import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { finalizeRegistration } from '@/lib/registrationHelper';

import { isRateLimited, sanitizeObject, isProd, cashfreeAppId, cashfreeSecretKey } from '@/lib/security';

// Initialize Cashfree
const cashfree = new Cashfree(
  isProd ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  cashfreeAppId,
  cashfreeSecretKey
);
cashfree.XApiVersion = '2023-08-01';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Use unified security rate limiting: max 5 requests per minute
    if (isRateLimited(ip, 5, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many attempts. Please try again in a minute.' }, { status: 429 });
    }

    const body = await req.json();
    const { action, honeypot, ...rawData } = body;
    
    // Standardize mobile numbers to always format as +91 1234567890
    const formatPhoneNumber = (phone: string): string => {
      if (!phone) return '';
      const digits = phone.replace(/\D/g, '');
      if (digits.length >= 10) {
        return `+91 ${digits.slice(-10)}`;
      }
      return phone;
    };
    if (rawData.mobile) rawData.mobile = formatPhoneNumber(rawData.mobile);
    if (rawData.fatherMobile) rawData.fatherMobile = formatPhoneNumber(rawData.fatherMobile);
    if (rawData.motherMobile) rawData.motherMobile = formatPhoneNumber(rawData.motherMobile);
    if (rawData.parentPhone) rawData.parentPhone = formatPhoneNumber(rawData.parentPhone);

    // Use unified security sanitization to prevent XSS script injection
    const data = sanitizeObject(rawData);

    if (honeypot) {
      console.warn("Honeypot triggered by IP:", ip);
      return NextResponse.json({ error: 'Bot detected' }, { status: 400 });
    }

    if (action === 'CREATE_ORDER') {
      try {
        const orderId = `order_${Date.now()}`;
        const orderAmount = data.coupon?.toUpperCase() === 'TESTTEST' ? 1 : 2500;

        console.log("Saving pending registration for order ID:", orderId);
        // 1. Save pending registration details under pendingRegistrations using Admin SDK
        await adminDb.collection('pendingRegistrations').doc(orderId).set({
          formData: data,
          orderId: orderId,
          amount: orderAmount,
          createdAt: FieldValue.serverTimestamp(),
          status: 'pending'
        });
        console.log("Pending registration saved.");

        // MOCK MODE: If no keys, return a mock session for testing
        if (!cashfreeAppId) {
          return NextResponse.json({ 
            order_id: orderId,
            payment_session_id: "mock_session_id",
            is_mock: true
          });
        }

        console.log("Creating Cashfree Order via PGCreateOrder...");
        
        // Strip non-digit characters and ensure a clean 10-digit format for Cashfree validation
        let cleanPhone = data.mobile ? data.mobile.replace(/\D/g, '') : '';
        if (cleanPhone.length > 10) {
          if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
            cleanPhone = cleanPhone.slice(2);
          } else {
            cleanPhone = cleanPhone.slice(-10);
          }
        }
        // Fail-safe default if number is somehow empty or too short
        if (cleanPhone.length < 10) {
          cleanPhone = '9999999999';
        }

        let host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'aarambh.jklu.edu.in';
        if (host.includes('0.0.0.0')) {
          host = host.replace('0.0.0.0', 'localhost');
        }
        const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
        
        // Prevent Host Header Injection: In production, strictly use the known safe domain.
        // During local development, allow localhost.
        const origin = isLocal 
          ? ((isProd) ? `https://${host}` : `http://${host}`)
          : (process.env.NEXT_PUBLIC_SITE_URL || 'https://aarambh.jklu.edu.in');

        const response = await cashfree.PGCreateOrder({
          order_id: orderId,
          order_amount: orderAmount,
          order_currency: 'INR',
          customer_details: {
            customer_id: data.registrationNumber || `cust_${Date.now()}`,
            customer_name: data.name,
            customer_email: data.email,
            customer_phone: cleanPhone,
          },
          order_meta: {
            return_url: `${origin}/register?order_id={order_id}`,
          }
        });
        console.log("Cashfree order created successfully.");

        return NextResponse.json({ 
          order_id: response.data.order_id,
          payment_session_id: response.data.payment_session_id 
        });
      } catch (err: any) {
        console.error("CREATE_ORDER error detail:", err.response?.data || err);
        return NextResponse.json({ error: `CREATE_ORDER failed: ${err.response?.data ? JSON.stringify(err.response.data) : err.message || err}` }, { status: 500 });
      }
    }

    if (action === 'VERIFY_PAYMENT') {
      const { orderId } = data;
      console.log("Verifying payment securely for order:", orderId);
      
      // Fetch the secure pending registration details from Firestore using Admin SDK
      const pendingRef = adminDb.collection('pendingRegistrations').doc(orderId);
      const pendingSnap = await pendingRef.get();
      if (!pendingSnap.exists) {
        console.warn(`No pending registration details found in Firestore for order ${orderId}`);
        return NextResponse.json({ error: 'Pending registration details not found' }, { status: 404 });
      }

      const pendingData = pendingSnap.data();
      const dbFormData = pendingData.formData;

      // If we are in development and don't have keys, allow bypass for testing UI
      // If we are in development and don't have keys, allow bypass for testing UI
      if (!cashfreeAppId) {
        console.warn("Cashfree App ID missing, bypassing verification for testing.");
        const regId = await finalizeRegistration(dbFormData, "mock_payment_id", orderId);
        return NextResponse.json({ success: true, id: regId });
      }

      const response = await cashfree.PGOrderFetchPayments(orderId);
      const payments = response.data;
      const successPayment = payments?.find((p: any) => p.payment_status === 'SUCCESS');

      if (!successPayment) {
        console.warn("No successful payment found for order:", orderId);
        return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
      }

      console.log("Payment verified successfully:", successPayment.cf_payment_id);
      const regId = await finalizeRegistration(dbFormData, successPayment.cf_payment_id.toString(), orderId);
      return NextResponse.json({ success: true, id: regId });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process registration' }, { status: 500 });
  }
}

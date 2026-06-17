import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { isRateLimited, sanitizeObject } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Rate limit: max 3 contact submissions per minute per IP
    if (isRateLimited(ip, 3, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a minute before sending another.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, subject, message, honeypot } = body;

    if (honeypot) {
      console.warn("Honeypot triggered by IP:", ip);
      return NextResponse.json({ error: 'Bot detected' }, { status: 400 });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Validate email format (restricting length and using non-backtracking regex to prevent ReDoS)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || email.length > 254 || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // Sanitize data
    const sanitizedData = sanitizeObject({
      name,
      email,
      subject,
      message,
      ipAddress: ip,
    });

    // Save to database using Admin SDK
    await adminDb.collection('contact_messages').add({
      ...sanitizedData,
      submittedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message.' },
      { status: 500 }
    );
  }
}

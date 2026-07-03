import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

async function performReconciliation(isManual: boolean) {
  const isProd = (process.env.NEXT_PUBLIC_CASHFREE_ENV || '').replace(/['"]/g, '').trim().toUpperCase() === 'PRODUCTION';
  const cashfreeAppId = isProd
    ? (process.env.CASHFREE_PROD_APP_ID || process.env.CASHFREE_APP_ID || '')
    : (process.env.CASHFREE_TEST_APP_ID || process.env.CASHFREE_APP_ID || '');
  const cashfreeSecretKey = isProd
    ? (process.env.CASHFREE_PROD_SECRET_KEY || process.env.CASHFREE_SECRET_KEY || '')
    : (process.env.CASHFREE_TEST_SECRET_KEY || process.env.CASHFREE_SECRET_KEY || '');
  
  const excelWebhook = process.env.EXCEL_SYNC_WEBHOOK_URL;
  const baseUrl = isProd ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

  // 1. Check if the daily service is enabled (only applicable for automated cron runs)
  if (!isManual) {
    const settingsDoc = await adminDb.collection('settings').doc('settlementReconciler').get();
    const isEnabled = settingsDoc.exists ? settingsDoc.data()?.enabled !== false : true;
    if (!isEnabled) {
      return {
        success: true,
        checkedCount: 0,
        updatedCount: 0,
        message: 'Automated daily settlement reconciliation is currently disabled.'
      };
    }
  }

  // 2. Fetch registrations with pending/missing settlement IDs
  const regSnap = await adminDb.collection('registrations').get();
  const pendingRegs: any[] = [];

  regSnap.forEach(doc => {
    const data = doc.data();
    const settlementId = data.settlementId;
    
    if (!settlementId || settlementId === 'Pending' || settlementId === 'N/A' || settlementId === '') {
      pendingRegs.push({
        docId: doc.id,
        orderId: data.orderId,
        name: data.name,
        paymentId: data.paymentId || '',
        registeredAt: data.registeredAt?.toDate() || new Date()
      });
    }
  });

  // Sort by registration date ascending (oldest first)
  pendingRegs.sort((a, b) => a.registeredAt.getTime() - b.registeredAt.getTime());

  if (pendingRegs.length === 0) {
    return {
      success: true,
      checkedCount: 0,
      updatedCount: 0,
      message: 'All registrations are already reconciled with completed settlements.'
    };
  }

  // Limit to 12 records per execution to avoid serverless timeouts (due to 1.5s rate-limit throttle per query)
  const batchToProcess = pendingRegs.slice(0, 12);
  let updatedCount = 0;

  for (const reg of batchToProcess) {
    try {
      const res = await fetch(`${baseUrl}/orders/${reg.orderId}/settlements`, {
        method: 'GET',
        headers: {
          'x-client-id': cashfreeAppId || '',
          'x-client-secret': cashfreeSecretKey || '',
          'x-api-version': '2023-08-01'
        }
      });

      if (!res.ok) {
        console.error(`Cashfree API returned error ${res.status} for order ${reg.orderId}`);
        continue;
      }

      let settlements = await res.json();
      
      // Normalize single object response to array
      if (settlements && !Array.isArray(settlements)) {
        if (settlements.cf_settlement_id || settlements.settlementId) {
          settlements = [settlements];
        } else {
          settlements = [];
        }
      }

      if (Array.isArray(settlements) && settlements.length > 0) {
        const settlement = settlements[0];
        const settlementId = settlement.cf_settlement_id || settlement.settlementId;
        const transferUtr = settlement.transfer_utr || settlement.settlement_utr || null;

        // Only reconcile if a bank UTR is present (indicates fully settled/transferred)
        if (settlementId && transferUtr) {
          console.log(`Reconciled Order: ${reg.orderId} with Settlement ID: ${settlementId}`);
          
          // 1. Update Firestore
          await adminDb.collection('registrations').doc(reg.docId).update({
            settlementId: String(settlementId)
          });

          // 2. Sync to Sheets
          if (excelWebhook) {
            try {
              await fetch(excelWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'UPDATE_SETTLEMENT',
                  orderId: reg.orderId,
                  paymentId: String(reg.paymentId),
                  settlementId: String(settlementId)
                })
              });
            } catch (sheetError) {
              console.error(`Failed to update Google Sheets for order ${reg.orderId}:`, sheetError);
            }
          }

          updatedCount++;
        }
      }
    } catch (err: any) {
      console.error(`Failed to query settlements for order ${reg.orderId}:`, err.message);
    }

    // Throttle to respect rate limits (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Log the sync action in auditLogs
  if (updatedCount > 0) {
    await adminDb.collection('auditLogs').add({
      timestamp: FieldValue.serverTimestamp(),
      action: 'SETTLEMENT_RECONCILE',
      performedBy: isManual ? 'Admin Console (Manual)' : 'Cloud Scheduler (Cron)',
      targetEntity: 'registrations',
      details: `Reconciled settlements: ${updatedCount} registrations marked as settled in this batch.`
    }).catch(() => {});
  }

  return {
    success: true,
    checkedCount: batchToProcess.length,
    updatedCount,
    remainingCount: Math.max(0, pendingRegs.length - batchToProcess.length),
    message: `Checked ${batchToProcess.length} pending records. Successfully finalized ${updatedCount} settled transaction(s).`
  };
}

// GET method for Google Cloud Scheduler / Cron-Job.org triggers
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const expectedSecret = process.env.CRON_SECRET || 'reconcile_cron_secret_token';

    // Verify token to secure the endpoint from public queries
    if (secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await performReconciliation(false);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Automated reconcile settlements GET error:', error);
    return NextResponse.json({ error: error.message || 'Reconciliation failed' }, { status: 500 });
  }
}

// POST method for manual triggers from the Admin Dashboard
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const isManual = body.manual !== false; // defaults to manual true
    
    const result = await performReconciliation(isManual);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Manual reconcile settlements POST error:', error);
    return NextResponse.json({ error: error.message || 'Reconciliation failed' }, { status: 500 });
  }
}

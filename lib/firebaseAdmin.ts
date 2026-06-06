import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Decode base64 or parse direct JSON string
      let serviceAccount;
      try {
        const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8');
        serviceAccount = JSON.parse(decoded);
      } catch {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      }
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin SDK initialized successfully via FIREBASE_SERVICE_ACCOUNT env variable.");
    } else if (process.env.NODE_ENV === 'development') {
      const fs = require('fs');
      const path = require('path');
      const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
      
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin SDK initialized successfully via local service-account.json.");
      } else {
        admin.initializeApp();
        console.log("Firebase Admin SDK initialized using Default Application Credentials (development fallback).");
      }
    } else {
      admin.initializeApp();
      console.log("Firebase Admin SDK initialized using Default Application Credentials (production).");
    }
  } catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export default admin;

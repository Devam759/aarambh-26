import { getApps, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';

function initFirebaseAdmin() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

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
      
      const app = initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized successfully via FIREBASE_SERVICE_ACCOUNT env var.');
      return app;
    } else {
      // Try loading local service-account.json if present
      const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
      
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        const app = initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized successfully via local service-account.json.');
      return app;
      } else {
        // Fallback to Application Default Credentials with explicit Project ID
        const app = initializeApp({
          credential: applicationDefault(),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'aarambh-26'
        });
        console.log("Firebase Admin SDK initialized using Default Application Credentials (production fallback).");
        return app;
      }
    }
  } catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
    throw error;
  }
}

export const adminApp = initFirebaseAdmin();
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);

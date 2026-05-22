import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True when real Firebase web config is present in env (not placeholders). */
export function isFirebaseConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  return Boolean(
    apiKey &&
    projectId &&
    apiKey !== 'your-api-key' &&
    !apiKey.startsWith('your-')
  );
}

export const FIREBASE_SETUP_MESSAGE =
  'Firebase is not configured. Copy .env.example to .env.local, add your Firebase web app keys from the Firebase Console (project: aarambh-26), then restart `npm run dev`.';

const app: FirebaseApp | null = isFirebaseConfigured()
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0]
  : null;

// Only initialize Auth/Firestore when config is valid — avoids auth/invalid-api-key on load
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app
  ? initializeFirestore(app, {
      localCache: typeof window !== 'undefined' ? persistentLocalCache() : undefined,
    })
  : null;
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;

export default app;

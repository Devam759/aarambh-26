import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "aarambh-2026.firebaseapp.com",
  projectId: "aarambh-2026",
  storageBucket: "aarambh-2026.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth = getAuth(app);
export const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache()
});
export const storage: FirebaseStorage = getStorage(app);

export default app;

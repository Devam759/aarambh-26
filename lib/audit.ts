import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

export async function logAdminAction(action: string, targetEntity: string, details: string) {
  try {
    const user = auth.currentUser;
    if (!user) return;
    
    await addDoc(collection(db, 'auditLogs'), {
      action,
      performedBy: user.email || user.uid,
      targetEntity,
      details,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}

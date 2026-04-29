import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Registrations
export const registerUser = async (userData: any) => {
  return await addDoc(collection(db, 'registrations'), {
    ...userData,
    timestamp: serverTimestamp(),
    status: 'pending'
  });
};

// Attendance/Check-in
export const checkInUser = async (userId: string, eventId: string) => {
  const attendanceRef = collection(db, 'attendance');
  return await addDoc(attendanceRef, {
    userId,
    eventId,
    timestamp: serverTimestamp(),
    status: 'checked-in'
  });
};

// Volunteer Assignments
export const getVolunteerAssignments = async (userId: string) => {
  const q = query(collection(db, 'volunteers'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Feedback
export const submitFeedback = async (feedbackData: any) => {
  return await addDoc(collection(db, 'feedback'), {
    ...feedbackData,
    timestamp: serverTimestamp()
  });
};

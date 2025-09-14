import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import type { User } from '../types';

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await createUserDocument(result.user, { displayName });
  return result;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await createUserDocument(result.user);
  return result;
};

export const logout = () => signOut(auth);

export const createUserDocument = async (user: FirebaseUser, additionalData?: any) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    
    await setDoc(userRef, {
      displayName: additionalData?.displayName || displayName,
      email,
      photoURL,
      createdAt,
      isAdmin: false,
      ...additionalData
    });
  }
  
  return userRef;
};

export const getUserDocument = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { uid, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await getUserDocument(firebaseUser.uid);
      callback(user);
    } else {
      callback(null);
    }
  });
};
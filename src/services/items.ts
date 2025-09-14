import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  getDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Item, ItemFormData } from '../types';

export const createItem = async (itemData: ItemFormData, userId: string, userEmail: string, userName: string): Promise<string> => {
  try {
    // Upload images
    const imageUrls = await uploadImages(itemData.images, userId);
    
    const docRef = await addDoc(collection(db, 'items'), {
      title: itemData.title,
      description: itemData.description,
      price: itemData.price,
      category: itemData.category,
      images: imageUrls,
      sellerId: userId,
      sellerEmail: userEmail,
      sellerName: userName,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

export const uploadImages = async (images: File[], userId: string): Promise<string[]> => {
  const uploadPromises = images.map(async (image, index) => {
    const imageRef = ref(storage, `items/${userId}/${Date.now()}-${index}`);
    const snapshot = await uploadBytes(imageRef, image);
    return getDownloadURL(snapshot.ref);
  });
  
  return Promise.all(uploadPromises);
};

export const getApprovedItems = async (): Promise<Item[]> => {
  try {
    const q = query(
      collection(db, 'items'), 
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Item[];
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

export const getUserItems = async (userId: string): Promise<Item[]> => {
  try {
    const q = query(
      collection(db, 'items'),
      where('sellerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Item[];
  } catch (error) {
    console.error('Error fetching user items:', error);
    return [];
  }
};

export const getPendingItems = async (): Promise<Item[]> => {
  try {
    const q = query(
      collection(db, 'items'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Item[];
  } catch (error) {
    console.error('Error fetching pending items:', error);
    return [];
  }
};

export const getItemById = async (id: string): Promise<Item | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'items', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Item;
    }
    return null;
  } catch (error) {
    console.error('Error fetching item:', error);
    return null;
  }
};

export const updateItemStatus = async (id: string, status: Item['status']) => {
  await updateDoc(doc(db, 'items', id), {
    status,
    updatedAt: new Date()
  });
};

export const updateItem = async (id: string, updates: Partial<ItemFormData>) => {
  await updateDoc(doc(db, 'items', id), {
    ...updates,
    updatedAt: new Date()
  });
};

export const deleteItem = async (id: string, images: string[]) => {
  try {
    // Delete images from storage
    await Promise.all(images.map(async (imageUrl) => {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }));
    
    // Delete item document
    await deleteDoc(doc(db, 'items', id));
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};
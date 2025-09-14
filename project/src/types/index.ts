export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  images: File[];
}

export type Category = 
  | 'electronics'
  | 'clothing'
  | 'home'
  | 'books'
  | 'sports'
  | 'automotive'
  | 'other';
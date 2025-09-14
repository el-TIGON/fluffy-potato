import { create } from 'zustand';
import type { Item } from '../types';

interface ItemState {
  items: Item[];
  userItems: Item[];
  pendingItems: Item[];
  loading: boolean;
  setItems: (items: Item[]) => void;
  setUserItems: (items: Item[]) => void;
  setPendingItems: (items: Item[]) => void;
  setLoading: (loading: boolean) => void;
  updateItemStatus: (id: string, status: Item['status']) => void;
  removeItem: (id: string) => void;
}

export const useItemStore = create<ItemState>((set) => ({
  items: [],
  userItems: [],
  pendingItems: [],
  loading: false,
  setItems: (items) => set({ items }),
  setUserItems: (userItems) => set({ userItems }),
  setPendingItems: (pendingItems) => set({ pendingItems }),
  setLoading: (loading) => set({ loading }),
  updateItemStatus: (id, status) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, status } : item
    ),
    userItems: state.userItems.map(item => 
      item.id === id ? { ...item, status } : item
    ),
    pendingItems: state.pendingItems.filter(item => item.id !== id)
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
    userItems: state.userItems.filter(item => item.id !== id),
    pendingItems: state.pendingItems.filter(item => item.id !== id)
  }))
}));
import type { Category } from '../types';

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing & Fashion' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'books', label: 'Books & Media' },
  { value: 'sports', label: 'Sports & Recreation' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'other', label: 'Other' },
];

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  sold: 'bg-gray-100 text-gray-800',
};
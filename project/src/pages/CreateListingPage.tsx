import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Select } from '../components/common/Select';
import { ImageUpload } from '../components/item/ImageUpload';
import { createItem } from '../services/items';
import { useAuth } from '../hooks/useAuth';
import { CATEGORIES } from '../utils/constants';
import type { ItemFormData } from '../types';

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ItemFormData>({
    title: '',
    description: '',
    price: 0,
    category: 'other',
    images: [],
  });
  const [errors, setErrors] = useState<Partial<ItemFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ItemFormData> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setLoading(true);
    try {
      await createItem(formData, user.uid, user.email!, user.displayName || 'Anonymous');
      toast.success('Item listed successfully! It will be reviewed by our team.');
      navigate('/my-listings');
    } catch (error: any) {
      toast.error(error.message || 'Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h1>
        <p className="text-gray-600">
          List your item for sale. All listings are reviewed before going live.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            placeholder="Enter a descriptive title for your item"
          />

          <Textarea
            label="Description"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
            placeholder="Describe your item's condition, features, and any relevant details"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Price ($)"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              error={errors.price}
              placeholder="0.00"
            />

            <Select
              label="Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              options={[{ value: '', label: 'Select a category' }, ...CATEGORIES]}
            />
          </div>

          <ImageUpload
            images={formData.images}
            onImagesChange={(images) => setFormData({ ...formData, images })}
          />
          {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Your listing will be reviewed by our team before it appears on the marketplace. 
              This usually takes 1-2 business days.
            </p>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/my-listings')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              Create Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
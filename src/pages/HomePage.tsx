import React, { useEffect } from 'react';
import { ItemGrid } from '../components/item/ItemGrid';
import { useItemStore } from '../store/useItemStore';
import { getApprovedItems } from '../services/items';

export const HomePage: React.FC = () => {
  const { items, loading, setItems, setLoading } = useItemStore();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const fetchedItems = await getApprovedItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [setItems, setLoading]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Amazing Deals
        </h1>
        <p className="text-gray-600">
          Find quality second-hand items from trusted sellers
        </p>
      </div>

      <ItemGrid items={items} loading={loading} />
    </div>
  );
};
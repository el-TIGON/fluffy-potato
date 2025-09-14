import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Mail, Shield } from 'lucide-react';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getItemById } from '../services/items';
import type { Item } from '../types';
import { STATUS_COLORS } from '../utils/constants';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedItem = await getItemById(id);
        setItem(fetchedItem);
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
        <p className="text-gray-600 mb-4">The item you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const handleContactSeller = () => {
    // Placeholder for contact functionality
    alert(`Contact ${item.sellerName} at ${item.sellerEmail}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to listings
      </Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4 p-6">
            <div className="aspect-w-1 aspect-h-1">
              {item.images?.[currentImageIndex] ? (
                <img
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>

            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-w-1 aspect-h-1 rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? 'border-emerald-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                <p className="text-4xl font-bold text-emerald-600">
                  ${item.price.toLocaleString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                {item.status}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
                <p className="text-gray-900 capitalize">{item.category}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{item.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Posted</h3>
                <p className="text-gray-900">
                  {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Seller Information
              </h3>
              <p className="text-gray-900 font-medium">{item.sellerName}</p>
              <p className="text-gray-600 text-sm">{item.sellerEmail}</p>
            </div>

            {item.status === 'approved' && (
              <Button
                onClick={handleContactSeller}
                className="w-full flex items-center justify-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
            )}

            {item.status === 'sold' && (
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600">This item has been sold</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
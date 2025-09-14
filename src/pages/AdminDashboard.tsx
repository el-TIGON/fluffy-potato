import React, { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check, X, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useItemStore } from '../store/useItemStore';
import { getPendingItems, updateItemStatus } from '../services/items';

export const AdminDashboard: React.FC = () => {
  const { pendingItems, loading, setPendingItems, setLoading, updateItemStatus: updateStoreItemStatus } = useItemStore();

  useEffect(() => {
    const fetchPendingItems = async () => {
      setLoading(true);
      try {
        const items = await getPendingItems();
        setPendingItems(items);
      } catch (error) {
        console.error('Error fetching pending items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingItems();
  }, [setPendingItems, setLoading]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateItemStatus(id, status);
      updateStoreItemStatus(id, status);
      toast.success(`Item ${status} successfully`);
    } catch (error) {
      toast.error('Error updating item status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Review and manage pending listings</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Pending Items ({pendingItems.length})
          </h2>
        </div>

        {pendingItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">All caught up!</h3>
            <p className="text-gray-500">No pending items to review at the moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingItems.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-xl font-bold text-emerald-600 mt-1">
                          ${item.price.toLocaleString()}
                        </p>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span className="capitalize">{item.category}</span>
                          <span>By {item.sellerName}</span>
                          <span>{formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Link to={`/item/${item.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </Button>
                      </Link>
                      
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(item.id, 'approved')}
                        className="flex items-center space-x-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(item.id, 'rejected')}
                        className="flex items-center space-x-1 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useItemStore } from '../store/useItemStore';
import { useAuth } from '../hooks/useAuth';
import { getUserItems, deleteItem } from '../services/items';
import { STATUS_COLORS } from '../utils/constants';

export const MyListingsPage: React.FC = () => {
  const { user } = useAuth();
  const { userItems, loading, setUserItems, setLoading, removeItem } = useItemStore();

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const items = await getUserItems(user.uid);
        setUserItems(items);
      } catch (error) {
        console.error('Error fetching user items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [user, setUserItems, setLoading]);

  const handleDelete = async (id: string, images: string[]) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await deleteItem(id, images);
      removeItem(id);
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Error deleting listing');
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
          <p className="text-gray-600">Manage your posted items</p>
        </div>
        <Link to="/create-listing">
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </Button>
        </Link>
      </div>

      {userItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No listings yet</h3>
          <p className="text-gray-500 mb-4">Start selling by creating your first listing</p>
          <Link to="/create-listing">
            <Button>Create First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {userItems.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          to={`/item/${item.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-emerald-600"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xl font-bold text-emerald-600">
                          ${item.price.toLocaleString()}
                        </p>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="capitalize">{item.category}</span>
                          <span>{formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                          {item.status}
                        </span>
                        
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {/* TODO: Implement edit */}}
                            disabled
                            title="Edit functionality coming soon"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id, item.images)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
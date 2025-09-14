import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import type { Item } from '../../types';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <Link
      to={`/item/${item.id}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-2xl font-bold text-emerald-600 mb-2">
          ${item.price.toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="capitalize">{item.category}</span>
          <span>{formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
        </div>
      </div>
    </Link>
  );
};
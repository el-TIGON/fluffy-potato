import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="p-2 bg-emerald-500 rounded-lg">
        <ShoppingBag className="w-6 h-6 text-white" />
      </div>
      {showText && (
        <span className="text-xl font-bold text-gray-900">Amman</span>
      )}
    </div>
  );
};
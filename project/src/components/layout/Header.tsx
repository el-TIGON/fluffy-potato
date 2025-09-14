import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  return (
    <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <Logo />
        <Link to="/create-listing">
          <Button size="sm" className="flex items-center space-x-1">
            <Plus className="w-4 h-4" />
            <span>Sell</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};
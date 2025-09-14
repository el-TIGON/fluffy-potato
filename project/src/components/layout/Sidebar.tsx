import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Package, User, Shield, Plus } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/create-listing', icon: Plus, label: 'Sell Item' },
    { path: '/my-listings', icon: Package, label: 'My Listings' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (user?.isAdmin) {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin Dashboard' });
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Logo />
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
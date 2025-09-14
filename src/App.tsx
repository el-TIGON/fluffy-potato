import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthGuard } from './components/auth/AuthGuard';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CreateListingPage } from './pages/CreateListingPage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthGuard>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-listing" element={<CreateListingPage />} />
            <Route path="/item/:id" element={<ItemDetailPage />} />
            <Route path="/my-listings" element={<MyListingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route 
              path="/admin" 
              element={
                <AuthGuard adminOnly>
                  <AdminDashboard />
                </AuthGuard>
              } 
            />
          </Routes>
        </Layout>
      </AuthGuard>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
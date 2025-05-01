import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div className="flex items-center py-4">
                <Link to="/" className="text-lg font-semibold text-gray-700">Gift Tracker</Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="py-4 px-2 text-gray-500 hover:text-gray-900">
                  Home
                </Link>
                <Link to="/about" className="py-4 px-2 text-gray-500 hover:text-gray-900">
                  About
                </Link>
                <Link to="/contact" className="py-4 px-2 text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="py-4 px-2 text-gray-500 hover:text-gray-900">
                    Dashboard
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 
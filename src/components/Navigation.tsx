
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { BarChart, Home, LogOut, User, LineChart } from 'lucide-react';

export default function Navigation() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center gap-2">
            <LineChart className="h-6 w-6 text-finance-primary" />
            <span className="font-bold text-xl text-finance-primary">StockVerse</span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center gap-2 ${isActive('/') ? 'text-finance-primary font-medium' : 'text-gray-600 hover:text-finance-primary'}`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/portfolio" 
                  className={`flex items-center gap-2 ${isActive('/portfolio') ? 'text-finance-primary font-medium' : 'text-gray-600 hover:text-finance-primary'}`}
                >
                  <BarChart className="h-4 w-4" />
                  <span>Portfolio</span>
                </Link>
              </>
            )}
          </nav>

          {/* Authentication buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <p className="text-sm text-gray-600">Welcome,</p>
                  <p className="font-medium text-finance-primary">{user?.name}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                <Button onClick={() => navigate('/register')} className="bg-finance-primary">Register</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

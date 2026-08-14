import React from 'react';
import { LogOut, User, Building2 as Hospital, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMobileMenuOpen, onToggleMobileMenu }) => {
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {auth.isAuthenticated && (
              <button
                onClick={onToggleMobileMenu}
                className="mr-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 md:hidden focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
            <Hospital className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">MediCare Super Speciality Hospital</h1>
              <p className="text-[10px] text-blue-600 font-semibold tracking-wide hidden sm:block uppercase">Premier Private Healthcare • Tamil Nadu Centres</p>
            </div>
          </div>
          
          {auth.isAuthenticated && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500 hidden sm:block" />
                <span className="text-sm font-medium text-gray-700 max-w-[120px] sm:max-w-none truncate">
                  {auth.user?.name}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                  {auth.user?.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
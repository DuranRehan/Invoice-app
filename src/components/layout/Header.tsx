import { ClipboardList, Home, Menu, Settings, Users, X } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useAppContext();
  const {t , i18n} = useTranslation();

  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center mr-2">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-primary-700">
                  {settings.company.name || 'InvoiceApp'}
                </span>
              </Link>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                to="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Home className="w-4 h-4 mr-1" />
                {t('header.dashboard')}
              </Link>
              <Link 
                to="/invoices" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/invoices') || isActive('/invoices/new') || location.pathname.includes('/invoices/') 
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <ClipboardList className="w-4 h-4 mr-1" />
                {t('header.invoices')}
              </Link>
              <Link 
                to="/clients" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/clients') || location.pathname.includes('/clients/') 
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Users className="w-4 h-4 mr-1" />
                {t('header.clients')}
              </Link>
              <Link 
                to="/settings" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/settings') 
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4 mr-1" />
                {t('header.settings')}
              </Link>
            </nav>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>


      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/') 
                ? 'border-primary-500 text-primary-700 bg-primary-50' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={closeMobileMenu}
          >
            <div className="flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Dashboard
            </div>
          </Link>
          <Link
            to="/invoices"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/invoices') || isActive('/invoices/new') || location.pathname.includes('/invoices/') 
                ? 'border-primary-500 text-primary-700 bg-primary-50' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={closeMobileMenu}
          >
            <div className="flex items-center">
              <ClipboardList className="w-5 h-5 mr-2" />
              Invoices
            </div>
          </Link>
          <Link
            to="/clients"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/clients') || location.pathname.includes('/clients/') 
                ? 'border-primary-500 text-primary-700 bg-primary-50' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={closeMobileMenu}
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Clients
            </div>
          </Link>
          <Link
            to="/settings"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/settings') 
                ? 'border-primary-500 text-primary-700 bg-primary-50' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={closeMobileMenu}
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const {t, i18n} = useTranslation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return `${t('layout.dashboard')}`;
    if (path.includes('/invoices/new')) return `${t('layout.create_invoice')}`;
    if (path.includes('/invoices/edit')) return `${t('layout.edit_invoice')}`;
    if (path.includes('/invoices/view')) return `${t('layout.view_invoice')}`;
    if (path.includes('/invoices')) return `${t('layout.invoices')}`;
    if (path.includes('/clients/new')) return `${t('layout.add_client')}`;
    if (path.includes('/clients/edit')) return `${t('layout.edit_client')}`;
    if (path.includes('/clients')) return `${t('layout.clients')}`;
    if (path === '/settings') return `${t('layout.settings')}`;
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
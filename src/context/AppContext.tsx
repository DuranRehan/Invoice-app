import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, Client, Invoice, Currency } from '../types';
import { defaultCurrencies } from '../interfaces/DefaultCurrency';

interface AppContextType {
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => void;
  updateCompany: (company: AppSettings['company']) => void;
  updateCurrency: (currency: Currency) => void;
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  availableCurrencies: Currency[];
  formatCurrency: (amount: number) => string;
  generateInvoiceNumber: () => string;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? JSON.parse(savedSettings) : null;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : null;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const savedInvoices = localStorage.getItem('invoices');
    return savedInvoices ? JSON.parse(savedInvoices) : null;
  });

  const [availableCurrencies] = useState<Currency[]>(defaultCurrencies);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const updateCompany = (company: AppSettings['company']) => {
    setSettings(prev => ({ ...prev, company }));
  };

  const updateCurrency = (currency: Currency) => {
    setSettings(prev => ({ ...prev, currency }));
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = {
      ...client,
      id: `client-${Date.now()}`,
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (client: Client) => {
    setClients(prev => prev.map(c => c.id === client.id ? client : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newInvoice = {
      ...invoice,
      id: `invoice-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setInvoices(prev => [...prev, newInvoice]);

    setSettings(prev => ({
      ...prev,
      invoiceNumberCounter: prev.invoiceNumberCounter + 1,
    }));
  };

  const updateInvoice = (invoice: Invoice) => {
    const updatedInvoice = {
      ...invoice,
      updatedAt: new Date().toISOString(),
    };
    setInvoices(prev => prev.map(i => i.id === invoice.id ? updatedInvoice : i));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  const formatCurrency = (amount: number) => {
    const { symbol, position, decimalPlaces } = settings.currency;
    const formattedAmount = amount.toFixed(decimalPlaces);

    return position === 'before'
      ? `${symbol}${formattedAmount}`
      : `${formattedAmount}${symbol}`;
  };

  const generateInvoiceNumber = () => {
    const { invoiceNumberPrefix, invoiceNumberSuffix, invoiceNumberCounter } = settings;
    return `${invoiceNumberPrefix}${invoiceNumberCounter}${invoiceNumberSuffix}`;
  };

  const value = {
    settings,
    updateSettings,
    updateCompany,
    updateCurrency,
    clients,
    addClient,
    updateClient,
    deleteClient,
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    availableCurrencies,
    formatCurrency,
    generateInvoiceNumber,
  };

  if (!settings) {
    setSettings({
      company: {
        id: '1',
        name: '',
        logo: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: '',
        email: '',
        website: '',
        taxId: '',
      },
      currency: defaultCurrencies[1],
      paymentTerms: 0,
      invoiceNumberPrefix: 'INV-',
      invoiceNumberSuffix: '',
      invoiceNumberCounter: 1,
      taxEnabled: true,
      defaultTaxRate: 6,

    })
  }
  if (!clients) {
    setClients([]);
  }
  if (!invoices) {
    setInvoices([]);
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export interface Company {
  id: string;
  name: string;
  logo: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  position: 'before' | 'after';
  decimalPlaces: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  clientId: string;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  status: InvoiceStatus;
  subtotal: number;
  taxTotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  title?: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'canceled';

export interface AppSettings {
  company: Company;
  currency: Currency;
  paymentTerms: number; 
  invoiceNumberPrefix: string;
  invoiceNumberSuffix: string;
  invoiceNumberCounter: number;
  taxEnabled: boolean;
  defaultTaxRate: number;
}

export interface InvoiceFilterOptions {
  status?: InvoiceStatus;
  startDate?: string;
  endDate?: string;
  clientId?: string;
  search?: string;
}
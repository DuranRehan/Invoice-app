import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Trash2,
  Save,
  ArrowLeft,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { Invoice, InvoiceItem, InvoiceStatus } from '../../types';
import { format } from 'date-fns';

interface InvoiceFormProps {
  initialData?: Invoice;
  mode: 'create' | 'edit';
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData, mode }) => {
  const navigate = useNavigate();
  const {
    clients,
    addInvoice,
    updateInvoice,

    settings,
    formatCurrency,
    generateInvoiceNumber
  } = useAppContext();

  const [invoice, setInvoice] = useState<Partial<Invoice>>(() => {
    if (initialData) {
      return { ...initialData };
    }

    // Default values for new invoice
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + settings.paymentTerms);

    return {
      number: generateInvoiceNumber(),
      date: format(today, 'yyyy-MM-dd'),
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      clientId: clients.length > 0 ? clients[0].id : '',
      items: [],
      notes: '',
      terms: settings.company.name ? `Payment terms: Net ${settings.paymentTerms} days` : '',
      status: 'draft' as InvoiceStatus,
      subtotal: 0,
      taxTotal: 0,
      total: 0,
    };
  });

  const [items, setItems] = useState<InvoiceItem[]>(initialData?.items || []);

  useEffect(() => {
    // Recalculate totals when items change
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxTotal = settings.taxEnabled ? items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.taxRate / 100)), 0) : 0;
    const total = subtotal + taxTotal;

    setInvoice(prev => ({
      ...prev,
      items,
      subtotal,
      taxTotal,
      total,
    }));
  }, [items, settings.taxEnabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: settings.taxEnabled ? settings.defaultTaxRate : 0,
      total: 0,
    };

    setItems(prev => [...prev, newItem]);
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate item total
        if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
          const quantity = field === 'quantity' ? Number(value) : item.quantity;
          const unitPrice = field === 'unitPrice' ? Number(value) : item.unitPrice;
          const taxRate = field === 'taxRate' ? Number(value) : item.taxRate;

          updatedItem.total = quantity * unitPrice * (1 + taxRate / 100);
        }

        return updatedItem;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent, saveAsDraft: boolean = false) => {
    e.preventDefault();

    const finalInvoice = {
      ...invoice,
      status: saveAsDraft ? 'draft' : (invoice.status || 'sent'),
      items,
    } as Invoice;

    if (mode === 'create') {
      addInvoice(finalInvoice);
      navigate('/invoices');
    } else if (mode === 'edit' && initialData) {
      updateInvoice(finalInvoice as Invoice);
      navigate(`/invoices/view/${initialData.id}`);
    }
  };

  const selectedClient = clients.find(c => c.id === invoice.clientId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <div className="flex space-x-2">
          {mode === 'create' && (
            <Button
              variant="outline"
              size="sm"
              icon={<FileText className="w-4 h-4" />}
              onClick={(e) => handleSubmit(e, true)}
            >
              Save as Draft
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={<Save className="w-4 h-4" />}
            onClick={(e) => handleSubmit(e, false)}
          >
            {mode === 'create' ? 'Create Invoice' : 'Update Invoice'}
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-4">
              {settings.company.logo && (
                <img
                  src={settings.company.logo}
                  alt={settings.company.name}
                  className="h-12 w-12 object-contain rounded mr-3"
                />
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900">{settings.company.name}</h3>
                <p className="text-sm text-gray-500">{settings.company.email}</p>
              </div>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>{settings.company.address}</p>
              <p>{settings.company.city}, {settings.company.state} {settings.company.zipCode}</p>
              <p>{settings.company.country}</p>
              <p>{settings.company.phone}</p>
              {settings.company.taxId && <p>Tax ID: {settings.company.taxId}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <input
                  type="text"
                  name="number"
                  value={invoice.number || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice title</label>
                <input
                  type="text"
                  name="title"
                  value={invoice.title || 'INVOICE'}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={invoice.status || 'draft'}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={invoice.date || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={invoice.dueDate || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>

          {clients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client</label>
                <select
                  name="clientId"
                  value={invoice.clientId || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              {selectedClient && (
                <div className="text-sm text-gray-500 space-y-1">
                  <p className="font-medium text-gray-700">{selectedClient.name}</p>
                  <p>{selectedClient.email}</p>
                  <p>{selectedClient.phone}</p>
                  <p>{selectedClient.address}</p>
                  <p>{selectedClient.city}, {selectedClient.state} {selectedClient.zipCode}</p>
                  <p>{selectedClient.country}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700">No clients found. Please add a client first.</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => navigate('/clients/new')}
              >
                Add Client
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
            <Button
              size="sm"
              variant="outline"
              icon={<PlusCircle className="w-4 h-4" />}
              onClick={handleAddItem}
            >
              Add Item
            </Button>
          </div>

          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    {settings.taxEnabled && (
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Rate (%)</th>
                    )}
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="min-w-[400px] max-w-[600px] px-2 py-3">
                        <textarea
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Item description"
                          rows={3}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          className="block  border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-right"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-right"
                        />
                      </td>
                      {settings.taxEnabled && (
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={item.taxRate}
                            onChange={(e) => handleItemChange(item.id, 'taxRate', Number(e.target.value))}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-right"
                          />
                        </td>
                      )}
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          size="sm"
                          variant="danger"
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={settings.taxEnabled ? 3 : 2} className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">Subtotal:</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">{formatCurrency(invoice.subtotal || 0)}</td>
                    <td></td>
                  </tr>
                  {settings.taxEnabled && (
                    <tr>
                      <td colSpan={settings.taxEnabled ? 3 : 2} className="px-4 py-3"></td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">Tax:</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">{formatCurrency(invoice.taxTotal || 0)}</td>
                      <td></td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={settings.taxEnabled ? 3 : 2} className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-right text-base font-bold text-gray-900">Total:</td>
                    <td className="px-4 py-3 text-right text-base font-bold text-gray-900">{formatCurrency(invoice.total || 0)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">No items added yet. Click "Add Item" to add your first invoice item.</p>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
            <textarea
              name="notes"
              value={invoice.notes}
              onChange={handleChange}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Notes visible to client"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Terms (optional)</label>
            <textarea
              name="terms"
              value={invoice.terms}
              onChange={handleChange}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Payment terms, conditions, etc."
            ></textarea>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceForm;
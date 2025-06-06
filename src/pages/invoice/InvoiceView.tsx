import { usePDF } from '@react-pdf/renderer';
import {
  ArrowLeft,
  Edit
} from 'lucide-react';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Dropdown from '../../components/invoice/Dropdown';
import InvoicePDF from '../../components/invoice/InvoicePDF';
import Button from '../../components/shared/Button';
import StatusBadge from '../../components/shared/StatusBadge';
import { useAppContext } from '../../context/AppContext';

import Card from '../../components/shared/Card';
import { format } from 'date-fns';

const InvoiceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, clients, updateInvoice, formatCurrency, settings } = useAppContext();

  const invoice = invoices.find(inv => inv.id === id);
  const client = invoice ? clients.find(c => c.id === invoice.clientId) : null;



  if (!invoice || !client) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Invoice Not Found</h2>
        <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist or has been deleted.</p>
        <Link to="/invoices">
          <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Invoices
          </Button>
        </Link>
      </div>
    );
  }

  const [instance] = usePDF({
    document: <InvoicePDF
      invoice={invoice}
      client={client}
      settings={settings}
      formatCurrency={formatCurrency}
    />,
  });


  if (instance.error) return <div>Something went wrong</div>;


  const handleStatusChange = (newStatus: 'sent' | 'paid' | 'overdue' | 'canceled') => {
    const updatedInvoice = {
      ...invoice,
      status: newStatus,
    };
    updateInvoice(updatedInvoice);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/invoices')}
        >
          Back to Invoices
        </Button>

        <div className="flex items-center space-x-2">
          <StatusBadge status={invoice.status} />
          <Dropdown invoice={invoice} handleStatusChange={handleStatusChange} />

          <Link to={`/invoices/edit/${invoice.id}`}>
            <Button
              variant="outline"
              size="sm"
              icon={<Edit className="w-4 h-4" />}
            >
              Edit
            </Button>
          </Link>

          {invoice && client && settings && (
            <>
              {
                instance.url && (

                  <a href={instance.url} download={`${invoice.number}.pdf`}>
                    <Button variant="primary" size="sm">
                      Download PDF
                    </Button>
                  </a>
                )
              }
            </>
          )}
        </div>
      </div>

      <Card>
        <div className="p-4">
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
            
            <div className="space-y-1 text-right">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{invoice.title}</h2>
              <p><span className="text-gray-500">Invoice Number:</span> <span className="font-medium">{invoice.number}</span></p>
              <p><span className="text-gray-500">Invoice Date:</span> <span className="font-medium">{format(new Date(invoice.date), 'MMMM d, yyyy')}</span></p>
              <p><span className="text-gray-500">Due Date:</span> <span className="font-medium">{format(new Date(invoice.dueDate), 'MMMM d, yyyy')}</span></p>
            </div>
          </div>
          
          <div className="mt-8  pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bill To</h3>
            
            <div className="text-sm">
              <p className="font-bold text-gray-900">{client.name}</p>
              <div className="text-gray-500 mt-1 space-y-1">
                <p>{client.address}</p>
                <p>{client.city}, {client.state} {client.zipCode}</p>
                <p>{client.country}</p>
                <p>Email: {client.email}</p>
                <p>Phone: {client.phone}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8  pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    {settings.taxEnabled && invoice.items.some(item => item.taxRate > 0) && (
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Rate</th>
                    )}
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-normal break-words">{item.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(item.unitPrice)}</td>
                      {settings.taxEnabled && invoice.items.some(item => item.taxRate > 0) && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.taxRate}%</td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td colSpan={settings.taxEnabled && invoice.items.some(item => item.taxRate > 0) ? 4 : 3} className="px-6 py-4 text-sm text-gray-900 text-right font-medium">Subtotal:</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{formatCurrency(invoice.subtotal)}</td>
                  </tr>
                  {settings.taxEnabled && invoice.taxTotal > 0 && (
                    <tr>
                      <td colSpan={settings.taxEnabled && invoice.items.some(item => item.taxRate > 0) ? 4 : 3} className="px-6 py-4 text-sm text-gray-900 text-right font-medium">Tax:</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{formatCurrency(invoice.taxTotal)}</td>
                    </tr>
                  )}
                  <tr className="border-t border-gray-200 bg-gray-50">
                    <td colSpan={settings.taxEnabled && invoice.items.some(item => item.taxRate > 0) ? 4 : 3} className="px-6 py-4 text-base text-gray-900 text-right font-bold">Total:</td>
                    <td className="px-6 py-4 text-base text-gray-900 text-right font-bold">{formatCurrency(invoice.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {(invoice.notes || invoice.terms) && (
            <div className="mt-8 border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {invoice.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-500 whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}
              
              {invoice.terms && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Terms & Conditions</h3>
                  <p className="text-sm text-gray-500 whitespace-pre-line">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500">Thank you for your business!</p>
            {settings.company.website && (
              <p className="text-sm text-gray-500 mt-1">{settings.company.website}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceView;
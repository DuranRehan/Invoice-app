import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus,
  Search,
  Filter,
  Trash2,
  Eye,
  Edit,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import StatusBadge from '../../components/shared/StatusBadge';
import { InvoiceFilterOptions, InvoiceStatus } from '../../types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const InvoiceList: React.FC = () => {
  const { invoices, clients, deleteInvoice, formatCurrency } = useAppContext();
  const [filterOptions, setFilterOptions] = useState<InvoiceFilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { t } = useTranslation();

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {

      if (filterOptions.status && invoice.status !== filterOptions.status) {
        return false;
      }

      if (filterOptions.clientId && invoice.clientId !== filterOptions.clientId) {
        return false;
      }

      if (filterOptions.startDate && new Date(invoice.date) < new Date(filterOptions.startDate)) {
        return false;
      }

      if (filterOptions.endDate && new Date(invoice.date) > new Date(filterOptions.endDate)) {
        return false;
      }

      if (searchTerm) {
        const client = clients.find(c => c.id === invoice.clientId);
        const searchableText = [
          invoice.number,
          client?.name,
          format(new Date(invoice.date), 'MMM d, yyyy'),
          formatCurrency(invoice.total),
        ].join(' ').toLowerCase();

        if (!searchableText.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, clients, filterOptions, searchTerm, formatCurrency]);

  const handleStatusChange = (status: InvoiceStatus | '') => {
    setFilterOptions(prev => ({
      ...prev,
      status: status === '' ? undefined : status,
    }));
  };

  const handleClientChange = (clientId: string) => {
    setFilterOptions(prev => ({
      ...prev,
      clientId: clientId === '' ? undefined : clientId,
    }));
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilterOptions({});
    setSearchTerm('');
  };

  const handleDeleteInvoice = (id: string) => {
    if (window.confirm(`${t('invoices.list.delete_confirmation')}`)) {
      deleteInvoice(id);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      all: invoices.length,
      draft: invoices.filter(inv => inv.status === 'draft').length,
      sent: invoices.filter(inv => inv.status === 'sent').length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      overdue: invoices.filter(inv => inv.status === 'overdue').length,
      canceled: invoices.filter(inv => inv.status === 'canceled').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder={t('invoices.list.search_placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {t('invoices.list.filter_label')}
          </Button>

          <Link to="/invoices/new">
            <Button
              size="sm"
              icon={<FilePlus className="w-4 h-4" />}
            >
              {t('invoices.list.create_invoice')}
            </Button>
          </Link>
        </div>
      </div>

      {showFilters && (
        <Card className="p-4 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"> {t('invoices.list.status')}</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={filterOptions.status || ''}
                onChange={e => handleStatusChange(e.target.value as InvoiceStatus | '')}
              >
                <option value="">{t('invoices.list.allStatus_filter_label')}</option>
                <option value="draft"> {t('invoices.list.draft_filter_label')}</option>
                <option value="sent">{t('invoices.list.send_filter_label')}</option>
                <option value="paid">{t('invoices.list.paid_filter_label')}</option>
                <option value="overdue">{t('invoices.list.overdue_filter_label')}</option>
                <option value="canceled">{t('invoices.list.cancelled_filter_label')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoices.list.client_label')}</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={filterOptions.clientId || ''}
                onChange={e => handleClientChange(e.target.value)}
              >
                <option value="">{t('invoices.list.allClients_filter_label')}</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoices.list.startDate_filter_label')}</label>
              <input
                type="date"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={filterOptions.startDate || ''}
                onChange={e => handleDateRangeChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoices.list.endDate_filter_label')}</label>
              <input
                type="date"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={filterOptions.endDate || ''}
                onChange={e => handleDateRangeChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              {t('invoices.list.clear_filters')}
            </Button>
          </div>
        </Card>
      )}

      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${!filterOptions.status
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => handleStatusChange('')}
          >
            {t('invoices.list.all_filter_label')} ({statusCounts.all})
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${filterOptions.status === 'draft'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => handleStatusChange('draft')}
          >
            {t('invoices.list.draft_filter_label')} ({statusCounts.draft})
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${filterOptions.status === 'sent'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => handleStatusChange('sent')}
          >
            {t('invoices.list.send_filter_label')} ({statusCounts.sent})
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${filterOptions.status === 'paid'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => handleStatusChange('paid')}
          >
            {t('invoices.list.paid_filter_label')} ({statusCounts.paid})
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${filterOptions.status === 'overdue'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => handleStatusChange('overdue')}
          >
            {t('invoices.list.overdue_filter_label')} ({statusCounts.overdue})
          </button>
        </nav>
      </div>

      <Card padding="none">
        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('invoices.list.invoice_number_label')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('invoices.list.client_label')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('invoices.list.date')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('invoices.list.due_date')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('invoices.list.amount')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('invoices.list.status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('invoices.list.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map(invoice => {
                  const client = clients.find(c => c.id === invoice.clientId);
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client?.name || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{format(new Date(invoice.date), 'MMM d, yyyy')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link to={`/invoices/view/${invoice.id}`}>
                            <Button size="sm" variant="outline" icon={<Eye className="w-4 h-4" />}>
                              {t('invoices.list.view_details')}
                            </Button>
                          </Link>
                          <Link to={`/invoices/edit/${invoice.id}`}>
                            <Button size="sm" variant="outline" icon={<Edit className="w-4 h-4" />}>
                              {t('invoices.list.edit_invoice')}
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="danger"
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            {t('invoices.list.delete_invoice')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>{t('invoices.list.invoice_not_found')}</p>
            <div className="mt-4">
              <Link to="/invoices/new">
                <Button icon={<FilePlus className="w-4 h-4" />}>{t('invoices.list.create_invoice')}</Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InvoiceList;
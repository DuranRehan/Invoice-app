import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  FilePlus, 
  UserPlus, 
  BarChart,
  Clock
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import StatusBadge from '../components/shared/StatusBadge';
import { format } from 'date-fns';

import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { invoices, clients, formatCurrency } = useAppContext();

   const { t, i18n } = useTranslation();
  
  const stats = useMemo(() => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
    const pendingInvoices = invoices.filter(inv => inv.status === 'sent');
    
    const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);

    const overduePercentage = (overdueInvoices.length / invoices.length) * 100 || 0;
    console.log(`Overdue Percentage: ${overduePercentage}%`);
    
    
    const paidInvoicesPercentage = (paidInvoices.length / invoices.length) * 100 || 0;
    
    return {
      paidCount: paidInvoices.length,
      overdueCount: overdueInvoices.length,
      pendingCount: pendingInvoices.length,
      paidInvoicesPercentage,
      overduePercentage,
      totalPaid,
      totalOverdue,
      totalPending,
      clientCount: clients.length,
      invoiceCount: invoices.length,
    };
  }, [invoices, clients]);
  
  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [invoices]);

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex flex-wrap gap-4">
        <Link to="/invoices/new">
          <Button icon={<FilePlus className="w-4 h-4" />}>
            {t('dashboard.new_invoice')}
          </Button>
        </Link>
        <Link to="/clients/new">
          <Button 
            variant="secondary" 
            icon={<UserPlus className="w-4 h-4" />}
          >
            {t('dashboard.add_client')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.paid_invoice')}
          value={formatCurrency(stats.totalPaid)}
          icon={<DollarSign className="w-5 h-5" />}
          color="bg-success-500"
          changePercent={stats.paidInvoicesPercentage}

        />
        <StatCard
          title={t('dashboard.pending_invoice')}
          value={formatCurrency(stats.totalPending)}
          icon={<Clock className="w-5 h-5" />}
          color="bg-accent-500"
        />
        <StatCard
          title={t('dashboard.overdue_invoice')}
          value={formatCurrency(stats.totalOverdue)}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="bg-error-500"
          changePercent={stats.overduePercentage}
        />
        <StatCard
          title={t('dashboard.total_invoices')}
          value={stats.invoiceCount}
          icon={<CreditCard className="w-5 h-5" />}
          color="bg-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.recent_invoices')}</h2>
            <Link to="/invoices" className="text-sm text-primary-600 hover:text-primary-700">
              {t('dashboard.view_all_invoices')}
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentInvoices.length > 0 ? (
              recentInvoices.map(invoice => {
                const client = clients.find(c => c.id === invoice.clientId);
                return (
                  <div key={invoice.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{invoice.number}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{client?.name || 'Unknown Client'}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(invoice.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{formatCurrency(invoice.total)}</span>
                      <StatusBadge status={invoice.status} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">{t('dashboard.no_recent_invoices')}</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.summary')}</h2>
            <BarChart className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('dashboard.client_label')}</p>
                <p className="text-2xl font-semibold mt-1">{stats.clientCount}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('dashboard.invoice_label')}</p>
                <p className="text-2xl font-semibold mt-1">{stats.invoiceCount}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t('dashboard.invoice_status')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('dashboard.paid_label')}</span>
                  <span className="text-sm font-medium">{stats.paidCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(stats.paidCount / stats.invoiceCount) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">{t('dashboard.pending_label')}</span>
                  <span className="text-sm font-medium">{stats.pendingCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent-500 h-2 rounded-full"
                    style={{ width: `${(stats.pendingCount / stats.invoiceCount) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">{t('dashboard.overdue_label')}</span>
                  <span className="text-sm font-medium">{stats.overdueCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-error-500 h-2 rounded-full"
                    style={{ width: `${(stats.overdueCount / stats.invoiceCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
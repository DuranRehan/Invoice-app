import React from 'react';
import { InvoiceStatus } from '../../types';
import { useTranslation } from 'react-i18next';


interface StatusBadgeProps {
  status: InvoiceStatus;
}


const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t, i18n } = useTranslation();
  const getStatusStyles = () => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'draft':
        return t('status.draft');
      case 'sent':
        return t('status.sent');
      case 'paid':
        return t('status.paid');
      case 'overdue':
        return t('status.overdue');
      case 'canceled':
        return t('status.canceled');
      default:
        return status;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;
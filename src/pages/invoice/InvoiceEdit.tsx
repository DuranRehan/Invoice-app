import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import InvoiceForm from '../../components/invoice/InvoiceForm';

const InvoiceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useAppContext();
  
  const invoice = invoices.find(inv => inv.id === id);
  
  if (!invoice) {
    return <Navigate to="/invoices" />;
  }
  
  return <InvoiceForm mode="edit" initialData={invoice} />;
};

export default InvoiceEdit;
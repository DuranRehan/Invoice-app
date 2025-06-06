import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import ClientForm from '../../components/client/ClientForm';

const ClientEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { clients } = useAppContext();
  
  const client = clients.find(c => c.id === id);
  
  if (!client) {
    return <Navigate to="/clients" />;
  }
  
  return <ClientForm mode="edit" initialData={client} />;
};

export default ClientEdit;
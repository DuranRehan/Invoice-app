import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

const ClientList: React.FC = () => {
  const { clients, deleteClient } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client => {
    const searchable = [
      client.name,
      client.email,
      client.phone,
      client.address,
      client.city,
      client.state,
      client.country,
    ].join(' ').toLowerCase();
    
    return searchable.includes(searchTerm.toLowerCase());
  });

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
    }
  };

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
              placeholder="Search clients..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Link to="/clients/new">
          <Button 
            icon={<UserPlus className="w-4 h-4" />}
          >
            Add Client
          </Button>
        </Link>
      </div>

      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <Card key={client.id} className="transition-all hover:shadow-md">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                <div className="flex space-x-1">
                  <Link to={`/clients/edit/${client.id}`}>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="p-1"
                      icon={<Edit className="w-4 h-4" />}
                    />
                  </Link>
                  <Button 
                    size="sm" 
                    variant="danger" 
                    className="p-1"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDeleteClient(client.id)}
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 mr-2" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-start">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 mr-2" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2" />
                  <div>
                    <p>{client.address}</p>
                    <p>{client.city}, {client.state} {client.zipCode}</p>
                    <p>{client.country}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-8">
          <p className="text-gray-500 mb-4">No clients found. Add your first client to get started.</p>
          <Link to="/clients/new">
            <Button 
              icon={<UserPlus className="w-4 h-4" />}
            >
              Add Client
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default ClientList;
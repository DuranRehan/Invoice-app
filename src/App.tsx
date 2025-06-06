import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import InvoiceList from './pages/invoice/InvoiceList';
import InvoiceCreate from './pages/invoice/InvoiceCreate';
import InvoiceView from './pages/invoice/InvoiceView';
import InvoiceEdit from './pages/invoice/InvoiceEdit';
import ClientList from './pages/client/ClientList';
import ClientCreate from './pages/client/ClientCreate';
import ClientEdit from './pages/client/ClientEdit';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/new" element={<InvoiceCreate />} />
            <Route path="/invoices/view/:id" element={<InvoiceView />} />
            <Route path="/invoices/edit/:id" element={<InvoiceEdit />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/new" element={<ClientCreate />} />
            <Route path="/clients/edit/:id" element={<ClientEdit />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
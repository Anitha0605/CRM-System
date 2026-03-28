import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerModal from './components/CustomerModal';
import './App.css';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://crm-system-wwmg.onrender.com/api/v1';

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
     
      const response = await axios.get(`${API_BASE_URL}/customers`);
      
      console.log(' API Response:', response.data);

    
      if (response.data && response.data.success) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      console.error('❌ Fetch Error:', error.message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

 
  const refreshCustomers = useCallback(() => {
    fetchCustomers();
    setShowModal(false);
    setSelectedCustomer(null);
  }, [fetchCustomers]);

 
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>CRM System</h1>
        <p>Customer Relationship Management</p>
      </header>

      <div className="container">
        <CustomerForm 
          refreshCustomers={refreshCustomers} 
          apiUrl={API_BASE_URL} 
        />
        
        <CustomerList 
          customers={customers}
          loading={loading}
          onEditCustomer={handleEdit}
          onViewCustomer={handleEdit}
          setShowModal={setShowModal}
          refreshCustomers={refreshCustomers}
          apiUrl={API_BASE_URL}
        />
      </div>

      {showModal && selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setShowModal(false)}
          refreshCustomers={refreshCustomers}
          apiUrl={API_BASE_URL}
        />
      )}
    </div>
  );
}

export default App;
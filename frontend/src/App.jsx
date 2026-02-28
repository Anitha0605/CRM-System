// App.jsx - YOUR CODE FIXED
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerModal from './components/CustomerModal';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api/v1';

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching from:', `${API_BASE_URL}/customers`);
      const response = await axios.get(`${API_BASE_URL}/customers`);
      console.log('✅ Response:', response.data);
      
      // Backend sends {success: true, customers: []}
      setCustomers(response.data.customers || response.data || []);
    } catch (error) {
      console.error('❌ Error:', error.response?.data || error.message);
      setCustomers([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const refreshCustomers = useCallback(() => {
    console.log('🔄 Refreshing...');
    fetchCustomers();
    setShowModal(false);
    setSelectedCustomer(null);
  }, [fetchCustomers]);

  return (
    <div className="App">
      <header className="app-header">
        <h1>CRM System</h1>
        <p>Customer Relationship Management</p>
      </header>

      <div className="container">
        <CustomerForm refreshCustomers={refreshCustomers} />
        <CustomerList 
          customers={customers}
          loading={loading}
          onEditCustomer={setSelectedCustomer}
          onViewCustomer={setSelectedCustomer}
          setShowModal={setShowModal}
          refreshCustomers={refreshCustomers}
        />
      </div>

      {showModal && selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={refreshCustomers}
          refreshCustomers={refreshCustomers}
        />
      )}
    </div>
  );
}

export default App;

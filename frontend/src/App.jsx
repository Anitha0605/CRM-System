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
      console.log('Fetching customers from:', `${API_BASE_URL}/customers`);
      const response = await axios.get(`${API_BASE_URL}/customers`);
      console.log('API Response:', response.data);
      setCustomers(response.data.data || []); // Set empty array if data is undefined
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]); // Set to empty array on error to prevent undefined issues
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const refreshCustomers = useCallback(() => {
    console.log('Refreshing customer list...');
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
          onClose={() => {
            setShowModal(false);
            setSelectedCustomer(null);
          }}
          refreshCustomers={refreshCustomers}
        />
      )}
    </div>
  );
}

export default App;

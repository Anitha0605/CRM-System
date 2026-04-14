import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerModal from './components/CustomerModal';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import Navbar from './components/Navbar';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://crm-system-wwmg.onrender.com/api/v1';

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const isAuthenticated = !!localStorage.getItem('token');

  const fetchCustomers = useCallback(async () => {
    if (!isAuthenticated) return; // Login pannala na fetch panna venaam
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data && response.data.success) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      console.error('❌ Fetch Error:', error.message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

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

  // Main Dashboard UI (Private Content)
  const Dashboard = () => (
    <div className="container">
      <CustomerForm refreshCustomers={refreshCustomers} apiUrl={API_BASE_URL} />
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
  );

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>CRM System</h1>
          {isAuthenticated && (
            <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }}>
              Logout
            </button>
          )}
        </header>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/navbar" element={<Navbar />} />
         
          <Route 
            path="/" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
        </Routes>

        {showModal && selectedCustomer && (
          <CustomerModal
            customer={selectedCustomer}
            onClose={() => setShowModal(false)}
            refreshCustomers={refreshCustomers}
            apiUrl={API_BASE_URL}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
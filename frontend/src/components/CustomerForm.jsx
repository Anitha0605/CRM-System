import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';


const CustomerForm = ({ refreshCustomers }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Sending customer data:', formData);
    
    try {
      // Validate required fields
      if (!formData.name.trim() || !formData.email.trim()) {
        throw new Error('Name and Email are required');
      }

      const response = await axios.post(`${API_BASE_URL}/customers`, formData);
      console.log('Customer created successfully:', response.data);
      
      // Clear form & refresh list
      setFormData({ name: '', email: '', phone: '', company: '', status: 'active' });
      refreshCustomers();
      
      alert('Customer added successfully!');
      
    } catch (error) {
      console.error(' Error creating customer:', error.response?.data || error.message);
      
      if (error.response?.status === 400 && error.response?.data?.message?.includes('duplicate')) {
        setError('Email already exists! Please use a different email.');
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || 'Validation error');
      } else {
        setError('Failed to create customer. Please try again.');
      }
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  return (
    <div className="customer-form">
      <h2>➕ Add New Customer</h2>
      
      {error && (
        <div className="error-message">
           {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Enter full name *"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Enter email *"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            name="company"
            placeholder="Enter company name"
            value={formData.company}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            disabled={loading}
          >
            <option value="active"> Active</option>
            <option value="inactive"> Inactive</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn primary" 
          disabled={loading}
        >
          {loading ? ' Adding...' : ' Add Customer'}
        </button>
      </form>
      
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        * Required fields
      </div>
    </div>
  );
};

export default CustomerForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaSave } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const CustomerModal = ({ customer, onClose, refreshCustomers }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(customer || {});
  }, [customer]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.put(`${API_BASE_URL}/customers/${customer._id}`, formData);
      refreshCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{formData.name || 'Customer Details'}</h3>
          <button onClick={onClose} className="btn close">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="modal-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn primary" disabled={loading}>
              <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="btn secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;

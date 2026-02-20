import React from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';


const CustomerList = ({ 
  customers = [],
  loading, 
  onEditCustomer, 
  onViewCustomer, 
  setShowModal, 
  refreshCustomers 
}) => {
  const deleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`${API_BASE_URL}/customers/${id}`);
        refreshCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div className="customer-list">
      <h2>Customers ({customers?.length || 0})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((customer) => ( 
              <tr key={customer._id} className="customer-row">
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone || '-'}</td>
                <td>{customer.company || '-'}</td>
                <td>
                  <span className={`status ${customer.status}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    onClick={() => {
                      onViewCustomer(customer);
                      setShowModal(true);
                    }}
                    className="btn view"
                  >
                     View
                  </button>
                  <button 
                    onClick={() => {
                      onEditCustomer(customer);
                      setShowModal(true);
                    }}
                    className="btn edit"
                  >
                     Edit
                  </button>
                  <button 
                    onClick={() => deleteCustomer(customer._id)}
                    className="btn delete"
                  >
                     Delete
                  </button>
                </td>
              </tr>
            )) || <tr><td colSpan="6">No customers found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;

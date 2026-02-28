const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api/v1'
  : 'https://crm-system-wwmg.onrender.com/api/v1';

export const api = {
  getCustomers: () => fetch(`${API_BASE_URL}/customers`),
  createCustomer: (data) => fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateCustomer: (id, data) => fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  deleteCustomer: (id) => fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'DELETE'
  })
};

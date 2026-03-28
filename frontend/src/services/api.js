import axios from 'axios';

const YOUR_LAPTOP_IP = '192.168.1.15'; // 
const isLocal = window.location.hostname === 'localhost';

const API_BASE_URL = isLocal 
  ? 'http://localhost:5000/api/v1' 
  : `http://${YOUR_LAPTOP_IP}:5000/api/v1`;

export const api = {
  
  getCustomers: async () => {
    const res = await axios.get(`${API_BASE_URL}/customers`);
    return res.data; 
  },
  
  createCustomer: (data) => axios.post(`${API_BASE_URL}/customers`, data),
  updateCustomer: (id, data) => axios.put(`${API_BASE_URL}/customers/${id}`, data),
  deleteCustomer: (id) => axios.delete(`${API_BASE_URL}/customers/${id}`)
};
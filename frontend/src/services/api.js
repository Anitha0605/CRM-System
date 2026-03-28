import axios from 'axios';


const RENDER_URL = 'https://crm-system-wwmg.onrender.com/api/v1';


const YOUR_LAPTOP_IP = '192.168.1.15'; 
const isLocal = window.location.hostname === 'localhost';


const API_BASE_URL = isLocal 
  ? `http://localhost:5000/api/v1` 
  : RENDER_URL;

export const api = {
  // GET: Customers list
  getCustomers: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/customers`);
      return res.data; 
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  
  createCustomer: (data) => axios.post(`${API_BASE_URL}/customers`, data),
  updateCustomer: (id, data) => axios.put(`${API_BASE_URL}/customers/${id}`, data),
  deleteCustomer: (id) => axios.delete(`${API_BASE_URL}/customers/${id}`)
};
// Check if we are on localhost or production
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocal 
  ? 'http://localhost:5000/api/v1' 
  : 'https://crm-system-wwmg.onrender.com/api/v1';

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API Error (${res.status}): ${errorBody}`);
  }
  return res.json();
};

export const api = {
  getCustomers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Network Error:", error);
      throw error;
    }
  },

  createCustomer: (data) => 
    fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse)
};
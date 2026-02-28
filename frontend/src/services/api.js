import axios from 'axios';

const BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:5000' 
  : 'https://crm-system-wwmg.onrender.com'; 

export const apiCall = async (url, options = {}) => {
  try {
    const response = await axios({
      url: `${BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.body,
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token') && {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data);
    throw error;
  }
};

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

let customers = [
  { _id: '1', name: 'Sample Customer', email: 'sample@test.com', phone: '1234567890', company: 'Test Co', status: 'active' }
];

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173',
    'https://crm-system-8jp53j2cu-anitha0605s-projects.vercel.app'  // Vercel Frontend
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/customers', (req, res) => {
  console.log('GET customers:', customers.length);
  res.json({ success: true, customers });
});

app.post('/api/v1/customers', (req, res) => {
  const newCustomer = {
    _id: Date.now().toString(),
    ...req.body,
    status: req.body.status || 'active'
  };
  customers.push(newCustomer);
  console.log('ADD:', newCustomer.name);
  res.status(201).json({ success: true, customer: newCustomer });
});

app.put('/api/v1/customers/:id', (req, res) => {
  const id = req.params.id;
  const index = customers.findIndex(c => c._id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  customers[index] = { ...customers[index], ...req.body };
  console.log('UPDATE:', customers[index].name);
  res.json({ success: true, customer: customers[index] });
});

app.delete('/api/v1/customers/:id', (req, res) => {
  const id = req.params.id;
  const initialLength = customers.length;
  customers = customers.filter(c => c._id !== id);
  if (customers.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  console.log('DELETE ID:', id);
  res.json({ success: true, message: 'Customer deleted' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', customers: customers.length });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server: http://localhost:${PORT}`);
});

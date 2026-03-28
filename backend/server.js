const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Request Logger 
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// 2. MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.log(" DB Error:", err.message));

// 3. Schema & Model
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  status: { type: String, default: 'active' }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

// 4. API Routes
app.get('/api/v1/customers', async (req, res) => {
  try {
    const data = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, customers: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/v1/customers', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json({ success: true, customer: newCustomer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.put('/api/v1/customers/:id', async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, customer: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/v1/customers/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 5. Start Server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
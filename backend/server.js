const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 1. Middleware 
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// 2. MongoDB Connection

const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected!"))
  .catch(err => console.error(" MongoDB Connection Error:", err.message));

// 3. Customer Schema & Model
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,
  status: { type: String, default: 'active' }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

// 4. API Routes
// Health Check 
app.get('/health', (req, res) => {
  res.status(200).send("Server is Running and Healthy! ");
});

// GET all customers
app.get('/api/v1/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new customer
app.post('/api/v1/customers', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json({ success: true, customer: newCustomer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update customer
app.put('/api/v1/customers/:id', async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, customer: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE customer
app.delete('/api/v1/customers/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 5. Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(` Backend is LIVE on port ${PORT}`);
});
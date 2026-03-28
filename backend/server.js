const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  next();
});

// --- MONGOOSE MODEL ---
// This defines how a "Customer" looks in your database
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,
  status: { type: String, default: 'active' }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// --- API ROUTES ---

// 1. GET ALL
app.get('/api/v1/customers', async (req, res) => {
  try {
    const allCustomers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, customers: allCustomers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. POST (Create)
app.post('/api/v1/customers', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json({ success: true, customer: newCustomer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 3. PUT (Update) - This fixes your 404 error
app.put('/api/v1/customers/:id', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Returns the updated document
    );
    if (!updatedCustomer) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, customer: updatedCustomer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 4. DELETE
app.delete('/api/v1/customers/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
  .then(() => console.log(" MongoDB Atlas Connected!"))
  .catch(err => console.error(" MongoDB Connection Error:", err.message));

// 3. Schemas & Models

// --- User Schema for Auth ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// --- Customer Schema for CRM ---
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,
  status: { type: String, default: 'active' }
}, { timestamps: true });
const Customer = mongoose.model('Customer', customerSchema);


// 4. API Routes

// --- Home & Health Check ---
app.get('/', (req, res) => {
  res.send(" CRM Backend is Running! Use /api/v1 for requests.");
});

app.get('/health', (req, res) => {
  res.status(200).send("Server is Running and Healthy! ");
});

// --- AUTH ROUTES ---

// REGISTER: POST /api/v1/auth/register
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// LOGIN: POST /api/v1/auth/login
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    res.json({ 
      success: true, 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// --- CUSTOMER ROUTES ---

app.get('/api/v1/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, customers });
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
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 5. Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is LIVE on port ${PORT}`);
});
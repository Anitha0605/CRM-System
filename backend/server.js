const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const customerRoutes = require('./routes/customers');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// ✅ FIXED CORS - No wildcard routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173',  'https://crm-system-modula-5.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect database
connectDB();

// Routes
app.use('/api/v1/customers', customerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
   status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'CRM Backend Running!' 
  });
});

// Test endpoint
app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'API v1 working!' });
});

// 404 handler - FIXED (no wildcard)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(` Server running in ${MODE} mode on http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/health`);
  console.log(` Customers: http://localhost:${PORT}/api/v1/customers`);
});

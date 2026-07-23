const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

// DNS Fix
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const authRoutes = require('./src/routes/authRoutes');

const app = express();

// 1. CORS Fix for Credentials & Specific Origin
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // আপনার ফ্রন্টএন্ডের URL
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is perfectly running' });
});

// 2. Auth Routes
app.use('/api/auth', authRoutes);

// 3. Fallback for Better-Auth Session (If triggered by frontend hooks)
app.get('/api/auth/get-session', (req, res) => {
  res.status(200).json({ user: null, session: null });
});

// Port & DB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swarmgrid';

mongoose.connect(MONGO_URI ,{
  dbName: 'veloAgent'
})
  .then(() => {
    console.log('✅ Database connected successfully!');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ Database connection error:', err));
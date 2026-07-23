import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import dns from "dns";

// Import Routes
const authRoutes = require('./routes/authRoutes.js');

// DNS Fixes for Cloud MongoDB
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// Auth Routes Mounting
app.use('/api/auth', authRoutes);

// Fallback for session checks
app.get('/api/auth/get-session', (req, res) => {
  res.status(200).json({ user: null, session: null });
});

// -------------------------------------------------------------
// HARD FIXED DATABASE CONNECTION TO "veloAgent"
// -------------------------------------------------------------
let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/projexAi';

// Ensure URL points specifically to veloAgent DB instead of default/test
if (mongoUri.includes('mongodb.net/?')) {
  mongoUri = mongoUri.replace('mongodb.net/?', 'mongodb.net/projexAi?');
} else if (mongoUri.includes('mongodb.net/test?')) {
  mongoUri = mongoUri.replace('mongodb.net/test?', 'mongodb.net/projexAi?');
} else if (mongoUri.includes('mongodb.net/swarmgrid?')) {
  mongoUri = mongoUri.replace('mongodb.net/swarmgrid?', 'mongodb.net/projexAi?');
}

console.log("Connecting directly to database target...");

mongoose.connect(mongoUri, {
  dbName: 'projexAi' // Force database name
})
  .then(() => {
    console.log('✅ Connected successfully! Target DB: projexAi');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
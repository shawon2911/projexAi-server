import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import dns from 'dns';

// Import Routes
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes'; // 👈 প্রজেক্ট রাউট ইমপোর্ট করা হয়েছে

dotenv.config();

// DNS Fixes for Cloud MongoDB
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]); 

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
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // 👈 প্রজেক্ট রাউট মাউন্ট করা হয়েছে

// Fallback for session checks
app.get('/api/auth/get-session', (req: Request, res: Response) => {
  res.status(200).json({ user: null, session: null });
});


let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/veloAgent';

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
  .catch((err: unknown) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

process.on('unhandledRejection', (err: unknown) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

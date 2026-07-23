"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const dns_1 = __importDefault(require("dns"));
// Import Routes
const authRoutes = require('./routes/authRoutes.js');
// DNS Fixes for Cloud MongoDB
dns_1.default.setDefaultResultOrder("ipv4first");
dns_1.default.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
}
else if (mongoUri.includes('mongodb.net/test?')) {
    mongoUri = mongoUri.replace('mongodb.net/test?', 'mongodb.net/projexAi?');
}
else if (mongoUri.includes('mongodb.net/swarmgrid?')) {
    mongoUri = mongoUri.replace('mongodb.net/swarmgrid?', 'mongodb.net/projexAi?');
}
console.log("Connecting directly to database target...");
mongoose_1.default.connect(mongoUri, {
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

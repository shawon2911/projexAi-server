import express from 'express';
// controllers থেকে ফাংশনগুলো ES Module স্টাইলে ইমপোর্ট
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

// Route: POST /api/auth/register
router.post('/register', registerUser);

// Route: POST /api/auth/login
router.post('/login', loginUser);

// ES Module Default Export (যাতে index.ts এ স্বাভাবিকভাবে import করা যায়)
export default router;
// import { Router } from 'express';
// import { submitBid, getBidsByProject } from '../controllers/bidController';

// const router = Router();

// router.post('/', submitBid);
// router.get('/project/:projectId', getBidsByProject);

// export default router;

// src/routes/bidRoutes.ts
import { Router } from 'express';
import { submitBid, getBidsByProject } from '../controllers/bidController';
import { protect } from '../middleware/authMiddleware'; // আপনার প্রজেক্টের Auth Middleware

const router = Router();

// protect মিডলওয়্যার যুক্ত করার ফলে req.user সেট হয়ে যাবে
router.post('/', protect, submitBid); 
router.get('/project/:projectId', getBidsByProject);

export default router;
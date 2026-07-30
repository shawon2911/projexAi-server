"use strict";
// import { Router } from 'express';
// import { submitBid, getBidsByProject } from '../controllers/bidController';
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.post('/', submitBid);
// router.get('/project/:projectId', getBidsByProject);
// export default router;
// src/routes/bidRoutes.ts
const express_1 = require("express");
const bidController_1 = require("../controllers/bidController");
const authMiddleware_1 = require("../middleware/authMiddleware"); // আপনার প্রজেক্টের Auth Middleware
const router = (0, express_1.Router)();
// protect মিডলওয়্যার যুক্ত করার ফলে req.user সেট হয়ে যাবে
router.post('/', authMiddleware_1.protect, bidController_1.submitBid);
router.get('/project/:projectId', bidController_1.getBidsByProject);
exports.default = router;

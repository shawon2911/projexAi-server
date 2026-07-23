"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controllers থেকে ফাংশনগুলো ES Module স্টাইলে ইমপোর্ট
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Route: POST /api/auth/register
router.post('/register', authController_1.registerUser);
// Route: POST /api/auth/login
router.post('/login', authController_1.loginUser);
// ES Module Default Export (যাতে index.ts এ স্বাভাবিকভাবে import করা যায়)
exports.default = router;

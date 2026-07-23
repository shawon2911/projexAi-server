"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// User Registration Controller
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists with this email' });
            return;
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create new user
        const newUser = new User_1.default({
            name,
            email,
            password: hashedPassword,
            role: role || 'developer'
        });
        await newUser.save();
        // Generate JWT Token
        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, role: newUser.role }, jwtSecret, { expiresIn: '7d' });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    }
    catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server Error during registration' });
    }
};
exports.registerUser = registerUser;
// User Login Controller
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user || !user.password) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Check password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate JWT Token
        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '7d' });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error during login' });
    }
};
exports.loginUser = loginUser;

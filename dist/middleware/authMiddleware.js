"use strict";
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret123');
            // Ensure req.user gets normalized id/id string
            req.user = {
                _id: decoded.id || decoded._id || decoded.userId,
                id: decoded.id || decoded._id || decoded.userId
            };
            return next();
        }
        catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'User authentication failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'User authentication failed' });
    }
};
exports.protect = protect;

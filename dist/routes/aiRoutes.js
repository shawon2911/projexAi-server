"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const router = (0, express_1.Router)();
// Groq Client Initialization
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY || '',
});
// 1️⃣ AI Scope / Description Generation Route
router.post('/generate-description', async (req, res) => {
    try {
        const { title, category, shortDescription } = req.body;
        if (!title && !shortDescription) {
            res.status(400).json({ message: 'Title or short description is required' });
            return;
        }
        if (!process.env.GROQ_API_KEY) {
            console.error('❌ GROQ_API_KEY is missing in backend .env file!');
            res.status(500).json({ message: 'Server configuration error: Groq API key missing' });
            return;
        }
        const prompt = `You are a technical project manager. Write a clear, professional, and detailed scope of work for a project with:
- Title: "${title || 'N/A'}"
- Category: "${category || 'N/A'}"
- Short Summary: "${shortDescription || 'N/A'}"

Please structure the output as follows:
1. Executive Summary
2. Core Features & Scope
3. Recommended Tech Stack
4. Key Deliverables

Keep the tone technical, clear, and concise (150-200 words max). Do not include conversational filler.`;
        // Calling Groq with Llama 3.3 70B model (Free & Super Fast)
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
        });
        const generatedDescription = completion.choices[0]?.message?.content || '';
        res.status(200).json({
            success: true,
            generatedDescription,
        });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
        console.error('❌ Groq API Error (generate-description):', err);
        res.status(500).json({ message: `AI Generation Failed: ${errorMessage}` });
    }
});
// 2️⃣ AI Chatbot Route
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            res.status(400).json({ message: 'Message is required' });
            return;
        }
        if (!process.env.GROQ_API_KEY) {
            console.error('❌ GROQ_API_KEY is missing in backend .env file!');
            res.status(500).json({ message: 'Server configuration error: Groq API key missing' });
            return;
        }
        const systemPrompt = `You are ProjexBot, an AI assistant for a project management and freelancing marketplace platform called ProjexAI. Help the user with concise, polite, and technical answers.`;
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
        });
        const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
        res.status(200).json({
            success: true,
            reply,
        });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
        console.error('❌ Groq API Error (chat):', err);
        res.status(500).json({ message: `Chat AI Failed: ${errorMessage}` });
    }
});
exports.default = router;

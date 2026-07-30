"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = exports.generateProjectDescription = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
// Groq Client setup
const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey)
        return null;
    return new groq_sdk_1.default({ apiKey });
};
// 1️⃣ Generate Project Description / Scope
const generateProjectDescription = async (req, res) => {
    try {
        const { title, category, shortDescription } = req.body;
        if (!title && !shortDescription) {
            res.status(400).json({ message: 'Title or short description is required' });
            return;
        }
        const groq = getGroqClient();
        if (!groq) {
            console.error('❌ GROQ_API_KEY is missing in backend .env file!');
            res.status(500).json({ message: 'Server configuration error: Groq API key is missing' });
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
        console.error('❌ Groq API Error (generateProjectDescription):', err);
        res.status(500).json({ message: `AI Generation Failed: ${errorMessage}` });
    }
};
exports.generateProjectDescription = generateProjectDescription;
// 2️⃣ Chatbot Logic
const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            res.status(400).json({ message: 'Message is required' });
            return;
        }
        const groq = getGroqClient();
        if (!groq) {
            console.error('❌ GROQ_API_KEY is missing in backend .env file!');
            res.status(500).json({ message: 'Server configuration error: Groq API key is missing' });
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
        console.error('❌ Groq API Error (handleChat):', err);
        res.status(500).json({ message: `Chat AI Failed: ${errorMessage}` });
    }
};
exports.handleChat = handleChat;

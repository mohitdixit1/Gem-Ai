require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";


app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat', async (req, res) => {
    try {
        const { conversationHistory, systemInstruction } = req.body;
        if (!conversationHistory) {
            return res.status(400).json({ error: "conversationHistory is required in the request body." });
        }
        const payload = {
            contents: conversationHistory
        };
        if (systemInstruction) {
            payload.system_instruction = { parts: [{ text: systemInstruction }] };
        }
        const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Error from Gemini API (on backend):', errorData);
            // Forward the error status and details back to the frontend
            return res.status(geminiResponse.status).json({
                error: "Failed to get a valid response from the AI model.",
                details: errorData
            });
        }
        const data = await geminiResponse.json();
        res.json(data);

    } catch (error) {
        console.error('Backend server error during chat processing:', error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

app.listen(port, () => {
    console.log(`Gem 💎 Ai Backend server running on http://localhost:${port}`);
});

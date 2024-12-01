// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();

// Verify API key exists
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
if (!API_KEY) {
  console.error('No API key found in environment variables!');
  process.exit(1);
}

// Configure CORS properly
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('/api/football/*', cors());

// Handle all football API requests
app.use('/api/football', async (req, res) => {
  try {
    console.log('\n=== Incoming Request ===');
    console.log('Original URL:', req.url);
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);

    // Construct target URL
    const targetUrl = `https://api.football-data.org/v4${req.url.replace('/api/football', '')}`;
    console.log('Target URL:', targetUrl);

    // Forward the request
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'X-Auth-Token': API_KEY,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    
    // Set CORS headers explicitly
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
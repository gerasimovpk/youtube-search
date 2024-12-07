// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Response as FetchResponse } from 'node-fetch'; // Add this if you need Response type
import { URL } from 'url';

dotenv.config();

const app = express();

// Verify API key exists
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
if (!API_KEY) {
  console.error('No API key found in environment variables!');
  process.exit(1);
}

// Cache configuration
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Function to generate cache key from URL and query parameters
function generateCacheKey(url: string): string {
  const parsedUrl = new URL(url, 'http://dummy-base');
  return `${parsedUrl.pathname}${parsedUrl.search}`;
}

// Function to check if cache is still valid
function isCacheValid(entry: CacheEntry): boolean {
  const now = Date.now();
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  
  return entry.timestamp >= midnight.getTime();
}

// Configure CORS properly
app.use(cors({
  // origin: ['http://localhost:3000', 'http://localhost:5173'],
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('/api/football/*', cors());

// Handle all football API requests
app.use('/api/football', async (req: express.Request, res: express.Response) => {
  try {
    
    // Construct target URL
    const targetUrl = `https://api.football-data.org/v4${req.url.replace('/api/football', '')}`;


    // Generate cache key
    const cacheKey = generateCacheKey(req.url);
    const cachedResponse = cache.get(cacheKey);

    // Check cache first
    if (cachedResponse && isCacheValid(cachedResponse)) {
      
      // Set CORS headers
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      return res.json(cachedResponse.data);
    }

    console.log('Cache miss. Fetching fresh data...');

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

    // Cache the response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
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

// Cache cleanup job - run once per day
setInterval(() => {
  console.log('Running cache cleanup...');
  for (const [key, entry] of cache.entries()) {
    if (!isCacheValid(entry)) {
      console.log(`Removing expired cache entry for: ${key}`);
      cache.delete(key);
    }
  }
}, CACHE_DURATION); 

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
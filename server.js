import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI/ML API Proxy Server is running' });
});

// Proxy endpoint for AI/ML API
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'google/gemini-2.5-flash' } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.VITE_AIML_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('\n📤 Forwarding request to AI/ML API...');
    console.log('Model:', model);
    console.log('Messages count:', messages.length);

    // Use supported Gemini model format
    const requestBody = {
      model: 'google/gemini-2.5-flash',  // Correct format for AI/ML API
      messages: messages
    };

    console.log('Sending to API with model:', requestBody.model);

    // Make request to AI/ML API
    const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ AI/ML API Error:');
      console.error('Status:', response.status, response.statusText);
      console.error('Response:', JSON.stringify(data, null, 2));
      
      return res.status(response.status).json({
        error: data.message || 'AI/ML API request failed',
        details: data
      });
    }

    console.log('✅ AI/ML API Response received');
    console.log('Response preview:', data.choices?.[0]?.message?.content?.substring(0, 100));
    
    // Forward the response to frontend
    res.json(data);

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 AI/ML API Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Frontend can make requests to http://localhost:${PORT}/api/chat\n`);
});

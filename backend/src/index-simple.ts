import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Basic routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'UNDO Recovery App API - Simple Mode'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'UNDO Recovery App API',
    version: 'v1',
    environment: 'development'
  });
});

// API Routes
const apiRouter = express.Router();

// Auth routes (placeholder)
apiRouter.post('/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        userId: 'demo-user',
        email: req.body.email,
        username: 'demo-user'
      },
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
      expiresIn: 900
    }
  });
});

// Coach routes
apiRouter.post('/coach/chat', (req, res) => {
  const { message } = req.body;

  res.json({
    success: true,
    data: {
      message: `I understand you said: "${message}". This is a demo response. Full AI coaching with GPT-5 will be available once you configure your OpenRouter API key.`,
      suggestions: ['Try the breathing exercise', 'Contact a friend', 'Take a walk'],
      urgency: 'low',
      timestamp: new Date()
    }
  });
});

apiRouter.post('/coach/crisis', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'I understand you need immediate support. Please call 988 for 24/7 crisis support, or dial 911 if you\'re in immediate danger.',
      suggestions: [
        'Call 988 - Suicide & Crisis Lifeline',
        'Call 911 for emergency',
        'Text HOME to 741741 for crisis text line'
      ],
      urgency: 'emergency',
      timestamp: new Date()
    }
  });
});

app.use('/api/v1', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 UNDO Recovery App API running on http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
});

export default app;
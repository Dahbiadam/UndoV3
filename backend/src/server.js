const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
    message: 'UNDO Recovery App API - Simple Mode',
    version: '1.0.0',
    environment: 'development'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'UNDO Recovery App API',
    version: 'v1',
    environment: 'development',
    description: 'API for addiction recovery support with AI coaching'
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
        userId: 'demo-user-' + Date.now(),
        email: req.body.email,
        username: 'demo-user'
      },
      accessToken: 'demo-access-token-' + Math.random().toString(36).substring(7),
      refreshToken: 'demo-refresh-token-' + Math.random().toString(36).substring(7),
      expiresIn: 900
    }
  });
});

// Coach routes
apiRouter.post('/coach/chat', (req, res) => {
  const { message, metadata = {} } = req.body;

  // Simple AI response simulation
  const responses = [
    "I understand you're going through a difficult time. Recovery is a journey, and every step forward matters.",
    "You're showing great courage by reaching out. What specific challenges are you facing right now?",
    "Recovery is possible, and you're not alone in this journey. Let's work through this together.",
    "Your feelings are valid. What coping strategies have worked for you in the past?"
    "Every day without giving in is a victory. Let's focus on today, one moment at a time."
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  res.json({
    success: true,
    data: {
      message: randomResponse + ` I understand you said: "${message}". This is a demo response. Full GPT-5 AI coaching will be available once you configure your OpenRouter API key in the backend environment.`,
      suggestions: [
        'Try the breathing exercise: 4-7-8 technique',
        'Call a friend or support person',
        'Take a walk or exercise',
        'Journal your thoughts and feelings',
        'Practice mindfulness meditation'
      ],
      followUpQuestions: [
        'What triggered these feelings?',
        'What has helped you in similar situations before?',
        'How can I support you right now?'
      ],
      strategies: ['breathing', 'mindfulness', 'social-support', 'exercise'],
      urgency: metadata.urgency || 'low',
      timestamp: new Date()
    }
  });
});

// Crisis intervention
apiRouter.post('/coach/crisis', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'I understand you need immediate support. Your safety is the most important thing right now.',
      urgent: true,
      suggestions: [
        '🚨 Call 988 - Suicide & Crisis Lifeline (24/7)',
        '🚨 Call 911 if you are in immediate danger',
        '📱 Text HOME to 741741 for Crisis Text Line',
        '📍 Reach out to a trusted friend or family member',
        '🧘 Practice deep breathing: 4 seconds in, 7 hold, 8 out'
      ],
      emergencyContacts: {
        usa: {
          crisis: '988',
          emergency: '911',
          textLine: 'Text HOME to 741741'
        }
      },
      groundingTechnique: {
        name: '5-4-3-2-1 Grounding',
        steps: [
          'Name 5 things you can SEE around you',
          'Name 4 things you can physically FEEL',
          'Name 3 things you can HEAR',
          'Name 2 things you can SMELL',
          'Name 1 thing you can TASTE'
        ]
      },
      urgency: 'emergency',
      timestamp: new Date()
    }
  });
});

// Journal analysis
apiRouter.post('/analyze-journal', (req, res) => {
  const { entry, mood } = req.body;

  // Simple sentiment analysis
  const positiveWords = ['happy', 'good', 'great', 'excellent', 'proud', 'accomplished', 'success', 'progress'];
  const negativeWords = ['struggle', 'difficult', 'hard', 'bad', 'sad', 'angry', 'frustrated', 'tempted', 'urges'];

  const entryLower = entry.toLowerCase();
  const positiveCount = positiveWords.filter(word => entryLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => entryLower.includes(word)).length;

  let sentiment = 'neutral';
  let insights = [];

  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    insights.push('Your journal entry shows positive reflection and growth mindset.');
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    insights.push('Your journal entry shows you\'re facing challenges, but you\'re reaching out which is brave.');
  }

  res.json({
    success: true,
    data: {
      insights: insights,
      patterns: [],
      suggestions: [
        'Continue daily journaling to track your progress',
        'Note your triggers and successful coping strategies',
        'Celebrate small victories in your recovery journey'
      ],
      mood: mood || 5,
      sentiment: sentiment,
      wordCount: entry.split(' ').length,
      timestamp: new Date()
    }
  });
});

// Mount API routes
app.use('/api/v1', apiRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /health',
      'GET /',
      'POST /api/v1/auth/login',
      'POST /api/v1/coach/chat',
      'POST /api/v1/coach/crisis',
      'POST /api/v1/analyze-journal'
    ],
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 UNDO Recovery App API Started Successfully!');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
  console.log(`💪 Ready to help people recover!`);
  console.log(`🤖 AI Coach: Demo Mode (Configure OPENROUTER_API_KEY for full GPT-5)`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  POST /api/v1/auth/login - Login (demo)');
  console.log('  POST /api/v1/coach/chat - Chat with AI coach');
  console.log('  POST /api/v1/coach/crisis - Crisis intervention');
  console.log('  POST /api/v1/analyze-journal - Journal analysis');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down UNDO Recovery App API...');
  process.exit(0);
});

module.exports = app;
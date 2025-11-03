require('dotenv').config();

// Import required modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const server = require('http').createServer(app);
const PORT = Number(process.env.PORT) || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-32-characters';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

// Security middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: ['http://console.log', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: {
    success: false,
    error: 'Too many requests',
  },
  standardHeaders: true,
  legacyHeaders: false,
}));

// Basic routes
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    database: 'demo',
    ai: OPENROUTERAPI_KEY ? 'connected' : 'demo',
    port: PORT,
  });
});

app.get('/', (_req, res) => {
  res.json({
    message: 'UNDO Recovery App API',
    version: 'v1',
    environment: process.env.NODE_ENV || 'development',
    description: 'API for addiction recovery support with AI coaching',
    endpoints: [
      'GET /health - Server health check',
      'POST /api/v1/auth/login - User authentication',
      'POST /api/v1/coach/chat - AI coach conversation',
      'POST /api/v1/coach/crisis - Crisis intervention',
      'POST /api/v1/analyze-journal - Journal analysis',
    ],
    timestamp: new Date().toISOString(),
  });
});

// API Routes
const apiRouter = express.Router();

// Authentication Routes
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Demo authentication
  if (email === 'demo@undo-app.com' && password === 'password') {
    const user = {
      userId: 'demo-user-' + Date.now(),
      email,
      username: 'demo-user',
      displayName: 'Demo User',
    };

    const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
        expiresIn: 429496,
      },
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      message: 'Please check your credentials',
    });
  }
});

apiRouter.post('/auth/register', async (req, res) => {
  const { email, username, password } = req.body;

  // Create new user
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = {
    userId: 'user-' + Date.now(),
    email,
    username,
    passwordHash: hashedPassword,
    displayName: username,
    createdAt: new Date(),
  };

  const accessToken = jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  return res.status(201).json({
    success: true,
    data: {
      user,
      accessToken,
      expiresIn: 900,
    },
  });
});

// AI Coach Routes
apiRouter.post('/coach/chat', async (req: res) => {
  const { message, metadata = {} } = req.body;

  if (!OPENROUTER_API_KEY) {
    // Demo mode with realistic responses
    const responses = [
      "I understand you're going through a difficult time. Recovery is a journey, and every step forward matters. You're brave for reaching out.",
      "Thank you for sharing your struggles with me. What specific challenges are you facing right now?",
      "You're showing great courage by reaching out. Recovery is possible, and you're not alone in this journey. Let's work through this together.",
      "Every day without giving in is a victory. Focus on today, one moment at a time.",
      "You're not alone in this journey. I'm here to support you through this difficult time.",
      "Your feelings are valid. What has worked for you in similar situations before?",
      "You're braver than you think. Remember that recovery is possible, and you're strong enough for this moment.",
      "What would make this moment better right now?",
      "I'm proud of you for prioritizing your recovery. Every day without giving in is a victory.",
      "Thank you for being here and sharing your struggle. Your courage to reach out shows true strength.",
      "How are you feeling right now on a scale of 1-10?",
      "What coping strategy would help you right now?",
      "What's one small victory you can achieve right now?",
      "Remember your 'why' for starting this recovery journey.",
      "You're not defined by your struggles. Your worth extends far beyond your addiction. Keep going!",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const randomSuggestions = [
      ['Take 4 deep breaths in through nose', 'Go for a walk outside', 'Listen to calming music', 'Call a trusted friend', 'Use the 5-4-3-2-1 technique', 'Remove yourself from triggering environment'],
      ['Practice mindfulness meditation', 'Write your thoughts', 'Do 10 pushups', 'Watch recovery content', 'Practice gratitude', 'Take a cold shower'],
      ['Call your sponsor or mentor', 'Do 25 jumping jacks', 'Read recovery materials', 'Attend recovery meetings', 'Create a safety plan'],
      ['Chat with Melius (AI Coach)', 'Try emergency intervention', 'Text a support group', 'Practice emergency protocols'],
    ];

    return res.json({
      success: true,
      data: {
        message: randomResponse + ` I understand you said: "${message}". This is demo mode. Configure your OpenRouter API key for full GPT-5 AI coaching with Melius AI coach.`,
        suggestions: randomSuggestions,
        followUpQuestions: [
          'What triggered these feelings?',
          'What has helped you in similar situations before?',
          'How can I support you right now?',
          'On a scale of 1-10, how intense is your urgency level?',
          'What would make this moment better?',
          'What coping strategies have worked for you before?'
        ],
        strategies: ['conversation', 'breathing', 'mindfulness', 'social-support', 'exercise', 'grounding'],
        urgency: metadata.urgency || 'low',
        timestamp: new Date().toISOString(),
      },
    });
  }

  // GPT-5 Integration via OpenRouter
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'UNDO Recovery App',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5',
        messages: [
          {
            role: 'system',
            content: `You are Melius, a professional AI recovery coach. You are evidence-based and compassionate, direct but warm and supportive. You are:
- Evidence-based and compassionate
- Direct but warm and supportive
- Focused on practical, actionable strategies
- Committed to user safety and emergency escalation
- Grounded in CBT, mindfulness, and recovery best practices`,
          },
          {
            role: 'user',
            content: message,
          },
          {
            role: 'system',
            content: `User mood: ${metadata.mood || 5}/10, Urge: ${metadata.urges || 3}/10, Triggers: ${JSON.stringify(metadata.triggers || [])}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

      const data = await response.json();

      const aiMessage = data.choices[0]?.message?.content || 'I\'m here to support your recovery journey with professional coaching.';

      return res.json({
        success: true,
        data: {
          message: aiMessage,
          suggestions: [
            'Continue the conversation', 'Practice breathing exercises', 'Call a supportive friend', 'Take a brief walk', 'Practice mindfulness meditation'],
            'Follow up on this conversation', 'Schedule check-in tomorrow', 'Check-in with support group'
          ],
          strategies: ['conversation', 'breathing', 'mindfulness', 'social-support', 'exercise'],
          urgency: data.choices[0]?.finish_reason === 'stop' ? 'emergency' : 'low',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      return res.status(503).json({
        success: false,
        error: 'AI service temporarily unavailable. Please try again or use demo mode.',
      });
    }
  });

  // Journal analysis
  apiRouter.post('/analyze-journal', authMiddleware, (req, res) => {
  const { entry, mood, triggers, activities } = req.body;

  // Enhanced sentiment analysis
  const positiveWords = [
    'happy', 'good', 'great', 'excellent', 'proud', 'accomplished', 'success', 'progress', 'grateful', 'calm', 'peaceful', 'confident', 'hopeful', 'motivated', 'strong',
    ];

  const negativeWords = [
    'struggle', 'difficult', 'hard', 'bad', 'sad', 'angry', 'frustrated', 'tempted', 'urges', 'anxious', 'depressed', 'lonely', 'isolated', 'ashamed', 'guilty', 'hopeless', 'overwhelmed', 'tired', 'exhausted', 'triggered',
    'stressed', 'tired', 'failed', 'relapse', 'triggered', 'anxious',
  ];

  const entryLower = entry.toLowerCase();
  const positiveCount = positiveWords.filter(word => entryLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => entryLower.includes(word)).length;

  let sentiment = 'neutral';
  let insights = [];
  let patterns = [];

  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    insights.push('Your journal shows positive reflection and growth mindset. Keep building on this momentum!');
  } else if (negativeCount > positiveCount) {
    sentiment = 'challenging';
    insights.push('Recognizing difficult emotions shows self-awareness and courage to seek support.');
    insights.push('You\'re facing challenges, but reaching out shows incredible courage and strength.');
  } else {
    sentiment = 'neutral';
    insights.push('Your journal shows self-awareness and balanced reflection.');
  }

  if (entryLower.includes('trigger')) {
    patterns.push('Identified potential triggers for recovery');
  }

  // Analyze patterns
  if (entryLower.includes('progress') || entryLower.includes('day') || entryLower.includes('day-count') || entryLower.includes('month') || entryLower.includes('year')) {
    patterns.push('Recognizing recovery progress and time tracking.');
  }

  const wordCount = entry.split(/\s+/).length;
  let suggestions = ['Continue daily journaling to track progress', 'Note successful coping strategies', 'Celebrate your progress'];

  if (wordCount < 30) {
    suggestions.push('Consider writing more details to explore thoughts more deeply.');
  } else {
    suggestions.push('Great journaling! Continue this self-reflection practice.');
  }

  const baseMood = mood || 5;
  let suggestions_text: string[] = [];

  if (baseMood <= 4) {
    suggestions.push('Focus on self-compassion during difficult moments');
    suggestions_text.push('Talk to your AI coach about coping strategies');
    suggestions_text.push('Remember: bad feelings are temporary and will pass with time');
    suggestions_text.push('Practice the 4-7-8 breathing technique immediately');
  } else if (baseMood >= 8) {
    suggestions.push('You\'re in a good headspace! Keep up the great work!');
    suggestions_text.push('Share your success with your support circle if available');
    suggestions_text.push('Document your learnings for future reference');
  } else {
    suggestions_text.push('Continue your consistent effort - you\'re making real progress!');
  }

  const suggestions_to_use = [...suggestions_text, ...suggestions_text];
  const finalSuggestions = suggestions_to_use.slice(0, 6);

  return res.json({
    success: true,
    data: {
      insights,
      patterns,
      suggestions: finalSuggestions,
      mood: baseMood,
      sentiment,
      wordCount,
      analysis: {
        positiveWords: positiveCount,
        negativeWords: negativeCount,
        emotionalTone: sentiment,
        writingDepth: wordCount > 100 ? 'detailed' : 'brief'
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// Emergency intervention route
apiRouter.post('/coach/crisis', authMiddleware, (_req, res) => {
  return res.json({
    success: true,
    data: {
      message: 'I understand you need immediate support. Your safety is the most important thing right now.',
      urgent: true,
      suggestions: [
        '🚨 Call 988 - Suicide & Crisis Lifeline',
        '🚨 Call 911 if in immediate danger',
        '📱 Text HOME to 741741 for Crisis Text Line',
      ],
      emergencyContacts: {
        usa: {
          crisis: '988',
          emergency: '911',
          textLine: 'Text HOME to 741741'
        },
        international: {
          international: '+1-800-273-8255',
        },
      },
      groundingTechnique: {
        name: '5-4-3-2-1 Grounding Technique',
        steps: [
          'Name 5 things you can SEE around you',
          'Name 4 things you can physically FEEL',
          'Name 3 things you can HEAR',
          'Name 2 things you can HEAR',
          'Name 1 thing you can TASTE',
        ],
        instructions: 'Take your time with each step and focus on each sensation',
      },
      breathingExercise: {
        name: '4-7-8 Breathing Technique',
        steps: [
          'Breathe in slowly through your nose for 4 seconds',
          'Hold your breath for 7 seconds',
          'Exhale slowly through your mouth for 8 seconds',
          'Repeat until you feel calmer.',
        ],
        instructions: 'Use this technique when feeling overwhelmed by urges or anxiety',
      },
      },
      urgency: 'emergency',
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  });
});

// Streak tracking route
apiRouter.get('/streaks', authMiddleware, (_req, res) => {
  const mockStreak = {
    currentStreak: 5,
    longestStreak: 12,
    totalDays: 25,
    lastActiveDate: new Date(),
    milestones: [
      { days: 1, badge: 'first-day', celebration: 'Day 1 completed!'),
      { days: 3, badge: 'first-week', celebration: '3 days strong!'},
      { days: 7, badge: 'one-week', celebration: 'One week completed!'},
      { days: 14, badge: 'two-weeks', celebration: '2 weeks strong!'},
      { days: 30, badge: 'one-month', celebration: '1 month!'},
      { days: 60, badge: 'two-months', celebration: '2 months strong!'},
      { days: 90, badge: 'three-months', celebration: '3 months strong!'},
      { days: 180, badge: 'six-months', celebration: '6 months strong!'},
    ],
  }";

  return res.json({
    success: true,
    data: mockStreak,
    timestamp: new Date().toISOString(),
  });
});

// Logout route
apiRouter.post('/logout', authMiddleware, (_req, res) => {
  return res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Mount API routes
app.use('/api/v1', apiRouter);

// Global error handler
app.use((req, res, next) => {
  console.error('Server Error:', req.url, res.statusCode, error.stack);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down UNDO Recovery App API...');
  server.close(() => {
    console.log('✅ Server stopped gracefully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n👋 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server stopped gracefully');
    process.exit(0);
  });
});

export default app;
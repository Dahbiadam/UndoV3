import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validate, validationResult } from 'express-validator';
import { config } from './config';

const app = express();
const server = createServer(app);
const PORT = Number(process.env['PORT']) || 3001;
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production-32-characters';
const OPENROUTER_API_KEY = process.env['OPENROUTER_API_KEY'] || '';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// General middleware
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// JWT Authentication middleware
interface AuthenticatedRequest extends express.Request {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

const authMiddleware = (req: any, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
        code: 'UNAUTHORIZED',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
    });
  };
};

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'] || 'development',
    version: '1.0.0',
    services: {
      database: 'demo',
      ai: OPENROUTER_API_KEY ? 'configured' : 'not configured',
    },
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'UNDO Recovery App API',
    version: 'v1',
    environment: 'development',
    description: 'API for addiction recovery support with AI coaching',
    endpoints: {
      health: 'GET /health',
      login: 'POST /api/v1/auth/login',
      register: 'POST /api/v1/auth/register',
      coachChat: 'POST /api/v1/coach/chat',
      crisis: 'POST /api/v1/coach/crisis',
      analyzeJournal: 'POST /api/v1/analyze-journal',
    },
  });
});

// API Routes
const apiRouter = express.Router();

// Authentication Routes
apiRouter.post('/auth/login',
  [
    validate([
      body('email').isEmail().withMessage('Valid email required'),
      body('password').isLength({ min: 1 }).withMessage('Password required'),
    ]),
  ],
  async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Mock authentication - in production, this would check against a database
    if (email === 'demo@undo-app.com' && password === 'password') {
      const user = {
        userId: 'demo-user-123',
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
          expiresIn: 900,
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
    });
  }
);

apiRouter.post('/auth/register',
  [
    validate([
      body('email').isEmail().withMessage('Valid email required'),
      body('username').isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters'),
      body('password').isLength({ min: 12 }).withMessage('Password must be at least 12 characters'),
    ]),
  ],
  async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { email, username, password } = req.body;

    // Mock user registration
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
      { userId: user.userId, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
        expiresIn: 900,
      },
    });
  }
);

// AI Coach Routes
apiRouter.post('/coach/chat', authMiddleware, async (req: any, res) => {
  const { message, metadata = {} } = req.body;

  if (!OPENROUTER_API_KEY) {
    // Demo mode responses
    const responses = [
      "I understand you're going through a difficult time. Recovery is a journey, and every step forward matters.",
      "You're showing great courage by reaching out. What specific challenges are you facing right now?",
      "Recovery is possible, and you're not alone in this journey. Let's work through this together.",
      "Your feelings are valid. What coping strategies have worked for you in the past?",
      "Every day without giving in is a victory. Let's focus on today, one moment at a time.",
      "Thank you for sharing this with me. It takes courage to be vulnerable and seek support.",
      "You're stronger than you think. Remember all the progress you've made so far.",
      "What's one small step you can take right now to move in a positive direction?",
      "I'm here to support you through this. You don't have to face this alone.",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return res.json({
      success: true,
      data: {
        message: randomResponse + ` I understand you said: "${message}". This is demo mode. Configure your OpenRouter API key for full GPT-5 AI coaching.`,
        suggestions: [
          'Try the breathing exercise: 4-7-8 technique',
          'Call a friend or support person',
          'Take a walk or exercise for 15 minutes',
          'Journal your thoughts and feelings',
          'Practice mindfulness meditation',
          'Remove yourself from triggering environment',
          'Use the 5-4-3-2-1 grounding technique',
          'Listen to calming music or nature sounds',
        ],
        followUpQuestions: [
          'What triggered these feelings?',
          'What has helped you in similar situations before?',
          'How can I support you right now?',
          'On a scale of 1-10, how intense are your urges?',
          'What would make this moment better?',
        ],
        strategies: ['breathing', 'mindfulness', 'social-support', 'exercise', 'distraction'],
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
            content: `You are Melius, a professional AI recovery coach for the UNDO app. You are:
- Evidence-based and compassionate
- Direct but warm and supportive
- Focused on practical, actionable strategies
- Knowledgeable about addiction recovery science
- Committed to user privacy and safety
- Able to recognize crisis situations and escalate appropriately

Your coaching style should be:
- Professional yet approachable
- Non-judgmental and empowering
- Focused on progress, not perfection
- Safety-conscious with clear boundaries
- Grounded in CBT, mindfulness, and recovery best practices

Always prioritize user safety and encourage professional help when appropriate.`,
          },
          {
            role: 'user',
            content: message,
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
    const aiMessage = data.choices[0]?.message?.content || 'I understand your message and I\'m here to support you.';

    return res.json({
      success: true,
      data: {
        message: aiMessage,
        suggestions: ['Continue the conversation', 'Practice breathing exercises', 'Contact support'],
        followUpQuestions: ['How are you feeling now?', 'What else would you like to share?'],
        strategies: ['conversation', 'breathing', 'support'],
        urgency: 'low',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'AI service temporarily unavailable',
      message: 'Please try again later or use demo mode',
    });
  }
});

apiRouter.post('/coach/crisis', authMiddleware, (_req: any, res) => {
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
        '🧘 Practice deep breathing: 4 seconds in, 7 hold, 8 out',
        '📍 Use the 5-4-3-2-1 grounding technique',
        '📍 Move to a different physical location',
        '📍 Call your therapist or counselor',
      ],
      emergencyContacts: {
        usa: {
          crisis: '988',
          emergency: '911',
          textLine: 'Text HOME to 741741',
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
          'Name 2 things you can SMELL',
          'Name 1 thing you can TASTE',
        ],
        instructions: 'Take your time with each step. Breathe deeply between each one.',
      },
      breathingExercise: {
        name: '4-7-8 Breathing Technique',
        steps: [
          'Breathehe in slowly through your nose for 4 seconds',
          'Hold your breath for 7 seconds',
          'Exhale slowly through your mouth for 8 seconds',
          'Repeat until you feel calmer',
        ],
      },
      urgency: 'emergency',
      timestamp: new Date().toISOString(),
    },
  });
});

apiRouter.post('/analyze-journal', authMiddleware, async (req: any, res) => {
  const { entry, mood } = req.body;

  // Simple sentiment analysis
  const positiveWords = [
    'happy', 'good', 'great', 'excellent', 'proud', 'accomplished', 'success', 'progress',
    'grateful', 'peaceful', 'calm', 'relaxed', 'confident', 'hopeful', 'motivated', 'strong',
    'recovery', 'freedom', 'empowered', 'supported', 'connected', 'balanced', 'focused',
  ];

  const negativeWords = [
    'struggle', 'difficult', 'hard', 'bad', 'sad', 'angry', 'frustrated', 'tempted', 'urges',
    'anxious', 'depressed', 'lonely', 'isolated', 'ashamed', 'guilty', 'hopeless', 'overwhelmed',
    'stressed', 'tired', 'exhausted', 'weak', 'failure', 'mistake', 'relapse', 'triggered',
  ];

  const entryLower = entry.toLowerCase();
  const positiveCount = positiveWords.filter(word => entryLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => entryLower.includes(word)).length;

  let sentiment = 'neutral';
  let insights = [];
  let patterns = [];

  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    insights.push('Your journal entry shows positive reflection and growth mindset.');
    insights.push('You\'re recognizing your strengths and progress in recovery.');
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    insights.push('Your journal entry shows you\'re facing challenges, but you\'re reaching out which is brave.');
    insights.push('Acknowledging difficult emotions is an important step in recovery.');
  } else {
    sentiment = 'neutral';
    insights.push('Your journal entry shows self-awareness and reflection.');
  }

  // Analyze patterns
  if (entryLower.includes('trigger')) {
    patterns.push('Identified potential triggers - this is valuable insight for your recovery.');
  }

  if (entryLower.includes('strategy') || entryLower.includes('coping')) {
    patterns.push('You\'re actively thinking about coping strategies - excellent for recovery.');
  }

  if (entryLower.includes('progress') || entryLower.includes('day')) {
    patterns.push('You\'re tracking your progress and time in recovery - this builds awareness.');
  }

  const wordCount = entry.split(' ').length;
  let suggestedActions = [];

  if (wordCount < 50) {
    suggestedActions.push('Consider writing more details to explore your thoughts and feelings more deeply.');
  } else {
    suggestedActions.push('Great job with detailed journaling! This will help with pattern recognition.');
  }

  suggestedActions.push('Continue daily journaling to track your progress over time.');
  suggestedActions.push('Note any triggers and successful coping strategies for future reference.');
  suggestedActions.push('Celebrate the small victories and milestones in your recovery journey.');

  return res.json({
    success: true,
    data: {
      insights,
      patterns,
      suggestions: suggestedActions,
      mood: mood || 5,
      sentiment: sentiment,
      wordCount,
      characterCount: entry.length,
      analysis: {
        positiveWords: positiveCount,
        negativeWords: negativeCount,
        emotionalTone: sentiment,
        writingDepth: wordCount > 100 ? 'detailed' : 'brief',
      },
      timestamp: new Date().toISOString(),
    },
  });
});

apiRouter.post('/refresh-token', async (req: any, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: 'Refresh token required',
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
    const accessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, username: decoded.username },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({
      success: true,
      data: {
        accessToken,
        expiresIn: 900,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
    });
  }
});

apiRouter.post('/logout', authMiddleware, async (req: any, res) => {
  // In a real app, you would invalidate the token on the server
  return res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Mount API routes
app.use('/api/v1', apiRouter);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The endpoint does not exist`,
    availableEndpoints: [
      'GET /health - Health check',
      'GET / - API information',
      'POST /api/v1/auth/login - User login',
      'POST /api/v1/auth/register - User registration',
      'POST /api/v1/coach/chat - AI coach chat',
      'POST /api/v1/coach/crisis - Crisis intervention',
      'POST /api/v1/analyze-journal - Journal analysis',
      'POST /api/v1/refresh-token - Refresh access token',
      'POST /api/v1/logout - User logout',
    ],
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((error: any, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message || 'Something went wrong',
    timestamp: new Date().toISOString(),
  });
});

// Start server
server.listen(PORT, () => {
  console.log('🚀 UNDO Recovery App API Started Successfully!');
  console.log('==========================================');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 API: http://localhost:${PORT}/api/v1`);
  console.log(`💪 Ready to help people recover!`);
  console.log('==========================================');
  console.log('🤖 AI Coach: ' + (OPENROUTER_API_KEY ? 'GPT-5 Connected' : 'Demo Mode'));
  console.log('');
  console.log('📊 Available Endpoints:');
  console.log('  GET  /health - Server health check');
  console.log('  POST /api/v1/auth/login - User authentication');
  console.log('  POST /api/v1/coach/chat - AI coach conversation');
  console.log('  POST /api/v1/coach/crisis - Crisis intervention');
  console.log('  POST /api/v1/analyze-journal - Journal analysis');
  console.log('');
  console.log('🔑 Demo Login Credentials:');
  console.log('  Email: demo@undo-app.com');
  console.log('  Password: password');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
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
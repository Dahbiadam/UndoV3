import { Router } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { authMiddleware } from '../middleware/auth';
import { aiCoachService } from '../services/aiCoachService';
import { createValidationError, createNotFoundError, createUnauthorizedError } from '../middleware/errorHandler';
import { coachConversationService } from '../services/coachConversationService';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * POST /api/v1/coach/chat
 * Send a message to AI coach
 */
router.post('/chat',
  [
    body('message')
      .isString()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Message must be between 1 and 2000 characters'),
    body('conversationId')
      .optional()
      .isMongoId()
      .withMessage('Invalid conversation ID'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object'),
  ],
  asyncHandler(async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createValidationError('Validation failed', errors.array());
    }

    const { message, conversationId, metadata } = req.body;
    const userId = req.user.userId;

    try {
      // Get or create conversation
      let conversation;
      if (conversationId) {
        conversation = await coachConversationService.getConversation(conversationId, userId);
        if (!conversation) {
          throw createNotFoundError('Conversation');
        }
      } else {
        conversation = await coachConversationService.createConversation(userId);
      }

      // Add user message to conversation
      await coachConversationService.addMessage(conversation._id, {
        id: generateMessageId(),
        role: 'user',
        content: message,
        type: 'text',
        timestamp: new Date(),
        metadata,
      });

      // Get conversation context
      const context = await coachConversationService.getConversationContext(conversation._id);

      // Build message history
      const messages = await coachConversationService.getRecentMessages(conversation._id, 10);

      // Generate AI response
      const coachingResponse = await aiCoachService.generateResponse(
        messages,
        context,
        conversation.stage
      );

      // Add AI response to conversation
      await coachConversationService.addMessage(conversation._id, {
        id: generateMessageId(),
        role: 'assistant',
        content: coachingResponse.message,
        type: 'text',
        timestamp: new Date(),
        metadata: {
          suggestions: coachingResponse.suggestions,
          followUpQuestions: coachingResponse.followUpQuestions,
          strategies: coachingResponse.strategies,
          urgency: coachingResponse.urgency,
        },
      });

      // Update conversation stage if needed
      if (coachingResponse.urgency === 'emergency') {
        await coachConversationService.updateConversationStage(conversation._id, 'crisis');
      }

      res.json({
        success: true,
        data: {
          conversationId: conversation._id,
          message: coachingResponse.message,
          suggestions: coachingResponse.suggestions,
          followUpQuestions: coachingResponse.followUpQuestions,
          strategies: coachingResponse.strategies,
          urgency: coachingResponse.urgency,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  })
);

/**
 * POST /api/v1/coach/crisis
 * Handle crisis intervention
 */
router.post('/crisis',
  [
    body('crisisData')
      .isObject()
      .withMessage('Crisis data is required'),
    body('urgency')
      .isIn(['low', 'medium', 'high', 'emergency'])
      .withMessage('Invalid urgency level'),
  ],
  asyncHandler(async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createValidationError('Validation failed', errors.array());
    }

    const { crisisData, urgency } = req.body;
    const userId = req.user.userId;

    try {
      // Generate crisis intervention response
      const crisisResponse = await aiCoachService.handleCrisis({
        ...crisisData,
        urgency,
        userId,
      });

      // Log crisis event
      await coachConversationService.logCrisisEvent(userId, {
        crisisData,
        urgency,
        response: crisisResponse,
        timestamp: new Date(),
      });

      res.json({
        success: true,
        data: {
          message: crisisResponse.message,
          suggestions: crisisResponse.suggestions,
          followUpQuestions: crisisResponse.followUpQuestions,
          strategies: crisisResponse.strategies,
          urgency: crisisResponse.urgency,
          emergencyContacts: [
            '988 - Suicide & Crisis Lifeline',
            '911 - Emergency Services',
            'Text HOME to 741741 - Crisis Text Line',
          ],
          timestamp: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  })
);

/**
 * GET /api/v1/coach/conversations
 * Get user's coach conversations
 */
router.get('/conversations',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
  ],
  asyncHandler(async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createValidationError('Validation failed', errors.array());
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const userId = req.user.userId;

    const conversations = await coachConversationService.getUserConversations(userId, page, limit);

    res.json({
      success: true,
      data: conversations,
      pagination: {
        page,
        limit,
        total: conversations.length,
        pages: Math.ceil(conversations.length / limit),
      },
    });
  })
);

/**
 * GET /api/v1/coach/conversations/:id
 * Get specific conversation
 */
router.get('/conversations/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid conversation ID'),
  ],
  asyncHandler(async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createValidationError('Validation failed', errors.array());
    }

    const conversationId = req.params.id;
    const userId = req.user.userId;

    const conversation = await coachConversationService.getConversation(conversationId, userId);
    if (!conversation) {
      throw createNotFoundError('Conversation');
    }

    res.json({
      success: true,
      data: conversation,
    });
  })
);

/**
 * POST /api/v1/coach/assessment
 * Start or continue recovery assessment
 */
router.post('/assessment',
  [
    body('userContext')
      .isObject()
      .withMessage('User context is required'),
    body('stage')
      .optional()
      .isIn(['initial', 'planning', 'review'])
      .withMessage('Invalid assessment stage'),
  ],
  asyncHandler(async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createValidationError('Validation failed', errors.array());
    }

    const { userContext, stage = 'initial' } = req.body;
    const userId = req.user.userId;

    try {
      if (stage === 'initial') {
        // Generate assessment questions
        const questions = await aiCoachService.generateAssessmentQuestions({
          ...userContext,
          userId,
        });

        res.json({
          success: true,
          data: {
            stage,
            questions,
            nextStep: 'planning',
            timestamp: new Date(),
          },
        });
      } else {
        // Generate personalized plan
        const assessmentResponse = await aiCoachService.generateResponse([
          {
            role: 'user',
            content: 'Based on my assessment, please create a personalized recovery plan.',
            timestamp: new Date(),
          },
        ], {
          currentStreak: userContext.currentStreak || 0,
          recentProgress: {
            moodAverage: 5,
            urgeAverage: 3,
            habitCompletion: 0,
          },
          recentTriggers: [],
          currentGoals: userContext.goals || [],
          emotionalState: 'stable',
        }, 'planning');

        res.json({
          success: true,
          data: {
            stage,
            plan: assessmentResponse.message,
            suggestions: assessmentResponse.suggestions,
            followUpQuestions: assessmentResponse.followUpQuestions,
            timestamp: new Date(),
          },
        });
      }
    } catch (error) {
      throw error;
    }
  })
);

/**
 * POST /api/v1/coach/analyze-journal
 * Analyze journal entry for insights
 */
router.post('/analyze-journal',
  [
    body('entry')
      .isString()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Journal entry must be between 10 and 5000 characters'),
    body('mood')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Mood must be between 1 and 10'),
  ],
  asyncHandler(async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createValidationError('Validation failed', errors.array());
    }

    const { entry, mood } = req.body;
    const userId = req.user.userId;

    try {
      // Get user context for analysis
      const context = await coachConversationService.getUserContext(userId);

      // Analyze journal entry
      const analysis = await aiCoachService.analyzeJournalEntry(entry, {
        ...context,
        currentMood: mood || context.currentMood,
      });

      res.json({
        success: true,
        data: {
          insights: analysis.insights,
          patterns: analysis.patterns,
          suggestions: analysis.suggestions,
          mood: analysis.mood,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  })
);

/**
 * DELETE /api/v1/coach/conversations/:id
 * Delete a conversation
 */
router.delete('/conversations/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid conversation ID'),
  ],
  asyncHandler(async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createValidationError('Validation failed', errors.array());
    }

    const conversationId = req.params.id;
    const userId = req.user.userId;

    await coachConversationService.deleteConversation(conversationId, userId);

    res.json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  })
);

/**
 * GET /api/v1/coach/models
 * Get available AI models
 */
router.get('/models', asyncHandler(async (req: any, res) => {
  try {
    const models = await aiCoachService.getModels();

    res.json({
      success: true,
      data: models,
    });
  } catch (error) {
    throw error;
  }
}));

/**
 * GET /api/v1/coach/status
 * Check AI service status
 */
router.get('/status', asyncHandler(async (req: any, res) => {
  try {
    const status = await aiCoachService.checkStatus();

    res.json({
      success: true,
      data: {
        status: status ? 'healthy' : 'unhealthy',
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-5',
        timestamp: new Date(),
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: 'AI service unavailable',
      timestamp: new Date(),
    });
  }
}));

// Helper function to generate message ID
function generateMessageId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export default router;
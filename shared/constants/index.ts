// Application constants for UNDO Recovery App

// Recovery Goals & Categories
export const RECOVERY_GOALS = {
  PORN_ADDICTION: 'porn-addiction',
  EXCESSIVE_MASTURBATION: 'excessive-masturbation',
  BOTH: 'both',
} as const;

export const PRIVACY_LEVELS = {
  COMPLETELY_ANONYMOUS: 'completely-anonymous',
  USERNAME_ONLY: 'username-only',
  SUPPORT_CIRCLE: 'support-circle',
} as const;

export const HABIT_CATEGORIES = {
  DAILY_FOUNDATION: 'daily-foundation',
  COPING: 'coping',
  GROWTH: 'growth',
  EMERGENCY_PREPAREDNESS: 'emergency-preparedness',
} as const;

export const COMMUNITY_TYPES = {
  GENERAL: 'general',
  SPECIALIZED: 'specialized',
  STRATEGY_SPECIFIC: 'strategy-specific',
  ACTIVITY_BASED: 'activity-based',
} as const;

export const POST_TYPES = {
  SUPPORT_REQUEST: 'support-request',
  SHARING: 'sharing',
  QUESTION: 'question',
  MILESTONE: 'milestone',
} as const;

export const EMERGENCY_INTERVENTION_TYPES = {
  BREATHING: 'breathing',
  GROUNDING: 'grounding',
  DISTRACTION: 'distraction',
  SUPPORT: 'support',
  AUDIO: 'audio',
} as const;

export const NOTIFICATION_TYPES = {
  DAILY_CHECKIN: 'daily-checkin',
  STREAK_MILESTONE: 'streak-milestone',
  EMERGENCY_FOLLOWUP: 'emergency-followup',
  COMMUNITY: 'community',
  AI_COACH: 'ai-coach',
} as const;

// Streak Milestones
export const STREAK_MILESTONES = [
  { days: 1, badge: 'first-day', celebration: 'First day completed!' },
  { days: 3, badge: 'three-days', celebration: '3 days strong!' },
  { days: 7, badge: 'one-week', celebration: 'One week milestone!' },
  { days: 14, badge: 'two-weeks', celebration: 'Two weeks of recovery!' },
  { days: 30, badge: 'one-month', celebration: '30 days - amazing progress!' },
  { days: 60, badge: 'two-months', celebration: '60 days of consistency!' },
  { days: 90, badge: 'three-months', celebration: '90 days - life changing!' },
  { days: 180, badge: 'six-months', celebration: 'Six months milestone!' },
  { days: 365, badge: 'one-year', celebration: 'One year of freedom!' },
  { days: 730, badge: 'two-years', celebration: 'Two years of recovery!' },
] as const;

// Mood & Emotion Constants
export const MOOD_RANGE = {
  MIN: 1,
  MAX: 10,
  VERY_LOW: 1,
  LOW: 3,
  MODERATE: 5,
  GOOD: 7,
  VERY_GOOD: 9,
  EXCELLENT: 10,
} as const;

export const URGE_INTENSITY = {
  MIN: 0,
  MAX: 10,
  NONE: 0,
  LOW: 3,
  MODERATE: 5,
  HIGH: 7,
  VERY_HIGH: 9,
  EXTREME: 10,
} as const;

export const EMOTIONS = {
  // Positive emotions
  GRATEFUL: 'grateful',
  HOPEFUL: 'hopeful',
  PROUD: 'proud',
  CONFIDENT: 'confident',
  PEACEFUL: 'peaceful',
  HAPPY: 'happy',
  MOTIVATED: 'motivated',
  INSPIRED: 'inspired',

  // Neutral emotions
  CALM: 'calm',
  NEUTRAL: 'neutral',
  FOCUSED: 'focused',
  REFLECTIVE: 'reflective',

  // Challenging emotions
  ANXIOUS: 'anxious',
  FRUSTRATED: 'frustrated',
  DISCOURAGED: 'discouraged',
  LONELY: 'lonely',
  BORED: 'bored',
  STRESSED: 'stressed',
  ANGRY: 'angry',
  SAD: 'sad',
  GUILTY: 'guilty',
  ASHAMED: 'ashamed',

  // Recovery-specific emotions
  TRIGGERED: 'triggered',
  TEMPTED: 'tempted',
  RESILIENT: 'resilient',
  DETERMINED: 'determined',
  VULNERABLE: 'vulnerable',
  SUPPORTED: 'supported',
  CONNECTED: 'connected',
} as const;

export const TRIGGER_CATEGORIES = {
  STRESS: 'stress',
  BOREDOM: 'boredom',
  LONELINESS: 'loneliness',
  ANXIETY: 'anxiety',
  DEPRESSION: 'depression',
  FATIGUE: 'fatigue',
  RELATIONSHIP_ISSUES: 'relationship-issues',
  WORK_PRESSURE: 'work-pressure',
  SOCIAL_MEDIA: 'social-media',
  CERTAIN_TIMES_OF_DAY: 'certain-times-of-day',
  SPECIFIC_LOCATIONS: 'specific-locations',
  EMOTIONAL_STATES: 'emotional-states',
  PHYSICAL_STATES: 'physical-states',
  ENVIRONMENTAL_CUES: 'environmental-cues',
  THOUGHT_PATTERNS: 'thought-patterns',
} as const;

export const COPING_STRATEGIES = {
  // Cognitive strategies
  THOUGHT_RECORDING: 'thought-recording',
  COGNITIVE_RESTRUCTURING: 'cognitive-restructuring',
  PROBLEM_SOLVING: 'problem-solving',
  GRATITUDE_PRACTICE: 'gratitude-practice',
  POSITIVE_AFFIRMATIONS: 'positive-affirmations',

  // Behavioral strategies
  EXERCISE: 'exercise',
  MEDITATION: 'meditation',
  DEEP_BREATHING: 'deep-breathing',
  PROGRESSIVE_MUSCLE_RELAXATION: 'progressive-muscle-relaxation',
  MINDFULNESS: 'mindfulness',

  // Social strategies
  REACHING_OUT: 'reaching-out',
  SUPPORT_GROUPS: 'support-groups',
  ACCOUNTABILITY_PARTNER: 'accountability-partner',
  THERAPY: 'therapy',

  // Environmental strategies
  CHANGING_ENVIRONMENT: 'changing-environment',
  BLOCKING_SITES: 'blocking-sites',
  AVOIDING_TRIGGERS: 'avoiding-triggers',
  CREATING_SAFE_SPACES: 'creating-safe-spaces',

  // Creative strategies
  JOURNALING: 'journaling',
  CREATIVE_EXPRESSION: 'creative-expression',
  MUSIC: 'music',
  READING: 'reading',
  LEARNING_NEW_SKILLS: 'learning-new-skills',
} as const;

// AI Coach Constants
export const AI_COACH_STAGES = {
  ASSESSMENT: 'assessment',
  PLANNING: 'planning',
  IMPLEMENTATION: 'implementation',
  CRISIS: 'crisis',
} as const;

export const AI_COACH_STYLES = {
  DIRECT: 'direct',
  GENTLE: 'gentle',
} as const;

export const AI_SESSION_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  AS_NEEDED: 'as-needed',
} as const;

// Breathing Exercise Constants
export const BREATHING_EXERCISES = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Balance your nervous system with equal counts',
    instructions: [
      'Breathe in slowly for 4 seconds',
      'Hold your breath for 4 seconds',
      'Exhale slowly for 4 seconds',
      'Hold your breath for 4 seconds',
    ],
    duration: 4,
    totalCycles: 10,
  },
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    description: 'Calm anxiety with extended exhale',
    instructions: [
      'Breathe in through your nose for 4 seconds',
      'Hold your breath for 7 seconds',
      'Exhale through your mouth for 8 seconds',
    ],
    duration: 8,
    totalCycles: 8,
  },
  {
    id: 'belly-breathing',
    name: 'Diaphragmatic Breathing',
    description: 'Reduce stress with deep belly breathing',
    instructions: [
      'Place one hand on your belly',
      'Breathe in slowly through your nose, feeling your belly expand',
      'Exhale slowly through your mouth, feeling your belly contract',
      'Focus on the rise and fall of your belly',
    ],
    duration: 6,
    totalCycles: 12,
  },
] as const;

// Grounding Exercise Constants (5-4-3-2-1 Method)
export const GROUNDING_STEPS = [
  { type: 'sight', instruction: 'Name 5 things you can see around you' },
  { type: 'touch', instruction: 'Name 4 things you can physically feel' },
  { type: 'hearing', instruction: 'Name 3 things you can hear right now' },
  { type: 'smell', instruction: 'Name 2 things you can smell' },
  { type: 'taste', instruction: 'Name 1 thing you can taste' },
] as const;

// Validation Constants
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
    FORBIDDEN_NAMES: ['admin', 'root', 'system', 'undo', 'support', 'help'],
  },
  PASSWORD: {
    MIN_LENGTH: 12,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    BLOCKED_DOMAINS: ['tempmail.com', '10minutemail.com', 'guerrillamail.com'],
  },
  POST_CONTENT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000,
  },
  COMMENT_CONTENT: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 500,
  },
} as const;

// Pagination & Limits
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const;

export const RATE_LIMITS = {
  AUTH: {
    LOGIN: { attempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
    REGISTER: { attempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
    PASSWORD_RESET: { attempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  },
  API: {
    GENERAL: { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
    AI_COACH: { requests: 20, windowMs: 60 * 60 * 1000 }, // 20 AI requests per hour
    COMMUNITY: { requests: 50, windowMs: 15 * 60 * 1000 }, // 50 community actions per 15 minutes
  },
} as const;

// Token Constants
export const TOKENS = {
  ACCESS_TOKEN: {
    EXPIRY: '15m',
    SECRET_LENGTH: 64,
  },
  REFRESH_TOKEN: {
    EXPIRY: '7d',
    SECRET_LENGTH: 64,
  },
  EMAIL_VERIFICATION: {
    EXPIRY: '24h',
    SECRET_LENGTH: 32,
  },
  PASSWORD_RESET: {
    EXPIRY: '1h',
    SECRET_LENGTH: 32,
  },
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  USER_STREAK: (userId: string) => `user:streak:${userId}`,
  COMMUNITY_POSTS: (communityId: string) => `community:posts:${communityId}`,
  AI_CONVERSATION: (userId: string) => `ai:conversation:${userId}`,
  RATE_LIMIT: (identifier: string, type: string) => `rate-limit:${type}:${identifier}`,
  SESSION: (sessionId: string) => `session:${sessionId}`,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Codes
export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // User errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  EMAIL_TAKEN: 'EMAIL_TAKEN',

  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  ACCESS_DENIED: 'ACCESS_DENIED',
  FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',

  // System errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// Achievement Badges
export const ACHIEVEMENT_BADGES = {
  // Streak badges
  FIRST_STEP: 'first-step',
  WEEK_WARRIOR: 'week-warrior',
  MONTH_CHAMPION: 'month-champion',
  QUARTER_MASTER: 'quarter-master',
  YEAR_LEGEND: 'year-legend',

  // Resilience badges
  URGE_URGER: 'urge-urger',
  EMERGENCY_HERO: 'emergency-hero',
  BOUNCED_BACK: 'bounced-back',

  // Growth badges
  JOURNAL_KEEPER: 'journal-keeper',
  MINDFUL_MASTER: 'mindful-master',
  HABIT_HERO: 'habit-hero',

  // Support badges
  COMMUNITY_HELPER: 'community-helper',
  ENCOURAGER: 'encourager',
  MENTOR: 'mentor',
  SHARER: 'sharer',

  // Special badges
  EARLY_ADOPTER: 'early-adopter',
  FEEDBACK_PROVIDER: 'feedback-provider',
  COMMUNITY_BUILDER: 'community-builder',
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_WEEK: 7,
  WEEKS_PER_MONTH: 4,
  MONTHS_PER_YEAR: 12,
  MILLISECONDS_PER_SECOND: 1000,
} as const;

export const TIME_IN_MS = {
  ONE_MINUTE: TIME_CONSTANTS.MILLISECONDS_PER_SECOND * TIME_CONSTANTS.SECONDS_PER_MINUTE,
  ONE_HOUR: TIME_CONSTANTS.MILLISECONDS_PER_SECOND * TIME_CONSTANTS.SECONDS_PER_MINUTE * TIME_CONSTANTS.MINUTES_PER_HOUR,
  ONE_DAY: TIME_CONSTANTS.MILLISECONDS_PER_SECOND * TIME_CONSTANTS.SECONDS_PER_MINUTE * TIME_CONSTANTS.MINUTES_PER_HOUR * TIME_CONSTANTS.HOURS_PER_DAY,
  ONE_WEEK: TIME_CONSTANTS.MILLISECONDS_PER_SECOND * TIME_CONSTANTS.SECONDS_PER_MINUTE * TIME_CONSTANTS.MINUTES_PER_HOUR * TIME_CONSTANTS.HOURS_PER_DAY * TIME_CONSTANTS.DAYS_PER_WEEK,
} as const;
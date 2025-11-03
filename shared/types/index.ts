// Core types for UNDO Recovery App

// User & Authentication Types
export interface User {
  _id: string;
  email: string;
  username: string;
  passwordHash: string;
  profile: UserProfile;
  recoveryGoals: RecoveryGoals;
  preferences: UserPreferences;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  displayName: string;
  avatar?: string;
  bio?: string;
  age?: number;
  timezone: string;
  language: string;
}

export interface RecoveryGoals {
  primaryGoal: 'porn-addiction' | 'excessive-masturbation' | 'both';
  startDate: Date;
  previousAttempts?: number;
  whatWorked?: string[];
  whatDidntWork?: string[];
  triggers?: string[];
  copingStrategies?: string[];
}

export interface UserPreferences {
  privacyLevel: 'completely-anonymous' | 'username-only' | 'support-circle';
  dataSharing: {
    analytics: boolean;
    improvement: boolean;
    research: boolean;
  };
  notifications: {
    email: boolean;
    inApp: boolean;
    dailyCheckIn: boolean;
    emergencyAlerts: boolean;
  };
  aiCoach: {
    name: string;
    style: 'direct' | 'gentle';
    sessionFrequency: 'daily' | 'weekly' | 'as-needed';
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  emergency: {
    quickPin?: string;
    emergencyContacts: EmergencyContact[];
    preferredInterventions: string[];
  };
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  contact: string;
  isVerified: boolean;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  recoveryGoals: RecoveryGoals;
  preferences: Partial<UserPreferences>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

// Streak & Progress Types
export interface Streak {
  _id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastActiveDate: Date;
  streakHistory: StreakEntry[];
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StreakEntry {
  date: Date;
  success: boolean;
  urgeIntensity: number;
  mood: number;
  triggers?: string[];
  notes?: string;
  emergencySessionUsed: boolean;
}

export interface Milestone {
  days: number;
  achieved: boolean;
  achievedDate?: Date;
  badge: string;
  celebration: string;
}

export interface DailyCheckIn {
  _id: string;
  userId: string;
  date: Date;
  mood: {
    rating: number; // 1-10
    emotions: string[];
    notes?: string;
  };
  urges: {
    intensity: number; // 0-10
    triggers: string[];
    duration?: number;
    resisted: boolean;
  };
  sleep: {
    quality: number; // 1-10
    duration: number; // hours
  };
  activities: {
    exercise: boolean;
    meditation: boolean;
    gratitude: boolean;
    journaling: boolean;
    social: boolean;
  };
  notes?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Emergency & Crisis Types
export interface EmergencySession {
  _id: string;
  userId: string;
  timestamp: Date;
  trigger: {
    type: string;
    intensity: number;
    context?: string;
  };
  interventions: EmergencyIntervention[];
  outcome: {
    resolved: boolean;
    resolvedAt?: Date;
    urgeReduction: number; // 0-100%
    copingStrategiesUsed: string[];
  };
  followUp: {
    scheduled: boolean;
    scheduledDate?: Date;
    completed: boolean;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyIntervention {
  type: 'breathing' | 'grounding' | 'distraction' | 'support' | 'audio';
  duration: number; // minutes
  completed: boolean;
  effectiveness: number; // 1-10
  notes?: string;
}

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  duration: number; // seconds per cycle
  totalCycles: number;
  audioUrl?: string;
}

// AI Coach Types
export interface AIConversation {
  _id: string;
  userId: string;
  sessionId: string;
  messages: AIMessage[];
  context: AIContext;
  stage: 'assessment' | 'planning' | 'implementation' | 'crisis';
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: 'text' | 'voice' | 'exercise';
  timestamp: Date;
  metadata?: {
    mood?: number;
    urgeIntensity?: number;
    triggerIdentified?: string;
    strategySuggested?: string;
  };
}

export interface AIContext {
  currentStreak: number;
  recentProgress: {
    moodAverage: number;
    urgeAverage: number;
    habitCompletion: number;
  };
  recentTriggers: string[];
  successfulStrategies: string[];
  currentGoals: string[];
  emotionalState: 'stable' | 'struggling' | 'improving' | 'crisis';
}

export interface AICoachingPlan {
  _id: string;
  userId: string;
  goals: AIGoal[];
  strategies: AIStrategy[];
  milestones: AIMilestone[];
  isActive: boolean;
  startDate: Date;
  targetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIGoal {
  id: string;
  title: string;
  description: string;
  category: 'urges' | 'triggers' | 'habits' | 'emotional' | 'lifestyle';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  isAchieved: boolean;
}

export interface AIStrategy {
  id: string;
  name: string;
  description: string;
  category: 'cognitive' | 'behavioral' | 'mindfulness' | 'social';
  instructions: string[];
  frequency: string;
  effectiveness: number; // 1-10
  isActive: boolean;
}

export interface AIMilestone {
  id: string;
  title: string;
  description: string;
  criteria: string;
  achieved: boolean;
  achievedDate?: Date;
}

// Community Types
export interface Community {
  _id: string;
  name: string;
  description: string;
  type: 'general' | 'specialized' | 'strategy-specific' | 'activity-based';
  category: string;
  isPrivate: boolean;
  memberCount: number;
  postCount: number;
  rules: CommunityRule[];
  moderators: string[]; // user IDs
  tags: string[];
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityRule {
  id: string;
  title: string;
  description: string;
  severity: 'warning' | 'temporary-ban' | 'permanent-ban';
}

export interface CommunityPost {
  _id: string;
  communityId: string;
  authorId: string;
  authorUsername: string;
  title?: string;
  content: string;
  type: 'support-request' | 'sharing' | 'question' | 'milestone';
  mood?: number;
  triggers?: string[];
  tags: string[];
  isAnonymous: boolean;
  responseCount: number;
  upvoteCount: number;
  isEdited: boolean;
  editedAt?: Date;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityComment {
  _id: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  parentId?: string; // for nested replies
  isAnonymous: boolean;
  upvoteCount: number;
  isEdited: boolean;
  editedAt?: Date;
  isModerator: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityMember {
  _id: string;
  userId: string;
  communityId: string;
  username: string;
  role: 'member' | 'moderator' | 'admin';
  joinDate: Date;
  postCount: number;
  commentCount: number;
  lastActiveAt: Date;
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: Date;
}

// Habit Tracking Types
export interface Habit {
  _id: string;
  userId: string;
  name: string;
  description: string;
  category: 'daily-foundation' | 'coping' | 'growth' | 'emergency-preparedness';
  type: 'boolean' | 'count' | 'duration';
  targetValue?: number;
  unit?: string;
  frequency: 'daily' | 'weekly' | 'specific-days';
  scheduleDays?: number[]; // 0-6 (Sunday-Saturday)
  isActive: boolean;
  streak: number;
  completionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitEntry {
  _id: string;
  habitId: string;
  userId: string;
  date: Date;
  value: number | boolean;
  duration?: number; // minutes
  notes?: string;
  completed: boolean;
  createdAt: Date;
}

export interface HabitCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  habits: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Notification Types
export interface Notification {
  _id: string;
  userId: string;
  type: 'daily-checkin' | 'streak-milestone' | 'emergency-followup' | 'community' | 'ai-coach';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface PushNotificationSettings {
  enabled: boolean;
  token: string;
  platform: 'web' | 'ios' | 'android';
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Database Query Types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  moodRange?: [number, number];
  triggers?: string[];
  categories?: string[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

// PWA Types
export interface ServiceWorkerMessage {
  type: string;
  payload: any;
}

export interface OfflineQueueItem {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  retryCount?: number;
}

export interface AppConfig {
  version: string;
  buildNumber: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    aiCoach: boolean;
    community: boolean;
    emergencyMode: boolean;
    offlineMode: boolean;
  };
  maintenance: {
    enabled: boolean;
    message?: string;
    startTime?: Date;
    endTime?: Date;
  };
}
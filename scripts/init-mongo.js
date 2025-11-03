// MongoDB initialization script for UNDO app
db = db.getSiblingDB('undo_dev');

// Create collections with indexes
db.createCollection('users');
db.createCollection('streaks');
db.createCollection('journals');
db.createCollection('communities');
db.createCollection('aiconversations');
db.createCollection('emergencysessions');
db.createCollection('habits');
db.createCollection('communityposts');
db.createCollection('communitycomments');

// Create indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

// Create indexes for streaks collection
db.streaks.createIndex({ userId: 1 });
db.streaks.createIndex({ currentStreak: -1 });
db.streaks.createIndex({ lastActiveDate: 1 });

// Create indexes for journals collection
db.journals.createIndex({ userId: 1 });
db.journals.createIndex({ createdAt: -1 });
db.journals.createIndex({ mood: 1 });

// Create indexes for communities collection
db.communities.createIndex({ name: 1 }, { unique: true });
db.communities.createIndex({ type: 1 });

// Create indexes for AI conversations collection
db.aiconversations.createIndex({ userId: 1 });
db.aiconversations.createIndex({ createdAt: -1 });

// Create indexes for emergency sessions collection
db.emergencysessions.createIndex({ userId: 1 });
db.emergencysessions.createIndex({ timestamp: -1 });
db.emergencysessions.createIndex({ resolved: 1 });

// Create indexes for habits collection
db.habits.createIndex({ userId: 1 });
db.habits.createIndex({ categoryId: 1 });

// Create indexes for community posts collection
db.communityposts.createIndex({ communityId: 1 });
db.communityposts.createIndex({ authorId: 1 });
db.communityposts.createIndex({ createdAt: -1 });

// Create indexes for community comments collection
db.communitycomments.createIndex({ postId: 1 });
db.communitycomments.createIndex({ authorId: 1 });
db.communitycomments.createIndex({ createdAt: 1 });

// Create a development user (for testing)
db.users.insertOne({
  email: 'dev@undo-app.com',
  username: 'developer',
  passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', // password: 'password'
  profile: {
    displayName: 'Developer',
    avatar: null,
    bio: 'Development account for testing'
  },
  recoveryGoals: {
    primaryGoal: 'porn-addiction',
    startDate: new Date(),
    privacyLevel: 'completely-anonymous'
  },
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('MongoDB initialized successfully for UNDO development environment');
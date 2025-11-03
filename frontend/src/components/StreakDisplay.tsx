'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastActiveDate: Date;
}

export function StreakDisplay() {
  const [streakData] = useState<StreakData>({
    currentStreak: 5,
    longestStreak: 12,
    totalDays: 25,
    lastActiveDate: new Date(),
  });

  const getStreakMessage = () => {
    if (streakData.currentStreak === 0) {
      return "Start your recovery journey today!";
    }
    if (streakData.currentStreak === 1) {
      return "Great start! One day completed!";
    }
    if (streakData.currentStreak < 7) {
      return `${streakData.currentStreak} days of freedom!`;
    }
    if (streakData.currentStreak < 30) {
      return `Incredible momentum! ${streakData.currentStreak} days strong!`;
    }
    if (streakData.currentStreak < 90) {
      return `Amazing progress! ${streakData.currentStreak} days of recovery!`;
    }
    return `${streakData.currentStreak} days transformed! You're changing your life!`;
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "One day at a time, one decision at a time.",
      "Progress, not perfection.",
      "Every setback is a setup for a comeback.",
      "You are stronger than your urges.",
      "Recovery is possible, and you're living proof.",
      "Your future self will thank you.",
      "Courage doesn't always roar. Sometimes it's the quiet voice that says 'try again tomorrow'.",
      "You are worth this fight.",
      "Every day without giving in is a victory.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const getStreakColor = () => {
    if (streakData.currentStreak === 0) return 'text-gray-500';
    if (streakData.currentStreak < 3) return 'text-blue-500';
    if (streakData.currentStreak < 7) return 'text-green-500';
    if (streakData.currentStreak < 14) return 'text-purple-500';
    if (streakData.currentStreak < 30) return 'text-orange-500';
    return 'text-red-500';
  };

  const getStreakEmoji = () => {
    if (streakData.currentStreak === 0) return '🌱';
    if (streakData.currentStreak < 3) return '🌱';
    if (streakData.currentStreak < 7) return '🌟';
    if (streakData.currentStreak < 14) return '🌟';
    if (streakData.currentStreak < 30) return '🔥';
    return '🔥';
  };

  const getProgressBarColor = () => {
    const percentage = (streakData.currentStreak / 30) * 100;
    if (percentage < 20) return 'bg-red-500';
    if (percentage < 40) return 'bg-orange-500';
    if (percentage < 60) return 'bg-yellow-500';
    if (percentage < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const daysTo30 = Math.min(streakData.currentStreak, 30);
  const percentageTo30 = (daysTo30 / 30) * 100;

  const milestones = [
    { days: 1, emoji: '🌟', label: 'First Day' },
    { days: 3, emoji: '🌟', label: '3 Days' },
    { days: 7, emoji: '🟠', label: '1 Week' },
    { days: 14, emoji: '🟠', label: '2 Weeks' },
    { days: 30, emoji: '🌟', label: '1 Month' },
    { days: 60, emoji: '🔥', label: '2 Months' },
    { days: 90, emoji: '🔥', label: '3 Months' },
    { days: 180, emoji: '🔥', label: '6 Months' },
    { days: 365, emoji: '🔥', label: '1 Year' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="glass-morphism rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          🎯 Your Recovery Journey
        </h2>

        {/* Current Streak Display */}
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {getStreakEmoji()}
          </div>
          <div className={`text-3xl font-bold ${getStreakColor()}`}>
            Day {streakData.currentStreak}
          </div>
          <p className="text-lg text-gray-600">
            {getStreakMessage()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to 30 Days</span>
            <span>{percentageTo30.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              className={`h-full ${getProgressBarColor()} transition-all duration-500 ease-out`}
              style={{ width: `${percentageTo30}%` }}
              initial={false}
            />
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Milestones</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.days}
                className={`relative flex flex-col items-center justify-center p-3 rounded-lg ${
                  streakData.currentStreak >= milestone.days
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : 'bg-gray-100 text-gray-500 border-gray-300'
                } transition-colors`}
              >
                <span className="text-2xl mb-1">{milestone.emoji}</span>
                <span className="text-xs font-medium">{milestone.label}</span>
                {streakData.currentStreak >= milestone.days && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{streakData.currentStreak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{streakData.longestStreak}</div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{streakData.totalDays}</div>
            <div className="text-sm text-gray-600">Total Days</div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-700 italic italic">
            "{getMotivationalQuote()}"
          </p>
        </div>

        {/* Success Celebration */}
        {streakData.currentStreak >= 7 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center p-4 bg-green-100 rounded-lg border-2 border-green-300"
          >
            <div className="text-2xl mb-2">🎉</div>
            <div className="font-bold text-green-800">
              You've built a week of recovery!
            </div>
            <div className="text-sm text-green-700">
              This is incredible progress!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface MoodCheckInProps {
  onSubmit?: (data: MoodData) => void;
}

interface MoodData {
  mood: number;
  urges: number;
  triggers: string[];
  activities: {
    meditation: boolean;
    exercise: boolean;
    journaling: boolean;
    gratitude: boolean;
    social: boolean;
  };
  notes: string;
}

export function MoodCheckIn({ onSubmit }: MoodCheckInProps) {
  const [mood, setMood] = useState(5);
  const [urges, setUrgeIntensity] = useState(3);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [activities, setActivities] = useState({
    meditation: false,
    exercise: false,
    journaling: false,
    gratitude: false,
    social: false,
  });
  const [notes, setNotes] = useState('');

  const triggerOptions = [
    'stress',
    'boredom',
    'loneliness',
    'anxiety',
    'fatigue',
    'anger',
    'sadness',
    'hunger',
    'social pressure',
    'work pressure',
    'evening hours',
    'weekend',
    'after conflict',
    'before sleep',
  ];

  const handleSubmit = () => {
    const data: MoodData = {
      mood,
      urges,
      triggers,
      activities,
      notes,
    };

    onSubmit?.(data);

    // Reset form after submission
    setTimeout(() => {
      setMood(5);
      setUrgeIntensity(3);
      setTriggers([]);
      setActivities({
        meditation: false,
        exercise: false,
        journaling: false,
        gratitude: false,
        social: false,
      });
      setNotes('');
    }, 1000);
  };

  const getMoodEmoji = (value: number) => {
    if (value <= 2) return '😢';
    if (value <= 4) return '😟�';
    if (value <= 6) return '😐';
    if (value <= 8) return '🙂';
    return '😊';
  };

  const getMoodColor = (value: number) => {
    if (value <= 2) return 'text-red-500';
    if (value <= 4) return 'text-orange-500';
    if (value <= 6) return 'text-yellow-500';
    if (value <= 8) return 'text-green-500';
    return 'text-blue-500';
  };

  const getUrgeEmoji = (value: number) => {
    if (value <= 2) return '🟢';
    if (value <= 4) return '🟠';
    if (value <= 6) return '🟡';
    if (value <= 8) return '🟠';
    return '🔴';
  };

  const getUrgeColor = (value: number) => {
    if (value <= 2) return 'bg-green-100 text-green-800';
    if (value <= 4) return 'bg-yellow-100 text-yellow-800';
    if (value <= 6) return 'bg-orange-100 text-orange-800';
    if (value <= 8) return 'bg-red-100 text-red-800';
    return 'bg-red-200 text-red-900';
  };

  const toggleTrigger = (trigger: string) => {
    setTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const toggleActivity = (activity: keyof MoodData['activities']) => {
    setActivities(prev => ({
      ...prev,
      [activity]: !prev[activity],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          💭 Daily Check-In
        </h2>

        <div className="space-y-6">
          {/* Mood Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How are you feeling today?
              <span className="text-2xl ml-2">{getMoodEmoji(mood)}</span>
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">1</span>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-gray-600">10</span>
            </div>
            <div className={`text-center text-2xl ${getMoodColor(mood)} mt-2`}>
              {mood}/10
            </div>
          </div>

          {/* Urge Intensity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Urge Intensity
              <span className="text-2xl ml-2">{getUrgeEmoji(urges)}</span>
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">0</span>
              <input
                type="range"
                min="0"
                max="10"
                value={urges}
                onChange={(e) => setUrgeIntensity(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-gray-600">10</span>
            </div>
            <div className={`text-center text-2xl ${getUrgeColor(urges)} mt-2`}>
              {urges}/10
            </div>
          </div>

          {/* Triggers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What triggered these feelings?
            </label>
            <div className="flex flex-wrap gap-2">
              {triggerOptions.map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => toggleTrigger(trigger)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    triggers.includes(trigger)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {trigger}
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <label className="block text font-medium text-gray-700 mb-3">
              Recovery Activities
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(activities).map(([activity, completed]) => (
                <button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  className={`p-3 rounded-lg text-sm transition-colors ${
                    completed
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-5 h-5 rounded-full ${
                        completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      {completed && '✓'}
                    </span>
                    <span className="capitalize">{activity}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-3">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share any additional thoughts or reflections..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Submit Check-In
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EmergencyButton } from '@/components/EmergencyButton';
import { AIChatInterface } from '@/components/AIChatInterface';
import { MoodCheckIn } from '@/components/MoodCheckIn';
import { StreakDisplay } from '@/components/StreakDisplay';

export default function CompletePage() {
  const router = useRouter();
  const { user, isLoading, login } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    // Redirect if authenticated and not in emergency mode
    if (user && !showEmergency) {
      router.replace('/dashboard');
    }
  }, [user, showEmergency, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (showEmergency) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="glass-morphism rounded-2xl p-8 text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Emergency Support</h1>
            <p className="text-lg text-gray-700 mb-6">
              You're not alone. Help is available 24/7.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">🚨 Immediate Help</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span>988 - Crisis Lifeline</span>
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                      Call Now
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span>Text HOME to 741741</span>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition">
                      Text Now
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span>911 - Emergency</span>
                    <button className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900 transition">
                      Call 911
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">🧘 Grounding Exercises</h3>
                <div className="space-y-4 text-left">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800">5-4-3-2-1 Technique</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      <li><strong>5</strong> things you can SEE</li>
                      <li><strong>4</strong> things you can TOUCH</li>
                      <li><strong>3</strong> things you can HEAR</li>
                      <li><strong>2</strong> things you can SMELL</li>
                      <li><strong>1</strong> thing you can TASTE</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800">4-7-8 Breathing</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      <li>Breathe in for 4 seconds</li>
                      <li>Hold for 7 seconds</li>
                      <li>Exhale for 8 seconds</li>
                      <li>Repeat until calm</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowEmergency(false)}
              className="mt-6 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Return to App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            UNDO
          </h1>
          <p className="text-xl text-gray-600">
            Reset Your Mind. Rebuild Your Life.
          </p>
          <p className="text-lg text-gray-500 mt-2">
            100% Free Recovery Support
          </p>
        </motion.header>

        {/* Emergency Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <EmergencyButton onClick={() => setShowEmergency(true)} />
        </motion.div>

        {!user && (
          <div className="text-center mb-8">
            <motion.button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-[rgb(0,122,255)] text-white rounded-lg hover:bg-[rgb(0,100,220)] transition-colors"
            >
              Enter Dashboard
            </motion.button>
          </div>
        )}

        {/* Demo Login Section */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Get Started with UNDO
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue="demo@undo-app.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    defaultValue="password"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => login('demo@undo-app.com', 'password')}
                  className="w-full py-3 px-4 bg-[rgb(0,122,255)] text-white rounded-lg hover:bg-[rgb(0,100,220)] transition-colors font-medium"
                >
                  Sign In (Demo Mode)
                </motion.button>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Demo Account: demo@undo-app.com / password
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Full AI features require OpenRouter API key
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="text-3xl mb-4">🧘‍♂️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Coaching
            </h3>
            <p className="text-gray-600 text-sm">
              24/7 personalized support with GPT-5 AI
            </p>
          </div>

          <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Crisis Support
            </h3>
            <p className="text-gray-600 text-sm">
              Immediate help when you need it most
            </p>
          </div>

          <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Streak Tracking
            </h3>
            <p className="text-gray-600 text-sm">
              Monitor your recovery progress
            </p>
          </div>

          <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Anonymous Community
            </h3>
            <p className="text-gray-600 text-sm">
              Connect with peers safely
            </p>
          </div>
        </motion.div>

        {/* Test Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-2xl mx-auto mt-12"
        >
          <div className="glass-morphism rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              🧪 Test AI Coach (Demo Mode)
            </h2>

            <AIChatInterface />
          </div>
        </motion.div>

        {/* Mood Check-in Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="max-w-2xl mx-auto mt-8"
        >
          <div className="glass-morphism rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              💭 Daily Check-In
            </h2>

            <MoodCheckIn />
          </div>
        </motion.div>

        {/* Streak Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="max-w-2xl mx-auto mt-8"
        >
          <div className="glass-morphism rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              📊 Your Progress
            </h2>

            <StreakDisplay />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
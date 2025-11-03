'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  followUpQuestions?: string[];
}

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate AI response for demo
      setTimeout(() => {
        const aiResponse = await generateAIResponse(inputText);
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
        scrollToBottom();
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again or use the emergency button if you need immediate support.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    const responses = [
      "I understand what you're going through. Recovery is challenging, but you're showing great courage by reaching out.",
      "Thank you for sharing this with me. Your feelings are valid, and you're not alone in this journey.",
      "Every day you choose recovery is a victory. What's one small step you can take right now?",
      "I'm here to support you without judgment. What coping strategies have worked for you before?",
      "Your awareness of your struggles is a sign of strength. Let's work through this together.",
      "You're braver than you think. Remember all the progress you've made so far.",
      "I'm proud of you for prioritizing your recovery. What would make this moment better?",
    ];

    const suggestions = [
      ['Try deep breathing exercises', 'Call a supportive friend', 'Take a brief walk', 'Practice mindfulness', 'Listen to calming music'],
      ['Write about your feelings', 'Use the 5-4-3-2-1 technique', 'Remove yourself from triggering environment', 'Exercise for 15 minutes'],
      ['Meditate for 10 minutes', 'Read recovery materials', 'Watch inspirational content', 'Practice gratitude', 'Set boundaries for your time'],
    ];

    const followUpQuestions = [
      ['How are you feeling now?', 'What triggered this feeling?', 'What would help right now?', 'On a scale of 1-10, how intense is this?'],
      ['What coping strategy can you try?', 'Who can support you right now?', 'What small action can you take?', 'How can I help you further?'],
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const randomSuggestions = suggestions[Math.floor(Math.random() * suggestions.length)];
    const randomQuestions = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: randomResponse,
      timestamp: new Date(),
      suggestions: randomSuggestions,
      followUpQuestions: randomQuestions,
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-morphism rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            💬 Chat with Melius (AI Coach)
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Demo Mode</span>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto mb-4 p-4 space-y-4 bg-gray-50 rounded-lg">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* AI Suggestions */}
        {messages.length > 0 && messages[messages.length - 1].suggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-50 rounded-lg p-3 mb-4"
          >
            <p className="text-sm font-medium text-blue-900 mb-2">💡 Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input Area */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </motion.button>
        </div>

        {/* Follow-up Questions */}
        {messages.length > 0 && messages[messages.length - 1].followUpQuestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-purple-50 rounded-lg p-3"
          >
            <p className="text-sm font-medium text-purple-900 mb-2">💭 Follow-up Questions:</p>
            <div className="space-y-2">
              {messages[messages.length - 1].followUpQuestions?.map((question, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200 transition-colors"
                  onClick={() => {
                    setInputText(question);
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
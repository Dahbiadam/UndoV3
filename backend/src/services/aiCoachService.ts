import { openRouterService } from './openRouterService';
import { logger } from '../config/logger';
import { AIConversation, AIMessage, AIContext, AICoachingPlan } from '@shared/types';

export interface CoachMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    mood?: number;
    urgeIntensity?: number;
    triggerIdentified?: string;
    strategySuggested?: string;
  };
}

export interface CoachingResponse {
  message: string;
  suggestions?: string[];
  followUpQuestions?: string[];
  strategies?: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
}

export interface PersonalizedPrompts {
  assessment: (userContext: any) => string;
  planning: (goals: string[], context: AIContext) => string;
  dailyCheckIn: (checkInData: any) => string;
  crisisIntervention: (crisisData: any) => string;
  triggerAnalysis: (triggers: string[]) => string;
  encouragement: (progress: any) => string;
}

class AICoachService {
  private coachName: string = 'Melius';
  private personality: string = `You are Melius, a professional AI recovery coach for the UNDO app. You are:

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

Always prioritize user safety and encourage professional help when appropriate.`;

  private personalizedPrompts: PersonalizedPrompts = {
    assessment: (userContext: any) => `
You are conducting an initial recovery assessment. The user has provided:
- Primary recovery goal: ${userContext.recoveryGoals?.primaryGoal}
- Start date: ${userContext.recoveryGoals?.startDate}
- Previous attempts: ${userContext.recoveryGoals?.previousAttempts || 'None mentioned'}

Your role is to understand their situation better and provide initial guidance. Ask thoughtful questions about:
1. Current challenges and triggers
2. Support system availability
3. Previous coping mechanisms
4. Recovery motivations
5. Daily routine and habits

Be warm, professional, and thorough. End with 2-3 specific suggestions they can try today.
`,

    planning: (goals: string[], context: AIContext) => `
You are creating a personalized recovery plan based on:
- Current goals: ${goals.join(', ')}
- Current streak: ${context.currentStreak} days
- Recent mood average: ${context.recentProgress.moodAverage}/10
- Recent urges: ${context.recentProgress.urgeAverage}/10

Create a structured plan with:
1. Clear, achievable short-term goals (first 7 days)
2. Medium-term objectives (30 days)
3. Daily habits and routines
4. Coping strategies for common triggers
5. Progress tracking methods

Make it actionable, specific, and tailored to their current recovery stage.
`,

    dailyCheckIn: (checkInData: any) => `
Review today's check-in:
- Mood: ${checkInData.mood?.rating}/10
- Urge intensity: ${checkInData.urges?.intensity}/10
- Triggers: ${checkInData.urges?.triggers?.join(', ') || 'None identified'}
- Activities completed: ${checkInData.activities ? Object.entries(checkInData.activities).filter(([_, done]) => done).map(([activity]) => activity).join(', ') : 'None'}

Provide:
1. Acknowledgment and validation
2. Analysis of patterns
3. Personalized encouragement
4. Suggestions for tomorrow
5. Resources if needed

Be supportive and solution-focused.
`,

    crisisIntervention: (crisisData: any) => `
CRISIS SITUATION:
- Urgent triggers identified
- High stress/intensity: ${crisisData.urgency}
- Time sensitive response needed

IMMEDIATE ACTIONS:
1. Grounding techniques (5-4-3-2-1 method)
2. Breathing exercises guidance
3. Distraction strategies
4. Emergency contacts/resources
5. Professional help recommendation

Respond immediately with clear, actionable steps. If life-threatening, provide crisis hotlines immediately.
Keep messages concise and focused on immediate stabilization.
`,

    triggerAnalysis: (triggers: string[]) => `
Analyze these recurring triggers: ${triggers.join(', ')}

Provide:
1. Pattern identification
2. Root cause analysis
3. Specific prevention strategies
4. Alternative coping mechanisms
5. Progress tracking suggestions

Be analytical but supportive, focusing on empowerment and skill-building.
`,

    encouragement: (progress: any) => `
Progress to celebrate:
- Current streak: ${progress.currentStreak} days
- Longest streak: ${progress.longestStreak} days
- Recent achievements: ${progress.recentMilestones?.join(', ') || 'None mentioned'}

Provide:
1. Genuine recognition of effort
2. Strengths observed
3. Growth indicators
4. Motivation for continued progress
5. Next steps or challenges

Be encouraging, specific, and motivating.
`,
  };

  /**
   * Generate personalized coaching response
   */
  async generateResponse(
    messages: CoachMessage[],
    context: AIContext,
    conversationStage: string = 'implementation'
  ): Promise<CoachingResponse> {
    try {
      // Build conversation history for context
      const conversationHistory = this.buildConversationHistory(messages);

      // Determine the appropriate system prompt
      const systemPrompt = this.getSystemPrompt(context, conversationStage);

      // Create OpenRouter messages
      const openRouterMessages = [
        {
          role: 'system' as const,
          content: systemPrompt,
        },
        ...conversationHistory,
      ];

      // Get response from GPT-5
      const response = await openRouterService.chatCompletion(openRouterMessages, {
        temperature: 0.7, // Balanced creativity and consistency
        max_tokens: 1000,
        top_p: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const message = response.choices[0]?.message?.content || '';

      // Analyze response and extract additional components
      return {
        message,
        suggestions: this.extractSuggestions(message),
        followUpQuestions: this.extractFollowUpQuestions(message),
        strategies: this.extractStrategies(message),
        urgency: this.assessUrgency(message, context),
      };
    } catch (error) {
      logger.error('AI Coach response generation failed:', error);
      throw error;
    }
  }

  /**
   * Handle crisis intervention
   */
  async handleCrisis(crisisData: any): Promise<CoachingResponse> {
    try {
      const systemPrompt = `${this.personality}

CRISIS PROTOCOL:
You are currently in crisis intervention mode. The user needs immediate support.

Provide:
1. Calming breathing exercises (step-by-step)
2. Grounding techniques (5-4-3-2-1 method)
3. Immediate distraction strategies
4. Emergency contact information
5. Professional help resources

Keep responses:
- Short and actionable
- Focused on immediate stabilization
- Non-judgmental and calming
- Including crisis hotlines when appropriate

If life-threatening risk is detected, provide immediate emergency numbers and encourage calling 911 or local emergency services.`;

      const crisisPrompt = `
URGENT SITUATION:
- User is experiencing high distress
- Needs immediate coping strategies
- Time-sensitive intervention required

Respond immediately with 3-4 specific, actionable steps the user can take RIGHT NOW.
Include crisis hotline: 988 (Suicide & Crisis Lifeline)
Emergency: Call 911 if life-threatening
`;

      const response = await openRouterService.simpleChat(crisisPrompt, systemPrompt, {
        temperature: 0.3, // More consistent responses in crisis
        max_tokens: 500,
      });

      return {
        message: response,
        suggestions: [
          'Call 988 for immediate support',
          'Use the 5-4-3-2-1 grounding technique',
          'Practice deep breathing: 4 seconds in, 7 hold, 8 out',
          'Remove yourself from triggering environment',
        ],
        followUpQuestions: [
          'Are you in a safe place right now?',
          'Is there someone you can contact immediately?',
          'What has helped you in similar situations before?',
        ],
        strategies: ['grounding', 'breathing', 'distraction', 'social_support'],
        urgency: 'emergency',
      };
    } catch (error) {
      logger.error('Crisis intervention failed:', error);
      return {
        message: 'I understand you\'re in crisis. Please call 988 immediately for 24/7 support, or dial 911 if you\'re in immediate danger. You deserve help and support is available.',
        suggestions: ['Call 988 - Suicide & Crisis Lifeline', 'Call 911 for emergency', 'Text HOME to 741741 for crisis text line'],
        urgency: 'emergency',
      };
    }
  }

  /**
   * Generate recovery assessment questions
   */
  async generateAssessmentQuestions(userContext: any): Promise<string[]> {
    try {
      const prompt = this.personalizedPrompts.assessment(userContext);
      const response = await openRouterService.simpleChat(prompt, undefined, {
        temperature: 0.5,
        max_tokens: 800,
      });

      // Extract questions from response
      const questions = response
        .split('\n')
        .filter(line => line.includes('?'))
        .map(line => line.replace(/^\d+\.?\s*/, '').trim())
        .filter(q => q.length > 10);

      return questions.slice(0, 5); // Return top 5 questions
    } catch (error) {
      logger.error('Assessment question generation failed:', error);
      return [
        'What led you to start your recovery journey today?',
        'What are your biggest challenges right now?',
        'What support systems do you have available?',
        'What strategies have helped you in the past?',
        'What does success look like for you?'
      ];
    }
  }

  /**
   * Analyze journal entry for insights
   */
  async analyzeJournalEntry(entry: string, context: AIContext): Promise<{
    insights: string[];
    patterns: string[];
    suggestions: string[];
    mood: number;
  }> {
    try {
      const prompt = `
Analyze this journal entry for recovery insights:
"${entry}"

Current context:
- Current streak: ${context.currentStreak} days
- Recent mood: ${context.recentProgress.moodAverage}/10
- Recent urges: ${context.recentProgress.urgeAverage}/10

Provide:
1. Key insights about their emotional state
2. Patterns or triggers identified
3. Specific suggestions for improvement
4. Mood assessment (1-10)

Format as JSON response.
`;

      const response = await openRouterService.simpleChat(prompt, undefined, {
        temperature: 0.3,
        max_tokens: 600,
      });

      // Parse structured response (this would need better parsing in production)
      return {
        insights: this.extractBulletPoints(response, 'insights'),
        patterns: this.extractBulletPoints(response, 'patterns'),
        suggestions: this.extractBulletPoints(response, 'suggestions'),
        mood: 5, // Default mood, would extract from response
      };
    } catch (error) {
      logger.error('Journal analysis failed:', error);
      return {
        insights: ['Journal entry shows self-reflection and awareness'],
        patterns: [],
        suggestions: ['Continue daily journaling for better pattern recognition'],
        mood: 5,
      };
    }
  }

  /**
   * Build conversation history for OpenRouter
   */
  private buildConversationHistory(messages: CoachMessage[]): any[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  /**
   * Get appropriate system prompt based on context
   */
  private getSystemPrompt(context: AIContext, stage: string): string {
    let prompt = `${this.personality}

CURRENT USER CONTEXT:
- Recovery Stage: ${stage}
- Current Streak: ${context.currentStreak} days
- Recent Progress:
  * Mood Average: ${context.recentProgress.moodAverage}/10
  * Urge Average: ${context.recentProgress.urgeAverage}/10
  * Habit Completion: ${context.recentProgress.habitCompletion}%
- Recent Triggers: ${context.recentTriggers.join(', ') || 'None identified'}
- Emotional State: ${context.emotionalState}

RESPONSE GUIDELINES:
- Be warm, professional, and non-judgmental
- Provide specific, actionable advice
- Ask clarifying questions when helpful
- Include progress acknowledgment when appropriate
- Maintain appropriate boundaries
- Encourage professional help when needed
- Keep responses focused and relevant
- Use recovery-focused language
- Balance compassion with directness
`;

    // Add stage-specific guidance
    if (stage === 'crisis') {
      prompt += `
CRISIS RESPONSE:
- Provide immediate stabilization techniques
- Include crisis resources
- Keep messages shorter and more direct
- Focus on safety above all else
`;
    }

    return prompt;
  }

  /**
   * Extract suggestions from AI response
   */
  private extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];

    // Look for bullet points or numbered lists
    const lines = response.split('\n');
    for (const line of lines) {
      if (line.match(/^[\-\*•]\s+/) || line.match(/^\d+\.\s+/)) {
        suggestions.push(line.replace(/^[\-\*•\d\.]\s+/, '').trim());
      }
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  /**
   * Extract follow-up questions from AI response
   */
  private extractFollowUpQuestions(response: string): string[] {
    const questions: string[] = [];

    // Look for sentences ending with question marks
    const sentences = response.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.trim().includes('?')) {
        questions.push(sentence.trim());
      }
    }

    return questions.slice(0, 3); // Limit to 3 questions
  }

  /**
   * Extract strategies from AI response
   */
  private extractStrategies(response: string): string[] {
    const strategies: string[] = [];

    // Look for strategy keywords
    const strategyKeywords = ['breathe', 'meditate', 'exercise', 'journal', 'connect', 'grounding', 'distraction'];

    for (const keyword of strategyKeywords) {
      if (response.toLowerCase().includes(keyword)) {
        strategies.push(keyword);
      }
    }

    return strategies;
  }

  /**
   * Assess urgency level of response
   */
  private assessUrgency(response: string, context: AIContext): 'low' | 'medium' | 'high' | 'emergency' {
    const urgentWords = ['crisis', 'emergency', 'urgent', 'immediate', 'danger', 'suicide', 'harm'];
    const highUrgencyWords = ['difficult', 'struggle', 'intense', 'overwhelmed', 'triggered'];

    const responseLower = response.toLowerCase();

    if (urgentWords.some(word => responseLower.includes(word))) {
      return 'emergency';
    }

    if (highUrgencyWords.some(word => responseLower.includes(word)) ||
        context.emotionalState === 'crisis') {
      return 'high';
    }

    if (context.emotionalState === 'struggling' || context.recentProgress.urgeAverage > 6) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Helper to extract bullet points from response
   */
  private extractBulletPoints(response: string, type: string): string[] {
    // This would be enhanced with better parsing in production
    return [response.slice(0, 100) + '...']; // Placeholder
  }
}

// Export singleton instance
export const aiCoachService = new AICoachService();
export default aiCoachService;
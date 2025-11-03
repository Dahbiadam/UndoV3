import axios, { AxiosError } from 'axios';
import { config } from '../config';
import { logger } from '../config/logger';
import { createExternalServiceError, AppError } from '../middleware/errorHandler';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | OpenRouterContent[];
}

export interface OpenRouterContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenRouterChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export interface OpenRouterChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
  stop?: string[] | string;
}

class OpenRouterService {
  private baseURL: string;
  private apiKey: string;
  private defaultModel: string;
  private siteUrl: string;
  private siteName: string;

  constructor() {
    this.baseURL = config.openRouter.baseURL;
    this.apiKey = config.openRouter.apiKey;
    this.defaultModel = config.openRouter.model;
    this.siteUrl = config.openRouter.siteUrl;
    this.siteName = config.openRouter.siteName;

    if (!this.apiKey) {
      throw new AppError('OpenRouter API key is not configured', 500, 'OPENROUTER_NOT_CONFIGURED');
    }
  }

  /**
   * Send a chat completion request to OpenRouter
   */
  async chatCompletion(
    messages: OpenRouterMessage[],
    options: OpenRouterChatOptions = {}
  ): Promise<OpenRouterResponse> {
    try {
      const requestData = {
        model: options.model || this.defaultModel,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        top_p: options.top_p || 1,
        frequency_penalty: options.frequency_penalty || 0,
        presence_penalty: options.presence_penalty || 0,
        stream: options.stream || false,
        stop: options.stop || undefined,
      };

      logger.info('OpenRouter chat completion request', {
        model: requestData.model,
        messageCount: messages.length,
        temperature: requestData.temperature,
        maxTokens: requestData.max_tokens,
      });

      const response = await axios.post<OpenRouterResponse>(
        `${this.baseURL}/chat/completions`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': this.siteUrl,
            'X-Title': this.siteName,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60 second timeout
        }
      );

      logger.info('OpenRouter chat completion response', {
        responseId: response.data.id,
        model: response.data.model,
        usage: response.data.usage,
        finishReason: response.data.choices[0]?.finish_reason,
      });

      return response.data;
    } catch (error) {
      this.handleError(error, 'chat completion');
    }
  }

  /**
   * Simple chat completion with just a prompt
   */
  async simpleChat(
    prompt: string,
    systemPrompt?: string,
    options: OpenRouterChatOptions = {}
  ): Promise<string> {
    const messages: OpenRouterMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const response = await this.chatCompletion(messages, options);
    return response.choices[0]?.message?.content || '';
  }

  /**
   * Chat completion with image support
   */
  async chatWithImage(
    textPrompt: string,
    imageUrl: string,
    systemPrompt?: string,
    options: OpenRouterChatOptions = {}
  ): Promise<string> {
    const messages: OpenRouterMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: textPrompt,
        },
        {
          type: 'image_url',
          image_url: {
            url: imageUrl,
          },
        },
      ],
    });

    const response = await this.chatCompletion(messages, {
      ...options,
      max_tokens: options.max_tokens || 500, // Reduced for image inputs
    });
    return response.choices[0]?.message?.content || '';
  }

  /**
   * Stream chat completion
   */
  async *streamChatCompletion(
    messages: OpenRouterMessage[],
    options: OpenRouterChatOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    try {
      const requestData = {
        model: options.model || this.defaultModel,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        stream: true,
      };

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': this.siteUrl,
            'X-Title': this.siteName,
            'Content-Type': 'application/json',
          },
          responseType: 'stream',
          timeout: 120000, // 2 minute timeout for streaming
        }
      );

      const stream = response.data;
      let buffer = '';

      for await (const chunk of stream) {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (parseError) {
              // Ignore parse errors in streaming
              continue;
            }
          }
        }
      }
    } catch (error) {
      this.handleError(error, 'streaming chat completion');
    }
  }

  /**
   * Get available models
   */
  async getModels(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.data.data || [];
    } catch (error) {
      this.handleError(error, 'getting models');
    }
  }

  /**
   * Check API status
   */
  async checkStatus(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      logger.error('OpenRouter API status check failed:', error);
      return false;
    }
  }

  /**
   * Error handling
   */
  private handleError(error: unknown, operation: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const data = axiosError.response?.data as any;

      logger.error(`OpenRouter ${operation} error`, {
        status,
        message: axiosError.message,
        data,
        config: {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
        },
      });

      if (status === 401) {
        throw new AppError('Invalid OpenRouter API key', 401, 'OPENROUTER_UNAUTHORIZED');
      } else if (status === 429) {
        throw new AppError('OpenRouter rate limit exceeded', 429, 'OPENROUTER_RATE_LIMIT');
      } else if (status === 402) {
        throw new AppError('OpenRouter payment required', 402, 'OPENROUTER_PAYMENT_REQUIRED');
      } else if (status && status >= 500) {
        throw createExternalServiceError('OpenRouter', `Server error: ${data?.error?.message || axiosError.message}`);
      } else {
        throw createExternalServiceError('OpenRouter', data?.error?.message || axiosError.message);
      }
    } else if (error instanceof AppError) {
      throw error;
    } else {
      logger.error(`OpenRouter ${operation} unexpected error`, error);
      throw createExternalServiceError('OpenRouter', `Unexpected error: ${error}`);
    }
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();
export default openRouterService;
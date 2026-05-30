/**
 * AITutorService - Provider-agnostic AI tutor
 *
 * Supports Groq, Together, OpenRouter, DeepInfra.
 * Provider/model configurable via app_config in DB.
 * Respects monthly message cap.
 */

import db from '../database/DatabaseService';
import {
    getProvider,
    getApiKey,
    getSystemPrompt,
    DEFAULT_PROVIDER,
    DEFAULT_MESSAGE_CAP,
    AI_TUTOR_MESSAGES,
} from '../config/aiTutorConfig';

class AITutorService {
    constructor() {
        this.provider = null;
        this.model = null;
        this.currentSession = null;
    }

    /**
     * Initialize service with provider from config
     */
    async init() {
        const providerId = await db.getConfig('ai_provider') || DEFAULT_PROVIDER;
        const modelId = await db.getConfig('ai_model');

        this.provider = getProvider(providerId);
        this.model = modelId || this.provider.defaultModel;
        this.apiKey = getApiKey(this.provider.id);

        if (!this.apiKey) {
            console.warn(`No API key found for provider ${this.provider.id}`);
        }
    }

    /**
     * Check if user can use AI tutor
     *
     * @param {string} userId
     * @returns {{ allowed: boolean, reason?: string, used: number, cap: number }}
     */
    async checkAccess(userId) {
        // Check subscription
        const hasSubscription = await db.hasActiveSubscription(userId);
        if (!hasSubscription) {
            return {
                allowed: false,
                reason: 'subscription_required',
                used: 0,
                cap: 0,
            };
        }

        // Check message cap
        const cap = parseInt(await db.getConfig('ai_monthly_message_cap') || DEFAULT_MESSAGE_CAP);
        const used = await db.getAIMessageCount(userId);

        if (used >= cap) {
            return {
                allowed: false,
                reason: 'cap_reached',
                used,
                cap,
            };
        }

        return {
            allowed: true,
            used,
            cap,
            remaining: cap - used,
        };
    }

    /**
     * Start a new chat session
     *
     * @param {string} userId
     * @param {object} context - Optional context (subject, topic, problem)
     * @returns {number} Session ID
     */
    async startSession(userId, context = {}) {
        const { subject, topicId, problemId, language } = context;
        const sessionId = await db.createAISession(userId, subject, topicId, problemId, language || 'en');
        this.currentSession = sessionId;
        return sessionId;
    }

    /**
     * Send a message to the AI tutor
     *
     * @param {string} userId
     * @param {string} userMessage
     * @param {array} history - Previous messages in conversation
     * @param {object} options - { language, subject, sessionId, stream }
     * @returns {{ response: string, messageId: number, usage: object }}
     */
    async sendMessage(userId, userMessage, history = [], options = {}) {
        await this.init();

        const { language = 'en', subject = null, sessionId = null, stream = false } = options;

        // Check access
        const access = await this.checkAccess(userId);
        if (!access.allowed) {
            const messages = AI_TUTOR_MESSAGES[language] || AI_TUTOR_MESSAGES.en;
            throw new Error(
                access.reason === 'subscription_required'
                    ? messages.subscriptionRequired
                    : messages.capReached
            );
        }

        // Use existing session or create new one
        const activeSession = sessionId || this.currentSession || await this.startSession(userId, { language, subject });

        // Build messages array
        const systemPrompt = getSystemPrompt(language);
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage },
        ];

        // Record user message
        await db.recordAIMessage(
            userId,
            activeSession,
            'user',
            userMessage,
            0, 0, // Tokens counted after response
            this.model,
            this.provider.id
        );

        // Call AI provider
        let response, usage;

        if (stream) {
            // Streaming response
            const result = await this._streamCompletion(messages, (chunk) => {
                if (options.onChunk) options.onChunk(chunk);
            });
            response = result.content;
            usage = result.usage;
        } else {
            // Non-streaming response
            const result = await this._getCompletion(messages);
            response = result.content;
            usage = result.usage;
        }

        // Record assistant message with token usage
        const messageId = await db.recordAIMessage(
            userId,
            activeSession,
            'assistant',
            response,
            usage.promptTokens || 0,
            usage.completionTokens || 0,
            this.model,
            this.provider.id
        );

        return {
            response,
            messageId,
            sessionId: activeSession,
            usage: {
                ...usage,
                messagesUsed: access.used + 1,
                messagesCap: access.cap,
                remaining: access.cap - access.used - 1,
            },
        };
    }

    /**
     * Non-streaming completion
     */
    async _getCompletion(messages) {
        const response = await fetch(this.provider.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages,
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('AI API error:', error);
            throw new Error('Failed to get AI response');
        }

        const data = await response.json();

        return {
            content: data.choices[0]?.message?.content || '',
            usage: {
                promptTokens: data.usage?.prompt_tokens || 0,
                completionTokens: data.usage?.completion_tokens || 0,
                totalTokens: data.usage?.total_tokens || 0,
            },
        };
    }

    /**
     * Streaming completion
     */
    async _streamCompletion(messages, onChunk) {
        const response = await fetch(this.provider.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages,
                temperature: 0.7,
                max_tokens: 1024,
                stream: true,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('AI API error:', error);
            throw new Error('Failed to get AI response');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        let usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content || '';
                        if (content) {
                            fullContent += content;
                            onChunk(content);
                        }

                        // Some providers include usage in final chunk
                        if (parsed.usage) {
                            usage = {
                                promptTokens: parsed.usage.prompt_tokens || 0,
                                completionTokens: parsed.usage.completion_tokens || 0,
                                totalTokens: parsed.usage.total_tokens || 0,
                            };
                        }
                    } catch (e) {
                        // Skip malformed chunks
                    }
                }
            }
        }

        // Estimate tokens if not provided
        if (!usage.totalTokens) {
            usage.promptTokens = Math.ceil(messages.reduce((acc, m) => acc + m.content.length / 4, 0));
            usage.completionTokens = Math.ceil(fullContent.length / 4);
            usage.totalTokens = usage.promptTokens + usage.completionTokens;
        }

        return { content: fullContent, usage };
    }

    /**
     * Submit feedback for a message
     */
    async submitFeedback(messageId, userId, isHelpful, hasError = false, feedbackText = null) {
        await db.recordAIFeedback(messageId, userId, isHelpful, hasError, feedbackText);
        return { success: true };
    }

    /**
     * Get usage summary for user
     */
    async getUsageSummary(userId) {
        const summary = await db.getAIUsageSummary(userId);
        const cap = parseInt(await db.getConfig('ai_monthly_message_cap') || DEFAULT_MESSAGE_CAP);

        return {
            messagesUsed: summary?.message_count || 0,
            messagesCap: cap,
            remaining: cap - (summary?.message_count || 0),
            billingPeriod: db.getCurrentBillingPeriod(),
            estimatedCostUsd: summary?.estimated_cost_usd || 0,
        };
    }
}

// Export singleton instance
const aiTutor = new AITutorService();
export default aiTutor;

// Also export class for testing
export { AITutorService };

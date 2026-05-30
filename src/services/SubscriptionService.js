/**
 * SubscriptionService - Access control and subscription management
 *
 * Provides a single gate model: active subscription = full access.
 * One free sample paper + video available as preview.
 */

import db from '../database/DatabaseService';
import { getDaysUntilExpiry, isExpiringSoon, ACCESS_MESSAGES } from '../config/subscriptionConfig';

class SubscriptionService {
    /**
     * Check if user has access to premium content
     *
     * @param {string} userId
     * @returns {{ hasAccess: boolean, accessUntil: string|null, daysRemaining: number, isExpiringSoon: boolean }}
     */
    static async checkAccess(userId) {
        const hasAccess = await db.hasActiveSubscription(userId);
        const accessUntil = await db.getAccessUntil(userId);
        const daysRemaining = getDaysUntilExpiry(accessUntil);

        return {
            hasAccess,
            accessUntil,
            daysRemaining,
            isExpiringSoon: isExpiringSoon(accessUntil, 7),
        };
    }

    /**
     * Check if specific content is accessible
     * (either user has subscription OR content is free)
     *
     * @param {string} userId
     * @param {string} contentType - 'paper', 'video', 'lesson', 'ai_tutor'
     * @param {string} contentId
     * @returns {{ canAccess: boolean, reason: string }}
     */
    static async canAccessContent(userId, contentType, contentId) {
        // Check if content is free
        const isFree = await db.isFreeContent(contentType, contentId);
        if (isFree) {
            return { canAccess: true, reason: 'free_content' };
        }

        // Check subscription
        const hasSubscription = await db.hasActiveSubscription(userId);
        if (hasSubscription) {
            return { canAccess: true, reason: 'subscribed' };
        }

        return { canAccess: false, reason: 'subscription_required' };
    }

    /**
     * Get user's subscription status for display
     *
     * @param {string} userId
     * @param {string} language
     * @returns {object} Status object with messages
     */
    static async getSubscriptionStatus(userId, language = 'en') {
        const messages = ACCESS_MESSAGES[language] || ACCESS_MESSAGES.en;
        const subscription = await db.getUserSubscription(userId);
        const accessUntil = await db.getAccessUntil(userId);

        if (!subscription || !accessUntil) {
            return {
                status: 'none',
                hasAccess: false,
                message: messages.locked,
                actionLabel: messages.subscribe,
                actionType: 'subscribe',
            };
        }

        const daysRemaining = getDaysUntilExpiry(accessUntil);
        const expiringSoon = isExpiringSoon(accessUntil, 7);

        if (daysRemaining <= 0) {
            return {
                status: 'expired',
                hasAccess: false,
                message: messages.expired,
                actionLabel: messages.renew,
                actionType: 'renew',
            };
        }

        return {
            status: 'active',
            hasAccess: true,
            message: messages.daysRemaining(daysRemaining),
            expiresOn: messages.expiresOn(accessUntil),
            accessUntil,
            daysRemaining,
            expiringSoon,
            planName: subscription.plan_name,
            actionLabel: expiringSoon ? messages.renew : null,
            actionType: expiringSoon ? 'renew' : null,
        };
    }

    /**
     * Get free content IDs for a content type
     *
     * @param {string} contentType - 'paper' or 'video'
     * @returns {string[]} Array of free content IDs
     */
    static async getFreeContentIds(contentType) {
        const results = await db.getFreeContent(contentType);
        return results.map(r => r.content_id);
    }

    /**
     * Get subscription plans
     */
    static async getPlans() {
        return db.getSubscriptionPlans();
    }

    /**
     * Get user's payment history
     */
    static async getPaymentHistory(userId, limit = 20) {
        return db.getPaymentHistory(userId, limit);
    }

    /**
     * Admin: Grant free subscription (for testing/promo)
     */
    static async grantFreeAccess(userId, days = 30) {
        // Create a "free" payment record
        const paymentId = await db.createPayment(userId, 'monthly', 'admin_grant', 0, 'ZAR');
        await db.updatePaymentStatus(paymentId, 'completed', 'ADMIN_GRANT', { grantedDays: days });

        // Manually extend subscription
        const accessUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        db.run(
            `INSERT INTO user_subscriptions (user_id, plan_id, status, access_until, started_at)
             VALUES (?, 'free_grant', 'active', ?, datetime('now'))`,
            [userId, accessUntil]
        );

        return { success: true, accessUntil };
    }
}

export default SubscriptionService;

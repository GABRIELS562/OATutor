/**
 * Subscription Configuration
 *
 * Defines subscription plans and access control settings
 * for Angelo Tutoring platform.
 */

// Subscription plans (mirrors DB but available for UI)
export const SUBSCRIPTION_PLANS = {
    monthly: {
        id: 'monthly',
        name: 'Monthly',
        price: 30, // R30
        priceCents: 3000,
        currency: 'ZAR',
        currencySymbol: 'R',
        duration: 30, // days
        description: 'Full access for 30 days',
        popular: true,
    },
    annual: {
        id: 'annual',
        name: 'Annual',
        price: 300, // R300
        priceCents: 30000,
        currency: 'ZAR',
        currencySymbol: 'R',
        duration: 365, // days
        description: 'Full access for 1 year - save R60!',
        savings: 60,
        popular: false,
    },
};

// What's included with subscription
export const SUBSCRIPTION_FEATURES = [
    { icon: 'School', text: 'All Maths & Science lessons' },
    { icon: 'Description', text: 'Past papers with memos (2009-2024)' },
    { icon: 'VideoLibrary', text: 'Curated video library' },
    { icon: 'Psychology', text: 'AI Tutor (100 messages/month)' },
    { icon: 'Timeline', text: 'Progress tracking & analytics' },
    { icon: 'EmojiEvents', text: 'Gamification & leaderboards' },
];

// Free preview content
export const FREE_PREVIEW = {
    description: 'Try before you subscribe!',
    items: [
        { type: 'paper', label: '1 sample past paper' },
        { type: 'video', label: '1 sample video' },
    ],
};

// Access control helpers
export const ACCESS_MESSAGES = {
    en: {
        locked: 'Subscribe to access this content',
        expired: 'Your subscription has expired',
        subscribe: 'Subscribe Now',
        renew: 'Renew Subscription',
        freePreview: 'Free Preview',
        daysRemaining: (days) => `${days} day${days !== 1 ? 's' : ''} remaining`,
        expiresOn: (date) => `Access until ${new Date(date).toLocaleDateString('en-ZA')}`,
    },
    af: {
        locked: 'Teken in om toegang te kry',
        expired: 'Jou intekening het verval',
        subscribe: 'Teken Nou In',
        renew: 'Hernu Intekening',
        freePreview: 'Gratis Voorskou',
        daysRemaining: (days) => `${days} dag${days !== 1 ? 'e' : ''} oor`,
        expiresOn: (date) => `Toegang tot ${new Date(date).toLocaleDateString('af-ZA')}`,
    },
};

/**
 * Calculate days until expiry
 */
export function getDaysUntilExpiry(accessUntil) {
    if (!accessUntil) return 0;
    const now = new Date();
    const expiry = new Date(accessUntil);
    const diff = expiry - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Check if subscription is expiring soon (within 7 days)
 */
export function isExpiringSoon(accessUntil, days = 7) {
    const remaining = getDaysUntilExpiry(accessUntil);
    return remaining > 0 && remaining <= days;
}

/**
 * Format price for display
 */
export function formatPrice(priceCents, currency = 'ZAR') {
    const price = priceCents / 100;
    if (currency === 'ZAR') {
        return `R${price.toFixed(0)}`;
    }
    return `${currency} ${price.toFixed(2)}`;
}

/**
 * Get plan by ID
 */
export function getPlan(planId) {
    return SUBSCRIPTION_PLANS[planId] || null;
}

/**
 * Get all active plans as array
 */
export function getAllPlans() {
    return Object.values(SUBSCRIPTION_PLANS);
}

export default {
    SUBSCRIPTION_PLANS,
    SUBSCRIPTION_FEATURES,
    FREE_PREVIEW,
    ACCESS_MESSAGES,
    getDaysUntilExpiry,
    isExpiringSoon,
    formatPrice,
    getPlan,
    getAllPlans,
};

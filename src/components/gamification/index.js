/**
 * Gamification Components Index
 * Export all gamification-related components
 */

export { default as GamificationStats } from './GamificationStats';
export { default as XPNotification, XPNotificationManager } from './XPNotification';
export { default as LevelUpCelebration } from './LevelUpCelebration';
export { default as BadgeUnlockNotification } from './BadgeUnlockNotification';

// Re-export context and hooks
export { GamificationProvider, useGamification } from '../../util/GamificationContext';

// Re-export config utilities
export {
    XP_CONFIG,
    LEVEL_CONFIG,
    STREAK_CONFIG,
    DAILY_GOALS,
    BADGES,
    BADGE_CATEGORIES,
    getLevelFromXP,
    calculateProblemXP,
    checkBadges,
    getBadgesByCategory,
} from '../../config/gamificationConfig';

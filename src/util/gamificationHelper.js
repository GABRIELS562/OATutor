/**
 * Gamification Helper
 * Provides imperative API for class components to interact with gamification
 */

// Global reference to gamification context methods
let gamificationRef = null;

/**
 * Set the gamification context reference
 * Called by GamificationProvider on mount
 */
export const setGamificationRef = (ref) => {
    gamificationRef = ref;
    // Also expose globally for debugging
    if (typeof window !== 'undefined') {
        window.__gamification = ref;
    }
};

/**
 * Record a problem attempt and award XP
 * Can be called from any component
 */
export const recordProblemAttempt = ({
    isCorrect,
    hintsUsed = 0,
    attempts = 1,
    timeSeconds = 0,
    knowledgeComponents = [],
    lessonId = null,
}) => {
    if (!gamificationRef?.recordProblemAttempt) {
        console.warn('Gamification not initialized');
        return 0;
    }

    const xpEarned = gamificationRef.recordProblemAttempt({
        isCorrect,
        hintsUsed,
        attempts,
        timeSeconds,
        knowledgeComponents,
        lessonId,
    });

    // Show XP notification if earned
    if (xpEarned > 0 && typeof window !== 'undefined' && window.showXPNotification) {
        const bonus = hintsUsed === 0 && attempts === 1 ? 'First Try Bonus!' : null;
        window.showXPNotification(xpEarned, bonus);
    }

    return xpEarned;
};

/**
 * Record lesson completion
 */
export const recordLessonComplete = (lessonId, isPerfect = false) => {
    if (!gamificationRef?.recordLessonComplete) {
        console.warn('Gamification not initialized');
        return;
    }

    gamificationRef.recordLessonComplete(lessonId, isPerfect);

    // Show notification for perfect lesson
    if (isPerfect && typeof window !== 'undefined' && window.showXPNotification) {
        window.showXPNotification(50, 'Perfect Lesson!');
    }
};

/**
 * Add XP directly
 */
export const addXP = (amount, source = 'bonus') => {
    if (!gamificationRef?.addXP) {
        console.warn('Gamification not initialized');
        return;
    }

    gamificationRef.addXP(amount, source);

    if (amount > 0 && typeof window !== 'undefined' && window.showXPNotification) {
        window.showXPNotification(amount);
    }
};

/**
 * Get current gamification stats
 */
export const getStats = () => {
    if (!gamificationRef) {
        return null;
    }

    return {
        stats: gamificationRef.stats,
        streakData: gamificationRef.streakData,
        dailyActivity: gamificationRef.dailyActivity,
        earnedBadges: gamificationRef.earnedBadges,
        levelInfo: gamificationRef.getLevelInfo?.(),
        goalProgress: gamificationRef.getDailyGoalProgress?.(),
    };
};

/**
 * Check if gamification is available
 */
export const isGamificationAvailable = () => {
    return gamificationRef !== null;
};

const gamificationHelper = {
    setGamificationRef,
    recordProblemAttempt,
    recordLessonComplete,
    addXP,
    getStats,
    isGamificationAvailable,
};

export default gamificationHelper;

/**
 * Gamification Configuration for SA CAPS Tutor
 * XP values, level thresholds, badge definitions, and streak settings
 */

// ============================================
// XP (Experience Points) Configuration
// ============================================
export const XP_CONFIG = {
    // Points for correct answers
    CORRECT_ANSWER: 10,
    CORRECT_FIRST_TRY: 15,      // No hints used
    CORRECT_WITH_HINT: 7,       // Used hints but got it right
    CORRECT_AFTER_STRUGGLE: 5,  // Multiple attempts before correct

    // Bonus XP
    PERFECT_LESSON: 50,         // Complete lesson with no errors
    STREAK_BONUS_7_DAYS: 25,    // Weekly streak milestone
    STREAK_BONUS_30_DAYS: 100,  // Monthly streak milestone
    DAILY_GOAL_COMPLETE: 20,    // Complete daily goal
    FIRST_PROBLEM_OF_DAY: 5,    // Bonus for starting practice
    SPEED_BONUS: 10,            // Solve problem in under 1 minute

    // Challenge bonuses
    CHALLENGE_COMPLETE: 30,
    EXAM_SIMULATOR_COMPLETE: 100,
};

// ============================================
// Level Configuration
// ============================================
export const LEVEL_CONFIG = {
    // Level thresholds (cumulative XP needed)
    THRESHOLDS: [
        { level: 1, xpRequired: 0, title: "Beginner" },
        { level: 2, xpRequired: 50, title: "Beginner" },
        { level: 3, xpRequired: 120, title: "Beginner" },
        { level: 4, xpRequired: 200, title: "Beginner" },
        { level: 5, xpRequired: 300, title: "Learner" },
        { level: 6, xpRequired: 420, title: "Learner" },
        { level: 7, xpRequired: 560, title: "Learner" },
        { level: 8, xpRequired: 720, title: "Learner" },
        { level: 9, xpRequired: 900, title: "Learner" },
        { level: 10, xpRequired: 1100, title: "Scholar" },
        { level: 11, xpRequired: 1350, title: "Scholar" },
        { level: 12, xpRequired: 1650, title: "Scholar" },
        { level: 13, xpRequired: 2000, title: "Scholar" },
        { level: 14, xpRequired: 2400, title: "Scholar" },
        { level: 15, xpRequired: 2850, title: "Expert" },
        { level: 16, xpRequired: 3350, title: "Expert" },
        { level: 17, xpRequired: 3900, title: "Expert" },
        { level: 18, xpRequired: 4500, title: "Expert" },
        { level: 19, xpRequired: 5150, title: "Expert" },
        { level: 20, xpRequired: 5850, title: "Master" },
        { level: 21, xpRequired: 6600, title: "Master" },
        { level: 22, xpRequired: 7400, title: "Master" },
        { level: 23, xpRequired: 8250, title: "Master" },
        { level: 24, xpRequired: 9150, title: "Master" },
        { level: 25, xpRequired: 10100, title: "Grandmaster" },
        { level: 30, xpRequired: 15000, title: "Grandmaster" },
        { level: 40, xpRequired: 25000, title: "Legend" },
        { level: 50, xpRequired: 40000, title: "Legend" },
    ],

    // Title colors for each rank
    TITLE_COLORS: {
        "Beginner": "#94A3B8",      // Gray
        "Learner": "#10B981",       // Green
        "Scholar": "#3B82F6",       // Blue
        "Expert": "#CE82FF",        // Purple (Duolingo)
        "Master": "#F59E0B",        // Gold
        "Grandmaster": "#EF4444",   // Red
        "Legend": "#EC4899",        // Pink (gradient)
    },
};

// ============================================
// Streak Configuration
// ============================================
export const STREAK_CONFIG = {
    // Minimum activity to count as a "practice day"
    MIN_PROBLEMS_FOR_STREAK: 3,
    MIN_XP_FOR_STREAK: 30,

    // Streak freeze settings
    INITIAL_STREAK_FREEZES: 1,
    MAX_STREAK_FREEZES: 3,
    STREAK_FREEZE_COST_XP: 200,  // Can buy with XP

    // Streak milestones (days)
    MILESTONES: [3, 7, 14, 30, 60, 100, 365],

    // Grace period (hours) for streak recovery
    GRACE_PERIOD_HOURS: 24,
};

// ============================================
// Daily Goals Configuration
// ============================================
export const DAILY_GOALS = {
    OPTIONS: [
        { id: "casual", problems: 5, xp: 50, label: "Casual", description: "5 problems or 50 XP" },
        { id: "regular", problems: 10, xp: 100, label: "Regular", description: "10 problems or 100 XP" },
        { id: "serious", problems: 15, xp: 150, label: "Serious", description: "15 problems or 150 XP" },
        { id: "intense", problems: 20, xp: 200, label: "Intense", description: "20 problems or 200 XP" },
    ],
    DEFAULT: "regular",
};

// ============================================
// Badge Definitions
// ============================================
export const BADGES = {
    // Getting Started
    first_problem: {
        id: "first_problem",
        name: "First Step",
        description: "Solve your first problem",
        icon: "🎯",
        category: "getting_started",
        condition: (stats) => stats.totalProblemsCorrect >= 1,
        xpReward: 10,
    },
    first_lesson: {
        id: "first_lesson",
        name: "Lesson Complete",
        description: "Complete your first lesson",
        icon: "📚",
        category: "getting_started",
        condition: (stats) => stats.lessonsCompleted >= 1,
        xpReward: 25,
    },

    // Streak Badges
    streak_3: {
        id: "streak_3",
        name: "Getting Started",
        description: "Maintain a 3-day streak",
        icon: "🔥",
        category: "streaks",
        condition: (stats) => stats.currentStreak >= 3,
        xpReward: 15,
    },
    streak_7: {
        id: "streak_7",
        name: "Week Warrior",
        description: "Maintain a 7-day streak",
        icon: "🔥",
        category: "streaks",
        condition: (stats) => stats.currentStreak >= 7,
        xpReward: 50,
    },
    streak_30: {
        id: "streak_30",
        name: "Month Master",
        description: "Maintain a 30-day streak",
        icon: "🔥",
        category: "streaks",
        condition: (stats) => stats.currentStreak >= 30,
        xpReward: 200,
    },
    streak_100: {
        id: "streak_100",
        name: "Centurion",
        description: "Maintain a 100-day streak",
        icon: "💯",
        category: "streaks",
        condition: (stats) => stats.currentStreak >= 100,
        xpReward: 500,
    },

    // Problem Solving
    problems_10: {
        id: "problems_10",
        name: "Problem Solver",
        description: "Solve 10 problems correctly",
        icon: "✅",
        category: "problems",
        condition: (stats) => stats.totalProblemsCorrect >= 10,
        xpReward: 20,
    },
    problems_50: {
        id: "problems_50",
        name: "Dedicated Learner",
        description: "Solve 50 problems correctly",
        icon: "📝",
        category: "problems",
        condition: (stats) => stats.totalProblemsCorrect >= 50,
        xpReward: 75,
    },
    problems_100: {
        id: "problems_100",
        name: "Century Club",
        description: "Solve 100 problems correctly",
        icon: "🏆",
        category: "problems",
        condition: (stats) => stats.totalProblemsCorrect >= 100,
        xpReward: 150,
    },
    problems_500: {
        id: "problems_500",
        name: "Problem Master",
        description: "Solve 500 problems correctly",
        icon: "👑",
        category: "problems",
        condition: (stats) => stats.totalProblemsCorrect >= 500,
        xpReward: 500,
    },

    // Skill Badges
    hint_free_10: {
        id: "hint_free_10",
        name: "Independent Thinker",
        description: "Solve 10 problems without using hints",
        icon: "🧠",
        category: "skill",
        condition: (stats) => stats.problemsWithoutHints >= 10,
        xpReward: 50,
    },
    perfect_lesson: {
        id: "perfect_lesson",
        name: "Perfect Score",
        description: "Complete a lesson with no wrong answers",
        icon: "💎",
        category: "skill",
        condition: (stats) => stats.perfectLessons >= 1,
        xpReward: 75,
    },
    speed_demon: {
        id: "speed_demon",
        name: "Speed Demon",
        description: "Solve a problem correctly in under 30 seconds",
        icon: "⚡",
        category: "skill",
        condition: (stats) => stats.fastestSolveSeconds <= 30 && stats.fastestSolveSeconds > 0,
        xpReward: 30,
    },

    // Subject Mastery
    maths_apprentice: {
        id: "maths_apprentice",
        name: "Maths Apprentice",
        description: "Reach 50% mastery in any Mathematics topic",
        icon: "📐",
        category: "mastery",
        condition: (stats) => stats.mathsMastery >= 0.5,
        xpReward: 50,
    },
    maths_scholar: {
        id: "maths_scholar",
        name: "Maths Scholar",
        description: "Reach 75% mastery in any Mathematics topic",
        icon: "📐",
        category: "mastery",
        condition: (stats) => stats.mathsMastery >= 0.75,
        xpReward: 100,
    },
    maths_master: {
        id: "maths_master",
        name: "Maths Master",
        description: "Reach 90% mastery in any Mathematics topic",
        icon: "🎓",
        category: "mastery",
        condition: (stats) => stats.mathsMastery >= 0.9,
        xpReward: 200,
    },
    science_apprentice: {
        id: "science_apprentice",
        name: "Science Apprentice",
        description: "Reach 50% mastery in any Science topic",
        icon: "⚛️",
        category: "mastery",
        condition: (stats) => stats.scienceMastery >= 0.5,
        xpReward: 50,
    },

    // XP Milestones
    xp_500: {
        id: "xp_500",
        name: "Rising Star",
        description: "Earn 500 XP total",
        icon: "⭐",
        category: "xp",
        condition: (stats) => stats.totalXP >= 500,
        xpReward: 25,
    },
    xp_1000: {
        id: "xp_1000",
        name: "Thousand Club",
        description: "Earn 1,000 XP total",
        icon: "🌟",
        category: "xp",
        condition: (stats) => stats.totalXP >= 1000,
        xpReward: 50,
    },
    xp_5000: {
        id: "xp_5000",
        name: "XP Champion",
        description: "Earn 5,000 XP total",
        icon: "💫",
        category: "xp",
        condition: (stats) => stats.totalXP >= 5000,
        xpReward: 100,
    },

    // Level Badges
    level_10: {
        id: "level_10",
        name: "Scholar Rank",
        description: "Reach Level 10",
        icon: "🎖️",
        category: "level",
        condition: (stats) => stats.level >= 10,
        xpReward: 100,
    },
    level_20: {
        id: "level_20",
        name: "Master Rank",
        description: "Reach Level 20",
        icon: "🏅",
        category: "level",
        condition: (stats) => stats.level >= 20,
        xpReward: 250,
    },
    level_25: {
        id: "level_25",
        name: "Grandmaster",
        description: "Reach Level 25",
        icon: "🥇",
        category: "level",
        condition: (stats) => stats.level >= 25,
        xpReward: 500,
    },
};

// Badge categories for display
export const BADGE_CATEGORIES = {
    getting_started: { name: "Getting Started", order: 1 },
    streaks: { name: "Streaks", order: 2 },
    problems: { name: "Problem Solving", order: 3 },
    skill: { name: "Skills", order: 4 },
    mastery: { name: "Subject Mastery", order: 5 },
    xp: { name: "XP Milestones", order: 6 },
    level: { name: "Levels", order: 7 },
};

// ============================================
// Utility Functions
// ============================================

/**
 * Get level info from total XP
 */
export const getLevelFromXP = (totalXP) => {
    const thresholds = LEVEL_CONFIG.THRESHOLDS;
    let currentLevel = thresholds[0];

    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (totalXP >= thresholds[i].xpRequired) {
            currentLevel = thresholds[i];
            break;
        }
    }

    // Find next level
    const currentIndex = thresholds.findIndex(t => t.level === currentLevel.level);
    const nextLevel = thresholds[currentIndex + 1] || null;

    // Calculate progress to next level
    const xpInCurrentLevel = totalXP - currentLevel.xpRequired;
    const xpForNextLevel = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : 0;
    const progressPercent = nextLevel ? Math.min((xpInCurrentLevel / xpForNextLevel) * 100, 100) : 100;

    return {
        level: currentLevel.level,
        title: currentLevel.title,
        titleColor: LEVEL_CONFIG.TITLE_COLORS[currentLevel.title],
        totalXP,
        xpInCurrentLevel,
        xpForNextLevel,
        progressPercent,
        nextLevel: nextLevel?.level || null,
        nextLevelXP: nextLevel?.xpRequired || null,
    };
};

/**
 * Calculate XP for a problem submission
 */
export const calculateProblemXP = (isCorrect, hintsUsed, attempts, timeSeconds, isFirstProblemOfDay) => {
    if (!isCorrect) return 0;

    let xp = 0;

    // Base XP based on hints used
    if (hintsUsed === 0 && attempts === 1) {
        xp = XP_CONFIG.CORRECT_FIRST_TRY;
    } else if (hintsUsed > 0) {
        xp = XP_CONFIG.CORRECT_WITH_HINT;
    } else if (attempts > 2) {
        xp = XP_CONFIG.CORRECT_AFTER_STRUGGLE;
    } else {
        xp = XP_CONFIG.CORRECT_ANSWER;
    }

    // Speed bonus
    if (timeSeconds > 0 && timeSeconds < 60) {
        xp += XP_CONFIG.SPEED_BONUS;
    }

    // First problem of day bonus
    if (isFirstProblemOfDay) {
        xp += XP_CONFIG.FIRST_PROBLEM_OF_DAY;
    }

    return xp;
};

/**
 * Check which badges a user has earned
 */
export const checkBadges = (stats, earnedBadgeIds = []) => {
    const newBadges = [];

    Object.values(BADGES).forEach(badge => {
        // Skip if already earned
        if (earnedBadgeIds.includes(badge.id)) return;

        // Check condition
        if (badge.condition(stats)) {
            newBadges.push(badge);
        }
    });

    return newBadges;
};

/**
 * Get all badges grouped by category
 */
export const getBadgesByCategory = () => {
    const grouped = {};

    Object.values(BADGES).forEach(badge => {
        if (!grouped[badge.category]) {
            grouped[badge.category] = {
                ...BADGE_CATEGORIES[badge.category],
                badges: [],
            };
        }
        grouped[badge.category].badges.push(badge);
    });

    // Sort by category order
    return Object.values(grouped).sort((a, b) => a.order - b.order);
};

const gamificationConfig = {
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
};

export default gamificationConfig;

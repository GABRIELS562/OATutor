/**
 * Gamification Context
 * Provides XP, streaks, badges, and level state across the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    XP_CONFIG,
    STREAK_CONFIG,
    DAILY_GOALS,
    getLevelFromXP,
    calculateProblemXP,
    checkBadges,
} from '../config/gamificationConfig';
import { setGamificationRef } from './gamificationHelper';

// Create context
const GamificationContext = createContext(null);

// Storage keys
const STORAGE_KEYS = {
    USER_STATS: 'angelo_user_stats',
    BADGES: 'angelo_badges',
    DAILY_ACTIVITY: 'angelo_daily_activity',
    STREAK_DATA: 'angelo_streak_data',
    DAILY_GOAL: 'angelo_daily_goal',
};

// Default user stats
const DEFAULT_STATS = {
    totalXP: 0,
    totalProblemsAttempted: 0,
    totalProblemsCorrect: 0,
    problemsWithoutHints: 0,
    lessonsCompleted: 0,
    perfectLessons: 0,
    fastestSolveSeconds: 0,
    currentStreak: 0,
    longestStreak: 0,
    streakFreezesAvailable: STREAK_CONFIG.INITIAL_STREAK_FREEZES,
    lastPracticeDate: null,
    mathsMastery: 0,
    scienceMastery: 0,
    level: 1,
    createdAt: new Date().toISOString(),
};

// Default daily activity
const getDefaultDailyActivity = () => ({
    date: new Date().toISOString().split('T')[0],
    xpEarned: 0,
    problemsSolved: 0,
    correctAnswers: 0,
    hintsUsed: 0,
    timeSpentSeconds: 0,
    lessonsWorkedOn: [],
    isFirstProblemOfDay: true,
});

/**
 * Gamification Provider Component
 */
export const GamificationProvider = ({ children, supabase, userId }) => {
    // State
    const [stats, setStats] = useState(DEFAULT_STATS);
    const [earnedBadges, setEarnedBadges] = useState([]);
    const [dailyActivity, setDailyActivity] = useState(getDefaultDailyActivity());
    const [streakData, setStreakData] = useState({
        currentStreak: 0,
        longestStreak: 0,
        lastPracticeDate: null,
        streakFreezesAvailable: STREAK_CONFIG.INITIAL_STREAK_FREEZES,
    });
    const [dailyGoal, setDailyGoal] = useState(DAILY_GOALS.DEFAULT);
    const [isLoaded, setIsLoaded] = useState(false);
    const [newBadges, setNewBadges] = useState([]); // For badge unlock notifications
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [previousLevel, setPreviousLevel] = useState(1);

    // Load data from localStorage on mount
    useEffect(() => {
        loadFromStorage();
    }, []);

    // Register with helper for imperative access from class components
    useEffect(() => {
        if (isLoaded) {
            setGamificationRef({
                stats,
                streakData,
                dailyActivity,
                earnedBadges,
                addXP,
                recordProblemAttempt,
                recordLessonComplete,
                getLevelInfo,
                getDailyGoalProgress,
            });
        }
    }, [isLoaded, stats, streakData, dailyActivity, earnedBadges]);

    // Check for new day and reset daily activity
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (dailyActivity.date !== today) {
            // Check streak before resetting
            checkAndUpdateStreak();
            setDailyActivity(getDefaultDailyActivity());
        }
    }, [dailyActivity.date]);

    // Save to localStorage whenever stats change
    useEffect(() => {
        if (isLoaded) {
            saveToStorage();
        }
    }, [stats, earnedBadges, dailyActivity, streakData, dailyGoal, isLoaded]);

    /**
     * Load data from localStorage
     */
    const loadFromStorage = () => {
        try {
            const storedStats = localStorage.getItem(STORAGE_KEYS.USER_STATS);
            const storedBadges = localStorage.getItem(STORAGE_KEYS.BADGES);
            const storedDaily = localStorage.getItem(STORAGE_KEYS.DAILY_ACTIVITY);
            const storedStreak = localStorage.getItem(STORAGE_KEYS.STREAK_DATA);
            const storedGoal = localStorage.getItem(STORAGE_KEYS.DAILY_GOAL);

            if (storedStats) {
                const parsed = JSON.parse(storedStats);
                setStats({ ...DEFAULT_STATS, ...parsed });
            }

            if (storedBadges) {
                setEarnedBadges(JSON.parse(storedBadges));
            }

            if (storedDaily) {
                const parsed = JSON.parse(storedDaily);
                const today = new Date().toISOString().split('T')[0];
                if (parsed.date === today) {
                    setDailyActivity(parsed);
                } else {
                    setDailyActivity(getDefaultDailyActivity());
                }
            }

            if (storedStreak) {
                setStreakData(JSON.parse(storedStreak));
            }

            if (storedGoal) {
                setDailyGoal(storedGoal);
            }

            setIsLoaded(true);
            console.debug('Gamification data loaded from storage');
        } catch (err) {
            console.error('Error loading gamification data:', err);
            setIsLoaded(true);
        }
    };

    /**
     * Save data to localStorage
     */
    const saveToStorage = () => {
        try {
            localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
            localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(earnedBadges));
            localStorage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, JSON.stringify(dailyActivity));
            localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
            localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, dailyGoal);
        } catch (err) {
            console.error('Error saving gamification data:', err);
        }
    };

    /**
     * Check and update streak based on last practice date
     */
    const checkAndUpdateStreak = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastPractice = streakData.lastPracticeDate
            ? new Date(streakData.lastPracticeDate)
            : null;

        if (lastPractice) {
            lastPractice.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((today - lastPractice) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                // Same day, streak continues
                return;
            } else if (diffDays === 1) {
                // Yesterday, streak continues if they practiced
                // This is handled by recordActivity
                return;
            } else if (diffDays === 2 && streakData.streakFreezesAvailable > 0) {
                // Missed one day, use streak freeze - bridge the gap by setting lastPracticeDate to yesterday
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                setStreakData(prev => ({
                    ...prev,
                    streakFreezesAvailable: prev.streakFreezesAvailable - 1,
                    lastPracticeDate: yesterdayStr, // Bridge the gap so streak continues
                }));
                setStats(prev => ({
                    ...prev,
                    streakFreezesAvailable: prev.streakFreezesAvailable - 1,
                    lastPracticeDate: yesterdayStr,
                }));
                console.debug('Streak freeze used! Gap bridged to maintain streak.');
            } else {
                // Streak broken
                setStreakData(prev => ({
                    ...prev,
                    currentStreak: 0,
                }));
                setStats(prev => ({
                    ...prev,
                    currentStreak: 0,
                }));
                console.debug('Streak broken :(');
            }
        }
    }, [streakData]);

    /**
     * Record XP earned from an activity
     */
    const addXP = useCallback((amount, source = 'unknown') => {
        if (amount <= 0) return;

        const prevLevel = getLevelFromXP(stats.totalXP).level;

        setStats(prev => {
            const newTotalXP = prev.totalXP + amount;
            const newLevelInfo = getLevelFromXP(newTotalXP);

            // Check for level up
            if (newLevelInfo.level > prevLevel) {
                setPreviousLevel(prevLevel);
                setShowLevelUp(true);
            }

            return {
                ...prev,
                totalXP: newTotalXP,
                level: newLevelInfo.level,
            };
        });

        setDailyActivity(prev => ({
            ...prev,
            xpEarned: prev.xpEarned + amount,
        }));

        console.debug(`+${amount} XP from ${source}`);

        // Check for new badges after XP update
        setTimeout(() => checkForNewBadges(), 100);
    }, [stats.totalXP]);

    /**
     * Record a problem attempt
     */
    const recordProblemAttempt = useCallback(({
        isCorrect,
        hintsUsed = 0,
        attempts = 1,
        timeSeconds = 0,
        knowledgeComponents = [],
        lessonId = null,
    }) => {
        const isFirstProblemOfDay = dailyActivity.isFirstProblemOfDay;

        // Calculate XP
        const xpEarned = calculateProblemXP(
            isCorrect,
            hintsUsed,
            attempts,
            timeSeconds,
            isFirstProblemOfDay
        );

        // Determine subject from knowledge components
        const isMathsProblem = knowledgeComponents.some(kc =>
            kc.includes('alg') || kc.includes('calc') || kc.includes('trig') ||
            kc.includes('geo') || kc.includes('func') || kc.includes('seq') ||
            kc.includes('fin') || kc.includes('stats') || kc.includes('anl') ||
            kc.includes('linear') || kc.includes('quadratic') || kc.includes('exponent')
        );
        const isScienceProblem = knowledgeComponents.some(kc =>
            kc.includes('phys') || kc.includes('chem') || kc.includes('bio')
        );

        // Calculate mastery increment (small increment per correct answer)
        const masteryIncrement = isCorrect ? 0.02 : 0; // 2% per correct answer

        // Update stats
        setStats(prev => {
            const newMathsMastery = isMathsProblem && isCorrect
                ? Math.min(1, prev.mathsMastery + masteryIncrement)
                : prev.mathsMastery;
            const newScienceMastery = isScienceProblem && isCorrect
                ? Math.min(1, prev.scienceMastery + masteryIncrement)
                : prev.scienceMastery;

            return {
                ...prev,
                totalProblemsAttempted: prev.totalProblemsAttempted + 1,
                totalProblemsCorrect: prev.totalProblemsCorrect + (isCorrect ? 1 : 0),
                problemsWithoutHints: prev.problemsWithoutHints + (isCorrect && hintsUsed === 0 ? 1 : 0),
                fastestSolveSeconds: isCorrect && timeSeconds > 0
                    ? (prev.fastestSolveSeconds === 0
                        ? timeSeconds
                        : Math.min(prev.fastestSolveSeconds, timeSeconds))
                    : prev.fastestSolveSeconds,
                mathsMastery: newMathsMastery,
                scienceMastery: newScienceMastery,
            };
        });

        // Update daily activity
        setDailyActivity(prev => ({
            ...prev,
            problemsSolved: prev.problemsSolved + 1,
            correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
            hintsUsed: prev.hintsUsed + hintsUsed,
            timeSpentSeconds: prev.timeSpentSeconds + timeSeconds,
            isFirstProblemOfDay: false,
            lessonsWorkedOn: lessonId && !prev.lessonsWorkedOn.includes(lessonId)
                ? [...prev.lessonsWorkedOn, lessonId]
                : prev.lessonsWorkedOn,
        }));

        // Update streak
        updateStreakOnActivity();

        // Add XP
        if (xpEarned > 0) {
            addXP(xpEarned, 'problem_solve');
        }

        return xpEarned;
    }, [dailyActivity.isFirstProblemOfDay, addXP]);

    /**
     * Record lesson completion
     */
    const recordLessonComplete = useCallback((lessonId, isPerfect = false) => {
        setStats(prev => ({
            ...prev,
            lessonsCompleted: prev.lessonsCompleted + 1,
            perfectLessons: prev.perfectLessons + (isPerfect ? 1 : 0),
        }));

        // Bonus XP for perfect lesson
        if (isPerfect) {
            addXP(XP_CONFIG.PERFECT_LESSON, 'perfect_lesson');
        }

        checkForNewBadges();
    }, [addXP]);

    /**
     * Update streak on any activity
     */
    const updateStreakOnActivity = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        const lastPractice = streakData.lastPracticeDate
            ? new Date(streakData.lastPracticeDate)
            : null;

        if (lastPractice) {
            lastPractice.setHours(0, 0, 0, 0);
            const lastPracticeStr = lastPractice.toISOString().split('T')[0];

            if (lastPracticeStr === todayStr) {
                // Already practiced today, no change
                return;
            }

            const diffDays = Math.floor((today - lastPractice) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day - extend streak!
                const newStreak = streakData.currentStreak + 1;
                const newLongest = Math.max(newStreak, streakData.longestStreak);

                setStreakData(prev => ({
                    ...prev,
                    currentStreak: newStreak,
                    longestStreak: newLongest,
                    lastPracticeDate: todayStr,
                }));

                setStats(prev => ({
                    ...prev,
                    currentStreak: newStreak,
                    longestStreak: newLongest,
                    lastPracticeDate: todayStr,
                }));

                // Check streak milestones
                if (STREAK_CONFIG.MILESTONES.includes(newStreak)) {
                    const bonusXP = newStreak >= 30
                        ? XP_CONFIG.STREAK_BONUS_30_DAYS
                        : XP_CONFIG.STREAK_BONUS_7_DAYS;
                    addXP(bonusXP, `streak_${newStreak}`);
                }

                console.debug(`Streak extended to ${newStreak} days!`);
            } else if (diffDays > 1) {
                // Streak broken, start new streak
                setStreakData(prev => ({
                    ...prev,
                    currentStreak: 1,
                    lastPracticeDate: todayStr,
                }));

                setStats(prev => ({
                    ...prev,
                    currentStreak: 1,
                    lastPracticeDate: todayStr,
                }));
            }
        } else {
            // First ever activity - start streak
            setStreakData(prev => ({
                ...prev,
                currentStreak: 1,
                longestStreak: Math.max(1, prev.longestStreak),
                lastPracticeDate: todayStr,
            }));

            setStats(prev => ({
                ...prev,
                currentStreak: 1,
                longestStreak: Math.max(1, prev.longestStreak),
                lastPracticeDate: todayStr,
            }));

            console.debug('Streak started!');
        }
    }, [streakData, addXP]);

    /**
     * Check for newly earned badges
     */
    const checkForNewBadges = useCallback(() => {
        const currentStats = {
            ...stats,
            currentStreak: streakData.currentStreak,
            longestStreak: streakData.longestStreak,
        };

        const newlyEarned = checkBadges(currentStats, earnedBadges);

        if (newlyEarned.length > 0) {
            // Add new badges
            const newBadgeIds = newlyEarned.map(b => b.id);
            setEarnedBadges(prev => [...prev, ...newBadgeIds]);

            // Queue for notification
            setNewBadges(newlyEarned);

            // Award XP for badges
            newlyEarned.forEach(badge => {
                if (badge.xpReward > 0) {
                    addXP(badge.xpReward, `badge_${badge.id}`);
                }
            });

            console.debug('New badges earned:', newlyEarned.map(b => b.name));
        }
    }, [stats, streakData, earnedBadges, addXP]);

    /**
     * Clear badge notification queue
     */
    const clearNewBadges = useCallback(() => {
        setNewBadges([]);
    }, []);

    /**
     * Clear level up notification
     */
    const clearLevelUp = useCallback(() => {
        setShowLevelUp(false);
    }, []);

    /**
     * Update daily goal setting
     */
    const updateDailyGoal = useCallback((goalId) => {
        setDailyGoal(goalId);
    }, []);

    /**
     * Check if daily goal is complete
     */
    const isDailyGoalComplete = useCallback(() => {
        const goal = DAILY_GOALS.OPTIONS.find(g => g.id === dailyGoal);
        if (!goal) return false;

        return (
            dailyActivity.correctAnswers >= goal.problems ||
            dailyActivity.xpEarned >= goal.xp
        );
    }, [dailyGoal, dailyActivity]);

    /**
     * Get daily goal progress
     */
    const getDailyGoalProgress = useCallback(() => {
        const goal = DAILY_GOALS.OPTIONS.find(g => g.id === dailyGoal);
        if (!goal) return { percent: 0, problems: 0, xp: 0 };

        const problemsPercent = (dailyActivity.correctAnswers / goal.problems) * 100;
        const xpPercent = (dailyActivity.xpEarned / goal.xp) * 100;

        return {
            percent: Math.min(Math.max(problemsPercent, xpPercent), 100),
            problemsProgress: dailyActivity.correctAnswers,
            problemsTarget: goal.problems,
            xpProgress: dailyActivity.xpEarned,
            xpTarget: goal.xp,
            isComplete: problemsPercent >= 100 || xpPercent >= 100,
        };
    }, [dailyGoal, dailyActivity]);

    /**
     * Get level info
     */
    const getLevelInfo = useCallback(() => {
        return getLevelFromXP(stats.totalXP);
    }, [stats.totalXP]);

    /**
     * Use streak freeze
     */
    const useStreakFreeze = useCallback(() => {
        if (streakData.streakFreezesAvailable > 0) {
            setStreakData(prev => ({
                ...prev,
                streakFreezesAvailable: prev.streakFreezesAvailable - 1,
            }));
            return true;
        }
        return false;
    }, [streakData.streakFreezesAvailable]);

    /**
     * Reset all gamification data (for testing)
     */
    const resetAllData = useCallback(() => {
        setStats(DEFAULT_STATS);
        setEarnedBadges([]);
        setDailyActivity(getDefaultDailyActivity());
        setStreakData({
            currentStreak: 0,
            longestStreak: 0,
            lastPracticeDate: null,
            streakFreezesAvailable: STREAK_CONFIG.INITIAL_STREAK_FREEZES,
        });
        setDailyGoal(DAILY_GOALS.DEFAULT);

        // Clear localStorage
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });

        console.debug('All gamification data reset');
    }, []);

    // Context value
    const value = {
        // State
        stats,
        earnedBadges,
        dailyActivity,
        streakData,
        dailyGoal,
        isLoaded,

        // Notifications
        newBadges,
        showLevelUp,
        previousLevel,

        // Actions
        addXP,
        recordProblemAttempt,
        recordLessonComplete,
        checkForNewBadges,
        clearNewBadges,
        clearLevelUp,
        updateDailyGoal,
        useStreakFreeze,
        resetAllData,

        // Computed
        getLevelInfo,
        isDailyGoalComplete,
        getDailyGoalProgress,
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};

/**
 * Custom hook to use gamification context
 */
export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};

export default GamificationContext;

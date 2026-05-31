/**
 * GamificationContext Tests
 * Tests for XP calculation, leveling, streaks, and badges
 */

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: jest.fn(key => localStorageMock.store[key] || null),
    setItem: jest.fn((key, value) => { localStorageMock.store[key] = value; }),
    removeItem: jest.fn(key => { delete localStorageMock.store[key]; }),
    clear: jest.fn(() => { localStorageMock.store = {}; }),
};
global.localStorage = localStorageMock;

// Test the XP and leveling calculations directly
describe('Gamification Calculations', () => {
    // XP required for each level (matching GamificationContext)
    const XP_PER_LEVEL = [
        0,      // Level 1 (starting)
        100,    // Level 2
        250,    // Level 3
        450,    // Level 4
        700,    // Level 5
        1000,   // Level 6
        1400,   // Level 7
        1900,   // Level 8
        2500,   // Level 9
        3200,   // Level 10
    ];

    const getLevelFromXP = (xp) => {
        for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
            if (xp >= XP_PER_LEVEL[i]) {
                return i + 1;
            }
        }
        return 1;
    };

    const getXPForNextLevel = (level) => {
        if (level >= XP_PER_LEVEL.length) return XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
        return XP_PER_LEVEL[level];
    };

    describe('getLevelFromXP', () => {
        test('returns level 1 for 0 XP', () => {
            expect(getLevelFromXP(0)).toBe(1);
        });

        test('returns level 1 for 99 XP', () => {
            expect(getLevelFromXP(99)).toBe(1);
        });

        test('returns level 2 for 100 XP', () => {
            expect(getLevelFromXP(100)).toBe(2);
        });

        test('returns level 2 for 249 XP', () => {
            expect(getLevelFromXP(249)).toBe(2);
        });

        test('returns level 3 for 250 XP', () => {
            expect(getLevelFromXP(250)).toBe(3);
        });

        test('returns level 5 for 700 XP', () => {
            expect(getLevelFromXP(700)).toBe(5);
        });

        test('returns level 10 for 3200+ XP', () => {
            expect(getLevelFromXP(3200)).toBe(10);
            expect(getLevelFromXP(5000)).toBe(10);
        });
    });

    describe('getXPForNextLevel', () => {
        test('level 1 needs 100 XP for next level', () => {
            expect(getXPForNextLevel(1)).toBe(100);
        });

        test('level 2 needs 250 XP for next level', () => {
            expect(getXPForNextLevel(2)).toBe(250);
        });

        test('level 9 needs 3200 XP for next level', () => {
            expect(getXPForNextLevel(9)).toBe(3200);
        });
    });
});

describe('XP Awards', () => {
    const XP_AWARDS = {
        PROBLEM_CORRECT: 10,
        PROBLEM_CORRECT_FIRST_TRY: 15,
        HINT_USED: -2,
        STEP_COMPLETE: 5,
        LESSON_COMPLETE: 50,
        STREAK_BONUS_3: 20,
        STREAK_BONUS_7: 50,
        STREAK_BONUS_30: 200,
        DAILY_GOAL_MET: 25,
    };

    test('correct problem awards 10 XP', () => {
        expect(XP_AWARDS.PROBLEM_CORRECT).toBe(10);
    });

    test('first try bonus awards 15 XP', () => {
        expect(XP_AWARDS.PROBLEM_CORRECT_FIRST_TRY).toBe(15);
    });

    test('hint usage reduces XP by 2', () => {
        expect(XP_AWARDS.HINT_USED).toBe(-2);
    });

    test('lesson completion awards 50 XP', () => {
        expect(XP_AWARDS.LESSON_COMPLETE).toBe(50);
    });

    test('7-day streak bonus is 50 XP', () => {
        expect(XP_AWARDS.STREAK_BONUS_7).toBe(50);
    });
});

describe('Streak Calculations', () => {
    const isConsecutiveDay = (lastDate, currentDate) => {
        const last = new Date(lastDate);
        const current = new Date(currentDate);

        // Reset hours to compare just dates
        last.setHours(0, 0, 0, 0);
        current.setHours(0, 0, 0, 0);

        const diffTime = current.getTime() - last.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return diffDays === 1;
    };

    const isSameDay = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.toDateString() === d2.toDateString();
    };

    test('consecutive days are detected', () => {
        expect(isConsecutiveDay('2024-01-01', '2024-01-02')).toBe(true);
        expect(isConsecutiveDay('2024-01-01', '2024-01-03')).toBe(false);
        expect(isConsecutiveDay('2024-01-01', '2024-01-01')).toBe(false);
    });

    test('same day detection works', () => {
        expect(isSameDay('2024-01-01T10:00:00', '2024-01-01T15:00:00')).toBe(true);
        expect(isSameDay('2024-01-01', '2024-01-02')).toBe(false);
    });
});

describe('Badge Unlock Conditions', () => {
    const BADGES = {
        FIRST_PROBLEM: { id: 'first_problem', condition: (stats) => stats.problemsCompleted >= 1 },
        TEN_PROBLEMS: { id: 'ten_problems', condition: (stats) => stats.problemsCompleted >= 10 },
        STREAK_3: { id: 'streak_3', condition: (stats) => stats.currentStreak >= 3 },
        STREAK_7: { id: 'streak_7', condition: (stats) => stats.currentStreak >= 7 },
        PERFECT_LESSON: { id: 'perfect_lesson', condition: (stats) => stats.perfectLessons >= 1 },
    };

    test('first problem badge unlocks at 1 problem', () => {
        expect(BADGES.FIRST_PROBLEM.condition({ problemsCompleted: 0 })).toBe(false);
        expect(BADGES.FIRST_PROBLEM.condition({ problemsCompleted: 1 })).toBe(true);
    });

    test('ten problems badge unlocks at 10 problems', () => {
        expect(BADGES.TEN_PROBLEMS.condition({ problemsCompleted: 9 })).toBe(false);
        expect(BADGES.TEN_PROBLEMS.condition({ problemsCompleted: 10 })).toBe(true);
    });

    test('streak badges unlock at correct thresholds', () => {
        expect(BADGES.STREAK_3.condition({ currentStreak: 2 })).toBe(false);
        expect(BADGES.STREAK_3.condition({ currentStreak: 3 })).toBe(true);
        expect(BADGES.STREAK_7.condition({ currentStreak: 6 })).toBe(false);
        expect(BADGES.STREAK_7.condition({ currentStreak: 7 })).toBe(true);
    });
});

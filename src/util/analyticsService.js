/**
 * Analytics Service
 * Manages tracking and retrieval of student progress data for the Analytics Dashboard
 * Integrates with BKT model and gamification system
 */

import localforage from 'localforage';
import { MASTERY_THRESHOLD } from '../config/config';

// Storage keys for analytics data
const ANALYTICS_KEYS = {
    PROBLEM_HISTORY: 'angelo_problem_history',
    ACTIVITY_LOG: 'angelo_activity_log',
    SKILL_PROGRESS: 'angelo_skill_progress',
    SESSION_DATA: 'angelo_session_data',
};

// Subject categorization based on skill prefixes
const SUBJECT_MAPPINGS = {
    Mathematics: [
        'alg', 'calc', 'trig', 'geo', 'func', 'seq', 'fin', 'stats', 'anl',
        'linear', 'quadratic', 'exponent', 'surd', 'factor', 'parabola',
        'hyperbola', 'gradient', 'arithmetic', 'geometric', 'sigma',
        'limits', 'optimization', 'integration', 'differentiation',
        'probability', 'permutation', 'combination', 'annuit', 'interest',
        'surds', 'inequalit', 'simultaneous', 'inverse-function', 'logarithm'
    ],
    Physics: [
        'phys', 'momentum', 'projectile', 'circuit', 'ohm', 'doppler',
        'wave', 'em-induction', 'photoelectric', 'newton', 'motion',
        'velocity', 'acceleration', 'optics'
    ],
    Chemistry: [
        'chem', 'organic', 'ph-calc', 'titration', 'galvanic', 'electrolysis',
        'equilibrium', 'reaction-rate', 'stoichiometry', 'functional-group',
        'iupac'
    ],
    Biology: [
        'bio', 'meiosis', 'genetic', 'dna', 'protein-synthesis', 'evolution',
        'speciation', 'nerve', 'hormone', 'homeostasis', 'menstrual',
        'photosynthesis', 'respiration', 'ecology', 'classification',
        'reflex', 'brain'
    ],
};

/**
 * Determine which subject a skill belongs to
 */
export const getSubjectForSkill = (skillId) => {
    const lowerSkill = skillId.toLowerCase();
    for (const [subject, prefixes] of Object.entries(SUBJECT_MAPPINGS)) {
        if (prefixes.some(prefix => lowerSkill.includes(prefix))) {
            return subject;
        }
    }
    return 'Mathematics'; // Default to Maths
};

/**
 * Get color scheme for each subject
 */
export const getSubjectColor = (subject) => {
    const colors = {
        Mathematics: { primary: '#58CC02', secondary: '#89E219', gradient: '#58CC02' },
        Physics: { primary: '#1CB0F6', secondary: '#0095D9', gradient: '#1CB0F6' },
        Chemistry: { primary: '#10B981', secondary: '#059669', gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
        Biology: { primary: '#F59E0B', secondary: '#D97706', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
    };
    return colors[subject] || colors.Mathematics;
};

/**
 * Record a problem attempt for analytics
 */
export const recordProblemAttempt = async (data) => {
    const {
        problemId,
        skillIds,
        isCorrect,
        hintsUsed,
        attempts,
        timeSpentSeconds,
        lessonId,
    } = data;

    const timestamp = new Date().toISOString();
    const entry = {
        problemId,
        skillIds: skillIds || [],
        isCorrect,
        hintsUsed: hintsUsed || 0,
        attempts: attempts || 1,
        timeSpentSeconds: timeSpentSeconds || 0,
        lessonId,
        timestamp,
        date: timestamp.split('T')[0],
    };

    try {
        // Get existing history
        const history = await localforage.getItem(ANALYTICS_KEYS.PROBLEM_HISTORY) || [];

        // Add new entry (keep last 1000 entries for performance)
        history.push(entry);
        if (history.length > 1000) {
            history.shift();
        }

        await localforage.setItem(ANALYTICS_KEYS.PROBLEM_HISTORY, history);

        // Update skill progress
        await updateSkillProgress(skillIds, isCorrect);

        // Update activity log
        await updateActivityLog(entry);

        return true;
    } catch (error) {
        console.error('Error recording problem attempt:', error);
        return false;
    }
};

/**
 * Update skill progress tracking
 */
const updateSkillProgress = async (skillIds, isCorrect) => {
    if (!skillIds || skillIds.length === 0) return;

    try {
        const progress = await localforage.getItem(ANALYTICS_KEYS.SKILL_PROGRESS) || {};

        skillIds.forEach(skillId => {
            if (!progress[skillId]) {
                progress[skillId] = {
                    attempts: 0,
                    correct: 0,
                    lastAttempt: null,
                    history: [],
                };
            }

            progress[skillId].attempts += 1;
            if (isCorrect) {
                progress[skillId].correct += 1;
            }
            progress[skillId].lastAttempt = new Date().toISOString();

            // Keep last 20 attempts for trend analysis
            progress[skillId].history.push(isCorrect ? 1 : 0);
            if (progress[skillId].history.length > 20) {
                progress[skillId].history.shift();
            }
        });

        await localforage.setItem(ANALYTICS_KEYS.SKILL_PROGRESS, progress);
    } catch (error) {
        console.error('Error updating skill progress:', error);
    }
};

/**
 * Update activity log for timeline
 */
const updateActivityLog = async (entry) => {
    try {
        const log = await localforage.getItem(ANALYTICS_KEYS.ACTIVITY_LOG) || [];

        log.push({
            type: 'problem_attempt',
            problemId: entry.problemId,
            isCorrect: entry.isCorrect,
            timestamp: entry.timestamp,
            lessonId: entry.lessonId,
        });

        // Keep last 100 activities
        if (log.length > 100) {
            log.shift();
        }

        await localforage.setItem(ANALYTICS_KEYS.ACTIVITY_LOG, log);
    } catch (error) {
        console.error('Error updating activity log:', error);
    }
};

/**
 * Get problem history with filtering
 */
export const getProblemHistory = async (filters = {}) => {
    try {
        const history = await localforage.getItem(ANALYTICS_KEYS.PROBLEM_HISTORY) || [];

        let filtered = history;

        if (filters.startDate) {
            filtered = filtered.filter(h => h.date >= filters.startDate);
        }
        if (filters.endDate) {
            filtered = filtered.filter(h => h.date <= filters.endDate);
        }
        if (filters.lessonId) {
            filtered = filtered.filter(h => h.lessonId === filters.lessonId);
        }
        if (filters.subject) {
            filtered = filtered.filter(h =>
                h.skillIds.some(skillId => getSubjectForSkill(skillId) === filters.subject)
            );
        }

        return filtered;
    } catch (error) {
        console.error('Error getting problem history:', error);
        return [];
    }
};

/**
 * Get skill progress data
 */
export const getSkillProgress = async () => {
    try {
        return await localforage.getItem(ANALYTICS_KEYS.SKILL_PROGRESS) || {};
    } catch (error) {
        console.error('Error getting skill progress:', error);
        return {};
    }
};

/**
 * Get activity log for timeline
 */
export const getActivityLog = async (limit = 50) => {
    try {
        const log = await localforage.getItem(ANALYTICS_KEYS.ACTIVITY_LOG) || [];
        return log.slice(-limit).reverse();
    } catch (error) {
        console.error('Error getting activity log:', error);
        return [];
    }
};

/**
 * Calculate overall statistics
 */
export const getOverallStats = async (bktParams = {}) => {
    try {
        const history = await getProblemHistory();

        const totalAttempts = history.length;
        const correctAnswers = history.filter(h => h.isCorrect).length;
        const accuracy = totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0;
        const totalTimeSeconds = history.reduce((sum, h) => sum + (h.timeSpentSeconds || 0), 0);

        // Calculate subject breakdown
        const subjectStats = {
            Mathematics: { attempts: 0, correct: 0, skills: new Set() },
            Physics: { attempts: 0, correct: 0, skills: new Set() },
            Chemistry: { attempts: 0, correct: 0, skills: new Set() },
            Biology: { attempts: 0, correct: 0, skills: new Set() },
        };

        history.forEach(h => {
            h.skillIds.forEach(skillId => {
                const subject = getSubjectForSkill(skillId);
                if (subjectStats[subject]) {
                    subjectStats[subject].attempts += 1;
                    if (h.isCorrect) {
                        subjectStats[subject].correct += 1;
                    }
                    subjectStats[subject].skills.add(skillId);
                }
            });
        });

        // Convert sets to counts
        Object.keys(subjectStats).forEach(subject => {
            subjectStats[subject].skillCount = subjectStats[subject].skills.size;
            delete subjectStats[subject].skills;
            subjectStats[subject].accuracy = subjectStats[subject].attempts > 0
                ? (subjectStats[subject].correct / subjectStats[subject].attempts) * 100
                : 0;
        });

        // Get mastery stats from BKT params
        const masteredSkills = Object.entries(bktParams)
            .filter(([_, params]) => params.probMastery >= MASTERY_THRESHOLD)
            .length;
        const totalSkills = Object.keys(bktParams).length;

        return {
            totalAttempts,
            correctAnswers,
            accuracy: Math.round(accuracy * 10) / 10,
            totalTimeMinutes: Math.round(totalTimeSeconds / 60),
            subjectStats,
            masteredSkills,
            totalSkills,
            masteryPercentage: totalSkills > 0 ? Math.round((masteredSkills / totalSkills) * 100) : 0,
        };
    } catch (error) {
        console.error('Error calculating overall stats:', error);
        return {
            totalAttempts: 0,
            correctAnswers: 0,
            accuracy: 0,
            totalTimeMinutes: 0,
            subjectStats: {},
            masteredSkills: 0,
            totalSkills: 0,
            masteryPercentage: 0,
        };
    }
};

/**
 * Get skill mastery breakdown from BKT params
 */
export const getSkillMasteryData = (bktParams = {}) => {
    const skills = Object.entries(bktParams).map(([skillId, params]) => {
        const mastery = params.probMastery || 0;
        const subject = getSubjectForSkill(skillId);

        return {
            skillId,
            name: formatSkillName(skillId),
            mastery: Math.round(mastery * 100),
            subject,
            isMastered: mastery >= MASTERY_THRESHOLD,
            level: getMasteryLevel(mastery),
        };
    });

    // Sort by mastery level (descending)
    skills.sort((a, b) => b.mastery - a.mastery);

    return skills;
};

/**
 * Format skill ID to readable name
 */
const formatSkillName = (skillId) => {
    return skillId
        .replace(/-/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

/**
 * Get mastery level label
 */
export const getMasteryLevel = (mastery) => {
    if (mastery >= 0.95) return { label: 'Mastered', color: '#10B981', icon: 'star' };
    if (mastery >= 0.75) return { label: 'Proficient', color: '#CE82FF', icon: 'trophy' };
    if (mastery >= 0.50) return { label: 'Developing', color: '#FF9600', icon: 'trending_up' };
    if (mastery >= 0.25) return { label: 'Learning', color: '#1CB0F6', icon: 'school' };
    return { label: 'Beginner', color: '#94A3B8', icon: 'flag' };
};

/**
 * Get strengths and weaknesses analysis
 */
export const getStrengthsWeaknesses = async (bktParams = {}) => {
    const skills = getSkillMasteryData(bktParams);
    const skillProgress = await getSkillProgress();

    // Combine BKT mastery with actual performance
    const enrichedSkills = skills.map(skill => {
        const progress = skillProgress[skill.skillId] || { attempts: 0, correct: 0, history: [] };
        const recentTrend = progress.history.length >= 5
            ? progress.history.slice(-5).reduce((a, b) => a + b, 0) / 5
            : null;

        return {
            ...skill,
            attempts: progress.attempts,
            accuracy: progress.attempts > 0 ? Math.round((progress.correct / progress.attempts) * 100) : 0,
            recentTrend,
            isImproving: recentTrend !== null && recentTrend > 0.6,
            isStruggling: recentTrend !== null && recentTrend < 0.4,
        };
    });

    // Get top 5 strengths (high mastery + good recent performance)
    const strengths = enrichedSkills
        .filter(s => s.mastery >= 70 && s.attempts >= 3)
        .slice(0, 5);

    // Get top 5 areas needing improvement (low mastery or struggling)
    const weaknesses = enrichedSkills
        .filter(s => s.mastery < 50 || s.isStruggling)
        .filter(s => s.attempts >= 2)
        .sort((a, b) => a.mastery - b.mastery)
        .slice(0, 5);

    // Get skills that are improving
    const improving = enrichedSkills
        .filter(s => s.isImproving && s.mastery < 95)
        .slice(0, 5);

    return {
        strengths,
        weaknesses,
        improving,
    };
};

/**
 * Get weekly progress data for charts
 */
export const getWeeklyProgress = async () => {
    const history = await getProblemHistory();
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailyData = {};

    // Initialize all 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        dailyData[dateStr] = {
            date: dateStr,
            dayName: date.toLocaleDateString('en-ZA', { weekday: 'short' }),
            attempts: 0,
            correct: 0,
            timeMinutes: 0,
        };
    }

    // Fill in actual data
    history
        .filter(h => new Date(h.timestamp) >= weekAgo)
        .forEach(h => {
            const dateStr = h.date;
            if (dailyData[dateStr]) {
                dailyData[dateStr].attempts += 1;
                if (h.isCorrect) {
                    dailyData[dateStr].correct += 1;
                }
                dailyData[dateStr].timeMinutes += Math.round((h.timeSpentSeconds || 0) / 60);
            }
        });

    // Calculate accuracy for each day
    Object.values(dailyData).forEach(day => {
        day.accuracy = day.attempts > 0 ? Math.round((day.correct / day.attempts) * 100) : 0;
    });

    return Object.values(dailyData);
};

/**
 * Get subject progress for charts
 */
export const getSubjectProgressData = async (bktParams = {}) => {
    const skills = getSkillMasteryData(bktParams);
    const subjectData = {};

    // Group skills by subject
    skills.forEach(skill => {
        if (!subjectData[skill.subject]) {
            subjectData[skill.subject] = {
                subject: skill.subject,
                skills: [],
                totalMastery: 0,
                masteredCount: 0,
            };
        }
        subjectData[skill.subject].skills.push(skill);
        subjectData[skill.subject].totalMastery += skill.mastery;
        if (skill.isMastered) {
            subjectData[skill.subject].masteredCount += 1;
        }
    });

    // Calculate averages
    return Object.values(subjectData).map(subject => ({
        subject: subject.subject,
        skillCount: subject.skills.length,
        averageMastery: subject.skills.length > 0
            ? Math.round(subject.totalMastery / subject.skills.length)
            : 0,
        masteredCount: subject.masteredCount,
        color: getSubjectColor(subject.subject),
        skills: subject.skills,
    }));
};

const analyticsService = {
    recordProblemAttempt,
    getProblemHistory,
    getSkillProgress,
    getActivityLog,
    getOverallStats,
    getSkillMasteryData,
    getStrengthsWeaknesses,
    getWeeklyProgress,
    getSubjectProgressData,
    getSubjectForSkill,
    getSubjectColor,
    getMasteryLevel,
};

export default analyticsService;

/**
 * Supabase Service for SA CAPS Tutor
 * Drop-in replacement for Firebase with Supabase backend
 * FREE TIER: 500MB database, 50K MAU, unlimited API requests
 */

import { createClient } from '@supabase/supabase-js';
import {
    CURRENT_SEMESTER,
    DO_LOG_DATA,
    ENABLE_SUPABASE,
    SITE_VERSION,
} from "../config/config.js";
import supabaseConfig from "../config/supabaseConfig.js";
import {
    IS_STAGING_OR_DEVELOPMENT,
} from "../util/getBuildType";

class Supabase {
    constructor(oats_user_id, treatment, siteVersion, ltiContext) {
        this.oats_user_id = oats_user_id;
        this.treatment = treatment;
        this.siteVersion = siteVersion || SITE_VERSION;
        this.ltiContext = ltiContext;
        this.isConfigured = false;

        // Check if Supabase is properly configured
        if (!ENABLE_SUPABASE) {
            console.debug("Supabase logging disabled");
            return;
        }

        if (!supabaseConfig.url || supabaseConfig.url.includes('[YOUR_')) {
            console.warn("⚠️ Supabase not configured - using local storage only");
            return;
        }

        try {
            this.client = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                },
                // Optimize for SA network conditions
                realtime: {
                    timeout: 30000, // 30s timeout for slow connections
                },
            });
            this.isConfigured = true;
            console.debug("✅ Supabase client initialized");
        } catch (err) {
            console.error("Failed to initialize Supabase:", err);
        }
    }

    /**
     * Get table name with environment prefix for development
     */
    getTableName(tableName) {
        return IS_STAGING_OR_DEVELOPMENT ? `dev_${tableName}` : tableName;
    }

    /**
     * Add metadata to all logged data
     */
    addMetaData(data) {
        return {
            semester: CURRENT_SEMESTER,
            site_version: this.siteVersion,
            site_commit_hash: process.env.REACT_APP_COMMIT_HASH || 'unknown',
            oats_user_id: this.oats_user_id,
            treatment: this.treatment,

            ...(process.env.REACT_APP_STUDY_ID && {
                study_id: process.env.REACT_APP_STUDY_ID,
            }),

            ...(this.ltiContext?.user_id ? {
                course_id: this.ltiContext.course_id,
                course_name: this.ltiContext.course_name,
                course_code: this.ltiContext.course_code,
                lms_user_id: this.ltiContext.user_id,
            } : {
                course_id: 'n/a',
                course_name: 'n/a',
                course_code: 'n/a',
                lms_user_id: 'n/a',
            }),

            ...data,
        };
    }

    /**
     * Log a problem submission (answer attempt)
     */
    async log(
        inputVal,
        problemID,
        step,
        hint,
        isCorrect,
        hintsFinished,
        eventType,
        variabilization,
        lesson,
        courseName,
        hintType,
        dynamicHint,
        bioInfo
    ) {
        if (!DO_LOG_DATA || !this.isConfigured) {
            console.debug("Skipping log - logging disabled or not configured");
            return;
        }

        console.debug("Logging submission:", { problemID, stepId: step?.id, isCorrect });

        // Flatten hintsFinished arrays
        let flattenedHints = hintsFinished;
        if (Array.isArray(hintsFinished) && Array.isArray(hintsFinished[0])) {
            flattenedHints = hintsFinished.map((s) => s.join(", "));
        }

        const data = this.addMetaData({
            event_type: eventType,
            problem_id: problemID,
            step_id: step?.id || null,
            hint_id: hint?.id || null,
            input_value: inputVal?.toString() || null,
            correct_answer: step?.stepAnswer?.toString() || null,
            is_correct: isCorrect,
            hint_input: null,
            hint_answer: null,
            hint_is_correct: null,
            hints_finished: flattenedHints || [],
            variabilization: variabilization || {},
            lesson: lesson || null,
            course_name: courseName || null,
            knowledge_components: step?.knowledgeComponents || [],
            hint_type: hintType || null,
            dynamic_hint: dynamicHint || null,
        });

        try {
            const { error } = await this.client
                .from('problem_submissions')
                .insert(data);

            if (error) throw error;

            // Update BKT mastery for each knowledge component
            if (step?.knowledgeComponents && isCorrect !== null) {
                await this.updateSkillMastery(step.knowledgeComponents, isCorrect);
            }

            console.debug("✅ Logged submission successfully");
        } catch (err) {
            console.error("Failed to log submission:", err);
        }
    }

    /**
     * Log a hint scaffold interaction
     */
    async hintLog(
        hintInput,
        problemID,
        step,
        hint,
        isCorrect,
        hintsFinished,
        variabilization,
        lesson,
        courseName,
        hintType,
        dynamicHint,
        bioInfo
    ) {
        if (!DO_LOG_DATA || !this.isConfigured) return;

        const data = this.addMetaData({
            event_type: 'hintScaffoldLog',
            problem_id: problemID,
            step_id: step?.id || null,
            hint_id: hint?.id || null,
            input_value: null,
            correct_answer: null,
            is_correct: null,
            hint_input: hintInput?.toString() || null,
            hint_answer: hint?.hintAnswer?.toString() || null,
            hint_is_correct: isCorrect,
            hints_finished: hintsFinished || [],
            variabilization: variabilization || {},
            lesson: lesson || null,
            course_name: courseName || null,
            knowledge_components: step?.knowledgeComponents || [],
            hint_type: hintType || null,
            dynamic_hint: dynamicHint || null,
        });

        try {
            const { error } = await this.client
                .from('problem_submissions')
                .insert(data);

            if (error) throw error;
            console.debug("✅ Logged hint interaction");
        } catch (err) {
            console.error("Failed to log hint:", err);
        }
    }

    /**
     * Log when a problem is started
     */
    async startedProblem(problemID, courseName, lesson, lessonObjectives) {
        if (!DO_LOG_DATA || !this.isConfigured) return;

        console.debug(`Logging problem start: ${problemID}`);

        const data = this.addMetaData({
            event_type: 'problem_start',
            problem_id: problemID,
            course_name: courseName,
            lesson: lesson,
            // Store lesson objectives as variabilization
            variabilization: { lessonObjectives },
        });

        try {
            const { error } = await this.client
                .from('problem_submissions')
                .insert(data);

            if (error) throw error;
        } catch (err) {
            console.error("Failed to log problem start:", err);
        }
    }

    /**
     * Update BKT mastery for skills
     */
    async updateSkillMastery(knowledgeComponents, isCorrect) {
        if (!this.isConfigured || !knowledgeComponents?.length) return;

        for (const skillId of knowledgeComponents) {
            try {
                // Call the database function to update BKT
                const { data, error } = await this.client.rpc('update_bkt_mastery', {
                    p_oats_user_id: this.oats_user_id,
                    p_skill_id: skillId,
                    p_is_correct: isCorrect,
                });

                if (error) throw error;
                console.debug(`Updated mastery for ${skillId}:`, data);
            } catch (err) {
                console.error(`Failed to update mastery for ${skillId}:`, err);
            }
        }
    }

    /**
     * Get current skill mastery levels
     */
    async getSkillProgress() {
        if (!this.isConfigured) return {};

        try {
            const { data, error } = await this.client
                .from('skill_progress')
                .select('skill_id, prob_mastery, problems_attempted, problems_correct')
                .eq('oats_user_id', this.oats_user_id);

            if (error) throw error;

            // Convert to BKT params format
            return data.reduce((acc, row) => {
                acc[row.skill_id] = {
                    probMastery: parseFloat(row.prob_mastery),
                    problemsAttempted: row.problems_attempted,
                    problemsCorrect: row.problems_correct,
                };
                return acc;
            }, {});
        } catch (err) {
            console.error("Failed to get skill progress:", err);
            return {};
        }
    }

    /**
     * Save lesson progress
     */
    async saveLessonProgress(lessonId, progress) {
        if (!this.isConfigured) return;

        try {
            const { error } = await this.client
                .from('lesson_progress')
                .upsert({
                    oats_user_id: this.oats_user_id,
                    lesson_id: lessonId,
                    ...progress,
                    last_activity_at: new Date().toISOString(),
                }, {
                    onConflict: 'oats_user_id,lesson_id',
                });

            if (error) throw error;
            console.debug(`Saved progress for lesson ${lessonId}`);
        } catch (err) {
            console.error("Failed to save lesson progress:", err);
        }
    }

    /**
     * Log focus/blur events
     */
    async submitFocusChange(focusStatus) {
        if (!DO_LOG_DATA || !this.isConfigured) return;

        try {
            const { error } = await this.client
                .from('focus_events')
                .insert({
                    oats_user_id: this.oats_user_id,
                    focus_status: focusStatus,
                });

            if (error) throw error;
        } catch (err) {
            console.error("Failed to log focus change:", err);
        }
    }

    /**
     * Submit site log (errors, warnings)
     */
    async submitSiteLog(logType, logMessage, relevantInformation, problemID = 'n/a') {
        if (!this.isConfigured) return;

        const data = this.addMetaData({
            event_type: 'site_log',
            problem_id: problemID,
            variabilization: {
                logType,
                logMessage,
                relevantInformation,
            },
        });

        try {
            const { error } = await this.client
                .from('problem_submissions')
                .insert(data);

            if (error) throw error;
        } catch (err) {
            console.error("Failed to submit site log:", err);
        }
    }

    /**
     * Submit student feedback
     */
    async submitFeedback(
        problemID,
        feedback,
        problemFinished,
        variables,
        courseName,
        steps,
        lesson
    ) {
        if (!this.isConfigured) return;

        const data = {
            oats_user_id: this.oats_user_id,
            problem_id: problemID,
            feedback_text: feedback,
            problem_finished: problemFinished,
            lesson: lesson,
            course_name: courseName,
            variables: variables || {},
            steps: steps?.map(({
                answerType,
                id,
                stepAnswer,
                problemType,
                knowledgeComponents,
            }) => ({
                answerType,
                id,
                stepAnswer,
                problemType,
                knowledgeComponents,
            })) || [],
        };

        try {
            const { error } = await this.client
                .from('feedback')
                .insert(data);

            if (error) throw error;
            console.debug("✅ Feedback submitted");
        } catch (err) {
            console.error("Failed to submit feedback:", err);
        }
    }

    /**
     * Mouse logging (simplified - stores less data than Firebase version)
     */
    mouseLog(payload) {
        // Skip mouse logging to save bandwidth on mobile data
        // This is intentionally minimal for SA deployment
        console.debug("Mouse logging disabled for bandwidth optimization");
    }
}

export default Supabase;

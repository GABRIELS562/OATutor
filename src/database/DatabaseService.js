/**
 * DatabaseService - SQLite database layer using sql.js (WebAssembly)
 *
 * Provides local SQLite storage for:
 * - User preferences (including language)
 * - Progress tracking
 * - Gamification data
 * - Past papers metadata
 * - Video metadata
 * - Translated content
 *
 * Uses sql.js for browser-compatible SQLite via WebAssembly.
 * Schema designed for easy migration to PostgreSQL.
 */

import initSqlJs from 'sql.js';

// Storage key for persisting database
const DB_STORAGE_KEY = 'angelo_tutor_db';
const SCHEMA_VERSION = 1;

class DatabaseService {
    constructor() {
        this.db = null;
        this.SQL = null;
        this.isInitialized = false;
        this.initPromise = null;
    }

    /**
     * Initialize the database
     * Loads sql.js WASM and restores or creates database
     */
    async init() {
        if (this.isInitialized) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = this._doInit();
        return this.initPromise;
    }

    async _doInit() {
        try {
            // Load sql.js with WASM
            this.SQL = await initSqlJs({
                // Load WASM from CDN (can be self-hosted)
                locateFile: file => `https://sql.js.org/dist/${file}`
            });

            // Try to restore from localStorage
            const savedData = localStorage.getItem(DB_STORAGE_KEY);
            if (savedData) {
                try {
                    const uint8Array = new Uint8Array(
                        atob(savedData).split('').map(c => c.charCodeAt(0))
                    );
                    this.db = new this.SQL.Database(uint8Array);
                    console.debug('Database restored from localStorage');

                    // Check if migration needed
                    await this._checkMigrations();
                } catch (e) {
                    console.warn('Failed to restore database, creating new:', e);
                    this.db = new this.SQL.Database();
                    await this._initSchema();
                }
            } else {
                // Create new database
                this.db = new this.SQL.Database();
                await this._initSchema();
            }

            this.isInitialized = true;
            console.debug('DatabaseService initialized');
        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }

    /**
     * Initialize database schema
     */
    async _initSchema() {
        const schema = await this._getSchema();
        this.db.run(schema);
        this._save();
        console.debug('Database schema initialized');
    }

    /**
     * Get schema SQL
     */
    async _getSchema() {
        // Inline schema to avoid file loading issues
        return `
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'en',
    daily_goal TEXT DEFAULT 'regular',
    theme TEXT DEFAULT 'light',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, key)
);

-- UI translations
CREATE TABLE IF NOT EXISTS ui_translations (
    key TEXT NOT NULL,
    language TEXT NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (key, language)
);

-- Content translations
CREATE TABLE IF NOT EXISTS content_translations (
    content_id TEXT NOT NULL,
    content_type TEXT NOT NULL,
    language TEXT NOT NULL,
    field TEXT NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (content_id, content_type, language, field)
);

CREATE INDEX IF NOT EXISTS idx_content_translations_lang
    ON content_translations(language, content_type);

-- Past papers
CREATE TABLE IF NOT EXISTS past_papers (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    grade INTEGER NOT NULL,
    year INTEGER NOT NULL,
    paper_number INTEGER NOT NULL,
    exam_type TEXT NOT NULL,
    language TEXT NOT NULL,
    province TEXT,
    paper_path TEXT NOT NULL,
    memo_path TEXT,
    is_available INTEGER DEFAULT 1,
    file_size_bytes INTEGER,
    topics TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(subject, grade, year, paper_number, exam_type, language)
);

CREATE INDEX IF NOT EXISTS idx_past_papers_filter
    ON past_papers(subject, grade, year, language);

-- User downloaded papers
CREATE TABLE IF NOT EXISTS user_downloaded_papers (
    user_id TEXT NOT NULL,
    paper_id TEXT NOT NULL,
    downloaded_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, paper_id)
);

-- User stats
CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_problems_attempted INTEGER DEFAULT 0,
    total_problems_correct INTEGER DEFAULT 0,
    problems_without_hints INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    perfect_lessons INTEGER DEFAULT 0,
    fastest_solve_seconds INTEGER DEFAULT 0,
    maths_mastery REAL DEFAULT 0,
    science_mastery REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Streaks
CREATE TABLE IF NOT EXISTS user_streaks (
    user_id TEXT PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_practice_date TEXT,
    streak_freezes_available INTEGER DEFAULT 1,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Badges
CREATE TABLE IF NOT EXISTS user_badges (
    user_id TEXT NOT NULL,
    badge_id TEXT NOT NULL,
    earned_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, badge_id)
);

-- Daily activity
CREATE TABLE IF NOT EXISTS daily_activity (
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    problems_solved INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    lessons_worked_on TEXT,
    PRIMARY KEY (user_id, date)
);

-- Leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
    user_id TEXT PRIMARY KEY,
    display_name TEXT,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    weekly_xp INTEGER DEFAULT 0,
    monthly_xp INTEGER DEFAULT 0,
    last_updated TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_total_xp ON leaderboard(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_xp ON leaderboard(weekly_xp DESC);

-- Subject progress
CREATE TABLE IF NOT EXISTS subject_progress (
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    grade INTEGER NOT NULL,
    completion_percent REAL DEFAULT 0,
    mastery_percent REAL DEFAULT 0,
    total_time_seconds INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    lessons_total INTEGER DEFAULT 0,
    last_activity_at TEXT,
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, subject, grade)
);

-- Topic mastery
CREATE TABLE IF NOT EXISTS topic_mastery (
    user_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    grade INTEGER,
    prob_mastery REAL DEFAULT 0.1,
    problems_attempted INTEGER DEFAULT 0,
    problems_correct INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    last_practiced_at TEXT,
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, topic_id)
);

-- Lesson progress
CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    course_name TEXT,
    status TEXT DEFAULT 'not_started',
    completion_percent REAL DEFAULT 0,
    problems_completed INTEGER DEFAULT 0,
    problems_total INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    mastery REAL DEFAULT 0,
    started_at TEXT,
    completed_at TEXT,
    last_activity_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, lesson_id)
);

-- Quiz scores
CREATE TABLE IF NOT EXISTS quiz_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    quiz_type TEXT DEFAULT 'lesson',
    subject TEXT,
    grade INTEGER,
    score REAL NOT NULL,
    correct_answers INTEGER,
    total_questions INTEGER,
    time_taken_seconds INTEGER,
    completed_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quiz_scores_user ON quiz_scores(user_id);

-- Videos
CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    youtube_video_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    channel_name TEXT NOT NULL,
    channel_id TEXT,
    subject TEXT NOT NULL,
    grade INTEGER NOT NULL,
    topic_id TEXT,
    topic_name TEXT,
    duration_seconds INTEGER,
    thumbnail_url TEXT,
    language TEXT DEFAULT 'en',
    view_count INTEGER DEFAULT 0,
    rating REAL,
    tags TEXT,
    sort_order INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_videos_subject_grade ON videos(subject, grade);

-- User video history
CREATE TABLE IF NOT EXISTS user_video_history (
    user_id TEXT NOT NULL,
    video_id TEXT NOT NULL,
    watch_progress_seconds INTEGER DEFAULT 0,
    watch_count INTEGER DEFAULT 1,
    completed INTEGER DEFAULT 0,
    last_watched_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, video_id)
);

-- Video playlists
CREATE TABLE IF NOT EXISTS video_playlists (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    grade INTEGER,
    topic_id TEXT,
    channel_name TEXT,
    video_ids TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Schema version
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT DEFAULT (datetime('now')),
    description TEXT
);

INSERT OR IGNORE INTO schema_version (version, description)
VALUES (1, 'Initial schema');

-- =============================================================================
-- SUBSCRIPTIONS & ACCESS (Schema v2)
-- =============================================================================

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'ZAR',
    duration_days INTEGER NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    access_until TEXT NOT NULL,
    started_at TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_access ON user_subscriptions(user_id, access_until);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'ZAR',
    provider TEXT NOT NULL,
    provider_reference TEXT,
    status TEXT DEFAULT 'pending',
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payment_transactions(status);

-- =============================================================================
-- AI TUTOR USAGE
-- =============================================================================

-- AI tutor sessions
CREATE TABLE IF NOT EXISTS ai_tutor_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    subject TEXT,
    topic_id TEXT,
    problem_id TEXT,
    language TEXT DEFAULT 'en',
    created_at TEXT DEFAULT (datetime('now')),
    ended_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_ai_sessions_user ON ai_tutor_sessions(user_id);

-- AI tutor messages
CREATE TABLE IF NOT EXISTS ai_tutor_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT,
    token_count_input INTEGER DEFAULT 0,
    token_count_output INTEGER DEFAULT 0,
    model TEXT,
    provider TEXT,
    estimated_cost_usd REAL DEFAULT 0,
    billing_period TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_user ON ai_tutor_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_period ON ai_tutor_messages(user_id, billing_period);

-- AI usage summary per billing period
CREATE TABLE IF NOT EXISTS ai_usage_summary (
    user_id TEXT NOT NULL,
    billing_period TEXT NOT NULL,
    message_count INTEGER DEFAULT 0,
    total_input_tokens INTEGER DEFAULT 0,
    total_output_tokens INTEGER DEFAULT 0,
    estimated_cost_usd REAL DEFAULT 0,
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, billing_period)
);

-- AI response feedback
CREATE TABLE IF NOT EXISTS ai_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    is_helpful INTEGER,
    has_error INTEGER DEFAULT 0,
    feedback_text TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ai_feedback_message ON ai_feedback(message_id);

-- =============================================================================
-- ADMIN / CONFIG
-- =============================================================================

-- App configuration
CREATE TABLE IF NOT EXISTS app_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
    user_id TEXT PRIMARY KEY,
    role TEXT DEFAULT 'admin',
    created_at TEXT DEFAULT (datetime('now'))
);

-- Free content markers
CREATE TABLE IF NOT EXISTS free_content (
    content_type TEXT NOT NULL,
    content_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (content_type, content_id)
);

-- Seed default plans
INSERT OR IGNORE INTO subscription_plans (id, name, price_cents, currency, duration_days)
VALUES
    ('monthly', 'Monthly', 3000, 'ZAR', 30),
    ('annual', 'Annual', 30000, 'ZAR', 365);

-- Seed default config
INSERT OR IGNORE INTO app_config (key, value, description) VALUES
    ('ai_monthly_message_cap', '100', 'Max AI tutor messages per user per month'),
    ('ai_provider', 'groq', 'Active AI provider: groq, together, openrouter'),
    ('ai_model', 'llama-3.3-70b-versatile', 'Active AI model'),
    ('ai_cost_per_1k_input_tokens', '0.00005', 'Estimated cost per 1K input tokens (USD)'),
    ('ai_cost_per_1k_output_tokens', '0.00008', 'Estimated cost per 1K output tokens (USD)');

-- Seed one free sample paper and video
INSERT OR IGNORE INTO free_content (content_type, content_id) VALUES
    ('paper', 'math-gr12-2024-p1-nsc-en'),
    ('video', 'maths-gr12-trig-intro');

INSERT OR IGNORE INTO schema_version (version, description)
VALUES (2, 'Subscriptions, payments, AI tutor tracking');
        `;
    }

    /**
     * Check and apply migrations
     */
    async _checkMigrations() {
        try {
            const result = this.db.exec('SELECT MAX(version) as v FROM schema_version');
            const currentVersion = result[0]?.values[0]?.[0] || 0;

            if (currentVersion < SCHEMA_VERSION) {
                console.debug(`Migrating from version ${currentVersion} to ${SCHEMA_VERSION}`);
                // Apply migrations here as needed
                this.db.run(
                    'INSERT INTO schema_version (version, description) VALUES (?, ?)',
                    [SCHEMA_VERSION, 'Migration applied']
                );
                this._save();
            }
        } catch (e) {
            // Table might not exist, initialize schema
            await this._initSchema();
        }
    }

    /**
     * Save database to localStorage
     */
    _save() {
        if (!this.db) return;
        try {
            const data = this.db.export();
            const base64 = btoa(String.fromCharCode.apply(null, data));
            localStorage.setItem(DB_STORAGE_KEY, base64);
        } catch (e) {
            console.error('Failed to save database:', e);
        }
    }

    /**
     * Execute SQL and return results
     */
    exec(sql, params = []) {
        if (!this.db) throw new Error('Database not initialized');
        try {
            const stmt = this.db.prepare(sql);
            stmt.bind(params);

            const results = [];
            while (stmt.step()) {
                results.push(stmt.getAsObject());
            }
            stmt.free();

            this._save();
            return results;
        } catch (e) {
            console.error('SQL Error:', e, sql);
            throw e;
        }
    }

    /**
     * Execute SQL without returning results (INSERT, UPDATE, DELETE)
     */
    run(sql, params = []) {
        if (!this.db) throw new Error('Database not initialized');
        try {
            this.db.run(sql, params);
            this._save();
        } catch (e) {
            console.error('SQL Error:', e, sql);
            throw e;
        }
    }

    /**
     * Get single row
     */
    getOne(sql, params = []) {
        const results = this.exec(sql, params);
        return results[0] || null;
    }

    // =========================================================================
    // USER METHODS
    // =========================================================================

    /**
     * Get or create user
     */
    async getOrCreateUser(userId) {
        await this.init();
        let user = this.getOne('SELECT * FROM users WHERE id = ?', [userId]);

        if (!user) {
            this.run(
                'INSERT INTO users (id, created_at) VALUES (?, datetime("now"))',
                [userId]
            );
            user = this.getOne('SELECT * FROM users WHERE id = ?', [userId]);
        }
        return user;
    }

    /**
     * Update user preference
     */
    async updateUserPreference(userId, key, value) {
        await this.init();
        this.run(
            `INSERT INTO user_preferences (user_id, key, value, updated_at)
             VALUES (?, ?, ?, datetime('now'))
             ON CONFLICT(user_id, key) DO UPDATE SET value = ?, updated_at = datetime('now')`,
            [userId, key, value, value]
        );
    }

    /**
     * Get user preference
     */
    async getUserPreference(userId, key) {
        await this.init();
        const result = this.getOne(
            'SELECT value FROM user_preferences WHERE user_id = ? AND key = ?',
            [userId, key]
        );
        return result?.value;
    }

    /**
     * Set user language preference
     */
    async setUserLanguage(userId, language) {
        await this.init();
        this.run(
            `UPDATE users SET preferred_language = ?, updated_at = datetime('now') WHERE id = ?`,
            [language, userId]
        );
        await this.updateUserPreference(userId, 'language', language);
    }

    /**
     * Get user language preference
     */
    async getUserLanguage(userId) {
        await this.init();
        const user = this.getOne('SELECT preferred_language FROM users WHERE id = ?', [userId]);
        return user?.preferred_language || 'en';
    }

    // =========================================================================
    // PAST PAPERS METHODS
    // =========================================================================

    /**
     * Get papers with filters
     */
    async getPapers(filters = {}) {
        await this.init();

        let sql = 'SELECT * FROM past_papers WHERE 1=1';
        const params = [];

        if (filters.subject) {
            sql += ' AND subject = ?';
            params.push(filters.subject);
        }
        if (filters.grade) {
            sql += ' AND grade = ?';
            params.push(filters.grade);
        }
        if (filters.year) {
            sql += ' AND year = ?';
            params.push(filters.year);
        }
        if (filters.paper_number) {
            sql += ' AND paper_number = ?';
            params.push(filters.paper_number);
        }
        if (filters.language) {
            sql += ' AND language = ?';
            params.push(filters.language);
        }
        if (filters.exam_type) {
            sql += ' AND exam_type = ?';
            params.push(filters.exam_type);
        }
        if (filters.availableOnly) {
            sql += ' AND is_available = 1';
        }

        sql += ' ORDER BY year DESC, paper_number ASC';

        return this.exec(sql, params);
    }

    /**
     * Add paper metadata
     */
    async addPaper(paper) {
        await this.init();
        this.run(
            `INSERT OR REPLACE INTO past_papers
             (id, subject, grade, year, paper_number, exam_type, language, province,
              paper_path, memo_path, is_available, file_size_bytes, topics)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                paper.id,
                paper.subject,
                paper.grade,
                paper.year,
                paper.paper_number,
                paper.exam_type,
                paper.language,
                paper.province || null,
                paper.paper_path,
                paper.memo_path || null,
                paper.is_available ?? 1,
                paper.file_size_bytes || null,
                JSON.stringify(paper.topics || [])
            ]
        );
    }

    /**
     * Mark paper as downloaded
     */
    async markPaperDownloaded(userId, paperId) {
        await this.init();
        this.run(
            `INSERT OR REPLACE INTO user_downloaded_papers (user_id, paper_id, downloaded_at)
             VALUES (?, ?, datetime('now'))`,
            [userId, paperId]
        );
    }

    /**
     * Get downloaded papers for user
     */
    async getDownloadedPapers(userId) {
        await this.init();
        return this.exec(
            `SELECT p.* FROM past_papers p
             JOIN user_downloaded_papers d ON p.id = d.paper_id
             WHERE d.user_id = ?
             ORDER BY d.downloaded_at DESC`,
            [userId]
        );
    }

    // =========================================================================
    // GAMIFICATION METHODS
    // =========================================================================

    /**
     * Get or create user stats
     */
    async getOrCreateStats(userId) {
        await this.init();
        let stats = this.getOne('SELECT * FROM user_stats WHERE user_id = ?', [userId]);

        if (!stats) {
            this.run('INSERT INTO user_stats (user_id) VALUES (?)', [userId]);
            stats = this.getOne('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
        }
        return stats;
    }

    /**
     * Update user stats
     */
    async updateStats(userId, updates) {
        await this.init();
        const fields = Object.keys(updates);
        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const values = [...Object.values(updates), userId];

        this.run(
            `UPDATE user_stats SET ${setClause}, updated_at = datetime('now') WHERE user_id = ?`,
            values
        );
    }

    /**
     * Add XP
     */
    async addXP(userId, amount) {
        await this.init();
        this.run(
            `UPDATE user_stats
             SET total_xp = total_xp + ?, updated_at = datetime('now')
             WHERE user_id = ?`,
            [amount, userId]
        );

        // Update leaderboard
        const stats = await this.getOrCreateStats(userId);
        this.run(
            `INSERT INTO leaderboard (user_id, total_xp, weekly_xp, monthly_xp)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(user_id) DO UPDATE SET
             total_xp = ?, weekly_xp = weekly_xp + ?, monthly_xp = monthly_xp + ?,
             last_updated = datetime('now')`,
            [userId, stats.total_xp, amount, amount, stats.total_xp, amount, amount]
        );
    }

    /**
     * Get or create streak data
     */
    async getOrCreateStreak(userId) {
        await this.init();
        let streak = this.getOne('SELECT * FROM user_streaks WHERE user_id = ?', [userId]);

        if (!streak) {
            this.run('INSERT INTO user_streaks (user_id) VALUES (?)', [userId]);
            streak = this.getOne('SELECT * FROM user_streaks WHERE user_id = ?', [userId]);
        }
        return streak;
    }

    /**
     * Update streak
     */
    async updateStreak(userId, updates) {
        await this.init();
        const fields = Object.keys(updates);
        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const values = [...Object.values(updates), userId];

        this.run(
            `UPDATE user_streaks SET ${setClause}, updated_at = datetime('now') WHERE user_id = ?`,
            values
        );

        // Sync to leaderboard
        if (updates.current_streak !== undefined) {
            this.run(
                'UPDATE leaderboard SET current_streak = ? WHERE user_id = ?',
                [updates.current_streak, userId]
            );
        }
    }

    /**
     * Award badge
     */
    async awardBadge(userId, badgeId) {
        await this.init();
        this.run(
            `INSERT OR IGNORE INTO user_badges (user_id, badge_id, earned_at)
             VALUES (?, ?, datetime('now'))`,
            [userId, badgeId]
        );
    }

    /**
     * Get user badges
     */
    async getUserBadges(userId) {
        await this.init();
        return this.exec(
            'SELECT badge_id, earned_at FROM user_badges WHERE user_id = ? ORDER BY earned_at DESC',
            [userId]
        );
    }

    /**
     * Get leaderboard
     */
    async getLeaderboard(type = 'total', limit = 50) {
        await this.init();
        let orderBy = 'total_xp DESC';
        if (type === 'weekly') orderBy = 'weekly_xp DESC';
        if (type === 'streak') orderBy = 'current_streak DESC';

        return this.exec(
            `SELECT user_id, display_name, total_xp, level, current_streak, weekly_xp, monthly_xp
             FROM leaderboard
             WHERE total_xp > 0
             ORDER BY ${orderBy}
             LIMIT ?`,
            [limit]
        );
    }

    /**
     * Reset weekly/monthly leaderboard
     */
    async resetLeaderboardPeriod(period = 'weekly') {
        await this.init();
        const field = period === 'monthly' ? 'monthly_xp' : 'weekly_xp';
        this.run(`UPDATE leaderboard SET ${field} = 0`);
    }

    // =========================================================================
    // PROGRESS METHODS
    // =========================================================================

    /**
     * Update topic mastery
     */
    async updateTopicMastery(userId, topicId, isCorrect, subject, grade, timeSpent = 0) {
        await this.init();

        // BKT parameters
        const P_INIT = 0.1;
        const P_LEARN = 0.3;
        const P_GUESS = 0.2;
        const P_SLIP = 0.1;

        let mastery = this.getOne(
            'SELECT * FROM topic_mastery WHERE user_id = ? AND topic_id = ?',
            [userId, topicId]
        );

        let probMastery = mastery?.prob_mastery || P_INIT;

        // BKT update
        if (isCorrect) {
            const pCorrectGivenKnown = 1 - P_SLIP;
            const pCorrectGivenUnknown = P_GUESS;
            const pCorrect = probMastery * pCorrectGivenKnown + (1 - probMastery) * pCorrectGivenUnknown;
            probMastery = (probMastery * pCorrectGivenKnown) / pCorrect;
        } else {
            const pIncorrectGivenKnown = P_SLIP;
            const pIncorrectGivenUnknown = 1 - P_GUESS;
            const pIncorrect = probMastery * pIncorrectGivenKnown + (1 - probMastery) * pIncorrectGivenUnknown;
            probMastery = (probMastery * pIncorrectGivenKnown) / pIncorrect;
        }

        // Apply learning
        probMastery = probMastery + (1 - probMastery) * P_LEARN;

        this.run(
            `INSERT INTO topic_mastery (user_id, topic_id, subject, grade, prob_mastery, problems_attempted, problems_correct, time_spent_seconds, last_practiced_at)
             VALUES (?, ?, ?, ?, ?, 1, ?, ?, datetime('now'))
             ON CONFLICT(user_id, topic_id) DO UPDATE SET
             prob_mastery = ?,
             problems_attempted = problems_attempted + 1,
             problems_correct = problems_correct + ?,
             time_spent_seconds = time_spent_seconds + ?,
             last_practiced_at = datetime('now'),
             updated_at = datetime('now')`,
            [userId, topicId, subject, grade, probMastery, isCorrect ? 1 : 0, timeSpent, probMastery, isCorrect ? 1 : 0, timeSpent]
        );
    }

    /**
     * Get topic mastery for user
     */
    async getTopicMastery(userId, subject = null, grade = null) {
        await this.init();

        let sql = 'SELECT * FROM topic_mastery WHERE user_id = ?';
        const params = [userId];

        if (subject) {
            sql += ' AND subject = ?';
            params.push(subject);
        }
        if (grade) {
            sql += ' AND grade = ?';
            params.push(grade);
        }

        sql += ' ORDER BY last_practiced_at DESC';

        return this.exec(sql, params);
    }

    /**
     * Update lesson progress
     */
    async updateLessonProgress(userId, lessonId, updates) {
        await this.init();

        const existing = this.getOne(
            'SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?',
            [userId, lessonId]
        );

        if (!existing) {
            this.run(
                `INSERT INTO lesson_progress (user_id, lesson_id, course_name, status, started_at)
                 VALUES (?, ?, ?, 'in_progress', datetime('now'))`,
                [userId, lessonId, updates.course_name || null]
            );
        }

        const fields = Object.keys(updates);
        if (fields.length > 0) {
            const setClause = fields.map(f => `${f} = ?`).join(', ');
            const values = [...Object.values(updates), userId, lessonId];

            this.run(
                `UPDATE lesson_progress SET ${setClause}, last_activity_at = datetime('now') WHERE user_id = ? AND lesson_id = ?`,
                values
            );
        }
    }

    /**
     * Get lesson progress
     */
    async getLessonProgress(userId, lessonId = null) {
        await this.init();

        if (lessonId) {
            return this.getOne(
                'SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?',
                [userId, lessonId]
            );
        }

        return this.exec(
            'SELECT * FROM lesson_progress WHERE user_id = ? ORDER BY last_activity_at DESC',
            [userId]
        );
    }

    /**
     * Save quiz score
     */
    async saveQuizScore(userId, quizId, score, details = {}) {
        await this.init();
        this.run(
            `INSERT INTO quiz_scores (user_id, quiz_id, quiz_type, subject, grade, score, correct_answers, total_questions, time_taken_seconds)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                quizId,
                details.quiz_type || 'lesson',
                details.subject || null,
                details.grade || null,
                score,
                details.correct_answers || null,
                details.total_questions || null,
                details.time_taken_seconds || null
            ]
        );
    }

    /**
     * Get quiz history
     */
    async getQuizHistory(userId, limit = 50) {
        await this.init();
        return this.exec(
            `SELECT * FROM quiz_scores WHERE user_id = ? ORDER BY completed_at DESC LIMIT ?`,
            [userId, limit]
        );
    }

    // =========================================================================
    // VIDEO METHODS
    // =========================================================================

    /**
     * Get videos with filters
     */
    async getVideos(filters = {}) {
        await this.init();

        let sql = 'SELECT * FROM videos WHERE 1=1';
        const params = [];

        if (filters.subject) {
            sql += ' AND subject = ?';
            params.push(filters.subject);
        }
        if (filters.grade) {
            sql += ' AND grade = ?';
            params.push(filters.grade);
        }
        if (filters.topic_id) {
            sql += ' AND topic_id = ?';
            params.push(filters.topic_id);
        }
        if (filters.language) {
            sql += ' AND language = ?';
            params.push(filters.language);
        }
        if (filters.featured) {
            sql += ' AND is_featured = 1';
        }

        sql += ' ORDER BY sort_order ASC, view_count DESC';

        if (filters.limit) {
            sql += ' LIMIT ?';
            params.push(filters.limit);
        }

        return this.exec(sql, params);
    }

    /**
     * Add video
     */
    async addVideo(video) {
        await this.init();
        this.run(
            `INSERT OR REPLACE INTO videos
             (id, youtube_video_id, title, description, channel_name, channel_id,
              subject, grade, topic_id, topic_name, duration_seconds, thumbnail_url,
              language, tags, sort_order, is_featured)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                video.id,
                video.youtube_video_id,
                video.title,
                video.description || null,
                video.channel_name,
                video.channel_id || null,
                video.subject,
                video.grade,
                video.topic_id || null,
                video.topic_name || null,
                video.duration_seconds || null,
                video.thumbnail_url || null,
                video.language || 'en',
                JSON.stringify(video.tags || []),
                video.sort_order || 0,
                video.is_featured ? 1 : 0
            ]
        );
    }

    /**
     * Record video watch
     */
    async recordVideoWatch(userId, videoId, progressSeconds = 0, completed = false) {
        await this.init();

        this.run(
            `INSERT INTO user_video_history (user_id, video_id, watch_progress_seconds, completed, watch_count)
             VALUES (?, ?, ?, ?, 1)
             ON CONFLICT(user_id, video_id) DO UPDATE SET
             watch_progress_seconds = ?,
             completed = MAX(completed, ?),
             watch_count = watch_count + 1,
             last_watched_at = datetime('now')`,
            [userId, videoId, progressSeconds, completed ? 1 : 0, progressSeconds, completed ? 1 : 0]
        );

        // Increment view count
        this.run('UPDATE videos SET view_count = view_count + 1 WHERE id = ?', [videoId]);
    }

    /**
     * Get video playlists
     */
    async getPlaylists(filters = {}) {
        await this.init();

        let sql = 'SELECT * FROM video_playlists WHERE 1=1';
        const params = [];

        if (filters.subject) {
            sql += ' AND subject = ?';
            params.push(filters.subject);
        }
        if (filters.grade) {
            sql += ' AND grade = ?';
            params.push(filters.grade);
        }

        sql += ' ORDER BY sort_order ASC';

        return this.exec(sql, params);
    }

    // =========================================================================
    // TRANSLATION METHODS
    // =========================================================================

    /**
     * Get translated content
     */
    async getTranslation(contentId, contentType, language, field) {
        await this.init();
        const result = this.getOne(
            `SELECT value FROM content_translations
             WHERE content_id = ? AND content_type = ? AND language = ? AND field = ?`,
            [contentId, contentType, language, field]
        );
        return result?.value;
    }

    /**
     * Set translated content
     */
    async setTranslation(contentId, contentType, language, field, value) {
        await this.init();
        this.run(
            `INSERT INTO content_translations (content_id, content_type, language, field, value)
             VALUES (?, ?, ?, ?, ?)
             ON CONFLICT(content_id, content_type, language, field)
             DO UPDATE SET value = ?, updated_at = datetime('now')`,
            [contentId, contentType, language, field, value, value]
        );
    }

    /**
     * Get all translations for content
     */
    async getContentTranslations(contentId, contentType, language) {
        await this.init();
        const results = this.exec(
            `SELECT field, value FROM content_translations
             WHERE content_id = ? AND content_type = ? AND language = ?`,
            [contentId, contentType, language]
        );

        return results.reduce((acc, row) => {
            acc[row.field] = row.value;
            return acc;
        }, {});
    }

    // =========================================================================
    // MIGRATION HELPERS
    // =========================================================================

    /**
     * Migrate data from localStorage
     */
    async migrateFromLocalStorage(userId) {
        await this.init();

        // Migrate gamification stats
        const storedStats = localStorage.getItem('angelo_user_stats');
        if (storedStats) {
            try {
                const stats = JSON.parse(storedStats);
                await this.getOrCreateStats(userId);
                await this.updateStats(userId, {
                    total_xp: stats.totalXP || 0,
                    level: stats.level || 1,
                    total_problems_attempted: stats.totalProblemsAttempted || 0,
                    total_problems_correct: stats.totalProblemsCorrect || 0,
                    problems_without_hints: stats.problemsWithoutHints || 0,
                    lessons_completed: stats.lessonsCompleted || 0,
                    perfect_lessons: stats.perfectLessons || 0,
                    maths_mastery: stats.mathsMastery || 0,
                    science_mastery: stats.scienceMastery || 0,
                });
                console.debug('Migrated user stats from localStorage');
            } catch (e) {
                console.warn('Failed to migrate stats:', e);
            }
        }

        // Migrate badges
        const storedBadges = localStorage.getItem('angelo_badges');
        if (storedBadges) {
            try {
                const badges = JSON.parse(storedBadges);
                for (const badgeId of badges) {
                    await this.awardBadge(userId, badgeId);
                }
                console.debug('Migrated badges from localStorage');
            } catch (e) {
                console.warn('Failed to migrate badges:', e);
            }
        }

        // Migrate streak data
        const storedStreak = localStorage.getItem('angelo_streak_data');
        if (storedStreak) {
            try {
                const streak = JSON.parse(storedStreak);
                await this.getOrCreateStreak(userId);
                await this.updateStreak(userId, {
                    current_streak: streak.currentStreak || 0,
                    longest_streak: streak.longestStreak || 0,
                    last_practice_date: streak.lastPracticeDate || null,
                    streak_freezes_available: streak.streakFreezesAvailable || 1,
                });
                console.debug('Migrated streak data from localStorage');
            } catch (e) {
                console.warn('Failed to migrate streak:', e);
            }
        }

        // Migrate language preference
        const storedLang = localStorage.getItem('platformLanguage');
        if (storedLang) {
            await this.setUserLanguage(userId, storedLang);
        }
    }

    /**
     * Export database for backup
     */
    exportDatabase() {
        if (!this.db) return null;
        return this.db.export();
    }

    /**
     * Import database from backup
     */
    async importDatabase(data) {
        await this.init();
        try {
            this.db = new this.SQL.Database(data);
            this._save();
            console.debug('Database imported successfully');
        } catch (e) {
            console.error('Failed to import database:', e);
            throw e;
        }
    }

    // =========================================================================
    // SUBSCRIPTION METHODS
    // =========================================================================

    /**
     * Check if user has active subscription
     */
    async hasActiveSubscription(userId) {
        await this.init();
        const result = this.getOne(
            `SELECT * FROM user_subscriptions
             WHERE user_id = ? AND status = 'active' AND access_until > datetime('now')
             ORDER BY access_until DESC LIMIT 1`,
            [userId]
        );
        return !!result;
    }

    /**
     * Get user's current subscription
     */
    async getUserSubscription(userId) {
        await this.init();
        return this.getOne(
            `SELECT us.*, sp.name as plan_name, sp.price_cents, sp.duration_days
             FROM user_subscriptions us
             JOIN subscription_plans sp ON us.plan_id = sp.id
             WHERE us.user_id = ? AND us.status = 'active'
             ORDER BY us.access_until DESC LIMIT 1`,
            [userId]
        );
    }

    /**
     * Get subscription plans
     */
    async getSubscriptionPlans() {
        await this.init();
        return this.exec('SELECT * FROM subscription_plans WHERE is_active = 1');
    }

    /**
     * Create or extend subscription
     */
    async extendSubscription(userId, planId, paymentId = null) {
        await this.init();

        // Get plan details
        const plan = this.getOne('SELECT * FROM subscription_plans WHERE id = ?', [planId]);
        if (!plan) throw new Error('Plan not found');

        // Get current access_until or use now
        const current = this.getOne(
            `SELECT access_until FROM user_subscriptions
             WHERE user_id = ? AND status = 'active' AND access_until > datetime('now')
             ORDER BY access_until DESC LIMIT 1`,
            [userId]
        );

        const baseDate = current?.access_until || new Date().toISOString();
        const newAccessUntil = new Date(new Date(baseDate).getTime() + plan.duration_days * 24 * 60 * 60 * 1000).toISOString();

        this.run(
            `INSERT INTO user_subscriptions (user_id, plan_id, status, access_until, started_at)
             VALUES (?, ?, 'active', ?, datetime('now'))`,
            [userId, planId, newAccessUntil]
        );

        return { access_until: newAccessUntil, plan };
    }

    /**
     * Get access expiry date
     */
    async getAccessUntil(userId) {
        await this.init();
        const result = this.getOne(
            `SELECT access_until FROM user_subscriptions
             WHERE user_id = ? AND status = 'active'
             ORDER BY access_until DESC LIMIT 1`,
            [userId]
        );
        return result?.access_until || null;
    }

    // =========================================================================
    // PAYMENT METHODS
    // =========================================================================

    /**
     * Create payment transaction
     */
    async createPayment(userId, planId, provider, amountCents, currency = 'ZAR') {
        await this.init();
        this.run(
            `INSERT INTO payment_transactions (user_id, plan_id, amount_cents, currency, provider, status)
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [userId, planId, amountCents, currency, provider]
        );

        // Get the inserted ID
        const result = this.getOne('SELECT last_insert_rowid() as id');
        return result.id;
    }

    /**
     * Update payment status
     */
    async updatePaymentStatus(paymentId, status, providerReference = null, metadata = null) {
        await this.init();
        this.run(
            `UPDATE payment_transactions
             SET status = ?, provider_reference = ?, metadata = ?,
                 completed_at = CASE WHEN ? = 'completed' THEN datetime('now') ELSE completed_at END,
                 updated_at = datetime('now')
             WHERE id = ?`,
            [status, providerReference, metadata ? JSON.stringify(metadata) : null, status, paymentId]
        );
    }

    /**
     * Get payment by ID
     */
    async getPayment(paymentId) {
        await this.init();
        return this.getOne('SELECT * FROM payment_transactions WHERE id = ?', [paymentId]);
    }

    /**
     * Get user's payment history
     */
    async getPaymentHistory(userId, limit = 20) {
        await this.init();
        return this.exec(
            `SELECT pt.*, sp.name as plan_name
             FROM payment_transactions pt
             JOIN subscription_plans sp ON pt.plan_id = sp.id
             WHERE pt.user_id = ?
             ORDER BY pt.created_at DESC LIMIT ?`,
            [userId, limit]
        );
    }

    // =========================================================================
    // AI TUTOR METHODS
    // =========================================================================

    /**
     * Get current billing period (YYYY-MM)
     */
    getCurrentBillingPeriod() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    /**
     * Get user's AI message count for current period
     */
    async getAIMessageCount(userId, billingPeriod = null) {
        await this.init();
        const period = billingPeriod || this.getCurrentBillingPeriod();
        const result = this.getOne(
            'SELECT message_count FROM ai_usage_summary WHERE user_id = ? AND billing_period = ?',
            [userId, period]
        );
        return result?.message_count || 0;
    }

    /**
     * Check if user has reached AI message cap
     */
    async hasReachedAICap(userId) {
        await this.init();
        const cap = await this.getConfig('ai_monthly_message_cap');
        const count = await this.getAIMessageCount(userId);
        return count >= parseInt(cap || '100');
    }

    /**
     * Create AI tutor session
     */
    async createAISession(userId, subject = null, topicId = null, problemId = null, language = 'en') {
        await this.init();
        this.run(
            `INSERT INTO ai_tutor_sessions (user_id, subject, topic_id, problem_id, language)
             VALUES (?, ?, ?, ?, ?)`,
            [userId, subject, topicId, problemId, language]
        );
        const result = this.getOne('SELECT last_insert_rowid() as id');
        return result.id;
    }

    /**
     * Record AI message and update usage
     */
    async recordAIMessage(userId, sessionId, role, content, tokenInput = 0, tokenOutput = 0, model = null, provider = null) {
        await this.init();
        const billingPeriod = this.getCurrentBillingPeriod();

        // Calculate estimated cost
        const costPerKInput = parseFloat(await this.getConfig('ai_cost_per_1k_input_tokens') || '0.00005');
        const costPerKOutput = parseFloat(await this.getConfig('ai_cost_per_1k_output_tokens') || '0.00008');
        const estimatedCost = (tokenInput / 1000 * costPerKInput) + (tokenOutput / 1000 * costPerKOutput);

        // Insert message
        this.run(
            `INSERT INTO ai_tutor_messages
             (session_id, user_id, role, content, token_count_input, token_count_output, model, provider, estimated_cost_usd, billing_period)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [sessionId, userId, role, content?.substring(0, 500), tokenInput, tokenOutput, model, provider, estimatedCost, billingPeriod]
        );

        const messageResult = this.getOne('SELECT last_insert_rowid() as id');
        const messageId = messageResult.id;

        // Update usage summary (only count assistant messages)
        if (role === 'assistant') {
            this.run(
                `INSERT INTO ai_usage_summary (user_id, billing_period, message_count, total_input_tokens, total_output_tokens, estimated_cost_usd)
                 VALUES (?, ?, 1, ?, ?, ?)
                 ON CONFLICT(user_id, billing_period) DO UPDATE SET
                 message_count = message_count + 1,
                 total_input_tokens = total_input_tokens + ?,
                 total_output_tokens = total_output_tokens + ?,
                 estimated_cost_usd = estimated_cost_usd + ?,
                 updated_at = datetime('now')`,
                [userId, billingPeriod, tokenInput, tokenOutput, estimatedCost, tokenInput, tokenOutput, estimatedCost]
            );
        }

        return messageId;
    }

    /**
     * Record AI feedback
     */
    async recordAIFeedback(messageId, userId, isHelpful, hasError = false, feedbackText = null) {
        await this.init();
        this.run(
            `INSERT INTO ai_feedback (message_id, user_id, is_helpful, has_error, feedback_text)
             VALUES (?, ?, ?, ?, ?)`,
            [messageId, userId, isHelpful ? 1 : 0, hasError ? 1 : 0, feedbackText]
        );
    }

    /**
     * Get AI usage summary for user
     */
    async getAIUsageSummary(userId, billingPeriod = null) {
        await this.init();
        const period = billingPeriod || this.getCurrentBillingPeriod();
        return this.getOne(
            'SELECT * FROM ai_usage_summary WHERE user_id = ? AND billing_period = ?',
            [userId, period]
        );
    }

    // =========================================================================
    // ADMIN / CONFIG METHODS
    // =========================================================================

    /**
     * Get config value
     */
    async getConfig(key) {
        await this.init();
        const result = this.getOne('SELECT value FROM app_config WHERE key = ?', [key]);
        return result?.value;
    }

    /**
     * Set config value
     */
    async setConfig(key, value, description = null) {
        await this.init();
        this.run(
            `INSERT INTO app_config (key, value, description)
             VALUES (?, ?, ?)
             ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')`,
            [key, value, description, value]
        );
    }

    /**
     * Get all config
     */
    async getAllConfig() {
        await this.init();
        return this.exec('SELECT * FROM app_config');
    }

    /**
     * Check if user is admin
     */
    async isAdmin(userId) {
        await this.init();
        const result = this.getOne('SELECT * FROM admin_users WHERE user_id = ?', [userId]);
        return !!result;
    }

    /**
     * Add admin user
     */
    async addAdmin(userId, role = 'admin') {
        await this.init();
        this.run(
            'INSERT OR IGNORE INTO admin_users (user_id, role) VALUES (?, ?)',
            [userId, role]
        );
    }

    /**
     * Check if content is free
     */
    async isFreeContent(contentType, contentId) {
        await this.init();
        const result = this.getOne(
            'SELECT * FROM free_content WHERE content_type = ? AND content_id = ?',
            [contentType, contentId]
        );
        return !!result;
    }

    /**
     * Get free content IDs
     */
    async getFreeContent(contentType = null) {
        await this.init();
        if (contentType) {
            return this.exec('SELECT content_id FROM free_content WHERE content_type = ?', [contentType]);
        }
        return this.exec('SELECT * FROM free_content');
    }

    /**
     * Admin: Get cost dashboard data
     */
    async getAdminCostDashboard(billingPeriod = null) {
        await this.init();
        const period = billingPeriod || this.getCurrentBillingPeriod();

        // Total AI messages and cost
        const aiStats = this.getOne(
            `SELECT
                SUM(message_count) as total_messages,
                SUM(total_input_tokens) as total_input_tokens,
                SUM(total_output_tokens) as total_output_tokens,
                SUM(estimated_cost_usd) as total_cost_usd
             FROM ai_usage_summary WHERE billing_period = ?`,
            [period]
        );

        // Active subscribers
        const subStats = this.getOne(
            `SELECT COUNT(DISTINCT user_id) as active_subscribers
             FROM user_subscriptions
             WHERE status = 'active' AND access_until > datetime('now')`
        );

        // Completed payments this period
        const paymentStats = this.getOne(
            `SELECT
                COUNT(*) as total_payments,
                SUM(amount_cents) as total_revenue_cents
             FROM payment_transactions
             WHERE status = 'completed' AND strftime('%Y-%m', completed_at) = ?`,
            [period]
        );

        // Feedback summary
        const feedbackStats = this.getOne(
            `SELECT
                COUNT(*) as total_feedback,
                SUM(CASE WHEN is_helpful = 1 THEN 1 ELSE 0 END) as helpful_count,
                SUM(CASE WHEN has_error = 1 THEN 1 ELSE 0 END) as error_reports
             FROM ai_feedback
             WHERE strftime('%Y-%m', created_at) = ?`,
            [period]
        );

        return {
            billing_period: period,
            ai: {
                total_messages: aiStats?.total_messages || 0,
                total_input_tokens: aiStats?.total_input_tokens || 0,
                total_output_tokens: aiStats?.total_output_tokens || 0,
                total_cost_usd: aiStats?.total_cost_usd || 0,
            },
            subscriptions: {
                active_subscribers: subStats?.active_subscribers || 0,
            },
            payments: {
                total_payments: paymentStats?.total_payments || 0,
                total_revenue_zar: (paymentStats?.total_revenue_cents || 0) / 100,
            },
            feedback: {
                total_feedback: feedbackStats?.total_feedback || 0,
                helpful_count: feedbackStats?.helpful_count || 0,
                error_reports: feedbackStats?.error_reports || 0,
            },
            unit_economics: {
                avg_cost_per_subscriber_usd: subStats?.active_subscribers > 0
                    ? (aiStats?.total_cost_usd || 0) / subStats.active_subscribers
                    : 0,
            },
        };
    }
}

// Singleton instance
const db = new DatabaseService();
export default db;

-- ============================================================================
-- Angelo Tutoring - SQLite Database Schema
-- ============================================================================
-- This schema is designed for SQLite but uses standard SQL for easy
-- migration to PostgreSQL. Avoid SQLite-only features where possible.
-- ============================================================================

-- ============================================================================
-- USER & PREFERENCES
-- ============================================================================

-- Users table (local user identification)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,                          -- UUID, matches angelo_user_id
    display_name TEXT,                            -- Optional display name
    avatar_url TEXT,                              -- Optional avatar
    preferred_language TEXT DEFAULT 'en',         -- 'en' or 'af'
    daily_goal TEXT DEFAULT 'regular',            -- casual, regular, serious, intense
    theme TEXT DEFAULT 'light',                   -- light or dark
    created_at TEXT DEFAULT (datetime('now')),    -- ISO 8601 timestamp
    updated_at TEXT DEFAULT (datetime('now'))
);

-- User preferences (key-value for extensibility)
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- INTERNATIONALIZATION (i18n)
-- ============================================================================

-- UI translations (loaded from JSON files, cached in DB for offline)
CREATE TABLE IF NOT EXISTS ui_translations (
    key TEXT NOT NULL,                            -- e.g., 'problem.Submit'
    language TEXT NOT NULL,                       -- 'en' or 'af'
    value TEXT NOT NULL,                          -- Translated string
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (key, language)
);

-- Content translations (lessons, questions, etc.)
CREATE TABLE IF NOT EXISTS content_translations (
    content_id TEXT NOT NULL,                     -- Reference to content (lesson_id, problem_id)
    content_type TEXT NOT NULL,                   -- 'lesson', 'problem', 'hint', 'topic'
    language TEXT NOT NULL,                       -- 'en' or 'af'
    field TEXT NOT NULL,                          -- 'title', 'description', 'body', etc.
    value TEXT NOT NULL,                          -- Translated content
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (content_id, content_type, language, field)
);

-- Index for fast language-based queries
CREATE INDEX IF NOT EXISTS idx_content_translations_lang
    ON content_translations(language, content_type);

-- ============================================================================
-- PAST PAPERS
-- ============================================================================

-- Past papers metadata (PDFs stored on filesystem)
CREATE TABLE IF NOT EXISTS past_papers (
    id TEXT PRIMARY KEY,                          -- Unique paper ID
    subject TEXT NOT NULL,                        -- 'mathematics' or 'physical_sciences'
    grade INTEGER NOT NULL,                       -- 10, 11, or 12
    year INTEGER NOT NULL,                        -- 2009-2025
    paper_number INTEGER NOT NULL,                -- 1 or 2 (P1/P2)
    exam_type TEXT NOT NULL,                      -- 'nsc', 'ieb', 'provincial', 'supplementary'
    language TEXT NOT NULL,                       -- 'en' or 'af'
    province TEXT,                                -- Province for provincial papers
    paper_path TEXT NOT NULL,                     -- Relative path: /papers/mathematics/grade12/2024_p1_en.pdf
    memo_path TEXT,                               -- Relative path to memo PDF (nullable)
    is_available INTEGER DEFAULT 1,               -- 1 = available, 0 = not yet uploaded
    file_size_bytes INTEGER,                      -- File size for download progress
    topics TEXT,                                  -- JSON array of topic tags
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),

    -- Ensure unique papers
    UNIQUE(subject, grade, year, paper_number, exam_type, language)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_past_papers_subject ON past_papers(subject);
CREATE INDEX IF NOT EXISTS idx_past_papers_grade ON past_papers(grade);
CREATE INDEX IF NOT EXISTS idx_past_papers_year ON past_papers(year);
CREATE INDEX IF NOT EXISTS idx_past_papers_language ON past_papers(language);
CREATE INDEX IF NOT EXISTS idx_past_papers_filter
    ON past_papers(subject, grade, year, language);

-- User's downloaded papers tracking
CREATE TABLE IF NOT EXISTS user_downloaded_papers (
    user_id TEXT NOT NULL,
    paper_id TEXT NOT NULL,
    downloaded_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, paper_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (paper_id) REFERENCES past_papers(id) ON DELETE CASCADE
);

-- ============================================================================
-- GAMIFICATION
-- ============================================================================

-- User stats (XP, levels, etc.)
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
    maths_mastery REAL DEFAULT 0,                 -- 0.0 to 1.0
    science_mastery REAL DEFAULT 0,               -- 0.0 to 1.0
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Streaks
CREATE TABLE IF NOT EXISTS user_streaks (
    user_id TEXT PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_practice_date TEXT,                      -- ISO 8601 date (YYYY-MM-DD)
    streak_freezes_available INTEGER DEFAULT 1,
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Badges earned
CREATE TABLE IF NOT EXISTS user_badges (
    user_id TEXT NOT NULL,
    badge_id TEXT NOT NULL,                       -- e.g., 'first_step', 'week_warrior'
    earned_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Daily activity tracking
CREATE TABLE IF NOT EXISTS daily_activity (
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,                           -- ISO 8601 date (YYYY-MM-DD)
    xp_earned INTEGER DEFAULT 0,
    problems_solved INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    lessons_worked_on TEXT,                       -- JSON array of lesson IDs
    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Leaderboard (aggregated for performance)
CREATE TABLE IF NOT EXISTS leaderboard (
    user_id TEXT PRIMARY KEY,
    display_name TEXT,                            -- Anonymous-friendly name
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    weekly_xp INTEGER DEFAULT 0,                  -- Reset weekly
    monthly_xp INTEGER DEFAULT 0,                 -- Reset monthly
    last_updated TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_xp ON leaderboard(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_xp ON leaderboard(weekly_xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_streak ON leaderboard(current_streak DESC);

-- ============================================================================
-- PROGRESS TRACKING
-- ============================================================================

-- Subject progress
CREATE TABLE IF NOT EXISTS subject_progress (
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,                        -- 'mathematics' or 'physical_sciences'
    grade INTEGER NOT NULL,                       -- 10, 11, or 12
    completion_percent REAL DEFAULT 0,            -- 0.0 to 100.0
    mastery_percent REAL DEFAULT 0,               -- 0.0 to 100.0
    total_time_seconds INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    lessons_total INTEGER DEFAULT 0,
    last_activity_at TEXT,
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, subject, grade),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Topic/skill mastery (BKT-based)
CREATE TABLE IF NOT EXISTS topic_mastery (
    user_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,                       -- Knowledge component ID
    subject TEXT NOT NULL,
    grade INTEGER,
    prob_mastery REAL DEFAULT 0.1,                -- BKT probability of mastery
    problems_attempted INTEGER DEFAULT 0,
    problems_correct INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    last_practiced_at TEXT,
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, topic_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Lesson progress
CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    course_name TEXT,
    status TEXT DEFAULT 'not_started',            -- 'not_started', 'in_progress', 'completed'
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
    PRIMARY KEY (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Quiz/assessment scores
CREATE TABLE IF NOT EXISTS quiz_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,         -- Auto-increment for SQLite
    user_id TEXT NOT NULL,
    quiz_id TEXT NOT NULL,                        -- Lesson ID or custom quiz ID
    quiz_type TEXT DEFAULT 'lesson',              -- 'lesson', 'mock_test', 'practice'
    subject TEXT,
    grade INTEGER,
    score REAL NOT NULL,                          -- 0.0 to 100.0
    correct_answers INTEGER,
    total_questions INTEGER,
    time_taken_seconds INTEGER,
    completed_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quiz_scores_user ON quiz_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_scores_date ON quiz_scores(completed_at);

-- ============================================================================
-- VIDEO LECTURES
-- ============================================================================

-- Video metadata (YouTube videos, never download/rehost)
CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,                          -- Internal video ID
    youtube_video_id TEXT NOT NULL,               -- YouTube video ID
    title TEXT NOT NULL,
    description TEXT,
    channel_name TEXT NOT NULL,
    channel_id TEXT,
    subject TEXT NOT NULL,                        -- 'mathematics' or 'physical_sciences'
    grade INTEGER NOT NULL,                       -- 10, 11, or 12
    topic_id TEXT,                                -- Links to topic/skill
    topic_name TEXT,                              -- Human-readable topic
    duration_seconds INTEGER,
    thumbnail_url TEXT,
    language TEXT DEFAULT 'en',                   -- 'en' or 'af'
    view_count INTEGER DEFAULT 0,                 -- Our platform views
    rating REAL,                                  -- Average user rating
    tags TEXT,                                    -- JSON array of tags
    sort_order INTEGER DEFAULT 0,                 -- For manual ordering
    is_featured INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for video queries
CREATE INDEX IF NOT EXISTS idx_videos_subject_grade ON videos(subject, grade);
CREATE INDEX IF NOT EXISTS idx_videos_topic ON videos(topic_id);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(is_featured);

-- User video watch history
CREATE TABLE IF NOT EXISTS user_video_history (
    user_id TEXT NOT NULL,
    video_id TEXT NOT NULL,
    watch_progress_seconds INTEGER DEFAULT 0,     -- Where they left off
    watch_count INTEGER DEFAULT 1,
    completed INTEGER DEFAULT 0,                  -- 1 if watched >90%
    last_watched_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, video_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- Video playlists/collections
CREATE TABLE IF NOT EXISTS video_playlists (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    grade INTEGER,
    topic_id TEXT,
    channel_name TEXT,
    video_ids TEXT NOT NULL,                      -- JSON array of video IDs in order
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================================
-- MIGRATION HELPERS
-- ============================================================================

-- Schema version for migrations
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT DEFAULT (datetime('now')),
    description TEXT
);

-- Insert initial version
INSERT OR IGNORE INTO schema_version (version, description)
VALUES (1, 'Initial schema with all core tables');

-- ============================================================================
-- VIEWS (for common queries)
-- ============================================================================

-- Leaderboard view with ranks
CREATE VIEW IF NOT EXISTS leaderboard_ranked AS
SELECT
    user_id,
    display_name,
    total_xp,
    level,
    current_streak,
    weekly_xp,
    ROW_NUMBER() OVER (ORDER BY total_xp DESC) as overall_rank,
    ROW_NUMBER() OVER (ORDER BY weekly_xp DESC) as weekly_rank
FROM leaderboard
WHERE total_xp > 0;

-- User progress summary view
CREATE VIEW IF NOT EXISTS user_progress_summary AS
SELECT
    u.id as user_id,
    u.display_name,
    COALESCE(us.total_xp, 0) as total_xp,
    COALESCE(us.level, 1) as level,
    COALESCE(us.maths_mastery, 0) as maths_mastery,
    COALESCE(us.science_mastery, 0) as science_mastery,
    COALESCE(str.current_streak, 0) as current_streak,
    (SELECT COUNT(*) FROM user_badges WHERE user_id = u.id) as badges_earned,
    (SELECT COUNT(*) FROM lesson_progress WHERE user_id = u.id AND status = 'completed') as lessons_completed
FROM users u
LEFT JOIN user_stats us ON u.id = us.user_id
LEFT JOIN user_streaks str ON u.id = str.user_id;

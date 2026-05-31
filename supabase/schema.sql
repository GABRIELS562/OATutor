-- SA CAPS Tutor Database Schema for Supabase
-- Run this in Supabase SQL Editor to set up tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    oats_user_id TEXT UNIQUE NOT NULL,
    display_name TEXT,
    grade INTEGER CHECK (grade BETWEEN 10 AND 12),
    province TEXT,
    school_name TEXT,
    treatment INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read/write their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- PROGRESS TRACKING (BKT Mastery)
-- =============================================

-- Skill mastery progress (BKT parameters per user per skill)
CREATE TABLE IF NOT EXISTS skill_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    oats_user_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    prob_mastery DECIMAL(5,4) DEFAULT 0.3,
    prob_transit DECIMAL(5,4) DEFAULT 0.15,
    prob_slip DECIMAL(5,4) DEFAULT 0.1,
    prob_guess DECIMAL(5,4) DEFAULT 0.2,
    problems_attempted INTEGER DEFAULT 0,
    problems_correct INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(oats_user_id, skill_id)
);

-- Index for fast lookups
CREATE INDEX idx_skill_progress_user ON skill_progress(oats_user_id);
CREATE INDEX idx_skill_progress_skill ON skill_progress(skill_id);

ALTER TABLE skill_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own skill progress" ON skill_progress
    FOR ALL USING (oats_user_id = current_setting('app.current_user_id', true));

-- =============================================
-- PROBLEM SUBMISSIONS (Analytics)
-- =============================================

CREATE TABLE IF NOT EXISTS problem_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    oats_user_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'submit', 'hint', 'hintScaffoldLog'
    problem_id TEXT NOT NULL,
    step_id TEXT,
    hint_id TEXT,
    input_value TEXT,
    correct_answer TEXT,
    is_correct BOOLEAN,
    hint_input TEXT,
    hint_answer TEXT,
    hint_is_correct BOOLEAN,
    hints_finished TEXT[], -- Array of completed hints
    variabilization JSONB,
    lesson TEXT,
    course_name TEXT,
    knowledge_components TEXT[],
    hint_type TEXT,
    dynamic_hint TEXT,
    treatment INTEGER,
    site_version TEXT,
    semester TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX idx_submissions_user ON problem_submissions(oats_user_id);
CREATE INDEX idx_submissions_problem ON problem_submissions(problem_id);
CREATE INDEX idx_submissions_lesson ON problem_submissions(lesson);
CREATE INDEX idx_submissions_date ON problem_submissions(created_at);

ALTER TABLE problem_submissions ENABLE ROW LEVEL SECURITY;

-- Allow inserting submissions (for logging)
CREATE POLICY "Anyone can insert submissions" ON problem_submissions
    FOR INSERT WITH CHECK (true);

-- Users can only read their own submissions
CREATE POLICY "Users can view own submissions" ON problem_submissions
    FOR SELECT USING (oats_user_id = current_setting('app.current_user_id', true));

-- =============================================
-- LESSON PROGRESS
-- =============================================

CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    oats_user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    course_name TEXT,
    problems_completed INTEGER DEFAULT 0,
    problems_total INTEGER DEFAULT 0,
    mastery_achieved BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(oats_user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON lesson_progress(oats_user_id);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own lesson progress" ON lesson_progress
    FOR ALL USING (oats_user_id = current_setting('app.current_user_id', true));

-- =============================================
-- FOCUS TRACKING (Optional analytics)
-- =============================================

CREATE TABLE IF NOT EXISTS focus_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    oats_user_id TEXT NOT NULL,
    focus_status TEXT NOT NULL, -- 'focus', 'blur'
    problem_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_focus_user ON focus_events(oats_user_id);
CREATE INDEX idx_focus_date ON focus_events(created_at);

ALTER TABLE focus_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert focus events" ON focus_events
    FOR INSERT WITH CHECK (true);

-- =============================================
-- FEEDBACK (Student feedback on problems)
-- =============================================

CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    oats_user_id TEXT NOT NULL,
    problem_id TEXT NOT NULL,
    feedback_text TEXT NOT NULL,
    problem_finished BOOLEAN DEFAULT false,
    lesson TEXT,
    course_name TEXT,
    status TEXT DEFAULT 'open', -- 'open', 'reviewed', 'resolved'
    variables JSONB,
    steps JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_status ON feedback(status);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON feedback
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own feedback" ON feedback
    FOR SELECT USING (oats_user_id = current_setting('app.current_user_id', true));

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_progress_updated_at
    BEFORE UPDATE ON skill_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update BKT mastery after problem attempt
CREATE OR REPLACE FUNCTION update_bkt_mastery(
    p_oats_user_id TEXT,
    p_skill_id TEXT,
    p_is_correct BOOLEAN
)
RETURNS DECIMAL AS $$
DECLARE
    v_prob_mastery DECIMAL;
    v_prob_transit DECIMAL;
    v_prob_slip DECIMAL;
    v_prob_guess DECIMAL;
    v_prob_correct_given_mastery DECIMAL;
    v_prob_correct_given_not_mastery DECIMAL;
    v_prob_correct DECIMAL;
    v_new_mastery DECIMAL;
BEGIN
    -- Get current BKT params or use defaults
    SELECT
        COALESCE(prob_mastery, 0.3),
        COALESCE(prob_transit, 0.15),
        COALESCE(prob_slip, 0.1),
        COALESCE(prob_guess, 0.2)
    INTO v_prob_mastery, v_prob_transit, v_prob_slip, v_prob_guess
    FROM skill_progress
    WHERE oats_user_id = p_oats_user_id AND skill_id = p_skill_id;

    -- If no record exists, use defaults
    IF NOT FOUND THEN
        v_prob_mastery := 0.3;
        v_prob_transit := 0.15;
        v_prob_slip := 0.1;
        v_prob_guess := 0.2;
    END IF;

    -- BKT Update formulas
    v_prob_correct_given_mastery := 1 - v_prob_slip;
    v_prob_correct_given_not_mastery := v_prob_guess;

    IF p_is_correct THEN
        -- P(L|correct) = P(correct|L) * P(L) / P(correct)
        v_prob_correct := v_prob_mastery * v_prob_correct_given_mastery +
                          (1 - v_prob_mastery) * v_prob_correct_given_not_mastery;
        v_new_mastery := (v_prob_mastery * v_prob_correct_given_mastery) / v_prob_correct;
    ELSE
        -- P(L|incorrect) = P(incorrect|L) * P(L) / P(incorrect)
        v_prob_correct := v_prob_mastery * v_prob_slip +
                          (1 - v_prob_mastery) * (1 - v_prob_guess);
        v_new_mastery := (v_prob_mastery * v_prob_slip) / v_prob_correct;
    END IF;

    -- Apply learning transition
    v_new_mastery := v_new_mastery + (1 - v_new_mastery) * v_prob_transit;

    -- Clamp between 0 and 1
    v_new_mastery := GREATEST(0, LEAST(1, v_new_mastery));

    -- Upsert skill progress
    INSERT INTO skill_progress (oats_user_id, skill_id, prob_mastery, problems_attempted,
                                 problems_correct, last_practiced_at)
    VALUES (p_oats_user_id, p_skill_id, v_new_mastery, 1,
            CASE WHEN p_is_correct THEN 1 ELSE 0 END, NOW())
    ON CONFLICT (oats_user_id, skill_id)
    DO UPDATE SET
        prob_mastery = v_new_mastery,
        problems_attempted = skill_progress.problems_attempted + 1,
        problems_correct = skill_progress.problems_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
        last_practiced_at = NOW(),
        updated_at = NOW();

    RETURN v_new_mastery;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ADMIN VIEW (for tutors/teachers)
-- =============================================

-- View for aggregated student progress (for admin dashboard)
CREATE OR REPLACE VIEW student_progress_summary AS
SELECT
    sp.oats_user_id,
    up.display_name,
    up.grade,
    up.school_name,
    COUNT(DISTINCT sp.skill_id) as skills_practiced,
    AVG(sp.prob_mastery) as avg_mastery,
    SUM(sp.problems_attempted) as total_problems,
    SUM(sp.problems_correct) as total_correct,
    CASE WHEN SUM(sp.problems_attempted) > 0
         THEN ROUND(SUM(sp.problems_correct)::DECIMAL / SUM(sp.problems_attempted) * 100, 1)
         ELSE 0 END as accuracy_pct,
    MAX(sp.last_practiced_at) as last_active
FROM skill_progress sp
LEFT JOIN user_profiles up ON sp.oats_user_id = up.oats_user_id
GROUP BY sp.oats_user_id, up.display_name, up.grade, up.school_name;

-- =============================================
-- INITIAL DATA (SA CAPS Skills)
-- =============================================

-- You can optionally seed default skills here
-- INSERT INTO ...

COMMENT ON TABLE skill_progress IS 'Tracks BKT mastery per skill per student for adaptive learning';
COMMENT ON TABLE problem_submissions IS 'Logs all student interactions for analytics';
COMMENT ON TABLE lesson_progress IS 'Tracks lesson completion progress';
COMMENT ON TABLE feedback IS 'Student feedback on problems';

-- =============================================
-- VIDEO SOLUTIONS (Phase 1: JSDT-style features)
-- =============================================

-- Video solutions linked to problems/steps
CREATE TABLE IF NOT EXISTS video_solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id TEXT NOT NULL,
    step_id TEXT,
    video_type TEXT NOT NULL CHECK (video_type IN ('youtube', 'self', 'vimeo')),
    video_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    duration_seconds INTEGER,
    timestamps JSONB, -- Array of {time: seconds, title: string, description: string}
    chapters JSONB, -- Structured chapters with subchapters
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast video lookups
CREATE INDEX idx_video_solutions_problem ON video_solutions(problem_id);
CREATE INDEX idx_video_solutions_step ON video_solutions(step_id);
CREATE INDEX idx_video_solutions_active ON video_solutions(is_active);

ALTER TABLE video_solutions ENABLE ROW LEVEL SECURITY;

-- Anyone can view active videos
CREATE POLICY "Anyone can view active videos" ON video_solutions
    FOR SELECT USING (is_active = true);

-- Only authenticated users can create videos
CREATE POLICY "Authenticated users can create videos" ON video_solutions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Video progress tracking
CREATE TABLE IF NOT EXISTS video_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    oats_user_id TEXT NOT NULL,
    video_id UUID REFERENCES video_solutions(id) ON DELETE CASCADE,
    progress_seconds INTEGER DEFAULT 0,
    duration_seconds INTEGER,
    completed BOOLEAN DEFAULT false,
    completed_chapters TEXT[], -- Array of completed chapter IDs
    last_watched_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(oats_user_id, video_id)
);

CREATE INDEX idx_video_progress_user ON video_progress(oats_user_id);
CREATE INDEX idx_video_progress_video ON video_progress(video_id);

ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own video progress" ON video_progress
    FOR ALL USING (oats_user_id = current_setting('app.current_user_id', true));

-- Audio explanations cache (optional - for storing generated explanations)
CREATE TABLE IF NOT EXISTS audio_explanations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id TEXT NOT NULL,
    step_id TEXT,
    hint_id TEXT,
    explanation_text TEXT NOT NULL,
    language TEXT DEFAULT 'en-ZA',
    voice_name TEXT,
    generated_by TEXT DEFAULT 'groq', -- groq, gemini, manual
    is_cached BOOLEAN DEFAULT true,
    play_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(problem_id, step_id, hint_id, language)
);

CREATE INDEX idx_audio_explanations_problem ON audio_explanations(problem_id);

ALTER TABLE audio_explanations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read audio explanations" ON audio_explanations
    FOR SELECT USING (true);

CREATE POLICY "System can insert audio explanations" ON audio_explanations
    FOR INSERT WITH CHECK (true);

COMMENT ON TABLE video_solutions IS 'JSDT-style video solutions linked to problems';
COMMENT ON TABLE video_progress IS 'Tracks video watching progress per user';
COMMENT ON TABLE audio_explanations IS 'Cached AI-generated audio explanations';

-- =============================================
-- EDUCATOR DASHBOARD (Phase 4: JSDT-style features)
-- =============================================

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    class_name TEXT NOT NULL,
    grade INTEGER CHECK (grade BETWEEN 10 AND 12),
    subject TEXT DEFAULT 'Mathematics',
    join_code TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_join_code ON classes(join_code);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own classes
CREATE POLICY "Teachers can manage own classes" ON classes
    FOR ALL USING (teacher_id = auth.uid());

-- Students can view classes they're enrolled in (via join code)
CREATE POLICY "Anyone can view active classes by join code" ON classes
    FOR SELECT USING (is_active = true);

-- Class enrollments
CREATE TABLE IF NOT EXISTS class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    student_oats_id TEXT NOT NULL,
    student_name TEXT,
    student_email TEXT,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'removed')),
    UNIQUE(class_id, student_oats_id)
);

CREATE INDEX idx_enrollments_class ON class_enrollments(class_id);
CREATE INDEX idx_enrollments_student ON class_enrollments(student_oats_id);

ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage enrollments" ON class_enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM classes
            WHERE classes.id = class_enrollments.class_id
            AND classes.teacher_id = auth.uid()
        )
    );

-- Attendance tracking
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    student_oats_id TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    notes TEXT,
    marked_by UUID REFERENCES auth.users(id),
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_oats_id, date)
);

CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student ON attendance(student_oats_id);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage attendance" ON attendance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM classes
            WHERE classes.id = attendance.class_id
            AND classes.teacher_id = auth.uid()
        )
    );

-- Assignments (assessments)
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    assignment_type TEXT DEFAULT 'homework' CHECK (assignment_type IN ('homework', 'quiz', 'test', 'exam', 'practice')),
    problems JSONB, -- Array of problem IDs or custom questions
    total_marks INTEGER,
    time_limit_minutes INTEGER,
    due_date TIMESTAMPTZ,
    available_from TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT false,
    allow_retries BOOLEAN DEFAULT true,
    show_solutions_after BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_assignments_due ON assignments(due_date);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage own assignments" ON assignments
    FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can view published assignments" ON assignments
    FOR SELECT USING (
        is_published = true AND
        EXISTS (
            SELECT 1 FROM class_enrollments ce
            WHERE ce.class_id = assignments.class_id
            AND ce.student_oats_id = current_setting('app.current_user_id', true)
            AND ce.status = 'active'
        )
    );

-- Assignment submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_oats_id TEXT NOT NULL,
    answers JSONB, -- {problemId: answer, ...}
    score DECIMAL(5,2),
    total_possible DECIMAL(5,2),
    percentage DECIMAL(5,2),
    time_spent_seconds INTEGER,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES auth.users(id),
    feedback TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded', 'returned')),
    attempt_number INTEGER DEFAULT 1,
    UNIQUE(assignment_id, student_oats_id, attempt_number)
);

CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_student ON assignment_submissions(student_oats_id);
CREATE INDEX idx_submissions_status ON assignment_submissions(status);

ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage own submissions" ON assignment_submissions
    FOR ALL USING (student_oats_id = current_setting('app.current_user_id', true));

CREATE POLICY "Teachers can view/grade submissions" ON assignment_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM assignments a
            WHERE a.id = assignment_submissions.assignment_id
            AND a.teacher_id = auth.uid()
        )
    );

-- Generated slides (AI-generated presentations)
CREATE TABLE IF NOT EXISTS generated_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    grade INTEGER CHECK (grade BETWEEN 10 AND 12),
    duration_minutes INTEGER,
    content JSONB NOT NULL, -- Full slide deck JSON
    worksheet_questions JSONB, -- Optional worksheet questions
    is_template BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_slides_teacher ON generated_slides(teacher_id);
CREATE INDEX idx_slides_topic ON generated_slides(topic);

ALTER TABLE generated_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage own slides" ON generated_slides
    FOR ALL USING (teacher_id = auth.uid());

-- Aggregate attendance view
CREATE OR REPLACE VIEW class_attendance_summary AS
SELECT
    c.id as class_id,
    c.class_name,
    c.grade,
    a.date,
    COUNT(*) FILTER (WHERE a.status = 'present') as present_count,
    COUNT(*) FILTER (WHERE a.status = 'absent') as absent_count,
    COUNT(*) FILTER (WHERE a.status = 'late') as late_count,
    COUNT(*) FILTER (WHERE a.status = 'excused') as excused_count,
    COUNT(*) as total_students,
    ROUND(COUNT(*) FILTER (WHERE a.status = 'present')::DECIMAL / NULLIF(COUNT(*), 0) * 100, 1) as attendance_rate
FROM classes c
LEFT JOIN attendance a ON c.id = a.class_id
GROUP BY c.id, c.class_name, c.grade, a.date;

-- Assignment performance view
CREATE OR REPLACE VIEW assignment_performance AS
SELECT
    a.id as assignment_id,
    a.title,
    a.class_id,
    c.class_name,
    COUNT(DISTINCT asub.student_oats_id) as submissions_count,
    AVG(asub.percentage) as avg_percentage,
    MIN(asub.percentage) as min_percentage,
    MAX(asub.percentage) as max_percentage,
    COUNT(*) FILTER (WHERE asub.percentage >= 50) as passing_count,
    COUNT(*) FILTER (WHERE asub.percentage < 50) as failing_count
FROM assignments a
JOIN classes c ON a.class_id = c.id
LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.status = 'graded'
GROUP BY a.id, a.title, a.class_id, c.class_name;

COMMENT ON TABLE classes IS 'Teacher-created classes for organizing students';
COMMENT ON TABLE class_enrollments IS 'Student enrollment in classes';
COMMENT ON TABLE attendance IS 'Daily attendance tracking per class';
COMMENT ON TABLE assignments IS 'Teacher-created assignments and assessments';
COMMENT ON TABLE assignment_submissions IS 'Student submissions for assignments';
COMMENT ON TABLE generated_slides IS 'AI-generated presentation slides';

-- =============================================
-- PROBLEM COMMENTS (JSDT-style community discussion)
-- =============================================

-- Comments on problems/questions
CREATE TABLE IF NOT EXISTS problem_comments (
    id TEXT PRIMARY KEY,
    problem_id TEXT NOT NULL,
    user_id TEXT,
    user_name TEXT DEFAULT 'Anonymous',
    text TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    upvoted_by TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_problem_comments_problem ON problem_comments(problem_id);
CREATE INDEX idx_problem_comments_user ON problem_comments(user_id);
CREATE INDEX idx_problem_comments_created ON problem_comments(created_at DESC);

ALTER TABLE problem_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view comments
CREATE POLICY "Anyone can view comments" ON problem_comments
    FOR SELECT USING (true);

-- Anyone can insert comments
CREATE POLICY "Anyone can insert comments" ON problem_comments
    FOR INSERT WITH CHECK (true);

-- Users can update their own comments (for upvoting)
CREATE POLICY "Anyone can update comments" ON problem_comments
    FOR UPDATE USING (true);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON problem_comments
    FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

COMMENT ON TABLE problem_comments IS 'Community comments and discussions on problems (JSDT-style feature)';

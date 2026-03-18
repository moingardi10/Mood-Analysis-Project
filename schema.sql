-- ============================================================
-- MoodLens — COMPLETE SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. USERS TABLE (synced with auth.users via trigger)
CREATE TABLE IF NOT EXISTS public.users (
    id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email         TEXT,
    name          TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TEST RESULTS (per-test summary, stored for streak/stats)
CREATE TABLE IF NOT EXISTS public.test_results (
    test_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID REFERENCES public.users(id) ON DELETE CASCADE,
    test_start_time    TIMESTAMPTZ,
    test_end_time      TIMESTAMPTZ,
    duration_seconds   INTEGER,
    total_score        INTEGER,
    average_score      NUMERIC(5,2),
    percentage_score   NUMERIC(5,2),
    emotional_state    TEXT,
    stress_level       TEXT,
    energy_level       TEXT,
    wellbeing          TEXT,
    mood_classification TEXT,
    browser            TEXT,
    device             TEXT,
    screen_size        TEXT,
    timezone           TEXT,
    language           TEXT,
    status             TEXT DEFAULT 'COMPLETED',
    created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEST ANSWERS (individual question answers)
CREATE TABLE IF NOT EXISTS public.test_answers (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id              UUID REFERENCES public.test_results(test_id) ON DELETE CASCADE,
    question_number      INTEGER,
    question_id          INTEGER,
    question_text        TEXT,
    category             TEXT,
    selected_value       INTEGER,
    selected_label       TEXT,
    selected_description TEXT,
    created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORY SCORES
CREATE TABLE IF NOT EXISTS public.category_scores (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id        UUID REFERENCES public.test_results(test_id) ON DELETE CASCADE,
    category_name  TEXT,
    total_score    INTEGER,
    question_count INTEGER,
    average_score  NUMERIC(5,2),
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER STREAKS
CREATE TABLE IF NOT EXISTS public.user_streaks (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    current_streak_days  INTEGER DEFAULT 0,
    longest_streak_days  INTEGER DEFAULT 0,
    last_test_date       DATE,
    created_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TEST RESPONSES (weekly 4-week system — CORE TABLE)
CREATE TABLE IF NOT EXISTS public.test_responses (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID REFERENCES public.users(id) ON DELETE CASCADE,
    week              INTEGER NOT NULL CHECK (week BETWEEN 1 AND 4),
    responses         JSONB NOT NULL,          -- full 30-question response dict
    prediction_label  TEXT,                    -- Stable / Moderate / Unstable
    prediction_confidence NUMERIC(6,4),
    shap_values       JSONB,                   -- {feature: value, ...}
    pa_score          NUMERIC(6,4),
    na_score          NUMERIC(6,4),
    debate_result     JSONB,                   -- full debate dict from API
    submitted_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, week)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_answers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_responses  ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "users_own_data"        ON public.users           FOR ALL USING (auth.uid() = id);
CREATE POLICY "test_results_own"      ON public.test_results    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "test_answers_own"      ON public.test_answers    FOR ALL USING (
    test_id IN (SELECT test_id FROM public.test_results WHERE user_id = auth.uid())
);
CREATE POLICY "category_scores_own"   ON public.category_scores FOR ALL USING (
    test_id IN (SELECT test_id FROM public.test_results WHERE user_id = auth.uid())
);
CREATE POLICY "user_streaks_own"      ON public.user_streaks    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "test_responses_own"    ON public.test_responses  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: auto-create user profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_streaks (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCTION: update streak
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_last_date    DATE;
    v_current      INTEGER;
    v_longest      INTEGER;
    v_today        DATE := CURRENT_DATE;
BEGIN
    SELECT last_test_date, current_streak_days, longest_streak_days
    INTO v_last_date, v_current, v_longest
    FROM public.user_streaks
    WHERE user_id = p_user_id;

    IF v_last_date IS NULL THEN
        v_current := 1;
    ELSIF v_last_date = v_today THEN
        -- already counted today, do nothing
        RETURN;
    ELSIF v_last_date = v_today - INTERVAL '1 day' THEN
        v_current := v_current + 1;
    ELSE
        v_current := 1;
    END IF;

    v_longest := GREATEST(v_longest, v_current);

    UPDATE public.user_streaks
    SET current_streak_days = v_current,
        longest_streak_days = v_longest,
        last_test_date      = v_today,
        updated_at          = NOW()
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/**
 * supabase.js — Single global Supabase client for MoodFlow
 * Load AFTER the Supabase CDN script, BEFORE any other scripts.
 * Provides: window.sb  (use this everywhere)
 */
(function () {
    'use strict';

    var SUPABASE_URL = "https://brkcqvoazyyiwdmhmorw.supabase.co";
    var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJya2Nxdm9henl5aXdkbWhtb3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2Nzk3NjksImV4cCI6MjA4OTI1NTc2OX0.m1Yaa458b90MY30YT2YHi2Nw9nnkJRq7mUfqkqOWN-A";

    if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
        console.error('[MoodFlow] Supabase SDK not loaded. Check CDN script tag.');
        return;
    }

    if (window.sb && window.sb.auth) {
        console.log('[MoodFlow] Supabase client already initialised.');
        return;
    }

    try {
        var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: false
            }
        });
        window.sb = client;
        console.log('[MoodFlow] ✅ Supabase client ready → window.sb');
    } catch (err) {
        console.error('[MoodFlow] Failed to create Supabase client:', err);
    }
})();
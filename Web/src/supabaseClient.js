// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Automatically handle token refresh and save updated token to localStorage
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
            localStorage.setItem('sb_access_token', session.access_token);
        }
    } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('sb_access_token');
    }
});

export default supabase;


require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to dynamically create an authenticated Supabase client
const getSupabaseClientWithAuth = (accessToken) => {
    if (!accessToken) {
        throw new Error('Access token is required for authentication.');
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        },
    });
};

module.exports = {
    supabase,
    getSupabaseClientWithAuth,
};


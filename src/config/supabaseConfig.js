// Supabase Configuration for SA CAPS Tutor
// FREE TIER: 500MB database, 50K monthly active users, unlimited API requests

const supabaseConfig = {
    // Replace these with your Supabase project credentials
    // Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
    url: process.env.REACT_APP_SUPABASE_URL || "[YOUR_SUPABASE_URL]",
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || "[YOUR_SUPABASE_ANON_KEY]",
};

// Validate config in development
if (process.env.NODE_ENV === 'development') {
    if (supabaseConfig.url.includes('[YOUR_')) {
        console.warn('⚠️ Supabase not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env');
    }
}

export default supabaseConfig;

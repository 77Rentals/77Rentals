// Supabase project connection for the guest experiences board.
// The anon key below is meant to be public — Row Level Security policies on the
// `guest_experiences` table and `guest-experience-photos` bucket are the real
// security boundary, not secrecy of this key. Safe to commit.
//
// Replace both placeholders after creating the Supabase project and running the
// setup SQL (see public/shared/guest-experiences-setup.sql).
window.SUPABASE_URL = 'REPLACE_WITH_YOUR_SUPABASE_PROJECT_URL';
window.SUPABASE_ANON_KEY = 'REPLACE_WITH_YOUR_SUPABASE_ANON_PUBLIC_KEY';

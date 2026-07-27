// Supabase project connection for the guest experiences board.
// The anon key below is meant to be public — Row Level Security policies on the
// `guest_experiences` table and `guest-experience-photos` bucket are the real
// security boundary, not secrecy of this key. Safe to commit.
//
// Replace both placeholders after creating the Supabase project and running the
// setup SQL (see public/shared/guest-experiences-setup.sql).
window.SUPABASE_URL = 'https://vexlqzojvjmjdcuniwlw.supabase.co';
window.SUPABASE_ANON_KEY = 'sb_publishable_PjSS8PPDfVPVoFjLhyVMdQ_sa9l-Him';

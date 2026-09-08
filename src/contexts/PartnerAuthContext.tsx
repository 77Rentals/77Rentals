import React, { createContext, useEffect, useState, ReactNode, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

export interface PartnerAuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  userId: string | null;
  userEmail: string;
  userRole: 'admin' | 'owner';
  isApprovedOwner: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

export const PartnerAuthContext = createContext<PartnerAuthContextType | null>(null);

export function PartnerAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'owner'>('owner');
  const [isApprovedOwner, setIsApprovedOwner] = useState(false);

  const resolveRole = useCallback(async (userId: string) => {
    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (isAdmin) {
      setUserRole('admin');
      setIsApprovedOwner(false);
      return;
    }

    setUserRole('owner');
    const { data: profile } = await supabase
      .from('owner_profiles')
      .select('approved')
      .eq('id', userId)
      .maybeSingle();
    setIsApprovedOwner(!!profile?.approved);
  }, []);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (cancelled) return;
      setSession(initialSession);
      if (initialSession?.user) {
        await resolveRole(initialSession.user.id);
      }
      if (!cancelled) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await resolveRole(newSession.user.id);
      } else {
        setUserRole('owner');
        setIsApprovedOwner(false);
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [resolveRole]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message, needsEmailConfirmation: false };
    return { error: null, needsEmailConfirmation: !data.session };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const refreshRole = useCallback(async () => {
    if (session?.user) await resolveRole(session.user.id);
  }, [session, resolveRole]);

  return (
    <PartnerAuthContext.Provider
      value={{
        isLoggedIn: !!session,
        loading,
        userId: session?.user.id ?? null,
        userEmail: session?.user.email ?? '',
        userRole,
        isApprovedOwner,
        login,
        signUp,
        logout,
        refreshRole,
      }}
    >
      {children}
    </PartnerAuthContext.Provider>
  );
}

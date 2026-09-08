import React, { useState, useContext } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PartnerAuthContext } from '@/contexts/PartnerAuthContext';

export function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const auth = useContext(PartnerAuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        const { error: loginError } = (await auth?.login(email, password)) ?? { error: 'Auth unavailable' };
        if (loginError) setError(loginError);
      } else {
        const result = await auth?.signUp(email, password);
        if (!result || result.error) {
          setError(result?.error ?? 'Auth unavailable');
        } else if (result.needsEmailConfirmation) {
          setInfo('Account created. Check your email to confirm it, then log in below.');
          setMode('login');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B69] to-[#1a0f3f] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-sm">
        <div className="p-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Partner Hub</h1>
          <p className="text-white/60 text-sm mb-6">
            {mode === 'login'
              ? 'Login to access your partner dashboard'
              : 'Register as a property owner to start offering properties'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
                {error}
              </div>
            )}
            {info && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded text-emerald-200 text-sm">
                {info}
              </div>
            )}

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/40"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold py-2 h-auto disabled:opacity-60"
            >
              {submitting ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
                setInfo('');
              }}
              className="text-white/60 hover:text-white text-sm underline"
            >
              {mode === 'login'
                ? "New property owner? Register here"
                : 'Already have an account? Log in'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/50 text-xs text-center">
              Partner Hub • 77Rentals
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

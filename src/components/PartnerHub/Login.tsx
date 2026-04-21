import React, { useState, useContext } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PartnerAuthContext } from '@/contexts/PartnerAuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'owner'>('owner');
  const [error, setError] = useState('');
  const auth = useContext(PartnerAuthContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // MVP: Simple email validation
    // Admin emails only: founder@77rentals.com (hardcoded)
    // Owner emails: any email (for MVP)

    if (role === 'admin' && email !== 'founder@77rentals.com') {
      setError('Admin access only for authorized users');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    auth?.login(email, role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B69] to-[#1a0f3f] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-sm">
        <div className="p-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Partner Hub</h1>
          <p className="text-white/60 text-sm mb-6">
            Login to access your partner dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
                {error}
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
              <p className="text-white/50 text-xs mt-1">
                {role === 'admin'
                  ? 'Admin email: founder@77rentals.com'
                  : 'Enter your email to login as property owner'}
              </p>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Access Type
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as 'admin' | 'owner');
                  setError('');
                }}
                className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 focus:bg-white/15 focus:border-white/40 focus:outline-none"
              >
                <option value="owner" className="bg-[#2D1B69]">
                  Property Owner
                </option>
                <option value="admin" className="bg-[#2D1B69]">
                  Administrator
                </option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D4A843] hover:bg-[#c9963e] text-black font-bold py-2 h-auto"
            >
              Login
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/50 text-xs text-center">
              Partner Hub MVP • 77Rentals
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

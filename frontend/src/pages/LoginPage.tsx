import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('Could not access demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/40 shadow-glow-cyan mb-2">
            <Sparkles className="w-6 h-6 text-brand-cyan" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to CareerTwin AI</h2>
          <p className="text-xs text-slate-400">Access your digital career twin and simulation history</p>
        </div>

        {/* 1-Click Demo Box for Judges */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-brand-cyan/15 to-brand-indigo/15 border border-brand-cyan/30 text-center space-y-2">
          <p className="text-xs text-slate-200 font-semibold">Hackathon Judge / Instant Evaluation?</p>
          <button
            onClick={handleDemoAccess}
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-xs font-bold bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>1-Click Sign In as Demo User (Alex)</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-surface-border shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@careertwin.ai"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-light border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-light border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold bg-brand-blue hover:bg-blue-600 text-white shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-cyan hover:underline font-medium">
              Create a digital twin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

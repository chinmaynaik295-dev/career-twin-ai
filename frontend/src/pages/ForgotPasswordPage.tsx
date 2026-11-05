import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Unable to process reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-subtle">
              CT
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Reset your password</h2>
          <p className="text-xs text-slate-600">Enter your email and we'll send you recovery instructions</p>
        </div>

        <div className="p-6 rounded-xl bg-surface border border-surface-border shadow-card space-y-5">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-accent-emerald-subtle border border-emerald-200 text-accent-emerald flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Recovery Instructions Sent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account exists for <strong className="text-slate-900">{email}</strong>, you will receive password reset instructions.
              </p>
              <Link
                to="/login"
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-slate-950 text-white flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded-lg bg-accent-rose-subtle border border-rose-200 text-accent-rose text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 transition-colors shadow-subtle"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-white shadow-subtle transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Sending Request...' : 'Send Reset Instructions'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100 text-center">
                <Link to="/login" className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


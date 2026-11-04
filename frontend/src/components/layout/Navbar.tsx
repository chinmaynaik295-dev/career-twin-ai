import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Sparkles, Compass, Target, Cpu, MessageSquareCode, 
  Map, History, LogOut, Menu, X, ShieldAlert, Award
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Twin Dashboard', path: '/dashboard', icon: Sparkles },
    { name: 'Career Explorer', path: '/careers', icon: Compass },
    { name: 'Skill Gaps', path: '/gaps', icon: Target },
    { name: 'Simulation Lab', path: '/simulation', icon: Cpu, badge: 'What-If' },
    { name: 'AI Mentor', path: '/mentor', icon: MessageSquareCode, badge: 'Agentic' },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
    { name: 'Twin Evolution', path: '/evolution', icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan/20 via-brand-indigo/30 to-brand-violet/20 border border-brand-cyan/30 shadow-glow-cyan group-hover:scale-105 transition-transform duration-300">
              {/* Interconnected Twin Node SVG Concept */}
              <svg className="w-6 h-6 text-brand-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="12" r="3" />
                <circle cx="17" cy="12" r="3" />
                <path d="M10 12h4" strokeDasharray="2 2" />
                <path d="M7 9a5 5 0 0 1 10 0" />
                <path d="M7 15a5 5 0 0 0 10 0" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                CareerTwin <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-indigo font-black">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
                Digital Career Twin & Simulation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-surface-light'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold uppercase tracking-wider ${
                        link.badge === 'What-If' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-brand-indigo/30 text-brand-cyan border border-brand-indigo/40'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
              <a href="#features" className="hover:text-brand-cyan transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-brand-cyan transition-colors">How It Works</a>
              <a href="#simulation-preview" className="hover:text-brand-cyan transition-colors">Simulation Lab</a>
              <a href="#sdg-impact" className="hover:text-brand-cyan transition-colors">SDG Impact</a>
            </nav>
          )}

          {/* User Status & Auth Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface-light/80 border border-surface-border">
                  <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-200 leading-none">{user?.name || 'Alex'}</p>
                    <p className="text-[10px] text-slate-400 leading-none mt-1">2nd Year Engineering</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    await demoLogin();
                    navigate('/dashboard');
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-brand-cyan/20 to-brand-indigo/20 text-brand-cyan border border-brand-cyan/40 hover:border-brand-cyan hover:shadow-glow-cyan transition-all duration-300 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Demo as Alex</span>
                </button>

                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-surface-light border border-surface-border transition-all"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-blue hover:bg-blue-600 text-white shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-light focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-surface-border bg-surface px-4 pt-3 pb-6 space-y-2">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-brand-cyan hover:bg-surface-light"
                  >
                    <Icon className="w-4 h-4 text-brand-cyan" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                <span className="text-xs text-slate-400">{user?.name} (2nd Year)</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <button
                onClick={async () => {
                  await demoLogin();
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full py-2.5 rounded-lg text-sm font-semibold bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> 1-Click Demo as Alex
              </button>
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-lg text-sm font-medium bg-surface-light border border-surface-border text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-lg text-sm font-semibold bg-brand-blue text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

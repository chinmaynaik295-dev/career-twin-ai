import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Briefcase, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-surface-border bg-surface pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-subtle">
                CT
              </div>
              <span className="font-semibold text-sm text-slate-900 tracking-tight">
                CareerTwin <span className="text-primary-600 font-bold">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              CareerTwin AI provides precision digital career modeling, deterministic What-If simulation,
              and agentic career guidance for engineering students, graduates, and professionals.
            </p>
            <div className="flex items-center gap-3 pt-1 text-slate-600 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border font-medium">
                <Lock className="w-3 h-3 text-slate-500" /> Enterprise-grade Data Isolation
              </span>
            </div>
          </div>

          {/* Platform Columns */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/careers" className="hover:text-slate-900 transition-colors">Career Tracks</Link></li>
              <li><Link to="/simulation" className="hover:text-slate-900 transition-colors">Simulation Engine</Link></li>
              <li><Link to="/gaps" className="hover:text-slate-900 transition-colors">Skill Diagnostics</Link></li>
              <li><Link to="/roadmap" className="hover:text-slate-900 transition-colors">Adaptive Roadmaps</Link></li>
              <li><Link to="/mentor" className="hover:text-slate-900 transition-colors">AI Career Mentor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#how-it-works" className="hover:text-slate-900 transition-colors">Methodology</a></li>
              <li><a href="#tracks" className="hover:text-slate-900 transition-colors">Competency Datasets</a></li>
              <li><a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">API Documentation</a></li>
              <li><a href="#security" className="hover:text-slate-900 transition-colors">Ethics & Fairness</a></li>
            </ul>
          </div>

          {/* System & Trust */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Architecture</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
              Built on deterministic mathematical scoring. We do not generate fabricated job predictions or arbitrary hiring probabilities.
            </p>
            <span className="text-[10px] text-slate-500 font-mono block">
              FastAPI • PyMongo • React 18 • Tool Calling
            </span>
          </div>
        </div>

        <div className="border-t border-surface-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <p>© {new Date().getFullYear()} CareerTwin AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 transition-colors cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

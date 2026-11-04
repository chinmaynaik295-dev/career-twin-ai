import React from 'react';
import { Sparkles, Globe, Shield, BookOpen, Briefcase, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-surface-border bg-surface/50 backdrop-blur-md pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40">
                <Sparkles className="w-4 h-4 text-brand-cyan" />
              </div>
              <span className="font-bold text-base text-white">
                CareerTwin <span className="text-brand-cyan">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              An Advanced Agentic AI Digital Career Twin & Career Simulation Platform designed to help students,
              graduates, and career-switchers experiment with learning decisions through transparent mathematical simulation.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BookOpen className="w-3 h-3" /> SDG 4: Quality Education
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Briefcase className="w-3 h-3" /> SDG 8: Decent Work
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="/simulation" className="hover:text-brand-cyan transition-colors">What-If Simulation Lab</a></li>
              <li><a href="/gaps" className="hover:text-brand-cyan transition-colors">Skill Gap Diagnostic Engine</a></li>
              <li><a href="/mentor" className="hover:text-brand-cyan transition-colors">Agentic AI Career Mentor</a></li>
              <li><a href="/roadmap" className="hover:text-brand-cyan transition-colors">Adaptive Roadmaps</a></li>
              <li><a href="/evolution" className="hover:text-brand-cyan transition-colors">Digital Twin Evolution</a></li>
            </ul>
          </div>

          {/* Architectural transparency note */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Architecture & Ethics</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              CareerTwin AI uses transparent, deterministic Python evaluation formulas. Simulations are decision-support models and do not fabricate arbitrary employment guarantees.
            </p>
            <span className="text-[10px] text-slate-500 font-mono">
              FastAPI • PyMongo • React 18 • Tool Calling
            </span>
          </div>
        </div>

        <div className="border-t border-surface-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 CareerTwin AI. Built for the Next-Generation Workforce.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors">Privacy & Security</span>
            <span className="hover:text-slate-300 transition-colors">Documentation</span>
            <span className="hover:text-slate-300 transition-colors">API v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

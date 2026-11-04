import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sparkles, ArrowRight, Cpu, Target, Compass, MessageSquareCode, 
  Map, ShieldCheck, CheckCircle2, Sliders, Zap, BookOpen, Briefcase, Award 
} from 'lucide-react';
import { ReadinessGauge } from '../components/charts/ReadinessGauge';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  // Interactive Live Preview State on Landing Page!
  const [previewPython, setPreviewPython] = useState(3);
  const [previewML, setPreviewML] = useState(1);
  const [previewSQL, setPreviewSQL] = useState(1);

  // Deterministic live readiness calculation for preview:
  // (Python*5 + ML*5 + Math*4 + SQL*3 + DL*4 + MLOps*3 + ProbSolv*4 + Comm*3) / (31) * 20
  // Default Alex: Python: 3, ML: 1, Math: 3, SQL: 1, DL: 0, MLOps: 0, ProbSolv: 3, Comm: 0
  const previewWeightedSum = (previewPython * 5) + (previewML * 5) + (3 * 4) + (previewSQL * 3) + (0 * 4) + (0 * 3) + (3 * 4) + (0 * 3);
  const previewScore = Math.round((previewWeightedSum / 31) * 20 * 10) / 10;

  const handleDemoAccess = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-surface-border">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-cyan/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-brand-indigo/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-light border border-brand-cyan/30 text-brand-cyan text-xs font-semibold shadow-glow-cyan animate-pulse-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Agentic AI Career Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Simulate Your Future.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-violet">
                Build Your Career.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Meet your <strong className="text-white">Digital Career Twin</strong>. Model your current competencies, run
              mathematical <strong className="text-brand-cyan">What-If simulations</strong> on future learning decisions,
              and receive agentic roadmap orchestration to maximize your employability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={handleDemoAccess}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 hover:opacity-95 shadow-glow-cyan transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>1-Click Hackathon Demo (Alex)</span>
              </button>

              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm bg-surface-light border border-surface-border text-slate-200 hover:text-white hover:border-slate-400 transition-all flex items-center justify-center gap-2"
              >
                <span>Create Your Digital Twin</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs text-slate-500 pt-2">
              Aligned with <strong>UN SDG 4 (Quality Education)</strong> & <strong>SDG 8 (Decent Work & Economic Growth)</strong>.
            </p>
          </div>

          {/* Interactive Simulation Preview Hero Card */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-surface border border-surface-border shadow-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-cyan/5 rounded-full blur-3xl" />
            
            <div className="flex items-center justify-between border-b border-surface-border/60 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">careertwin-sim://alex-twin/preview</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                Interactive What-If Preview
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Gauges & Outcome */}
              <div className="flex flex-col items-center justify-center bg-surface-light/40 p-4 rounded-xl border border-surface-border">
                <ReadinessGauge score={previewScore} size={150} label="AI/ML Engineer Readiness" />
                <p className="text-[11px] text-slate-400 mt-3 text-center">
                  Adjust hypothetical skills below to watch the deterministic score react in real-time.
                </p>
              </div>

              {/* Sliders */}
              <div className="md:col-span-2 space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                    <span>Python Proficiency</span>
                    <span className="text-brand-cyan font-mono font-bold">{previewPython} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={previewPython}
                    onChange={(e) => setPreviewPython(Number(e.target.value))}
                    className="w-full h-2 bg-surface-light rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                    <span>Machine Learning Competency</span>
                    <span className="text-brand-cyan font-mono font-bold">{previewML} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={previewML}
                    onChange={(e) => setPreviewML(Number(e.target.value))}
                    className="w-full h-2 bg-surface-light rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                    <span>SQL & Relational Architecture</span>
                    <span className="text-brand-cyan font-mono font-bold">{previewSQL} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={previewSQL}
                    onChange={(e) => setPreviewSQL(Number(e.target.value))}
                    className="w-full h-2 bg-surface-light rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                  />
                </div>

                <div className="p-3 rounded-lg bg-surface-light/70 border border-surface-border text-xs text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Projected Readiness Gain:</span>
                  </div>
                  <span className="font-mono font-bold text-accent-emerald text-sm">
                    +{Math.max(0, Math.round((previewScore - 30.3) * 10) / 10)} pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Five Major Questions Answered Section */}
      <section className="py-20 bg-surface/30 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-semibold text-brand-cyan uppercase tracking-wider mb-2">Core Product Vision</h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">The Five Questions CareerTwin Answers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: "01", q: "Where am I currently?", desc: "Maps baseline competencies, project experience, and skill proficiencies on a transparent 0-5 scale." },
              { num: "02", q: "Which careers match?", desc: "Evaluates multi-track compatibility against 6 high-demand technology sectors with weighted scoring." },
              { num: "03", q: "What am I missing?", desc: "Diagnoses high, medium, and low priority skill gaps with actionable curriculum recommendations." },
              { num: "04", q: "What if I make a pivot?", desc: "Runs What-If scenario simulations comparing hours invested against projected career readiness gains." },
              { num: "05", q: "What should I do next?", desc: "Agentic AI Mentor orchestrates weekly milestone roadmaps and updates your twin as you verify progress." }
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl bg-surface border border-surface-border hover:border-brand-cyan/40 transition-all group">
                <span className="text-xs font-mono font-bold text-brand-cyan/60 group-hover:text-brand-cyan transition-colors">{item.num}</span>
                <h4 className="text-sm font-bold text-white mt-2 mb-1.5">{item.q}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-semibold text-brand-cyan uppercase tracking-wider mb-2">Platform Capabilities</h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">Engineered for Explainable Career Growth</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu,
                title: "What-If Simulation Lab",
                desc: "Experiment with hypothetical learning paths. Compare Scenario A (Python + ML) against Scenario B (Networking + Cyber) side-by-side.",
                color: "text-brand-cyan"
              },
              {
                icon: Target,
                title: "Skill Gap Diagnostic Engine",
                desc: "Calculates mathematical readiness scores using weighted importance metrics. Identifies high-gap bottlenecks before you start learning.",
                color: "text-accent-rose"
              },
              {
                icon: MessageSquareCode,
                title: "Agentic AI Career Mentor",
                desc: "Powered by Python tool-calling agents with 8 specialized tools grounded directly in your Digital Career Twin data.",
                color: "text-brand-indigo"
              },
              {
                icon: Compass,
                title: "6 In-Demand Career Tracks",
                desc: "Deep requirements for AI/ML, Cybersecurity, Data Science, Software Development, Cloud Architecture, and Data Engineering.",
                color: "text-amber-400"
              },
              {
                icon: Map,
                title: "Adaptive Learning Roadmaps",
                desc: "Weekly milestones with task checkboxes and estimated completion hours that dynamically calibrate to your available time.",
                color: "text-accent-emerald"
              },
              {
                icon: Award,
                title: "Verified Twin Evolution",
                desc: "Your Digital Twin only evolves when you record verifiable milestone evidence and completed portfolio repositories.",
                color: "text-brand-violet"
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-slate-600 transition-all group">
                  <div className={`w-10 h-10 rounded-xl bg-surface-light flex items-center justify-center mb-4 border border-surface-border group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SDG Impact */}
      <section id="sdg-impact" className="py-16 bg-surface/40 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-r from-emerald-950/40 via-surface to-blue-950/40 border border-emerald-500/30 p-8 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              United Nations Sustainable Development Goals
            </span>
            <h3 className="text-2xl font-bold text-white">Equipping Tomorrow's Global Workforce</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl mx-auto">
              CareerTwin AI directly advances <strong>SDG 4 (Target 4.4: Relevant skills for employment)</strong> and{' '}
              <strong>SDG 8 (Target 8.6: Substantially reduce youth not in employment or education)</strong> by eliminating
              information asymmetry and providing free, transparent simulation tools.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to simulate your career trajectory?
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Experience the full agentic AI workflow with the sample engineering student profile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDemoAccess}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 transition-all shadow-glow-cyan"
            >
              Launch Demo as Alex
            </button>
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-surface-light border border-surface-border text-slate-200 hover:text-white"
            >
              Sign Up as New Student
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

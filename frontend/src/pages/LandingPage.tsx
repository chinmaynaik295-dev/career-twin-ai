import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Cpu, Target, Compass, MessageSquareCode, 
  Map, Shield, CheckCircle2, Sliders, Zap, Lock, 
  Layers, ChevronRight, BarChart3, LineChart
} from 'lucide-react';
import { ReadinessGauge } from '../components/charts/ReadinessGauge';

export const LandingPage: React.FC = () => {
  // Interactive Live Product Preview State
  const [previewPython, setPreviewPython] = useState(3.0);
  const [previewML, setPreviewML] = useState(2.0);
  const [previewSQL, setPreviewSQL] = useState(2.0);

  // Deterministic preview calculation (transparent weighted formula)
  // Python (wt: 5), ML (wt: 5), SQL (wt: 3), Math (wt: 4, baseline 3.0), DL (wt: 4, baseline 1.0)
  // Total weight: 21
  const weightedSum = (previewPython * 5) + (previewML * 5) + (previewSQL * 3) + (3.0 * 4) + (1.0 * 4);
  const calculatedReadiness = Math.round((weightedSum / (21 * 5)) * 100 * 10) / 10;

  return (
    <div className="min-h-screen bg-background text-slate-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 border-b border-surface-border overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-surface-border text-slate-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-primary-600" />
              <span>Career Intelligence & Mathematical Simulation</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
              Simulate your learning decisions.{' '}
              <span className="text-primary-600">Accelerate career readiness.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              CareerTwin AI creates a verified digital representation of your technical competencies,
              enabling you to run deterministic What-If simulations on alternative learning paths before committing hundreds of hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-xs uppercase tracking-wider bg-slate-950 hover:bg-slate-800 text-white shadow-subtle transition-all flex items-center justify-center gap-2"
              >
                <span>Create Your Digital Twin</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-xs uppercase tracking-wider bg-surface border border-surface-border text-slate-700 hover:text-slate-950 hover:bg-surface-subtle transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Platform</span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" /> Transparent Mathematical Scoring
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" /> Zero Fabricated Employment Claims
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" /> Python Tool-Calling Agent
              </span>
            </div>
          </div>

          {/* Interactive Platform Simulation Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-xl bg-surface border border-surface-border shadow-elevation p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-xs font-mono text-slate-500 ml-2">simulation-engine://target/ai-ml-engineer</span>
              </div>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-primary-50 text-primary-700 border border-primary-100">
                Live Simulation Engine Preview
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Radial Gauge */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-surface-subtle rounded-xl border border-surface-border">
                <ReadinessGauge score={calculatedReadiness} size={150} label="AI/ML Engineer Readiness" />
                <p className="text-[11px] text-slate-500 text-center mt-3 leading-relaxed">
                  Adjust competency levels on the right to see the deterministic weighted score update instantly.
                </p>
              </div>

              {/* Sliders */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Python Proficiency</span>
                    <span className="font-mono text-primary-700 font-bold">{previewPython.toFixed(1)} / 5.0</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.5"
                    value={previewPython}
                    onChange={(e) => setPreviewPython(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Machine Learning Competency</span>
                    <span className="font-mono text-primary-700 font-bold">{previewML.toFixed(1)} / 5.0</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="5.0"
                    step="0.5"
                    value={previewML}
                    onChange={(e) => setPreviewML(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>SQL & Relational Architecture</span>
                    <span className="font-mono text-primary-700 font-bold">{previewSQL.toFixed(1)} / 5.0</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="5.0"
                    step="0.5"
                    value={previewSQL}
                    onChange={(e) => setPreviewSQL(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>

                <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Projected Learning Effort:</span>
                  </div>
                  <span className="font-mono font-semibold text-slate-900">
                    ~{Math.round((previewPython + previewML + previewSQL) * 16)} Hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Methodology Section */}
      <section id="how-it-works" className="py-20 bg-surface-subtle border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Methodology</h2>
            <h3 className="text-3xl font-bold text-slate-950 tracking-tight">How CareerTwin AI Operates</h3>
            <p className="text-xs text-slate-600">
              Moving beyond static roadmaps and generic job boards through precision digital modeling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Competency Ingestion",
                desc: "Ingests your educational background, technical proficiencies (0–5 scale), completed projects, and target roles."
              },
              {
                step: "02",
                title: "Gap Diagnostic",
                desc: "Evaluates your profile against structured industry benchmarks, classifying missing competencies by priority."
              },
              {
                step: "03",
                title: "What-If Simulation",
                desc: "Experiment with hypothetical skill acquisitions to see readiness score changes before spending learning time."
              },
              {
                step: "04",
                title: "Adaptive Roadmaps",
                desc: "An Agentic AI mentor generates week-by-week execution roadmaps that adapt as you complete verified milestones."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-surface border border-surface-border space-y-3 shadow-subtle">
                <span className="text-xs font-mono font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                  Step {item.step}
                </span>
                <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Modules Grid */}
      <section id="platform" className="py-20 border-b border-surface-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Platform Capabilities</h2>
            <h3 className="text-3xl font-bold text-slate-950 tracking-tight">Engineered for Technical Career Strategy</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu,
                title: "What-If Simulation Lab",
                desc: "Evaluate alternative learning decisions side-by-side. Compare the ROI of investing in AI/ML versus Cloud Infrastructure."
              },
              {
                icon: Target,
                title: "Competency Gap Diagnostic",
                desc: "Transparent importance weights and priority ranking show exactly which bottlenecks limit your career readiness."
              },
              {
                icon: MessageSquareCode,
                title: "Context-Aware AI Mentor",
                desc: "Powered by Python tool-calling agents with direct access to your verified digital twin data and 8 analytical tools."
              },
              {
                icon: Compass,
                title: "6 In-Demand Career Tracks",
                desc: "Curated benchmarks for AI/ML, Cybersecurity, Data Science, Software Development, Cloud Architecture, and Data Engineering."
              },
              {
                icon: Map,
                title: "Adaptive Learning Roadmaps",
                desc: "Milestones sequenced by gap urgency, complete with task checkboxes and verified completion tracking."
              },
              {
                icon: LineChart,
                title: "Verifiable Evolution Audit",
                desc: "A historical audit log tracking your competency progression over time backed by verified project evidence."
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-xl bg-surface border border-surface-border space-y-3 shadow-subtle hover:border-slate-300 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-center text-primary-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Ethics Notice */}
      <section id="security" className="py-16 bg-surface-subtle border-b border-surface-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-surface-border text-primary-600 mx-auto shadow-subtle">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-slate-950">Ethics, Privacy & Mathematical Transparency</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mx-auto">
            CareerTwin AI adheres to strict data minimization. We do not sell user data, scrape unauthorized credentials,
            or present estimated readiness scores as guaranteed employment outcomes. All scoring models are deterministic and explainable.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Take control of your technical career trajectory.
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Configure your Digital Career Twin, identify high-priority competency gaps, and simulate your next career move.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-slate-950 hover:bg-slate-800 text-white shadow-subtle transition-all"
            >
              Get Started with CareerTwin
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-surface border border-surface-border text-slate-700 hover:text-slate-950"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

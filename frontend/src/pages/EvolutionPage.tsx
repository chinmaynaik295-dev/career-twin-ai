import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DigitalCareerTwin } from '../types';
import { 
  History, Sparkles, TrendingUp, Award, CheckCircle2, 
  Calendar, ArrowRight, RefreshCw, Layers, ShieldCheck 
} from 'lucide-react';

export const EvolutionPage: React.FC = () => {
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [evolutionData, setEvolutionData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [twinData, evol] = await Promise.all([
          api.getTwin(),
          api.getEvolution()
        ]);
        setTwin(twinData);
        setEvolutionData(evol);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading || !twin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    );
  }

  const historyEvents = twin.evolution_history || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/30 text-brand-violet text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Verifiable Growth Audit</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Digital Twin Evolution History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track how your measured competencies and career readiness score evolve over time with verified milestone evidence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-surface-light border border-surface-border text-xs text-slate-300">
            Current Primary Readiness: <strong className="text-brand-cyan font-mono text-sm">{twin.primary_readiness_score}%</strong>
          </div>
        </div>
      </div>

      {/* Baseline vs Current Progression Overview */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-xl bg-surface-light border border-surface-border space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Baseline Initialization</span>
          <p className="text-xl font-bold text-white">2nd Year Engineering</p>
          <p className="text-xs text-slate-400">Initial profile mapped from student onboarding with baseline competencies.</p>
        </div>

        <div className="p-4 rounded-xl bg-surface-light border border-surface-border space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">Active Measured State</span>
          <p className="text-xl font-bold text-brand-cyan">{Object.keys(twin.skills).length} Competencies</p>
          <p className="text-xs text-slate-400">Across Python, Mathematics, ML, SQL, Linux, Networking & Soft Skills.</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Verified Evidence Events</span>
          <p className="text-xl font-bold text-accent-emerald">{historyEvents.length} Milestones</p>
          <p className="text-xs text-slate-300">Logged with tangible evidence or project completions.</p>
        </div>
      </div>

      {/* Current Skill Proficiency Grid */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Current Measured Competency Inventory
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(twin.skills).map(([skill, level]) => (
            <div key={skill} className="p-3 rounded-xl bg-surface-light border border-surface-border">
              <span className="text-xs font-semibold text-slate-200 block truncate">{skill}</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-mono font-bold text-brand-cyan">{level} / 5</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-3 rounded-sm ${
                        i <= level ? 'bg-brand-cyan' : 'bg-surface-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evolution Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-cyan" />
          <span>Verifiable Timeline of Milestones & Evidence</span>
        </h3>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-surface-border">
          {historyEvents.map((evt, idx) => (
            <div key={idx} className="relative flex items-start gap-4 ml-2">
              <div className="w-7 h-7 rounded-full bg-surface-light border border-brand-cyan/40 flex items-center justify-center shrink-0 z-10 text-brand-cyan shadow-glow-cyan">
                <CheckCircle2 className="w-4 h-4" />
              </div>

              <div className="flex-1 p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                  <h4 className="text-sm font-bold text-white">{evt.event}</h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    {evt.timestamp.split('T')[0] || evt.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{evt.details}</p>

                {evt.improvements && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {Object.entries(evt.improvements).map(([s, delta]: any) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-mono">
                        {s}: {delta.previous} ➔ {delta.current} (+{delta.boost})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

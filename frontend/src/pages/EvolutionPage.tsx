import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { DigitalCareerTwin } from '../types';
import { 
  History, Sparkles, TrendingUp, Award, CheckCircle2, 
  Calendar, ArrowRight, RefreshCw, Layers, ShieldCheck,
  AlertCircle
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading evolution audit log...</p>
        </div>
      </div>
    );
  }

  const hasConfiguredTwin = Object.keys(twin.skills || {}).length > 0;
  const historyEvents = twin.evolution_history || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-1">
            <History className="w-4 h-4" />
            <span>Verifiable Growth Audit Trail</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Twin Evolution History</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Audit log of verified competency increases, milestone completions, and readiness score progression over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 shadow-subtle text-xs text-slate-600">
            Current Primary Readiness:{' '}
            <strong className="text-primary-700 font-mono font-bold text-sm">
              {twin.primary_readiness_score}%
            </strong>
          </div>
        </div>
      </div>

      {!hasConfiguredTwin && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-900">Digital Twin baseline not set</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Complete your profile onboarding to establish your verified baseline and start tracking evolution.
              </p>
            </div>
          </div>
          <Link
            to="/onboarding"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shrink-0"
          >
            Configure Profile
          </Link>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-surface-border shadow-subtle space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Academic / Career Baseline
          </span>
          <p className="text-lg font-bold text-slate-900">
            {twin.academic_year || 'Undergraduate'}
          </p>
          <p className="text-xs text-slate-500">
            {twin.education_background || 'Engineering Profile'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-surface-border shadow-subtle space-y-1.5">
          <span className="text-[11px] font-semibold text-primary-700 uppercase tracking-wider">
            Active Verified Competencies
          </span>
          <p className="text-lg font-bold font-mono text-primary-700">
            {Object.keys(twin.skills || {}).length} Skills
          </p>
          <p className="text-xs text-slate-500">Tracked across technical and domain benchmarks</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-subtle space-y-1.5">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
            Verified Audit Events
          </span>
          <p className="text-lg font-bold font-mono text-emerald-700">
            {historyEvents.length} Milestones
          </p>
          <p className="text-xs text-emerald-700">Recorded with verifiable proof and task artifacts</p>
        </div>
      </div>

      {/* Competency Inventory Grid */}
      {hasConfiguredTwin && (
        <div className="p-5 rounded-xl bg-white border border-surface-border shadow-subtle space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Current Measured Competency Inventory
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(twin.skills).map(([skill, level]) => (
              <div
                key={skill}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
              >
                <span className="text-xs font-medium text-slate-800 block truncate">{skill}</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary-700">{level} / 5</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-3 rounded-xs ${
                          i <= level ? 'bg-primary-600' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evolution Timeline */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-600" />
          <span>Verifiable Timeline of Milestones & Evidence</span>
        </h3>

        {historyEvents.length === 0 ? (
          <div className="p-8 rounded-xl bg-white border border-surface-border shadow-subtle text-center space-y-3">
            <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-800">No Verified Evolution Events Recorded</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              As you complete and verify tasks in your Learning Roadmap with proof of work, audit trail entries will be timestamped here.
            </p>
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-subtle transition-colors"
            >
              <span>View Learning Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200">
            {historyEvents.map((evt, idx) => (
              <div key={idx} className="relative flex items-start gap-3.5 ml-1">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-primary-600 flex items-center justify-center shrink-0 z-10 text-primary-600 shadow-subtle">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 p-4 rounded-xl bg-white border border-surface-border shadow-subtle space-y-1.5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <h4 className="text-xs font-bold text-slate-900">{evt.event}</h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      {evt.timestamp ? evt.timestamp.split('T')[0] : 'Recorded'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{evt.details}</p>

                  {evt.improvements && Object.keys(evt.improvements).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {Object.entries(evt.improvements).map(([s, delta]: any) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded bg-primary-50 border border-primary-200 text-primary-700 font-mono"
                        >
                          {s}: {delta.previous} ➔ {delta.current} (+{delta.boost})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CareerPath, SkillGapAnalysis, DigitalCareerTwin } from '../types';
import { 
  Target, AlertTriangle, CheckCircle2, ChevronRight, 
  RefreshCw, Filter, Sparkles, ArrowRight, AlertCircle, Cpu
} from 'lucide-react';
import { RadarCompetencyChart } from '../components/charts/RadarCompetencyChart';
import { SkillGapCard } from '../components/ui/SkillGapCard';

export const SkillGapPage: React.FC = () => {
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('ai-ml-engineer');
  const [gapAnalysis, setGapAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [careersData, twinData] = await Promise.all([
          api.getCareers(),
          api.getTwin()
        ]);
        setCareers(careersData);
        setTwin(twinData);
        const targetId = (twinData.career_goals && twinData.career_goals.length > 0)
          ? twinData.career_goals[0]
          : 'ai-ml-engineer';
        setSelectedCareerId(targetId);
        const analysis = await api.analyzeCareer(targetId);
        setGapAnalysis(analysis);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleCareerChange = async (careerId: string) => {
    setSelectedCareerId(careerId);
    setAnalyzing(true);
    try {
      const analysis = await api.analyzeCareer(careerId);
      setGapAnalysis(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading && !gapAnalysis) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Analyzing competency differentials...</p>
        </div>
      </div>
    );
  }

  const hasConfiguredTwin = twin && Object.keys(twin.skills || {}).length > 0;

  const radarData = gapAnalysis?.skill_gaps.slice(0, 7).map((g) => ({
    skill: g.skill,
    user_level: g.user_level,
    target_level: g.target_level
  })) || [];

  const filteredGaps = (gapAnalysis?.skill_gaps || []).filter((g) => {
    if (filterPriority === 'all') return true;
    return g.priority.toLowerCase() === filterPriority.toLowerCase();
  });

  const highPriorityCount = gapAnalysis?.skill_gaps.filter(g => g.priority === 'High').length || 0;
  const mediumPriorityCount = gapAnalysis?.skill_gaps.filter(g => g.priority === 'Medium').length || 0;
  const metCount = (gapAnalysis?.total_competencies || 0) - (highPriorityCount + mediumPriorityCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-1">
            <Target className="w-4 h-4" />
            <span>Diagnostic Gap Analysis Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Competency Gap Analysis</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Quantitative assessment comparing your verified skill proficiencies against target market expectations.
          </p>
        </div>

        {/* Track Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="track-select" className="text-xs text-slate-500 font-medium">Benchmark Role:</label>
          <select
            id="track-select"
            value={selectedCareerId}
            onChange={(e) => handleCareerChange(e.target.value)}
            disabled={analyzing}
            aria-label="Select benchmark role"
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-subtle"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!hasConfiguredTwin && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-900">Digital Twin baseline not set</p>
              <p className="text-xs text-amber-700 mt-0.5">
                The current diagnostic evaluates against default base metrics. Complete onboarding to generate precise gap metrics.
              </p>
            </div>
          </div>
          <Link
            to="/onboarding"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shrink-0"
          >
            Calibrate Profile
          </Link>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-surface-border shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Target Role Readiness</p>
          <p className="text-2xl font-bold font-mono text-primary-700">
            {gapAnalysis?.readiness_score}%
          </p>
          <p className="text-[11px] text-slate-500">Calculated role benchmark</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-surface-border shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Evaluated Competencies</p>
          <p className="text-2xl font-bold font-mono text-slate-900">
            {gapAnalysis?.total_competencies || 0}
          </p>
          <p className="text-[11px] text-slate-500">Skills & domain areas</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-surface-border shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">High-Priority Bottlenecks</p>
          <p className="text-2xl font-bold font-mono text-rose-600">
            {highPriorityCount}
          </p>
          <p className="text-[11px] text-slate-500">Gap ≥ 2.0 with high weight</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-surface-border shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Requirements Satisfied</p>
          <p className="text-2xl font-bold font-mono text-emerald-700">
            {Math.max(0, metCount)}
          </p>
          <p className="text-[11px] text-slate-500">Meeting target proficiency</p>
        </div>
      </div>

      {/* Radar Chart & Simulation Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-surface-border shadow-subtle space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Competency Alignment Radar</h3>
              <p className="text-xs text-slate-500">Visual overlay of verified score versus role requirements</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              {gapAnalysis?.career_title}
            </span>
          </div>

          <div className="h-[280px]">
            <RadarCompetencyChart data={radarData} />
          </div>
        </div>

        {/* Simulation Callout */}
        <div className="p-5 rounded-xl bg-primary-50/70 border border-primary-100 shadow-subtle flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Simulate Skill Remediation</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Test how dedicating focused learning hours or completing portfolio projects will close these specific bottlenecks and increase your readiness.
              </p>
            </div>
          </div>

          <Link
            to="/simulation"
            className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors flex items-center justify-center gap-2 shadow-subtle"
          >
            <span>Launch Simulation Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Skill Gap Cards with Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Competency Diagnostic Breakdown</h3>
            <p className="text-xs text-slate-500">Target proficiencies and recommended closure actions</p>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <span className="text-xs text-slate-500 font-medium mr-1">Filter:</span>
            {['all', 'high', 'medium', 'low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterPriority(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                  filterPriority === f
                    ? 'bg-primary-50 text-primary-700 font-semibold border border-primary-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGaps.map((gap, i) => (
            <SkillGapCard key={i} gap={gap} />
          ))}
        </div>
      </div>
    </div>
  );
};

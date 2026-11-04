import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CareerPath, SkillGapAnalysis, DigitalCareerTwin } from '../types';
import { 
  Target, AlertTriangle, CheckCircle2, ChevronRight, 
  RefreshCw, Filter, Sparkles, ArrowRight 
} from 'lucide-react';
import { RadarCompetencyChart } from '../components/charts/RadarCompetencyChart';
import { SkillGapCard } from '../components/ui/SkillGapCard';
import { Link } from 'react-router-dom';

export const SkillGapPage: React.FC = () => {
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('ai-ml-engineer');
  const [gapAnalysis, setGapAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [careersData, twinData] = await Promise.all([
          api.getCareers(),
          api.getTwin()
        ]);
        setCareers(careersData);
        setTwin(twinData);
        const analysis = await api.analyzeCareer(selectedCareerId);
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
    setLoading(true);
    try {
      const analysis = await api.analyzeCareer(careerId);
      setGapAnalysis(analysis);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !gapAnalysis) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    );
  }

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light border border-accent-rose/30 text-rose-400 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Diagnostic Gap Analysis Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Competency Gap Diagnostic</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real mathematical comparison between your current proficiencies and industry career benchmarks
          </p>
        </div>

        {/* Track Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Career:</span>
          <select
            value={selectedCareerId}
            onChange={(e) => handleCareerChange(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-surface border border-surface-border text-xs font-semibold text-white focus:outline-none focus:border-brand-cyan"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <p className="text-xs text-slate-400">Target Role Readiness</p>
          <p className="text-2xl font-mono font-extrabold text-brand-cyan mt-1">
            {gapAnalysis?.readiness_score}%
          </p>
          <span className="text-[10px] text-slate-500">Transparent deterministic score</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <p className="text-xs text-slate-400">Total Competencies</p>
          <p className="text-2xl font-mono font-extrabold text-white mt-1">
            {gapAnalysis?.total_competencies}
          </p>
          <span className="text-[10px] text-slate-500">Evaluated skills & traits</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <p className="text-xs text-slate-400">High-Priority Bottlenecks</p>
          <p className="text-2xl font-mono font-extrabold text-rose-400 mt-1">
            {highPriorityCount}
          </p>
          <span className="text-[10px] text-slate-500">Gap ≥ 2.0 & Importance ≥ 4</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <p className="text-xs text-slate-400">Competencies Met</p>
          <p className="text-2xl font-mono font-extrabold text-accent-emerald mt-1">
            {(gapAnalysis?.total_competencies || 0) - (highPriorityCount + mediumPriorityCount)}
          </p>
          <span className="text-[10px] text-slate-500">Meeting minimum requirements</span>
        </div>
      </div>

      {/* Radar Chart & High-Level Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-white">Competency Alignment Radar</h3>
              <p className="text-xs text-slate-400">Visual comparison of your level vs required proficiency</p>
            </div>
            <span className="text-xs font-mono text-brand-cyan">{gapAnalysis?.career_title}</span>
          </div>
          <div className="h-[280px]">
            <RadarCompetencyChart data={radarData} />
          </div>
        </div>

        {/* Quick CTA to Simulation Lab */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-light border border-surface-border flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">
              Simulation Recommendation
            </span>
            <h3 className="text-lg font-bold text-white">Bridge the gap with What-If simulations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curious how fast your readiness score increases if you dedicate 40 hours to mastering{' '}
              <strong className="text-brand-cyan">Machine Learning</strong> or <strong className="text-brand-cyan">PyTorch</strong>?
            </p>
          </div>

          <Link
            to="/simulation"
            className="w-full py-3 rounded-xl text-xs font-bold bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 transition-all flex items-center justify-center gap-2 shadow-glow-cyan"
          >
            <span>Simulate Skill Uplift Now</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>
        </div>
      </div>

      {/* Detailed Skill Gap Cards with Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">All Competencies & Gap Actions</h3>
            <p className="text-xs text-slate-400">Detailed diagnostic across technical and soft skill benchmarks</p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Filter:</span>
            {['all', 'high', 'medium', 'low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterPriority(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase tracking-wider border transition-all ${
                  filterPriority === f
                    ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                    : 'bg-surface-light border-surface-border text-slate-400 hover:text-white'
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

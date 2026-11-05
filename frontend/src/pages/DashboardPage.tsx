import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { DigitalCareerTwin, CareerPath } from '../types';
import { 
  Sparkles, Cpu, Target, MessageSquareCode, Map, History, 
  ArrowRight, TrendingUp, AlertTriangle, RefreshCw, ChevronRight,
  UserCircle, PlusCircle, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import { ReadinessGauge } from '../components/charts/ReadinessGauge';
import { RadarCompetencyChart } from '../components/charts/RadarCompetencyChart';
import { SkillGapCard } from '../components/ui/SkillGapCard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>('ai-ml-engineer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [twinData, careersData] = await Promise.all([
          api.getTwin(),
          api.getCareers()
        ]);
        setTwin(twinData);
        setCareers(careersData);
        if (twinData.career_goals && twinData.career_goals.length > 0) {
          setSelectedGoal(twinData.career_goals[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading career intelligence profile...</p>
        </div>
      </div>
    );
  }

  // Check if user has an empty twin
  const hasConfiguredTwin = twin && (Object.keys(twin.skills || {}).length > 0 || (twin.career_goals || []).length > 0);

  if (!hasConfiguredTwin) {
    return (
      <div className="space-y-6">
        <div className="p-8 sm:p-12 rounded-xl bg-surface border border-surface-border text-center max-w-2xl mx-auto space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mx-auto">
            <UserCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-950">Welcome to CareerTwin AI, {user?.name || 'there'}!</h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            Your Digital Career Twin does not have any competencies or target career tracks configured yet.
            Complete the 4-step onboarding to establish your measured baseline and calculate transparent readiness scores.
          </p>
          <div className="pt-2">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-white shadow-subtle transition-all"
            >
              <span>Configure Digital Career Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeCareer = careers.find((c) => c.id === selectedGoal) || careers[0];

  // Radar data
  const radarData = activeCareer?.required_skills.slice(0, 7).map((req) => ({
    skill: req.name,
    user_level: twin?.skills[req.name] || 0,
    target_level: req.target_proficiency,
  })) || [];

  const currentScore = twin?.readiness_by_career[selectedGoal]?.score || twin?.primary_readiness_score || 0;

  return (
    <div className="space-y-8">
      {/* Top Profile Summary Header */}
      <div className="p-6 sm:p-8 rounded-xl bg-surface border border-surface-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-emerald" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Digital Career Twin
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
            {twin?.name || user?.name}
          </h1>

          <p className="text-xs text-slate-600">
            {twin?.degree ? `${twin.degree} • ` : ''}
            {twin?.academic_year ? `${twin.academic_year} • ` : ''}
            {twin?.institution ? `${twin.institution} • ` : ''}
            <strong className="text-slate-900 font-mono font-medium">{Object.keys(twin?.skills || {}).length} competencies logged</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/simulation"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-white shadow-subtle transition-all flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Simulation Lab</span>
          </Link>

          <Link
            to="/mentor"
            className="px-4 py-2 rounded-lg text-xs font-medium bg-surface border border-surface-border text-slate-700 hover:text-slate-900 hover:bg-surface-subtle transition-all flex items-center gap-1.5"
          >
            <MessageSquareCode className="w-3.5 h-3.5 text-primary-600" />
            <span>Ask AI Mentor</span>
          </Link>
        </div>
      </div>

      {/* Target Goal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-500 font-medium shrink-0 mr-1">Benchmark Track:</span>
        {careers.map((career) => {
          const isSelected = selectedGoal === career.id;
          const score = twin?.readiness_by_career[career.id]?.score || 0;
          return (
            <button
              key={career.id}
              onClick={() => setSelectedGoal(career.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all ${
                isSelected
                  ? 'bg-primary-50 border-primary-200 text-primary-800 font-semibold shadow-subtle'
                  : 'bg-surface border-surface-border text-slate-600 hover:text-slate-900 hover:bg-surface-subtle'
              }`}
            >
              <span>{career.title}</span>
              <span className={`ml-2 font-mono font-bold ${score >= 50 ? 'text-accent-emerald' : 'text-primary-700'}`}>
                {score}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Gauge (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-surface border border-surface-border shadow-card flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-primary-600" />
                <span>Readiness Score</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Scale 0-100%</span>
            </div>

            <div className="my-4">
              <ReadinessGauge score={currentScore} size={160} label={`${activeCareer?.title || 'Target'} Benchmark`} />
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Evaluated Track:</span>
                <strong className="text-slate-900">{activeCareer?.title}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Industry Demand:</span>
                <span className="text-accent-emerald font-semibold">{activeCareer?.market_outlook}</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-600">
                <span>Typical Salary Range:</span>
                <span className="font-mono text-slate-800">{activeCareer?.average_salary_range}</span>
              </div>
            </div>
          </div>

          <Link
            to="/gaps"
            className="w-full py-2.5 rounded-lg text-xs font-semibold bg-surface-subtle border border-surface-border text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Analyze Skill Gaps</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Competency Radar (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-surface border border-surface-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Multi-Axis Competency Alignment</h2>
              <p className="text-xs text-slate-500">Comparing your proficiency against role requirements</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-slate-600">
              0.0 to 5.0 Scale
            </span>
          </div>

          <div className="h-[280px]">
            <RadarCompetencyChart data={radarData} />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Score formula: Sum(User Proficiency × Importance) / Sum(Importance) × 20</span>
            <Link to="/simulation" className="text-primary-600 hover:underline flex items-center gap-1 font-medium">
              Simulate skill boosts <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Critical Competency Gaps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Priority Competency Bottlenecks</span>
            </h2>
            <p className="text-xs text-slate-500">Bridge these competencies to achieve highest readiness uplift</p>
          </div>
          <Link to="/gaps" className="text-xs text-primary-600 hover:underline flex items-center gap-1 font-medium">
            View full gap analysis <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {twin?.top_missing_skills && twin.top_missing_skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {twin.top_missing_skills.slice(0, 3).map((gap, idx) => (
              <SkillGapCard key={idx} gap={gap} />
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-surface border border-surface-border text-center text-xs text-slate-500">
            All core competencies meet or exceed current target benchmarks for this track.
          </div>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/roadmap"
          className="p-5 rounded-xl bg-surface border border-surface-border hover:border-slate-300 transition-all shadow-subtle group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
              Adaptive Learning Roadmap
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Execute weekly milestone schedules designed specifically to bridge your priority skill gaps.
          </p>
        </Link>

        <Link
          to="/simulation"
          className="p-5 rounded-xl bg-surface border border-surface-border hover:border-slate-300 transition-all shadow-subtle group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
              What-If Simulation Lab
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hypothetically boost skill levels and compare alternative learning paths before committing effort.
          </p>
        </Link>

        <Link
          to="/evolution"
          className="p-5 rounded-xl bg-surface border border-surface-border hover:border-slate-300 transition-all shadow-subtle group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
              Twin Evolution Timeline
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review verifiable milestone audit logs and see your readiness progress over time.
          </p>
        </Link>
      </div>
    </div>
  );
};

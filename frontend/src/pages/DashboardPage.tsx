import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { DigitalCareerTwin, CareerPath } from '../types';
import { 
  Sparkles, Cpu, Target, MessageSquareCode, Map, History, 
  ArrowRight, ShieldCheck, TrendingUp, AlertTriangle, BookOpen, 
  ChevronRight, RefreshCw, Star 
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

  if (loading || !twin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin" />
          <p className="text-xs text-slate-400">Loading your Digital Career Twin...</p>
        </div>
      </div>
    );
  }

  // Active targeted career
  const activeCareer = careers.find((c) => c.id === selectedGoal) || careers[0];

  // Radar data comparing user level vs career target level
  const radarData = activeCareer?.required_skills.slice(0, 7).map((req) => ({
    skill: req.name,
    user_level: twin.skills[req.name] || 0,
    target_level: req.target_proficiency,
  })) || [];

  const currentScore = twin.readiness_by_career[selectedGoal]?.score || twin.primary_readiness_score || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Greeting Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-surface via-surface-light to-surface border border-surface-border relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital Career Twin Active • ID: {twin.user_id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {twin.name}!
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {twin.degree} • <strong className="text-white">{twin.academic_year}</strong> at {twin.institution}.
              Your twin has <strong className="text-brand-cyan">{Object.keys(twin.skills).length} measured skills</strong> and {twin.career_goals.length} target career tracks mapped.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/simulation"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 transition-all flex items-center gap-1.5 shadow-glow-cyan"
            >
              <Cpu className="w-4 h-4 text-slate-950" />
              <span>Open Simulation Lab</span>
            </Link>

            <Link
              to="/mentor"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-surface-light border border-surface-border text-slate-200 hover:text-white flex items-center gap-1.5"
            >
              <MessageSquareCode className="w-4 h-4 text-brand-cyan" />
              <span>Ask AI Mentor</span>
            </Link>
          </div>
        </div>

        {/* Quick Career Goal Selector Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-surface-border/60 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 font-medium shrink-0 mr-2">Benchmark Target:</span>
          {careers.map((career) => {
            const isSelected = selectedGoal === career.id;
            const score = twin.readiness_by_career[career.id]?.score || 0;
            return (
              <button
                key={career.id}
                onClick={() => setSelectedGoal(career.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all ${
                  isSelected
                    ? 'bg-brand-cyan/15 border-brand-cyan text-white shadow-sm'
                    : 'bg-surface-light/60 border-surface-border text-slate-400 hover:text-white'
                }`}
              >
                <span>{career.title}</span>
                <span className={`ml-2 font-mono font-bold ${score >= 50 ? 'text-accent-emerald' : 'text-brand-cyan'}`}>
                  {score}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Career Readiness Diagnostic */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-cyan" />
                <span>Career Readiness Diagnostic</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Scale 0-100%</span>
            </div>

            <div className="my-6">
              <ReadinessGauge
                score={currentScore}
                size={180}
                label={`${activeCareer?.title || 'Target'} Readiness`}
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-surface-border/40 text-slate-300">
                <span>Evaluated Target Role:</span>
                <strong className="text-white">{activeCareer?.title}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-border/40 text-slate-300">
                <span>Market Outlook:</span>
                <span className="text-accent-emerald font-semibold">{activeCareer?.market_outlook}</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-300">
                <span>Average Salary Range:</span>
                <span className="font-mono text-slate-200">{activeCareer?.average_salary_range}</span>
              </div>
            </div>
          </div>

          <Link
            to="/gaps"
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-surface-light border border-surface-border text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
          >
            <span>Inspect Full Skill Gap Breakdown</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Center Col: Radar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-indigo" />
                <span>Multi-Axis Competency Radar</span>
              </h2>
              <p className="text-xs text-slate-400">Measured level vs target requirements across key competencies</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-light border border-surface-border text-slate-400">
              0 to 5 Proficiency
            </span>
          </div>

          <div className="h-[300px]">
            <RadarCompetencyChart data={radarData} />
          </div>

          <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-xs text-slate-400">
            <span>Formula: Weighted Importance × Level / Sum(Importance) × 20</span>
            <Link to="/simulation" className="text-brand-cyan hover:underline flex items-center gap-1">
              Simulate skill boosts <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* High-Priority Gaps & Recommended Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Missing Skills */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Critical Competency Gaps Identified</span>
              </h2>
              <p className="text-xs text-slate-400">Elevate these competencies to rapidly boost your readiness score</p>
            </div>
            <Link to="/gaps" className="text-xs text-brand-cyan hover:underline flex items-center gap-1">
              View all gaps <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {twin.top_missing_skills.map((gap, idx) => (
              <SkillGapCard key={idx} gap={gap} />
            ))}
          </div>
        </div>

        {/* Actionable Next Steps & Agent Recommendation */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-emerald" />
            <span>Agentic Recommendations</span>
          </h2>

          <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-4">
            <div className="p-3.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">
                Recommended Strategic Action
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                Your highest ROI pivot is <strong>Machine Learning (+3.0 gap)</strong>. Completing a practical project in PyTorch will increase your AI/ML readiness from <strong>{currentScore}%</strong> to <strong>{Math.min(100, Math.round(currentScore + 18))}%</strong>.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <Link
                to="/roadmap"
                className="p-3 rounded-xl bg-surface-light border border-surface-border hover:border-slate-500 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Map className="w-4 h-4 text-accent-emerald" />
                  <div>
                    <p className="font-semibold text-white group-hover:text-brand-cyan">View 8-Week Adaptive Roadmap</p>
                    <p className="text-[11px] text-slate-400">Weekly milestones & tasks</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </Link>

              <Link
                to="/mentor"
                className="p-3 rounded-xl bg-surface-light border border-surface-border hover:border-slate-500 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquareCode className="w-4 h-4 text-brand-indigo" />
                  <div>
                    <p className="font-semibold text-white group-hover:text-brand-cyan">Ask AI Mentor Questions</p>
                    <p className="text-[11px] text-slate-400">Grounded in your digital twin</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </Link>

              <Link
                to="/evolution"
                className="p-3 rounded-xl bg-surface-light border border-surface-border hover:border-slate-500 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-brand-violet" />
                  <div>
                    <p className="font-semibold text-white group-hover:text-brand-cyan">Check Twin Evolution Timeline</p>
                    <p className="text-[11px] text-slate-400">{twin.evolution_history.length} verified milestone events</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

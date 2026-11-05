import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CareerPath, DigitalCareerTwin } from '../types';
import { 
  Compass, ArrowRightLeft, Briefcase, TrendingUp, 
  CheckCircle2, AlertCircle, RefreshCw, Layers, ExternalLink,
  ChevronRight, Sparkles, Target, Award, ArrowUpRight, X
} from 'lucide-react';

export const CareerExplorerPage: React.FC = () => {
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  
  // Comparison state
  const [compareCareer1, setCompareCareer1] = useState<string>('ai-ml-engineer');
  const [compareCareer2, setCompareCareer2] = useState<string>('cloud-devops-architect');
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [careersData, twinData] = await Promise.all([
          api.getCareers(),
          api.getTwin()
        ]);
        setCareers(careersData);
        setTwin(twinData);
        if (careersData.length > 0) {
          setSelectedCareer(careersData[0]);
          if (careersData.length > 1) {
            setCompareCareer1(careersData[0].id);
            setCompareCareer2(careersData[1].id);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRunComparison = async (c1 = compareCareer1, c2 = compareCareer2) => {
    setComparing(true);
    try {
      const res = await api.compareCareers(c1, c2);
      setComparisonResult(res);
      setShowCompare(true);
    } catch (e) {
      console.error(e);
    } finally {
      setComparing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading career intelligence tracks...</p>
        </div>
      </div>
    );
  }

  const hasConfiguredTwin = twin && Object.keys(twin.skills || {}).length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-1">
            <Compass className="w-4 h-4" />
            <span>Industry Benchmark & Career Taxonomy</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Career Explorer</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Evaluate current market demands, required competencies, and salary trajectories across high-growth engineering tracks.
          </p>
        </div>

        <button
          onClick={() => handleRunComparison()}
          disabled={comparing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-subtle transition-colors shrink-0"
        >
          {comparing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRightLeft className="w-3.5 h-3.5 text-primary-600" />}
          <span>Compare Tracks</span>
        </button>
      </div>

      {!hasConfiguredTwin && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-900">Your Digital Twin is uncalibrated</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Complete your onboarding profile to benchmark your measured competency against target requirements.
              </p>
            </div>
          </div>
          <Link
            to="/onboarding"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shrink-0"
          >
            Configure Twin
          </Link>
        </div>
      )}

      {/* Comparison Drawer / Card */}
      {showCompare && comparisonResult && (
        <div className="p-6 rounded-xl bg-white border border-primary-200 shadow-subtle space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Comparative Career Evaluation</h2>
                <p className="text-[11px] text-slate-500">Benchmark readiness differentials and missing skill burdens</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <select
                  value={compareCareer1}
                  onChange={(e) => {
                    setCompareCareer1(e.target.value);
                    handleRunComparison(e.target.value, compareCareer2);
                  }}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  {careers.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                <span className="text-xs text-slate-400">vs</span>
                <select
                  value={compareCareer2}
                  onChange={(e) => {
                    setCompareCareer2(e.target.value);
                    handleRunComparison(compareCareer1, e.target.value);
                  }}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  {careers.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowCompare(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Career 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {comparisonResult.career_1?.career?.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{comparisonResult.career_1?.career?.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-primary-700">
                    {comparisonResult.career_1?.readiness_score}%
                  </span>
                  <p className="text-[10px] text-slate-500">Readiness</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {comparisonResult.career_1?.career?.description}
              </p>
              <div className="pt-3 border-t border-slate-200 text-xs flex justify-between text-slate-600">
                <span>Missing Competencies:</span>
                <span className="font-semibold text-rose-600">
                  {comparisonResult.career_1?.missing_count} skills
                </span>
              </div>
            </div>

            {/* Career 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {comparisonResult.career_2?.career?.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{comparisonResult.career_2?.career?.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-indigo-700">
                    {comparisonResult.career_2?.readiness_score}%
                  </span>
                  <p className="text-[10px] text-slate-500">Readiness</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {comparisonResult.career_2?.career?.description}
              </p>
              <div className="pt-3 border-t border-slate-200 text-xs flex justify-between text-slate-600">
                <span>Missing Competencies:</span>
                <span className="font-semibold text-rose-600">
                  {comparisonResult.career_2?.missing_count} skills
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-primary-50/60 border border-primary-100 flex items-center justify-between text-xs text-slate-700">
            <span>
              Higher Current Readiness: <strong className="text-slate-900">{comparisonResult.higher_readiness_career}</strong>
            </span>
            <span className="font-mono font-semibold text-primary-700">
              Score Differential: +{comparisonResult.score_difference} pts
            </span>
          </div>
        </div>
      )}

      {/* Career Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {careers.map((career) => {
          const score = twin?.readiness_by_career?.[career.id]?.score || 0;
          const isSelected = selectedCareer?.id === career.id;

          return (
            <div
              key={career.id}
              onClick={() => setSelectedCareer(career)}
              className={`p-5 rounded-xl bg-white border cursor-pointer transition-all flex flex-col justify-between space-y-4 shadow-subtle ${
                isSelected
                  ? 'border-primary-600 ring-2 ring-primary-100'
                  : 'border-surface-border hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {career.category}
                  </span>
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-primary-700">
                      {hasConfiguredTwin ? `${score}%` : '—'}
                    </span>
                    <p className="text-[9px] text-slate-400 uppercase">Readiness</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                    {career.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                    {career.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {career.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-surface-border text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Growth Outlook:</span>
                  <span className="font-semibold text-emerald-700">{career.market_outlook}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Salary Range:</span>
                  <span className="font-mono text-slate-800 font-medium">{career.average_salary_range}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {career.required_skills.slice(0, 3).map((s) => (
                    <span
                      key={s.name}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200"
                    >
                      {s.name}
                    </span>
                  ))}
                  {career.required_skills.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-400">
                      +{career.required_skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Career Detailed Inspection */}
      {selectedCareer && (
        <div className="p-6 rounded-xl bg-white border border-surface-border shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-surface-border">
            <div>
              <span className="text-[11px] font-semibold text-primary-700 uppercase tracking-wider">
                Track Requirements & Benchmark
              </span>
              <h2 className="text-lg font-bold text-slate-900">{selectedCareer.title}</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">{selectedCareer.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCompareCareer1(selectedCareer.id);
                  handleRunComparison(selectedCareer.id, compareCareer2);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
              >
                Benchmark Against Other Track
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Required Competencies */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Required Technical Competencies
              </h3>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {selectedCareer.required_skills.map((req) => {
                  const userLevel = twin?.skills?.[req.name] || 0;
                  const isMet = userLevel >= req.target_proficiency;

                  return (
                    <div
                      key={req.name}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900">{req.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                            Weight: {req.importance}/5
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{req.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs font-mono font-bold ${isMet ? 'text-emerald-700' : 'text-slate-900'}`}>
                          {hasConfiguredTwin ? userLevel : '—'}
                        </span>
                        <span className="text-xs font-mono text-slate-400"> / {req.target_proficiency}</span>
                        <p className="text-[9px] text-slate-400 uppercase">Proficiency</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Capstone Projects */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Industry Capstone & Portfolio Projects
              </h3>
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {selectedCareer.recommended_projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-medium">
                        {proj.difficulty} • ~{proj.estimated_hours}h
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.skills_targeted.map((st) => (
                        <span
                          key={st}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

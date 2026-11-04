import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CareerPath, DigitalCareerTwin } from '../types';
import { 
  Compass, ArrowRightLeft, Star, Briefcase, TrendingUp, 
  CheckCircle2, AlertCircle, RefreshCw, Layers, ExternalLink 
} from 'lucide-react';
import { ReadinessGauge } from '../components/charts/ReadinessGauge';

export const CareerExplorerPage: React.FC = () => {
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  
  // Comparison modal / drawer state
  const [compareCareer1, setCompareCareer1] = useState<string>('ai-ml-engineer');
  const [compareCareer2, setCompareCareer2] = useState<string>('cybersecurity-engineer');
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [loading, setLoading] = useState(true);

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
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRunComparison = async () => {
    try {
      const res = await api.compareCareers(compareCareer1, compareCareer2);
      setComparisonResult(res);
      setShowCompare(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !twin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light border border-brand-cyan/30 text-brand-cyan text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Structured Industry Competencies</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Career Explorer & Benchmark</h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore industry expectations and benchmark your measured Digital Twin against high-demand tracks
          </p>
        </div>

        <button
          onClick={() => {
            handleRunComparison();
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 transition-all flex items-center gap-2 shadow-glow-cyan"
        >
          <ArrowRightLeft className="w-4 h-4 text-slate-950" />
          <span>Compare Any Two Careers</span>
        </button>
      </div>

      {/* Comparison Drawer / Section if active */}
      {showCompare && comparisonResult && (
        <div className="p-6 rounded-2xl bg-surface border border-brand-cyan/40 shadow-2xl relative space-y-6">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-brand-cyan" />
              <h2 className="text-base font-bold text-white">Side-by-Side Career Evaluation</h2>
            </div>
            <button
              onClick={() => setShowCompare(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close Comparison [✕]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Career 1 */}
            <div className="p-5 rounded-xl bg-surface-light/70 border border-surface-border space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white">{comparisonResult.career_1?.career?.title}</h3>
                  <p className="text-xs text-slate-400">{comparisonResult.career_1?.career?.category}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-extrabold text-brand-cyan">
                    {comparisonResult.career_1?.readiness_score}%
                  </span>
                  <p className="text-[10px] text-slate-400">Readiness</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{comparisonResult.career_1?.career?.description}</p>
              <div className="text-xs text-slate-400 pt-2 border-t border-surface-border/60">
                <span>Missing Competencies: </span>
                <strong className="text-rose-400">{comparisonResult.career_1?.missing_count} skills</strong>
              </div>
            </div>

            {/* Career 2 */}
            <div className="p-5 rounded-xl bg-surface-light/70 border border-surface-border space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white">{comparisonResult.career_2?.career?.title}</h3>
                  <p className="text-xs text-slate-400">{comparisonResult.career_2?.career?.category}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-extrabold text-brand-indigo">
                    {comparisonResult.career_2?.readiness_score}%
                  </span>
                  <p className="text-[10px] text-slate-400">Readiness</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{comparisonResult.career_2?.career?.description}</p>
              <div className="text-xs text-slate-400 pt-2 border-t border-surface-border/60">
                <span>Missing Competencies: </span>
                <strong className="text-rose-400">{comparisonResult.career_2?.missing_count} skills</strong>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-light border border-surface-border flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Higher current readiness: <strong className="text-white">{comparisonResult.higher_readiness_career}</strong>
            </span>
            <span className="font-mono text-brand-cyan">Difference: +{comparisonResult.score_difference} pts</span>
          </div>
        </div>
      )}

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map((career) => {
          const score = twin.readiness_by_career[career.id]?.score || 0;
          const isSelected = selectedCareer?.id === career.id;

          return (
            <div
              key={career.id}
              onClick={() => setSelectedCareer(career)}
              className={`p-6 rounded-2xl bg-surface border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 group ${
                isSelected
                  ? 'border-brand-cyan shadow-glow-cyan bg-surface-light/40'
                  : 'border-surface-border hover:border-slate-500'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-light border border-surface-border text-slate-400">
                    {career.category}
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-mono font-extrabold text-brand-cyan">{score}%</span>
                    <p className="text-[9px] text-slate-400 uppercase">Twin Readiness</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
                    {career.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mt-0.5 line-clamp-1">{career.tagline}</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{career.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-surface-border/60">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Growth Outlook:</span>
                  <span className="text-accent-emerald font-semibold">{career.market_outlook}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Salary Range:</span>
                  <span className="font-mono text-slate-300">{career.average_salary_range}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {career.required_skills.slice(0, 3).map((s) => (
                    <span key={s.name} className="text-[10px] px-2 py-0.5 rounded bg-surface-light text-slate-300 border border-surface-border">
                      {s.name}
                    </span>
                  ))}
                  {career.required_skills.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-light text-slate-500">
                      +{career.required_skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Career Detailed Drawer / Inspection */}
      {selectedCareer && (
        <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-surface-border">
            <div>
              <span className="text-xs font-semibold text-brand-cyan uppercase tracking-wider">Detailed Track Inspection</span>
              <h2 className="text-2xl font-extrabold text-white">{selectedCareer.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{selectedCareer.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCompareCareer1(selectedCareer.id);
                  handleRunComparison();
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-surface-light border border-surface-border text-slate-200 hover:text-white"
              >
                Compare This Track
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Required Competencies */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Required Competencies & Target Expectations</h3>
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {selectedCareer.required_skills.map((req) => {
                  const userLevel = twin.skills[req.name] || 0;
                  return (
                    <div key={req.name} className="p-3 rounded-xl bg-surface-light border border-surface-border flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{req.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface text-slate-400">
                            Importance: {req.importance}/5
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{req.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className="text-xs font-mono font-bold text-brand-cyan">{userLevel}</span>
                        <span className="text-xs font-mono text-slate-500"> / {req.target_proficiency}</span>
                        <p className="text-[9px] text-slate-400">Target</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Practical Projects */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Recommended Capstone & Portfolio Projects</h3>
              <div className="space-y-3">
                {selectedCareer.recommended_projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-surface-light border border-surface-border space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                        {proj.difficulty} • ~{proj.estimated_hours} hrs
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.skills_targeted.map((st) => (
                        <span key={st} className="text-[10px] px-2 py-0.5 rounded bg-surface border border-surface-border text-slate-300">
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

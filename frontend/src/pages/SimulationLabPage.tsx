import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CareerPath, DigitalCareerTwin, SimulationResult } from '../types';
import { 
  Cpu, Sliders, Play, Plus, Trash2, ArrowRight, CheckCircle2, 
  Sparkles, AlertCircle, RefreshCw, Layers, ShieldCheck, Zap 
} from 'lucide-react';
import { ReadinessGauge } from '../components/charts/ReadinessGauge';

export const SimulationLabPage: React.FC = () => {
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('ai-ml-engineer');
  const [scenarioName, setScenarioName] = useState<string>('AI & Data Specialization Pivot');
  const [actions, setActions] = useState<Array<{ skill_name: string; added_proficiency: number; hours: number }>>([
    { skill_name: 'Machine Learning', added_proficiency: 2.0, hours: 36 },
    { skill_name: 'SQL', added_proficiency: 2.0, hours: 30 }
  ]);

  const [newSkill, setNewSkill] = useState<string>('Deep Learning & PyTorch');
  const [newBoost, setNewBoost] = useState<number>(2.0);

  // Simulation execution state
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Scenario Comparison State
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [careersData, twinData] = await Promise.all([
          api.getCareers(),
          api.getTwin()
        ]);
        setCareers(careersData);
        setTwin(twinData);
        // Initial run
        const initialSim = await api.runSimulation({
          career_id: 'ai-ml-engineer',
          scenario_name: 'AI & Data Specialization Pivot',
          learning_actions: actions
        });
        setResult(initialSim);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddAction = () => {
    if (actions.some((a) => a.skill_name === newSkill)) return;
    setActions([...actions, { skill_name: newSkill, added_proficiency: newBoost, hours: Math.round(newBoost * 18) }]);
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleRunSimulation = async () => {
    setSimulating(true);
    setSavedSuccess(false);
    try {
      const sim = await api.runSimulation({
        career_id: selectedCareerId,
        scenario_name: scenarioName,
        learning_actions: actions
      });
      setResult(sim);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  const handleRunTwoScenarioComparison = async () => {
    setSimulating(true);
    try {
      const comparison = await api.compareScenarios({
        career_id: selectedCareerId,
        scenarios: [
          {
            name: "Scenario A: AI & Scientific Data Track",
            actions: [
              { skill_name: "Machine Learning", added_proficiency: 2.0 },
              { skill_name: "SQL", added_proficiency: 2.0 }
            ]
          },
          {
            name: "Scenario B: Infrastructure & Cybersecurity Track",
            actions: [
              { skill_name: "Networking", added_proficiency: 2.5 },
              { skill_name: "Linux", added_proficiency: 2.0 }
            ]
          }
        ]
      });
      setComparisonData(comparison);
      setShowComparison(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  if (loading || !twin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    );
  }

  const selectedCareer = careers.find((c) => c.id === selectedCareerId) || careers[0];
  const allAvailableSkills = selectedCareer.required_skills.map((s) => s.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold mb-2 shadow-glow-cyan">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive What-If Simulation Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Career Simulation Lab</h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate the impact of acquiring new competencies on your career readiness before committing hundreds of learning hours
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunTwoScenarioComparison}
            disabled={simulating}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-surface-light border border-brand-cyan/40 text-brand-cyan hover:bg-brand-cyan/10 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare Scenario A vs B</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal / Box */}
      {showComparison && comparisonData && (
        <div className="p-6 rounded-2xl bg-surface border border-brand-cyan/50 shadow-2xl relative space-y-6">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-cyan" />
              <h2 className="text-base font-bold text-white">Comparative Scenario Simulation Analysis</h2>
            </div>
            <button
              onClick={() => setShowComparison(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close [✕]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisonData.scenarios?.map((sc: any, idx: number) => (
              <div key={idx} className="p-5 rounded-xl bg-surface-light/80 border border-surface-border space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">Option {idx + 1}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{sc.scenario_name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-mono font-bold text-accent-emerald">
                      +{sc.readiness_delta} pts
                    </span>
                    <p className="text-[10px] text-slate-400">Readiness Uplift</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <p>Initial: <strong>{sc.initial_readiness_score}%</strong> ➔ Projected: <strong className="text-brand-cyan">{sc.simulated_readiness_score}%</strong></p>
                  <p>Estimated Learning: <strong className="text-amber-400">{sc.total_estimated_learning_hours} hrs</strong></p>
                </div>

                <div className="pt-2 border-t border-surface-border/60">
                  <p className="text-[11px] text-slate-400">{sc.recommended_next_action}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-surface-light border border-surface-border flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Optimal Strategy: <strong className="text-white">{comparisonData.highest_readiness_scenario}</strong>
            </span>
            <span className="text-accent-emerald font-semibold">{comparisonData.comparison_summary}</span>
          </div>
        </div>
      )}

      {/* Main Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Inputs & Controls) - 5 Cols */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface border border-surface-border space-y-6">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-cyan" />
              <span>Configure Hypothetical Scenario</span>
            </h2>
            <p className="text-xs text-slate-400">Define the skills and learning efforts you want to experiment with</p>
          </div>

          {/* Target Track */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Career Track</label>
            <select
              value={selectedCareerId}
              onChange={(e) => setSelectedCareerId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-xs font-semibold text-white focus:outline-none focus:border-brand-cyan"
            >
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Scenario Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Scenario Label</label>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="e.g. 60-Hour ML & SQL Deep Dive"
              className="w-full px-3 py-2 rounded-xl bg-surface-light border border-surface-border text-xs text-white focus:outline-none focus:border-brand-cyan"
            />
          </div>

          {/* Active Hypothetical Actions List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-medium text-slate-300">
              <span>Hypothetical Learning Actions</span>
              <span className="text-slate-500">{actions.length} skills active</span>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {actions.map((act, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-surface-light border border-surface-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">{act.skill_name}</span>
                    <p className="text-[11px] text-slate-400">
                      Boost: <strong className="text-brand-cyan">+{act.added_proficiency} pts</strong> (~{act.hours} hrs)
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveAction(idx)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Another Skill Boost Row */}
          <div className="p-3.5 rounded-xl bg-surface-light/40 border border-surface-border space-y-3">
            <span className="text-[11px] font-semibold text-slate-300">Add Another Hypothetical Skill Boost:</span>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-white focus:outline-none"
              >
                {allAvailableSkills.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={newBoost}
                onChange={(e) => setNewBoost(Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-white focus:outline-none"
              >
                <option value={1.0}>+1.0 Level (~18 hrs)</option>
                <option value={2.0}>+2.0 Levels (~36 hrs)</option>
                <option value={3.0}>+3.0 Levels (~54 hrs)</option>
                <option value={4.0}>+4.0 Levels (~72 hrs)</option>
              </select>
            </div>

            <button
              onClick={handleAddAction}
              className="w-full py-1.5 rounded-lg text-xs font-semibold bg-surface-border text-slate-200 hover:text-white flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add to Simulation
            </button>
          </div>

          {/* Run Action */}
          <button
            onClick={handleRunSimulation}
            disabled={simulating || actions.length === 0}
            className="w-full py-3 rounded-xl text-xs font-bold bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 transition-all flex items-center justify-center gap-2 shadow-glow-cyan"
          >
            <Play className="w-4 h-4 text-slate-950 fill-current" />
            <span>{simulating ? 'Simulating Mathematical Trajectory...' : 'Run What-If Simulation'}</span>
          </button>
        </div>

        {/* Right Column (Simulation Outcome & Projections) - 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-surface-border">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">Simulated Outcome</span>
                  <h3 className="text-xl font-extrabold text-white">{result.scenario_name}</h3>
                  <p className="text-xs text-slate-400">Target Role: {result.career_title}</p>
                </div>

                {savedSuccess && (
                  <span className="text-xs text-accent-emerald flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Simulation Saved to Profile
                  </span>
                )}
              </div>

              {/* Before vs After Metric Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-light border border-surface-border text-center">
                  <p className="text-xs text-slate-400">Baseline Measured</p>
                  <p className="text-2xl font-mono font-bold text-slate-300 mt-1">
                    {result.initial_readiness_score}%
                  </p>
                  <span className="text-[10px] text-slate-500">Current Twin state</span>
                </div>

                <div className="p-4 rounded-xl bg-surface-light border border-surface-border text-center">
                  <p className="text-xs text-slate-400">Simulated Future</p>
                  <p className="text-2xl font-mono font-extrabold text-brand-cyan mt-1">
                    {result.simulated_readiness_score}%
                  </p>
                  <span className="text-[10px] text-slate-500">Hypothetical outcome</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center">
                  <p className="text-xs text-emerald-400">Projected Uplift</p>
                  <p className="text-2xl font-mono font-extrabold text-accent-emerald mt-1">
                    +{result.readiness_delta} pts
                  </p>
                  <span className="text-[10px] text-emerald-400/80">Readiness gain</span>
                </div>
              </div>

              {/* Skills Improved in Scenario */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Hypothetical Competency Trajectory
                </h4>

                <div className="space-y-2">
                  {result.skills_improved.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-surface-light border border-surface-border flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white">{item.skill}</span>
                        <p className="text-[11px] text-slate-400">
                          {item.previous_level} / 5 ➔ <strong className="text-brand-cyan">{item.simulated_level} / 5</strong> (+{item.gain} pts)
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-amber-400">~{item.estimated_hours} hrs</span>
                        <p className="text-[10px] text-slate-500">Effort</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Effort & Strategic Recommendation */}
              <div className="p-4 rounded-xl bg-surface-light border border-surface-border space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Total Simulated Learning Effort:
                  </span>
                  <strong className="text-amber-400 font-mono text-sm">{result.total_estimated_learning_hours} Hours</strong>
                </div>
                <div className="pt-2 border-t border-surface-border/60">
                  <p className="text-slate-300">
                    <strong className="text-brand-cyan">Recommended Next Step:</strong> {result.recommended_next_action}
                  </p>
                </div>
              </div>

              {/* Ethical Transparency Disclaimer */}
              <div className="p-3.5 rounded-xl bg-surface-light/40 border border-surface-border/60 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p leading-relaxed>
                  <strong className="text-slate-300">Transparent Methodology Notice:</strong> {result.disclaimer}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-surface border border-surface-border text-center space-y-3">
              <Cpu className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No Simulation Run Yet</h3>
              <p className="text-xs text-slate-500">Configure learning actions on the left and click 'Run What-If Simulation'</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CareerPath, DigitalCareerTwin, SimulationResult } from '../types';
import { 
  Cpu, Sliders, Play, Plus, Trash2, ArrowRight, CheckCircle2, 
  Sparkles, AlertCircle, RefreshCw, Layers, ShieldCheck, Zap,
  TrendingUp, X, Clock
} from 'lucide-react';

export const SimulationLabPage: React.FC = () => {
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('ai-ml-engineer');
  const [scenarioName, setScenarioName] = useState<string>('Deep Learning & Systems Specialization');
  const [actions, setActions] = useState<Array<{ skill_name: string; added_proficiency: number; hours: number }>>([
    { skill_name: 'Machine Learning', added_proficiency: 2.0, hours: 36 },
    { skill_name: 'Python', added_proficiency: 1.0, hours: 18 }
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
        const targetId = (twinData.career_goals && twinData.career_goals.length > 0)
          ? twinData.career_goals[0]
          : 'ai-ml-engineer';
        setSelectedCareerId(targetId);

        // Initial run
        const initialSim = await api.runSimulation({
          career_id: targetId,
          scenario_name: 'Deep Learning & Systems Specialization',
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
            name: "Scenario A: Applied AI & Analytics Focus",
            actions: [
              { skill_name: "Machine Learning", added_proficiency: 2.0 },
              { skill_name: "Python", added_proficiency: 1.5 }
            ]
          },
          {
            name: "Scenario B: Systems Engineering & Cloud Focus",
            actions: [
              { skill_name: "System Design", added_proficiency: 2.0 },
              { skill_name: "Cloud Platforms (AWS/GCP)", added_proficiency: 2.0 }
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading simulation engine...</p>
        </div>
      </div>
    );
  }

  const selectedCareer = careers.find((c) => c.id === selectedCareerId) || careers[0];
  const allAvailableSkills = selectedCareer?.required_skills?.map((s) => s.name) || [
    'Python', 'Machine Learning', 'Data Structures', 'System Design'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-1">
            <Cpu className="w-4 h-4" />
            <span>Quantitative What-If Simulation Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Career Simulation Lab</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Simulate the projected readiness impact of acquiring specific competencies or completing structured learning hours before committing your time.
          </p>
        </div>

        <button
          onClick={handleRunTwoScenarioComparison}
          disabled={simulating}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-subtle transition-colors shrink-0"
        >
          <Layers className="w-3.5 h-3.5 text-primary-600" />
          <span>Compare Scenario A vs B</span>
        </button>
      </div>

      {/* Comparison Modal / Section */}
      {showComparison && comparisonData && (
        <div className="p-6 rounded-xl bg-white border border-primary-200 shadow-subtle space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Scenario Simulation Comparison</h2>
                <p className="text-[11px] text-slate-500">Comparative evaluation of two alternative learning trajectories</p>
              </div>
            </div>

            <button
              onClick={() => setShowComparison(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {comparisonData.scenarios?.map((sc: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-semibold text-primary-700 uppercase tracking-wider">
                      Option {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{sc.scenario_name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-emerald-700">
                      +{sc.readiness_delta} pts
                    </span>
                    <p className="text-[10px] text-slate-500">Readiness Uplift</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <p>Baseline: <strong>{sc.initial_readiness_score}%</strong> ➔ Projected: <strong className="text-primary-700">{sc.simulated_readiness_score}%</strong></p>
                  <p>Estimated Effort: <strong className="text-slate-800">{sc.total_estimated_learning_hours} hours</strong></p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <p className="text-[11px] text-slate-500">{sc.recommended_next_action}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-slate-800">
            <span>
              Optimal Trajectory: <strong className="text-emerald-900">{comparisonData.highest_readiness_scenario}</strong>
            </span>
            <span className="font-semibold text-emerald-800">{comparisonData.comparison_summary}</span>
          </div>
        </div>
      )}

      {/* Main Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Inputs & Controls) - 5 Cols */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-surface-border shadow-subtle space-y-5">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary-600" />
              <span>Configure Hypothetical Scenario</span>
            </h2>
            <p className="text-xs text-slate-500">Define the skills and learning efforts you want to experiment with</p>
          </div>

          {/* Target Track */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Target Career Track</label>
            <select
              value={selectedCareerId}
              onChange={(e) => setSelectedCareerId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Scenario Name</label>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="e.g. 60-Hour ML & Cloud Deep Dive"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Active Hypothetical Actions List */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-medium text-slate-700">
              <span>Hypothetical Learning Actions</span>
              <span className="text-slate-400 font-mono text-[11px]">{actions.length} skills</span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {actions.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-900">{act.skill_name}</span>
                    <p className="text-[11px] text-slate-500">
                      Proficiency boost: <strong className="text-primary-700">+{act.added_proficiency}</strong> (~{act.hours}h)
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveAction(idx)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Another Skill Boost Row */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 space-y-2.5">
            <span className="text-xs font-medium text-slate-700">Add Skill Boost:</span>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none"
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
                className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none"
              >
                <option value={1.0}>+1.0 Level (~18h)</option>
                <option value={2.0}>+2.0 Levels (~36h)</option>
                <option value={3.0}>+3.0 Levels (~54h)</option>
                <option value={4.0}>+4.0 Levels (~72h)</option>
              </select>
            </div>

            <button
              onClick={handleAddAction}
              className="w-full py-1.5 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1 shadow-subtle transition-colors"
            >
              <Plus className="w-3 h-3" /> Add to Hypothetical Actions
            </button>
          </div>

          {/* Run Action */}
          <button
            onClick={handleRunSimulation}
            disabled={simulating || actions.length === 0}
            className="w-full py-2.5 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors flex items-center justify-center gap-2 shadow-subtle disabled:opacity-50"
          >
            {simulating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>{simulating ? 'Calculating Trajectory...' : 'Run What-If Simulation'}</span>
          </button>
        </div>

        {/* Right Column (Simulation Outcome & Projections) - 7 Cols */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="p-6 rounded-xl bg-white border border-surface-border shadow-subtle space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-surface-border">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-700">
                    Simulated Outcome
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{result.scenario_name}</h3>
                  <p className="text-xs text-slate-500">Benchmark Role: {result.career_title}</p>
                </div>

                {savedSuccess && (
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Simulation Recorded
                  </span>
                )}
              </div>

              {/* Before vs After Metric Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center space-y-1">
                  <p className="text-xs text-slate-500">Baseline Measured</p>
                  <p className="text-2xl font-mono font-bold text-slate-700">
                    {result.initial_readiness_score}%
                  </p>
                  <p className="text-[10px] text-slate-400">Current baseline</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center space-y-1">
                  <p className="text-xs text-slate-500">Simulated Future</p>
                  <p className="text-2xl font-mono font-bold text-primary-700">
                    {result.simulated_readiness_score}%
                  </p>
                  <p className="text-[10px] text-slate-400">Hypothetical state</p>
                </div>

                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <p className="text-xs text-emerald-800 font-medium">Projected Uplift</p>
                  <p className="text-2xl font-mono font-bold text-emerald-700">
                    +{result.readiness_delta} pts
                  </p>
                  <p className="text-[10px] text-emerald-600">Readiness differential</p>
                </div>
              </div>

              {/* Skills Improved in Scenario */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Hypothetical Competency Trajectory
                </h4>

                <div className="space-y-2">
                  {result.skills_improved.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900">{item.skill}</span>
                        <p className="text-[11px] text-slate-500">
                          {item.previous_level} / 5 ➔ <strong className="text-primary-700">{item.simulated_level} / 5</strong> (+{item.gain} pts)
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-slate-700 font-medium">~{item.estimated_hours}h</span>
                        <p className="text-[10px] text-slate-400">Effort</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Effort & Recommendation */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary-600" /> Total Simulated Learning Effort:
                  </span>
                  <strong className="text-slate-900 font-mono text-sm">{result.total_estimated_learning_hours} Hours</strong>
                </div>
                <div className="pt-2 border-t border-slate-200 text-slate-600">
                  <p>
                    <strong className="text-slate-900">Recommended Next Action:</strong> {result.recommended_next_action}
                  </p>
                </div>
              </div>

              {/* Methodology Notice */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-slate-700">Simulation Methodology:</strong> {result.disclaimer}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-white border border-surface-border text-center space-y-3">
              <Cpu className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-700">No Simulation Executed</h3>
              <p className="text-xs text-slate-500">Configure learning actions on the left and click 'Run What-If Simulation'</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

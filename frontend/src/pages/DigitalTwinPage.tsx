import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { DigitalCareerTwin, CareerPath } from '../types';
import { 
  UserCircle, Target, Sparkles, RefreshCw, Plus, Edit2, 
  CheckCircle2, AlertCircle, TrendingUp, Compass, Award, 
  Save, ShieldCheck, ArrowRight
} from 'lucide-react';
import { ReadinessGauge } from '../components/charts/ReadinessGauge';
import { RadarCompetencyChart } from '../components/charts/RadarCompetencyChart';

export const DigitalTwinPage: React.FC = () => {
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // New skill addition state
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillLevel, setNewSkillLevel] = useState<number>(3);
  const [showAddSkill, setShowAddSkill] = useState<boolean>(false);

  // Editable skills dictionary
  const [editableSkills, setEditableSkills] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [twinData, careersData] = await Promise.all([
          api.getTwin(),
          api.getCareers()
        ]);
        setTwin(twinData);
        setCareers(careersData);
        setEditableSkills(twinData.skills || {});
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSkillChange = (skill: string, value: number) => {
    setEditableSkills(prev => ({
      ...prev,
      [skill]: Math.max(0, Math.min(5, value))
    }));
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setEditableSkills(prev => ({
      ...prev,
      [newSkillName.trim()]: newSkillLevel
    }));
    setNewSkillName('');
    setShowAddSkill(false);
  };

  const handleSaveCompetencies = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.updateProfile({ skills: editableSkills });
      // Re-fetch updated twin
      const updated = await api.getTwin();
      setTwin(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !twin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading Digital Twin...</p>
        </div>
      </div>
    );
  }

  const hasConfiguredTwin = Object.keys(editableSkills).length > 0;
  const primaryGoal = twin.career_goals?.[0] || 'ai-ml-engineer';
  const targetCareer = careers.find(c => c.id === primaryGoal);

  const radarData = targetCareer?.required_skills?.slice(0, 6).map(req => ({
    skill: req.name,
    user_level: editableSkills[req.name] || 0,
    target_level: req.target_proficiency
  })) || Object.entries(editableSkills).slice(0, 6).map(([k, v]) => ({
    skill: k,
    user_level: v,
    target_level: 4.5
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-1">
            <UserCircle className="w-4 h-4" />
            <span>Digital Persona & Competency Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Digital Twin Architecture</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Inspect, calibrate, and verify your personal competencies and career target alignment in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Twin Calibrated
            </span>
          )}
          <button
            onClick={handleSaveCompetencies}
            disabled={saving}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-subtle transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Calibrations</span>
          </button>
        </div>
      </div>

      {!hasConfiguredTwin && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-900">Digital Twin baseline not set</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Complete your onboarding wizard to calibrate your digital twin with verified educational history and career goals.
              </p>
            </div>
          </div>
          <Link
            to="/onboarding"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shrink-0"
          >
            Run Calibration
          </Link>
        </div>
      )}

      {/* Twin Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-surface-border shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Twin Identity</p>
          <p className="text-base font-bold text-slate-900 truncate">{twin.name || 'User Profile'}</p>
          <p className="text-[11px] text-slate-500 truncate">{twin.email}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-surface-border shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Academic Standing</p>
          <p className="text-base font-bold text-slate-900">{twin.academic_year || 'Undergraduate'}</p>
          <p className="text-[11px] text-slate-500 truncate">{twin.education_background || 'Engineering'}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-surface-border shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Primary Career Goal</p>
          <p className="text-base font-bold text-slate-900 truncate">
            {targetCareer?.title || 'AI / ML Engineer'}
          </p>
          <p className="text-[11px] text-primary-700 font-semibold">{targetCareer?.category || 'Specialization'}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-surface-border shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Benchmark Readiness</p>
          <p className="text-2xl font-mono font-bold text-primary-700">
            {twin.primary_readiness_score}%
          </p>
          <p className="text-[11px] text-slate-500">Role benchmark score</p>
        </div>
      </div>

      {/* Radar & Multi-Career Readiness Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-white border border-surface-border shadow-subtle space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Competency Alignment Overlay</h3>
              <p className="text-xs text-slate-500">Comparison of your verified proficiency against role benchmarks</p>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {targetCareer?.title || 'Target Role'}
            </span>
          </div>

          <div className="h-[280px]">
            <RadarCompetencyChart data={radarData} />
          </div>
        </div>

        {/* Readiness Across All Tracks (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-surface-border shadow-subtle space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Readiness Across Tracks</h3>
          <p className="text-xs text-slate-500 pb-1 border-b border-surface-border">
            Calculated deterministic fit against all 6 industry benchmark roles
          </p>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {careers.map(c => {
              const score = twin.readiness_by_career?.[c.id]?.score || 0;
              const isTarget = c.id === primaryGoal;
              return (
                <div
                  key={c.id}
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                    isTarget ? 'bg-primary-50/60 border-primary-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className={`font-semibold truncate ${isTarget ? 'text-primary-900' : 'text-slate-800'}`}>
                      {c.title}
                    </p>
                    <p className="text-[10px] text-slate-500">{c.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-primary-700">{score}%</span>
                    {isTarget && (
                      <span className="block text-[9px] font-semibold text-primary-700 uppercase">Primary</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Competency Calibrator */}
      <div className="p-5 rounded-xl bg-white border border-surface-border shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-surface-border">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Calibrate Competency Ratings</h3>
            <p className="text-xs text-slate-500">
              Adjust proficiency ratings (0.0 - 5.0) to update your Digital Twin representation
            </p>
          </div>

          <button
            onClick={() => setShowAddSkill(!showAddSkill)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Competency</span>
          </button>
        </div>

        {/* Add Skill Row */}
        {showAddSkill && (
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="e.g. Docker, TypeScript, PyTorch"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1 min-w-[200px]"
            />
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600">Level (0-5):</label>
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                className="px-2 py-1.5 rounded-md bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}.0</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddSkill}
              className="px-3 py-1.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium shadow-subtle"
            >
              Add to Profile
            </button>
          </div>
        )}

        {/* Skills Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {Object.entries(editableSkills).map(([skill, level]) => (
            <div
              key={skill}
              className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-900 truncate">{skill}</span>
                <span className="font-mono font-bold text-primary-700 text-xs">
                  {level.toFixed(1)} / 5.0
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={level}
                onChange={(e) => handleSkillChange(skill, parseFloat(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
              />

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Novice (1.0)</span>
                <span>Intermediate (3.0)</span>
                <span>Expert (5.0)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


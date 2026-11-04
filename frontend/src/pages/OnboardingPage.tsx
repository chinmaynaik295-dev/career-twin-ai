import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, GraduationCap, 
  Code, Heart, Target, Layers, Plus, Trash2 
} from 'lucide-react';

const COMMON_SKILLS = [
  'Python', 'Machine Learning', 'Mathematics', 'SQL', 'Deep Learning & PyTorch',
  'MLOps & Model Deployment', 'Linux', 'Networking', 'Cybersecurity', 'C',
  'Web Technologies', 'Cloud Platforms (AWS/GCP/Azure)', 'Containers & Kubernetes'
];

const SOFT_SKILLS = [
  'Problem Solving', 'Analytical Thinking', 'Communication', 'Continuous Learning',
  'Team Collaboration', 'Ethical Judgment'
];

const INTEREST_AREAS = [
  'Artificial Intelligence', 'Cybersecurity', 'Software Development',
  'Data Science & Analytics', 'Cloud Architecture', 'Distributed Systems'
];

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [institution, setInstitution] = useState('National Institute of Engineering');
  const [degree, setDegree] = useState('B.Tech Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('Second year');

  const [skills, setSkills] = useState<Record<string, number>>({
    Python: 3,
    C: 3,
    Mathematics: 3,
    SQL: 1,
    'Machine Learning': 1,
    Linux: 1,
    Networking: 1,
    'Problem Solving': 3
  });

  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([
    'Problem Solving', 'Analytical Thinking'
  ]);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Artificial Intelligence', 'Cybersecurity'
  ]);

  const [selectedCareerGoals, setSelectedCareerGoals] = useState<string[]>([
    'ai-ml-engineer', 'cybersecurity-engineer'
  ]);

  const [projects, setProjects] = useState<Array<{ title: string; description: string; skills_used: string[] }>>([
    {
      title: 'Sorting Algorithm Visualizer',
      description: 'Program demonstrating quicksort and algorithmic analysis.',
      skills_used: ['Python', 'Problem Solving']
    }
  ]);

  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const handleSkillLevelChange = (skillName: string, level: number) => {
    setSkills((prev) => ({ ...prev, [skillName]: level }));
  };

  const toggleSoftSkill = (s: string) => {
    setSelectedSoftSkills((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const toggleInterest = (i: string) => {
    setSelectedInterests((prev) =>
      prev.includes(i) ? prev.filter((item) => item !== i) : [...prev, i]
    );
  };

  const toggleCareerGoal = (goalId: string) => {
    setSelectedCareerGoals((prev) =>
      prev.includes(goalId) ? prev.filter((item) => item !== goalId) : [...prev, goalId]
    );
  };

  const handleAddProject = () => {
    if (!newProjectTitle.trim()) return;
    setProjects([
      ...projects,
      {
        title: newProjectTitle,
        description: newProjectDesc,
        skills_used: ['Python']
      }
    ]);
    setNewProjectTitle('');
    setNewProjectDesc('');
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await api.createProfile({
        name: user?.name || 'Alex',
        institution,
        academic_year: academicYear,
        degree,
        skills,
        soft_skills: selectedSoftSkills,
        interests: selectedInterests,
        career_goals: selectedCareerGoals,
        projects,
        certifications: []
      });
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Wizard Step Indicator */}
      <div className="mb-8 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light border border-brand-cyan/30 text-brand-cyan text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step {currentStep} of 4: Digital Career Twin Ingestion</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Configure Your Career Twin</h2>
        <p className="text-xs text-slate-400">Provide accurate competencies to establish your measured baseline</p>

        {/* Progress Bar */}
        <div className="w-full bg-surface-border h-1.5 rounded-full mt-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-cyan to-brand-indigo h-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-2xl">
        {/* Step 1: Education */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
              <GraduationCap className="w-5 h-5 text-brand-cyan" />
              <div>
                <h3 className="text-base font-semibold text-white">Academic Background</h3>
                <p className="text-xs text-slate-400">Where are you currently studying?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Institution</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-light border border-surface-border text-sm text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Degree Program</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-light border border-surface-border text-sm text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-light border border-surface-border text-sm text-white focus:outline-none focus:border-brand-cyan"
                >
                  <option value="First year">First year</option>
                  <option value="Second year">Second year</option>
                  <option value="Third year">Third year</option>
                  <option value="Final year">Final year</option>
                  <option value="Fresh Graduate">Fresh Graduate</option>
                  <option value="Career Switcher">Career Switcher</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Technical Skills */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
              <Code className="w-5 h-5 text-brand-cyan" />
              <div>
                <h3 className="text-base font-semibold text-white">Technical Skills & Proficiency</h3>
                <p className="text-xs text-slate-400">Rate your current proficiency from 0 (None) to 5 (Expert)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
              {COMMON_SKILLS.map((skillName) => {
                const currentLevel = skills[skillName] || 0;
                return (
                  <div key={skillName} className="p-3 rounded-xl bg-surface-light/60 border border-surface-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-white">{skillName}</span>
                      <span className="text-xs font-mono font-bold text-brand-cyan">{currentLevel} / 5</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleSkillLevelChange(skillName, lvl)}
                          className={`flex-1 py-1 text-[11px] rounded font-mono font-medium transition-colors ${
                            currentLevel === lvl
                              ? 'bg-brand-cyan text-slate-950 font-bold'
                              : 'bg-surface-border text-slate-400 hover:text-white'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Soft Skills & Interests */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
              <Heart className="w-5 h-5 text-brand-cyan" />
              <div>
                <h3 className="text-base font-semibold text-white">Soft Skills & Domain Interests</h3>
                <p className="text-xs text-slate-400">Select what drives your focus and work style</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Soft Skills</label>
              <div className="flex flex-wrap gap-2">
                {SOFT_SKILLS.map((s) => {
                  const active = selectedSoftSkills.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSoftSkill(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        active
                          ? 'bg-brand-indigo/20 border-brand-indigo text-brand-cyan shadow-sm'
                          : 'bg-surface-light border-surface-border text-slate-400 hover:text-white'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 inline mr-1" />}
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Technical Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_AREAS.map((item) => {
                  const active = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        active
                          ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-sm'
                          : 'bg-surface-light border-surface-border text-slate-400 hover:text-white'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 inline mr-1" />}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Goals & Projects */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
              <Target className="w-5 h-5 text-brand-cyan" />
              <div>
                <h3 className="text-base font-semibold text-white">Target Career Goals & Projects</h3>
                <p className="text-xs text-slate-400">Select target roles to benchmark your digital twin against</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Target Career Tracks</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'ai-ml-engineer', label: 'AI/ML Engineer' },
                  { id: 'cybersecurity-engineer', label: 'Cybersecurity Engineer' },
                  { id: 'data-scientist', label: 'Data Scientist' },
                  { id: 'software-developer', label: 'Software Developer' },
                  { id: 'cloud-engineer', label: 'Cloud Engineer' },
                  { id: 'data-engineer', label: 'Data Engineer' },
                ].map((track) => {
                  const active = selectedCareerGoals.includes(track.id);
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => toggleCareerGoal(track.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        active
                          ? 'bg-brand-cyan/15 border-brand-cyan text-white shadow-sm'
                          : 'bg-surface-light border-surface-border text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-medium">{track.label}</span>
                      {active && <Check className="w-4 h-4 text-brand-cyan" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Project Logging */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-300 mb-2">Portfolio Projects (Optional)</label>
              <div className="space-y-2 mb-3">
                {projects.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-surface-light border border-surface-border flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{p.title}</p>
                      <p className="text-[11px] text-slate-400">{p.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-surface-light/40 border border-surface-border space-y-2">
                <input
                  type="text"
                  placeholder="Project Title (e.g. CLI Port Scanner)"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
                />
                <input
                  type="text"
                  placeholder="Short description"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
                />
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-surface-border text-slate-200 hover:text-white flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-surface-border">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-surface-light border border-surface-border flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-brand-blue hover:bg-blue-600 text-white flex items-center gap-1.5 shadow-sm"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-lg text-xs font-bold bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 flex items-center gap-2 shadow-glow-cyan"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>{loading ? 'Initializing Twin...' : 'Launch Digital Twin Dashboard'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

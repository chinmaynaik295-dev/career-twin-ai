import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Check, ArrowRight, ArrowLeft, GraduationCap, 
  Code, Target, Plus, Trash2 
} from 'lucide-react';

const COMMON_SKILLS = [
  'Python', 'Machine Learning', 'Mathematics', 'SQL', 'Deep Learning & PyTorch',
  'MLOps & Model Deployment', 'Linux', 'Networking', 'Cybersecurity', 'C',
  'Web Technologies', 'Cloud Platforms (AWS/GCP/Azure)', 'Containers & Kubernetes',
  'Data Warehousing', 'Distributed Computing (Spark/Kafka)'
];

const SOFT_SKILLS = [
  'Problem Solving', 'Analytical Thinking', 'Communication', 'Continuous Learning',
  'Team Collaboration', 'Ethical Judgment'
];

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [academicYear, setAcademicYear] = useState('Second year');

  const [skills, setSkills] = useState<Record<string, number>>({
    Python: 3.0,
    Mathematics: 3.0,
    'Problem Solving': 3.0
  });

  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([
    'Problem Solving', 'Analytical Thinking'
  ]);

  const [selectedCareerGoals, setSelectedCareerGoals] = useState<string[]>([
    'ai-ml-engineer'
  ]);

  const [projects, setProjects] = useState<Array<{ title: string; description: string; skills_used: string[] }>>([]);
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
        title: newProjectTitle.trim(),
        description: newProjectDesc.trim(),
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
        name: user?.name || '',
        institution,
        academic_year: academicYear,
        degree,
        skills,
        soft_skills: selectedSoftSkills,
        interests: selectedCareerGoals,
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
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Step Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
            Step {currentStep} of 4 • Profile Configuration
          </span>
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Configure Your Digital Career Twin</h2>
          <p className="text-xs text-slate-600">Provide accurate competency ratings to establish your measured baseline</p>

          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-primary-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-xl bg-surface border border-surface-border shadow-card space-y-6">
          {/* Step 1: Education */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
                <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-center text-primary-700">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Academic Background</h3>
                  <p className="text-xs text-slate-500">Provide your current institution and degree program</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Institution / University</label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Stanford University, MIT, IIT, National Institute"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 shadow-subtle"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Degree Program</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.S. Computer Science, M.S. Data Engineering"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 shadow-subtle"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Academic Year / Stage</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-slate-900 focus:outline-none focus:border-primary-600 shadow-subtle"
                  >
                    <option value="First year">First year undergraduate</option>
                    <option value="Second year">Second year undergraduate</option>
                    <option value="Third year">Third year undergraduate</option>
                    <option value="Final year">Final year undergraduate</option>
                    <option value="Graduate Student">Graduate / Master's Student</option>
                    <option value="Fresh Graduate">Fresh Graduate</option>
                    <option value="Career Switcher">Career Switcher / Professional</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Technical Skills */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
                <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-center text-primary-700">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Technical Competencies</h3>
                  <p className="text-xs text-slate-500">Rate your current proficiency on a standard 0 to 5 scale</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {COMMON_SKILLS.map((skillName) => {
                  const currentLevel = skills[skillName] || 0;
                  return (
                    <div key={skillName} className="p-3 rounded-lg bg-surface-subtle border border-surface-border space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-900 truncate">{skillName}</span>
                        <span className="font-mono font-bold text-primary-700">{currentLevel} / 5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[0, 1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleSkillLevelChange(skillName, lvl)}
                            className={`flex-1 py-1 text-[11px] rounded font-mono font-medium transition-colors ${
                              currentLevel === lvl
                                ? 'bg-primary-600 text-white font-bold shadow-subtle'
                                : 'bg-surface border border-surface-border text-slate-600 hover:text-slate-900'
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

          {/* Step 3: Career Goals & Soft Skills */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
                <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-center text-primary-700">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Target Career Tracks & Soft Skills</h3>
                  <p className="text-xs text-slate-500">Select which careers your digital twin should benchmark against</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Target Career Tracks</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                        className={`p-3 rounded-lg border text-left flex items-center justify-between text-xs font-medium transition-colors ${
                          active
                            ? 'bg-primary-50 border-primary-300 text-primary-900 font-semibold'
                            : 'bg-surface border-surface-border text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>{track.label}</span>
                        {active && <Check className="w-4 h-4 text-primary-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-700 mb-2">Soft Skills</label>
                <div className="flex flex-wrap gap-2">
                  {SOFT_SKILLS.map((s) => {
                    const active = selectedSoftSkills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSoftSkill(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          active
                            ? 'bg-primary-50 border-primary-300 text-primary-700 font-semibold'
                            : 'bg-surface border-surface-border text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 inline mr-1" />}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Projects */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
                <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-center text-primary-700">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Projects & Experience</h3>
                  <p className="text-xs text-slate-500">Record portfolio projects to support your competency baseline</p>
                </div>
              </div>

              {projects.length > 0 && (
                <div className="space-y-2">
                  {projects.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                        <p className="text-[11px] text-slate-600 line-clamp-1">{p.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border space-y-2.5">
                <input
                  type="text"
                  placeholder="Project Title (e.g. Real-Time Stream Processor)"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600"
                />
                <input
                  type="text"
                  placeholder="Brief description of work and technologies used"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600"
                />
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-surface border border-surface-border text-slate-700 hover:text-slate-900 flex items-center gap-1 shadow-subtle"
                >
                  <Plus className="w-3 h-3" /> Add Project
                </button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-surface-border">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-surface border border-surface-border flex items-center gap-1.5 shadow-subtle"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-subtle"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleComplete}
                className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2 shadow-subtle disabled:opacity-50"
              >
                <span>{loading ? 'Initializing Twin...' : 'Generate Digital Career Twin'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

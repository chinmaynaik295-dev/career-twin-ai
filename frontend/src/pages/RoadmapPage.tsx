import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LearningRoadmap, CareerPath, DigitalCareerTwin } from '../types';
import { 
  Map, CheckCircle2, Circle, Clock, Target, Sparkles, 
  RefreshCw, Check, ShieldCheck, ChevronDown, ChevronUp, ArrowRight 
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('ai-ml-engineer');
  const [weeksDuration, setWeeksDuration] = useState<number>(8);
  const [weeklyHours, setWeeklyHours] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [evidenceModalTask, setEvidenceModalTask] = useState<string | null>(null);
  const [evidenceText, setEvidenceText] = useState<string>('Completed coding exercises and pushed to GitHub repo');

  useEffect(() => {
    const init = async () => {
      try {
        const [roadmapData, careersData, twinData] = await Promise.all([
          api.getRoadmap(),
          api.getCareers(),
          api.getTwin()
        ]);
        setRoadmap(roadmapData);
        setCareers(careersData);
        setTwin(twinData);
        if (roadmapData.career_id) {
          setSelectedCareerId(roadmapData.career_id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleGenerateCustomRoadmap = async () => {
    setLoading(true);
    try {
      const generated = await api.generateRoadmap({
        career_id: selectedCareerId,
        target_weeks: weeksDuration,
        weekly_hours: weeklyHours
      });
      setRoadmap(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    if (!currentStatus) {
      // Prompt for verified evidence before checking
      setEvidenceModalTask(taskId);
      return;
    }

    // Uncheck
    setUpdatingTaskId(taskId);
    try {
      await api.updateTask(taskId, false);
      if (roadmap) {
        const updatedMilestones = roadmap.milestones.map((m) => ({
          ...m,
          tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, completed: false } : t)),
          is_completed: false
        }));
        setRoadmap({ ...roadmap, milestones: updatedMilestones });
      }
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleConfirmVerifiedTask = async () => {
    if (!evidenceModalTask || !roadmap) return;
    const taskId = evidenceModalTask;
    setUpdatingTaskId(taskId);
    setEvidenceModalTask(null);

    try {
      await api.updateTask(taskId, true, evidenceText);
      const updatedMilestones = roadmap.milestones.map((m) => {
        const updatedTasks = m.tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t));
        const allDone = updatedTasks.every((t) => t.completed);
        return { ...m, tasks: updatedTasks, is_completed: allDone };
      });

      const totalTasks = updatedMilestones.reduce((acc, m) => acc + m.tasks.length, 0);
      const doneTasks = updatedMilestones.reduce((acc, m) => acc + m.tasks.filter((t) => t.completed).length, 0);
      const newProgress = Math.round((doneTasks / Math.max(1, totalTasks)) * 100);

      setRoadmap({
        ...roadmap,
        milestones: updatedMilestones,
        progress_percentage: newProgress
      });
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading || !roadmap) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    );
  }

  const totalTasksCount = roadmap.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedTasksCount = roadmap.milestones.reduce((acc, m) => acc + m.tasks.filter((t) => t.completed).length, 0);
  const progressPct = roadmap.progress_percentage ?? Math.round((completedTasksCount / Math.max(1, totalTasksCount)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-emerald/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Map className="w-3.5 h-3.5" />
            <span>Adaptive Milestone Execution</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Personalized Learning Roadmap</h1>
          <p className="text-xs text-slate-400 mt-1">
            Weekly milestones dynamically sequenced to bridge your high-priority skill gaps in {roadmap.career_title}
          </p>
        </div>

        {/* Custom Duration & Career Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCareerId}
            onChange={(e) => setSelectedCareerId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface border border-surface-border text-xs font-medium text-white focus:outline-none focus:border-brand-cyan"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            value={weeksDuration}
            onChange={(e) => setWeeksDuration(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-surface border border-surface-border text-xs font-medium text-white focus:outline-none"
          >
            <option value={4}>4 Weeks</option>
            <option value={8}>8 Weeks</option>
            <option value={12}>12 Weeks</option>
          </select>

          <button
            onClick={handleGenerateCustomRoadmap}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 transition-all shadow-glow-cyan"
          >
            Regenerate
          </button>
        </div>
      </div>

      {/* Progress & Readiness Projection Header Card */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">Roadmap Completion</span>
          <p className="text-2xl font-mono font-extrabold text-white">{progressPct}%</p>
          <div className="w-full bg-surface-border h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-accent-emerald h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 pt-1">{completedTasksCount} of {totalTasksCount} tasks verified</p>
        </div>

        <div className="space-y-1 border-t md:border-t-0 md:border-l border-surface-border/60 md:pl-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Duration</span>
          <p className="text-xl font-bold text-white">{roadmap.target_weeks} Weeks</p>
          <p className="text-xs text-amber-400">~{roadmap.total_estimated_hours} Total Hours</p>
        </div>

        <div className="space-y-1 border-t md:border-t-0 md:border-l border-surface-border/60 md:pl-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Measured</span>
          <p className="text-xl font-mono font-bold text-slate-300">{roadmap.initial_readiness}%</p>
          <p className="text-[10px] text-slate-500">Starting baseline</p>
        </div>

        <div className="space-y-1 border-t md:border-t-0 md:border-l border-surface-border/60 md:pl-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent-emerald">Target Projected</span>
          <p className="text-xl font-mono font-bold text-accent-emerald">
            {roadmap.projected_readiness}%
          </p>
          <p className="text-[10px] text-emerald-400">+{Math.round((roadmap.projected_readiness - roadmap.initial_readiness) * 10) / 10} pts uplift</p>
        </div>
      </div>

      {/* Verified Evidence Dialog if active */}
      {evidenceModalTask && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-surface border border-brand-cyan/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-brand-cyan">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Record Verified Milestone Proof</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your Digital Career Twin updates verified competency levels only when supported by tangible learning evidence (e.g. repo URL or summary).
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Evidence / Notes</label>
              <textarea
                rows={3}
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-light border border-surface-border text-xs text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEvidenceModalTask(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVerifiedTask}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 shadow-sm"
              >
                Confirm & Boost Twin (+0.3 pts)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestones Vertical Timeline List */}
      <div className="space-y-6">
        {roadmap.milestones.map((milestone) => (
          <div
            key={milestone.week_number}
            className={`p-6 rounded-2xl bg-surface border transition-all ${
              milestone.is_completed ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-surface-border'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-surface-border/60">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                    milestone.is_completed
                      ? 'bg-accent-emerald text-slate-950'
                      : 'bg-surface-light border border-surface-border text-brand-cyan'
                  }`}
                >
                  {milestone.is_completed ? <Check className="w-4 h-4 stroke-[3]" /> : `W${milestone.week_number}`}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{milestone.title}</h3>
                  <p className="text-xs text-slate-400">Target Competency: <strong className="text-brand-cyan">{milestone.focus_skill}</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 px-2 py-0.5 rounded bg-surface-light border border-surface-border">
                  ~{milestone.estimated_hours} Hours
                </span>
                {milestone.is_completed && (
                  <span className="text-xs text-accent-emerald font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Milestone Completed
                  </span>
                )}
              </div>
            </div>

            {/* Tasks in Milestone */}
            <div className="pt-4 space-y-2.5">
              {milestone.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id, task.completed)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-surface-light/40 border-emerald-500/20 text-slate-400'
                      : 'bg-surface-light border-surface-border hover:border-slate-500 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-accent-emerald text-slate-950'
                          : 'border border-slate-500 hover:border-brand-cyan'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <span className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>
                      {task.description}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 shrink-0 ml-3">
                    {task.hours} hrs
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

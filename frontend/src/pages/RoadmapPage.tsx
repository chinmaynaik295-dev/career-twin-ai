import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { LearningRoadmap, CareerPath, DigitalCareerTwin } from '../types';
import { 
  Map, CheckCircle2, Circle, Clock, Target, Sparkles, 
  RefreshCw, Check, ShieldCheck, ChevronDown, ChevronUp, ArrowRight,
  Calendar, Award, BookOpen, AlertCircle, X
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [twin, setTwin] = useState<DigitalCareerTwin | null>(null);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('ai-ml-engineer');
  const [weeksDuration, setWeeksDuration] = useState<number>(8);
  const [weeklyHours, setWeeklyHours] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [evidenceModalTask, setEvidenceModalTask] = useState<string | null>(null);
  const [evidenceText, setEvidenceText] = useState<string>('Completed module exercises and pushed commits to repository');

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
        if (roadmapData?.career_id) {
          setSelectedCareerId(roadmapData.career_id);
        } else if (twinData?.career_goals && twinData.career_goals.length > 0) {
          setSelectedCareerId(twinData.career_goals[0]);
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
    setGenerating(true);
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
      setGenerating(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    if (!currentStatus) {
      // Prompt for verification evidence before marking completed
      setEvidenceModalTask(taskId);
      return;
    }

    // Uncheck task
    setUpdatingTaskId(taskId);
    try {
      await api.updateTask(taskId, false);
      if (roadmap) {
        const updatedMilestones = roadmap.milestones.map((m) => ({
          ...m,
          tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, completed: false } : t)),
          is_completed: false
        }));
        const totalTasks = updatedMilestones.reduce((acc, m) => acc + m.tasks.length, 0);
        const doneTasks = updatedMilestones.reduce((acc, m) => acc + m.tasks.filter((t) => t.completed).length, 0);
        const newProgress = Math.round((doneTasks / Math.max(1, totalTasks)) * 100);

        setRoadmap({
          ...roadmap,
          milestones: updatedMilestones,
          progress_percentage: newProgress
        });
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading roadmap plan...</p>
        </div>
      </div>
    );
  }

  const hasConfiguredTwin = twin && Object.keys(twin.skills || {}).length > 0;
  const totalTasksCount = roadmap?.milestones?.reduce((acc, m) => acc + m.tasks.length, 0) || 0;
  const completedTasksCount = roadmap?.milestones?.reduce((acc, m) => acc + m.tasks.filter((t) => t.completed).length, 0) || 0;
  const progressPct = roadmap?.progress_percentage ?? Math.round((completedTasksCount / Math.max(1, totalTasksCount)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-1">
            <Map className="w-4 h-4" />
            <span>Structured Milestone Execution</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Learning Roadmap</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Sequenced weekly milestones and verified micro-tasks tailored to systematically eliminate your measured competency gaps.
          </p>
        </div>

        {/* Generate / Configure Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCareerId}
            onChange={(e) => setSelectedCareerId(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-subtle focus:outline-none"
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
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-subtle focus:outline-none"
          >
            <option value={4}>4 Weeks</option>
            <option value={8}>8 Weeks</option>
            <option value={12}>12 Weeks</option>
          </select>

          <button
            onClick={handleGenerateCustomRoadmap}
            disabled={generating}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-subtle transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{roadmap ? 'Regenerate' : 'Generate Roadmap'}</span>
          </button>
        </div>
      </div>

      {!roadmap ? (
        /* Empty State */
        <div className="p-10 rounded-xl bg-white border border-surface-border text-center space-y-4 shadow-subtle max-w-2xl mx-auto my-8">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mx-auto">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Active Learning Roadmap</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Generate an adaptive step-by-step milestone plan structured to bridge the exact competency gaps identified for your target career track.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerateCustomRoadmap}
              disabled={generating}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-subtle transition-colors inline-flex items-center gap-2"
            >
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate My 8-Week Roadmap</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Roadmap Content */
        <div className="space-y-6">
          {/* Progress & Projection Card */}
          <div className="p-5 rounded-xl bg-white border border-surface-border shadow-subtle grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Overall Progress
              </span>
              <p className="text-2xl font-bold font-mono text-primary-700">{progressPct}%</p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 pt-0.5">
                {completedTasksCount} of {totalTasksCount} tasks verified
              </p>
            </div>

            <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-6">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Duration & Effort
              </span>
              <p className="text-xl font-bold text-slate-900">{roadmap.target_weeks} Weeks</p>
              <p className="text-xs text-slate-500">~{roadmap.total_estimated_hours} total learning hours</p>
            </div>

            <div className="space-y-1 lg:border-l lg:border-slate-200 lg:pl-6">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Starting Baseline
              </span>
              <p className="text-xl font-bold font-mono text-slate-700">{roadmap.initial_readiness}%</p>
              <p className="text-xs text-slate-500">Twin readiness at start</p>
            </div>

            <div className="space-y-1 lg:border-l lg:border-slate-200 lg:pl-6">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Projected Readiness
              </span>
              <p className="text-xl font-bold font-mono text-emerald-700">{roadmap.projected_readiness}%</p>
              <p className="text-xs text-emerald-600 font-medium">
                +{Math.round((roadmap.projected_readiness - roadmap.initial_readiness) * 10) / 10} pts projected uplift
              </p>
            </div>
          </div>

          {/* Verification Evidence Dialog */}
          {evidenceModalTask && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="max-w-md w-full p-6 rounded-xl bg-white border border-surface-border shadow-elevation space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                  <div className="flex items-center gap-2 text-primary-700 font-semibold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Record Verified Task Evidence</span>
                  </div>
                  <button
                    onClick={() => setEvidenceModalTask(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Your Digital Career Twin updates verified competency metrics when tasks are confirmed with tangible evidence (e.g. project notes or repository URL).
                </p>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Proof / Work Summary
                  </label>
                  <textarea
                    rows={3}
                    value={evidenceText}
                    onChange={(e) => setEvidenceText(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEvidenceModalTask(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmVerifiedTask}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-subtle"
                  >
                    Confirm & Update Twin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Milestones Vertical Timeline List */}
          <div className="space-y-4">
            {roadmap.milestones.map((milestone) => (
              <div
                key={milestone.week_number}
                className={`p-5 rounded-xl bg-white border transition-all shadow-subtle ${
                  milestone.is_completed ? 'border-emerald-200 bg-emerald-50/20' : 'border-surface-border'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-surface-border">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        milestone.is_completed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-primary-50 text-primary-700 border border-primary-200'
                      }`}
                    >
                      {milestone.is_completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `W${milestone.week_number}`}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{milestone.title}</h3>
                      <p className="text-xs text-slate-500">
                        Focus Competency: <strong className="text-slate-700">{milestone.focus_skill}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-600 px-2 py-0.5 rounded bg-slate-50 border border-slate-200">
                      ~{milestone.estimated_hours}h effort
                    </span>
                    {milestone.is_completed && (
                      <span className="text-xs text-emerald-700 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        Milestone Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Tasks */}
                <div className="pt-3 space-y-2">
                  {milestone.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, task.completed)}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                        task.completed
                          ? 'bg-slate-50/60 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                            task.completed
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-300 hover:border-primary-600'
                          }`}
                        >
                          {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <span
                          className={`text-xs ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'
                          }`}
                        >
                          {task.description}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-3">
                        {task.hours}h
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

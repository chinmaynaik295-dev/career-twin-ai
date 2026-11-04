import React from 'react';
import { SkillGapItem } from '../../types';
import { AlertCircle, CheckCircle2, ChevronRight, Star } from 'lucide-react';

interface Props {
  gap: SkillGapItem;
}

export const SkillGapCard: React.FC<Props> = ({ gap }) => {
  const isHigh = gap.priority === 'High';
  const isMedium = gap.priority === 'Medium';
  const isLow = gap.priority === 'Low';

  const priorityStyles = {
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  const progressPercentage = Math.min(100, (gap.user_level / Math.max(1, gap.target_level)) * 100);

  return (
    <div className="p-4 rounded-xl bg-surface-light/60 border border-surface-border hover:border-brand-cyan/30 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white">{gap.skill}</h4>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityStyles[gap.priority]}`}>
              {gap.priority} Priority
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{gap.description}</p>
        </div>

        {/* Importance Stars */}
        <div className="flex items-center gap-0.5 text-amber-400" title={`Importance: ${gap.importance}/5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < gap.importance ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bars: Current vs Target */}
      <div className="space-y-1.5 my-3">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Current: <strong className="text-brand-cyan">{gap.user_level}/5</strong></span>
          <span>Target: <strong className="text-brand-indigo">{gap.target_level}/5</strong></span>
        </div>

        <div className="relative w-full h-2 rounded-full bg-surface-border overflow-hidden">
          {/* User Level */}
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              gap.user_level >= gap.target_level ? 'bg-accent-emerald' : 'bg-brand-cyan'
            }`}
            style={{ width: `${(gap.user_level / 5) * 100}%` }}
          />
          {/* Target marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-brand-violet shadow-sm"
            style={{ left: `${(gap.target_level / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Suggested Action */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-border/60 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          {gap.gap > 0 ? (
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <span className="truncate">{gap.suggested_action}</span>
        </div>
        <span className="text-[11px] font-mono text-brand-cyan shrink-0">
          {gap.gap > 0 ? `+${gap.gap} pts needed` : 'Target Met'}
        </span>
      </div>
    </div>
  );
};

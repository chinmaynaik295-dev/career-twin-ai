import React from 'react';
import { SkillGapItem } from '../../types';
import { AlertCircle, CheckCircle2, Star } from 'lucide-react';

interface Props {
  gap: SkillGapItem;
}

export const SkillGapCard: React.FC<Props> = ({ gap }) => {
  const priorityStyles = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="p-4 rounded-xl bg-surface border border-surface-border hover:border-slate-300 transition-all shadow-subtle">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{gap.skill}</h4>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityStyles[gap.priority]}`}>
              {gap.priority} Priority
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{gap.description}</p>
        </div>

        {/* Importance Stars */}
        <div className="flex items-center gap-0.5 text-amber-400 shrink-0" title={`Importance: ${gap.importance}/5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < gap.importance ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bars: Current vs Target */}
      <div className="space-y-1.5 my-3">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Current: <strong className="text-slate-900 font-mono">{gap.user_level}/5</strong></span>
          <span>Target: <strong className="text-primary-700 font-mono">{gap.target_level}/5</strong></span>
        </div>

        <div className="relative w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
          {/* User Level */}
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              gap.user_level >= gap.target_level ? 'bg-accent-emerald' : 'bg-primary-600'
            }`}
            style={{ width: `${(gap.user_level / 5) * 100}%` }}
          />
          {/* Target marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-slate-400"
            style={{ left: `${(gap.target_level / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Actionable Guidance */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 min-w-0 pr-2">
          {gap.gap > 0 ? (
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
          )}
          <span className="truncate text-[11px]">{gap.suggested_action}</span>
        </div>
        <span className="text-[11px] font-mono font-medium text-slate-700 shrink-0">
          {gap.gap > 0 ? `+${gap.gap} pts needed` : 'Target Met'}
        </span>
      </div>
    </div>
  );
};

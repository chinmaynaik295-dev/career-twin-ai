import React from 'react';

interface Props {
  score: number;
  size?: number;
  label?: string;
  showSubtitle?: boolean;
}

export const ReadinessGauge: React.FC<Props> = ({
  score,
  size = 160,
  label = "Career Readiness",
  showSubtitle = true
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = "text-brand-cyan";
  let statusText = "Foundational";
  if (clampedScore >= 75) {
    colorClass = "text-accent-emerald";
    statusText = "Ready for Hire / Advanced";
  } else if (clampedScore >= 50) {
    colorClass = "text-brand-cyan";
    statusText = "Intermediate Ready";
  } else if (clampedScore >= 30) {
    colorClass = "text-accent-amber";
    statusText = "Developing Foundation";
  } else {
    colorClass = "text-accent-rose";
    statusText = "Early Explorer";
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-surface-border fill-none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorClass} fill-none transition-all duration-1000 ease-out`}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {clampedScore}%
          </span>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            {statusText}
          </span>
        </div>
      </div>

      {showSubtitle && (
        <div className="mt-2 text-center">
          <p className="text-xs font-semibold text-slate-200">{label}</p>
          <p className="text-[11px] text-slate-400">Deterministic Weighted Score</p>
        </div>
      )}
    </div>
  );
};

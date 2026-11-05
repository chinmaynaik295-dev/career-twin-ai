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
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = "text-primary-600";
  let statusText = "Early Stage";
  let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";

  if (clampedScore >= 75) {
    colorClass = "text-accent-emerald";
    statusText = "Strong Competency";
    badgeColor = "bg-accent-emerald-subtle text-accent-emerald border-emerald-200";
  } else if (clampedScore >= 50) {
    colorClass = "text-primary-600";
    statusText = "Intermediate Ready";
    badgeColor = "bg-primary-50 text-primary-700 border-primary-200";
  } else if (clampedScore >= 30) {
    colorClass = "text-accent-amber";
    statusText = "Developing Foundation";
    badgeColor = "bg-accent-amber-subtle text-accent-amber border-amber-200";
  } else if (clampedScore > 0) {
    colorClass = "text-accent-rose";
    statusText = "Foundational";
    badgeColor = "bg-accent-rose-subtle text-accent-rose border-rose-200";
  } else {
    colorClass = "text-slate-300";
    statusText = "Not Evaluated";
    badgeColor = "bg-slate-100 text-slate-500 border-slate-200";
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
            className="text-slate-100 fill-none"
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
            className={`${colorClass} fill-none transition-all duration-700 ease-out`}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
            {clampedScore}%
          </span>
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${badgeColor}`}>
            {statusText}
          </span>
        </div>
      </div>

      {showSubtitle && (
        <div className="mt-3 text-center">
          <p className="text-xs font-semibold text-slate-900">{label}</p>
          <p className="text-[11px] text-slate-600">Deterministic Weighted Score (0–100%)</p>
        </div>
      )}
    </div>
  );
};

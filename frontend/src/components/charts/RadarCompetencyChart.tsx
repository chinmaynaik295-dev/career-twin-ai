import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface RadarDataPoint {
  skill: string;
  user_level: number;
  target_level: number;
}

interface Props {
  data: RadarDataPoint[];
  title?: string;
  subtitle?: string;
}

export const RadarCompetencyChart: React.FC<Props> = ({ data, title, subtitle }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[250px] flex items-center justify-center text-xs text-slate-400 bg-surface-subtle rounded-xl border border-dashed border-surface-border">
        No competency data available to plot
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {(title || subtitle) && (
        <div className="mb-2">
          {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      )}

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: '#475569', fontSize: 11, fontFamily: 'Inter' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 5]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              stroke="#e2e8f0"
            />
            <Radar
              name="Current Proficiency"
              dataKey="user_level"
              stroke="#4f46e5"
              fill="#4f46e5"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Radar
              name="Target Expectation"
              dataKey="target_level"
              stroke="#94a3b8"
              fill="#cbd5e1"
              fillOpacity={0.1}
              strokeDasharray="4 4"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as RadarDataPoint;
                  return (
                    <div className="bg-surface border border-surface-border p-3 rounded-lg shadow-elevation text-xs">
                      <p className="font-bold text-slate-900 mb-1.5">{item.skill}</p>
                      <p className="text-primary-600 font-semibold">Your Level: {item.user_level} / 5</p>
                      <p className="text-slate-500">Required Target: {item.target_level} / 5</p>
                      <p className="text-slate-400 text-[11px] mt-1 pt-1 border-t border-slate-100">
                        Gap: {Math.max(0, item.target_level - item.user_level)} pts
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              formatter={(value) => <span className="text-slate-600 font-medium">{value}</span>}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

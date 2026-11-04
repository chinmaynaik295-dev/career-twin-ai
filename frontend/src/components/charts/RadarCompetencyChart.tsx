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
  return (
    <div className="w-full h-full flex flex-col justify-between">
      {(title || subtitle) && (
        <div className="mb-2">
          {title && <h3 className="text-sm font-semibold text-slate-100">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      )}

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#1f2e4d" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 5]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              stroke="#1f2e4d"
            />
            <Radar
              name="Your Current Level"
              dataKey="user_level"
              stroke="#38bdf8"
              fill="#38bdf8"
              fillOpacity={0.4}
            />
            <Radar
              name="Required Target Level"
              dataKey="target_level"
              stroke="#818cf8"
              fill="#818cf8"
              fillOpacity={0.15}
              strokeDasharray="4 4"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as RadarDataPoint;
                  return (
                    <div className="bg-surface border border-surface-border p-2.5 rounded-lg shadow-xl text-xs">
                      <p className="font-bold text-white mb-1">{item.skill}</p>
                      <p className="text-brand-cyan">Current: {item.user_level} / 5</p>
                      <p className="text-brand-indigo">Target: {item.target_level} / 5</p>
                      <p className="text-slate-400">
                        Gap: {Math.max(0, item.target_level - item.user_level)} pts
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              formatter={(value) => <span className="text-slate-300">{value}</span>}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

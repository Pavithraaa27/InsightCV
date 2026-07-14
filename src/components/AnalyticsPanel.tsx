import { BarChart3, Users, Target, Zap, TrendingUp } from 'lucide-react';
import type { CandidateResult } from '../lib/types';

interface AnalyticsPanelProps {
  candidates: CandidateResult[];
}

export default function AnalyticsPanel({ candidates }: AnalyticsPanelProps) {
  if (candidates.length === 0) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-slate-600" />
          <h2 className="text-[13px] font-semibold text-slate-200">Analytics</h2>
        </div>
        <div className="glass p-10 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
          >
            <TrendingUp className="w-5 h-5 text-slate-600" />
          </div>
          <p className="text-[11px] text-slate-600">Upload resumes to see analytics</p>
        </div>
      </div>
    );
  }

  const avgScore = Math.round(
    candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length
  );

  const allMatched = new Set(candidates.flatMap(c => c.matchedSkills));
  const allMissing = new Set(candidates.flatMap(c => c.missingSkills));

  const scoreDistribution = {
    high: candidates.filter(c => c.score >= 75).length,
    medium: candidates.filter(c => c.score >= 50 && c.score < 75).length,
    low: candidates.filter(c => c.score < 50).length,
  };

  const maxDist = Math.max(scoreDistribution.high, scoreDistribution.medium, scoreDistribution.low, 1);

  const stats = [
    {
      label: 'Candidates',
      value: candidates.length,
      icon: Users,
      color: '#60a5fa',
      bg: 'rgba(59, 130, 246, 0.06)',
      border: 'rgba(59, 130, 246, 0.1)',
    },
    {
      label: 'Avg Score',
      value: `${avgScore}%`,
      icon: Target,
      color: avgScore >= 50 ? '#34d399' : '#fbbf24',
      bg: avgScore >= 50 ? 'rgba(16, 185, 129, 0.06)' : 'rgba(245, 158, 11, 0.06)',
      border: avgScore >= 50 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
    },
    {
      label: 'Skills Matched',
      value: allMatched.size,
      icon: Zap,
      color: '#fbbf24',
      bg: 'rgba(245, 158, 11, 0.06)',
      border: 'rgba(245, 158, 11, 0.1)',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-slate-500" />
        <h2 className="text-[13px] font-semibold text-slate-200">Analytics Overview</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass p-4 animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              </div>
              <p className="text-xl font-bold text-white tabular-nums">{stat.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="glass p-4 animate-fade-in-up opacity-0 delay-200">
        <p className="section-label mb-3">Score Distribution</p>
        <div className="space-y-2.5">
          {[
            { label: 'High (75%+)', count: scoreDistribution.high, color: '#10b981' },
            { label: 'Medium (50-74%)', count: scoreDistribution.medium, color: '#f59e0b' },
            { label: 'Low (<50%)', count: scoreDistribution.low, color: '#ef4444' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500 w-24 flex-shrink-0">{item.label}</span>
              <div className="flex-1 rounded-full h-1 overflow-hidden"
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(item.count / maxDist) * 100}%`,
                    background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}88 100%)`,
                    boxShadow: `0 0 8px ${item.color}33`,
                  }}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 w-4 text-right tabular-nums">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {allMissing.size > 0 && (
        <div className="glass p-4 animate-fade-in-up opacity-0 delay-300">
          <p className="section-label mb-3">Common Skill Gaps</p>
          <div className="flex flex-wrap gap-1.5">
            {Array.from(allMissing).map(skill => {
              const frequency = candidates.filter(c => c.missingSkills.includes(skill)).length;
              const isFrequent = frequency > candidates.length / 2;
              return (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md"
                  style={isFrequent ? {
                    background: 'rgba(239, 68, 68, 0.06)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.12)',
                  } : {
                    background: 'rgba(255, 255, 255, 0.02)',
                    color: '#64748b',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  {skill}
                  <span className="text-[9px] opacity-40 tabular-nums">{frequency}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

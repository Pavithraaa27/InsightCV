import { TrendingUp, TrendingDown, Minus, Lightbulb, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { useState } from 'react';
import type { CandidateResult } from '../lib/types';

interface CandidateCardProps {
  candidate: CandidateResult;
  rank: number;
}

function ScoreRing({ score, isTop }: { score: number; isTop: boolean }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColor = '#ef4444';
  let glowColor = 'rgba(239, 68, 68, 0.3)';
  if (score >= 75) {
    strokeColor = '#10b981';
    glowColor = 'rgba(16, 185, 129, 0.35)';
  } else if (score >= 50) {
    strokeColor = '#f59e0b';
    glowColor = 'rgba(245, 158, 11, 0.3)';
  } else if (score >= 25) {
    strokeColor = '#f97316';
    glowColor = 'rgba(249, 115, 22, 0.3)';
  }

  return (
    <div className="relative w-[52px] h-[52px] flex items-center justify-center">
      <svg className="w-[52px] h-[52px] -rotate-90" viewBox="0 0 52 52"
        style={isTop ? { filter: `drop-shadow(0 0 8px ${glowColor})` } : undefined}
      >
        <circle cx="26" cy="26" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
        <circle
          cx="26" cy="26" r={radius} fill="none"
          stroke={strokeColor} strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className={`absolute text-[11px] font-bold tabular-nums ${isTop ? 'text-white' : 'text-slate-300'}`}>
        {score}
      </span>
    </div>
  );
}

export default function CandidateCard({ candidate, rank }: CandidateCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isTop = rank <= 3;

  const trendIcon = isTop
    ? <TrendingUp className="w-3 h-3 text-emerald-400" />
    : rank <= 6
    ? <Minus className="w-3 h-3 text-amber-400/50" />
    : <TrendingDown className="w-3 h-3 text-red-400/50" />;

  return (
    <div
      className={`${isTop ? 'glass-top animate-glow-pulse' : 'glass-interactive'} animate-fade-in-up opacity-0`}
      style={{ animationDelay: `${Math.min(rank * 50, 500)}ms` }}
    >
      <div className="px-4 py-3.5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            {isTop ? (
              <div className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.06) 100%)', border: '1px solid rgba(59, 130, 246, 0.15)' }}
              >
                <Award className="w-3.5 h-3.5 text-blue-400" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
              >
                <span className="text-[9px] font-bold text-slate-600">#{rank}</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-[13px] font-semibold text-white truncate">
                {candidate.candidateName}
              </h3>
              {trendIcon}
            </div>
            <p className="text-[11px] text-slate-600 truncate">{candidate.fileName}</p>
          </div>

          <div className="flex-shrink-0">
            <ScoreRing score={candidate.score} isTop={isTop} />
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-2.5 text-[11px]">
          <span className="text-slate-500">{candidate.totalSkills} skills</span>
          <span className="text-white/10">·</span>
          <span className="text-emerald-400/80">{candidate.matchedSkills.length} matched</span>
          {candidate.missingSkills.length > 0 && (
            <>
              <span className="text-white/10">·</span>
              <span className="text-red-400/70">{candidate.missingSkills.length} missing</span>
            </>
          )}
        </div>

        {candidate.matchedSkills.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {candidate.matchedSkills.slice(0, 5).map(skill => (
              <span key={skill} className="tag-matched">{skill}</span>
            ))}
            {candidate.matchedSkills.length > 5 && (
              <span className="tag-neutral">+{candidate.matchedSkills.length - 5}</span>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-1 px-4 py-1.5 text-[11px] text-slate-600 hover:text-slate-400 transition-colors duration-200"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}
      >
        {isExpanded ? 'Less' : 'Details'}
        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-3.5 space-y-3 animate-fade-in"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}
        >
          {candidate.missingSkills.length > 0 && (
            <div className="pt-3">
              <p className="section-label mb-1.5">Missing Skills</p>
              <div className="flex flex-wrap gap-1">
                {candidate.missingSkills.map(skill => (
                  <span key={skill} className="tag-missing">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {candidate.suggestions.length > 0 && (
            <div>
              <p className="section-label mb-1.5">Suggestions</p>
              <div className="space-y-1.5">
                {candidate.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Lightbulb className="w-3 h-3 text-amber-400/60 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-500 leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {candidate.matchedSkills.length > 5 && (
            <div>
              <p className="section-label mb-1.5">All Matched</p>
              <div className="flex flex-wrap gap-1">
                {candidate.matchedSkills.map(skill => (
                  <span key={skill} className="tag-matched">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

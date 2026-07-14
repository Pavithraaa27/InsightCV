import { Trophy, Award } from 'lucide-react';
import type { CandidateResult } from '../lib/types';

interface TopCandidatesProps {
  candidates: CandidateResult[];
}

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
}

export default function TopCandidates({ candidates }: TopCandidatesProps) {
  const top3 = candidates.slice(0, 3);

  if (top3.length === 0) {
    return (
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-4 h-4 text-amber-400/60" />
          <h2 className="text-[13px] font-semibold text-slate-200">Top Candidates</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
          >
            <Award className="w-5 h-5 text-slate-600" />
          </div>
          <p className="text-[11px] text-slate-600">Upload resumes to see top candidates</p>
        </div>
      </div>
    );
  }

  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <div className="glass p-5">
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-4 h-4 text-amber-400/60" />
        <h2 className="text-[13px] font-semibold text-slate-200">Top Candidates</h2>
      </div>

      <div className="flex items-end justify-center gap-2.5">
        {podiumOrder.map((candidate) => {
          const actualRank = top3.indexOf(candidate) + 1;
          const isFirst = actualRank === 1;
          const podiumHeight = isFirst ? 'h-[72px]' : 'h-[48px]';

          let podiumBg = 'rgba(239, 68, 68, 0.04)';
          let podiumBorder = 'rgba(239, 68, 68, 0.12)';
          if (candidate.score >= 75) {
            podiumBg = 'rgba(16, 185, 129, 0.04)';
            podiumBorder = 'rgba(16, 185, 129, 0.15)';
          } else if (candidate.score >= 50) {
            podiumBg = 'rgba(245, 158, 11, 0.04)';
            podiumBorder = 'rgba(245, 158, 11, 0.12)';
          }

          return (
            <div key={candidate.resumeId} className="flex flex-col items-center gap-2 flex-1 max-w-[100px]">
              <div className="text-center">
                <p className="text-[11px] font-semibold text-slate-300 truncate w-full px-0.5">
                  {candidate.candidateName.split(' ')[0]}
                </p>
                <p className={`text-base font-bold tabular-nums ${getScoreColor(candidate.score)}`}>
                  {candidate.score}%
                </p>
              </div>
              <div className={`w-full ${podiumHeight} rounded-t-lg flex items-center justify-center transition-all duration-500 ${
                isFirst ? 'animate-glow-pulse' : ''
              }`}
                style={{ background: podiumBg, border: `1px solid ${podiumBorder}`, borderBottom: 'none' }}
              >
                {isFirst ? (
                  <Trophy className="w-4 h-4 text-amber-400" />
                ) : (
                  <span className="text-[11px] font-bold text-slate-600">#{actualRank}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState, useCallback, useEffect } from 'react';
import { GitCompare, Check, X, Award, ChevronDown, UserPlus, Crown } from 'lucide-react';
import type { CandidateResult } from '../lib/types';

interface CandidateComparisonProps {
  candidates: CandidateResult[];
}

function ScoreBar({ score, isBest }: { score: number; isBest: boolean }) {
  let color = '#ef4444';
  let glow = 'rgba(239, 68, 68, 0.2)';
  if (score >= 75) {
    color = '#10b981';
    glow = 'rgba(16, 185, 129, 0.3)';
  } else if (score >= 50) {
    color = '#f59e0b';
    glow = 'rgba(245, 158, 11, 0.25)';
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className={`text-2xl font-bold tabular-nums ${isBest ? 'text-white' : 'text-slate-300'}`}>
          {score}
        </span>
        <span className="text-[11px] text-slate-500">%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`,
            boxShadow: isBest ? `0 0 12px ${glow}` : 'none',
          }}
        />
      </div>
    </div>
  );
}

function SkillTag({ skill, variant }: { skill: string; variant: 'matched' | 'missing' | 'shared' | 'unique' }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    matched: { bg: 'rgba(16, 185, 129, 0.06)', color: '#34d399', border: 'rgba(16, 185, 129, 0.12)' },
    missing: { bg: 'rgba(239, 68, 68, 0.06)', color: '#f87171', border: 'rgba(239, 68, 68, 0.12)' },
    shared: { bg: 'rgba(59, 130, 246, 0.06)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.12)' },
    unique: { bg: 'rgba(148, 163, 184, 0.04)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.08)' },
  };
  const s = styles[variant];

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {variant === 'shared' && <Check className="w-2.5 h-2.5" />}
      {variant === 'missing' && <X className="w-2.5 h-2.5" />}
      {skill}
    </span>
  );
}

export default function CandidateComparison({ candidates }: CandidateComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pickerOpen, setPickerOpen] = useState(false);

  const sorted = [...candidates].sort((a, b) => b.score - a.score);

  // Auto-select top 3 when candidates change
  useEffect(() => {
    if (selectedIds.size === 0 && sorted.length > 0) {
      setSelectedIds(new Set(sorted.slice(0, 3).map(c => c.id)));
    }
  }, [sorted.length]);

  const comparisonIds = selectedIds.size > 0
    ? Array.from(selectedIds)
    : sorted.slice(0, 3).map(c => c.id);

  const comparisonCandidates = comparisonIds
    .map(id => sorted.find(c => c.id === id))
    .filter((c): c is CandidateResult => c !== undefined);

  const bestScore = comparisonCandidates.length > 0
    ? Math.max(...comparisonCandidates.map(c => c.score))
    : 0;

  // Compute shared skills across all compared candidates
  const commonSkills = comparisonCandidates.length > 1
    ? [...new Set(comparisonCandidates.flatMap(c => c.matchedSkills))].filter(
        skill => comparisonCandidates.every(c => c.matchedSkills.includes(skill))
      )
    : [];

  const toggleCandidate = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const resetToAuto = useCallback(() => {
    setSelectedIds(new Set(sorted.slice(0, 3).map(c => c.id)));
  }, [sorted]);

  if (candidates.length === 0) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-slate-600" />
          <h2 className="text-[13px] font-semibold text-slate-200">Compare Candidates</h2>
        </div>
        <div className="glass p-10 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
          >
            <GitCompare className="w-5 h-5 text-slate-600" />
          </div>
          <p className="text-[11px] text-slate-600">Upload resumes to compare candidates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-slate-500" />
          <h2 className="text-[13px] font-semibold text-slate-200">Compare Candidates</h2>
          {commonSkills.length > 0 && (
            <span className="text-[11px] text-slate-600 ml-1">
              {commonSkills.length} shared skill{commonSkills.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetToAuto}
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-md"
            style={{ background: 'rgba(255, 255, 255, 0.02)' }}
          >
            Reset to top 3
          </button>
          <div className="relative">
            <button
              onClick={() => setPickerOpen(!pickerOpen)}
              className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', color: '#94a3b8' }}
            >
              <UserPlus className="w-3 h-3" />
              Select candidates
              <ChevronDown className="w-3 h-3" />
            </button>
            {pickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPickerOpen(false)} />
                <div
                  className="absolute right-0 top-full mt-1.5 w-60 glass-elevated p-1.5 z-50 animate-scale-in"
                  style={{ maxHeight: '300px', overflowY: 'auto' }}
                >
                  <p className="section-label px-2.5 py-1.5">Select up to 3 candidates</p>
                  {sorted.map(candidate => {
                    const isSelected = comparisonIds.includes(candidate.id);
                    const isDisabled = !isSelected && comparisonIds.length >= 3;
                    return (
                      <button
                        key={candidate.id}
                        onClick={() => toggleCandidate(candidate.id)}
                        disabled={isDisabled}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[12px] transition-colors ${
                          isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            border: isSelected ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-blue-400" />}
                        </div>
                        <span className="flex-1 text-left truncate text-slate-300">{candidate.candidateName}</span>
                        <span className="text-[10px] tabular-nums text-slate-600">{candidate.score}%</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comparison columns */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${comparisonCandidates.length}, 1fr)` }}
      >
        {comparisonCandidates.map((candidate, i) => {
          const isBest = candidate.score === bestScore && comparisonCandidates.length > 1;
          const rank = sorted.indexOf(candidate) + 1;

          // Determine which matched skills are shared vs unique to this candidate
          const uniqueMatched = candidate.matchedSkills.filter(s => !commonSkills.includes(s));
          const sharedMatched = candidate.matchedSkills.filter(s => commonSkills.includes(s));

          return (
            <div
              key={candidate.id}
              className={`animate-fade-in-up opacity-0 ${isBest ? 'glass-top animate-glow-pulse' : 'glass'}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Header */}
              <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <div className="flex items-center gap-2 mb-3">
                  {isBest ? (
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      <Crown className="w-3 h-3 text-blue-400" />
                    </div>
                  ) : (
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
                    >
                      <span className="text-[9px] font-bold text-slate-600">#{rank}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-semibold text-white truncate">{candidate.candidateName}</h3>
                    <p className="text-[10px] text-slate-600">Rank #{rank}</p>
                  </div>
                </div>
                <ScoreBar score={candidate.score} isBest={isBest} />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
                <div className="px-4 py-2.5 text-center" style={{ borderRight: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <p className="text-sm font-bold text-emerald-400 tabular-nums">{candidate.matchedSkills.length}</p>
                  <p className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">Matched</p>
                </div>
                <div className="px-4 py-2.5 text-center">
                  <p className="text-sm font-bold text-red-400 tabular-nums">{candidate.missingSkills.length}</p>
                  <p className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">Missing</p>
                </div>
              </div>

              {/* Skills */}
              <div className="px-4 py-3 space-y-3">
                {sharedMatched.length > 0 && (
                  <div>
                    <p className="section-label mb-1.5">Shared Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {sharedMatched.map(skill => (
                        <SkillTag key={skill} skill={skill} variant="shared" />
                      ))}
                    </div>
                  </div>
                )}
                {uniqueMatched.length > 0 && (
                  <div>
                    <p className="section-label mb-1.5">Unique Matched</p>
                    <div className="flex flex-wrap gap-1">
                      {uniqueMatched.map(skill => (
                        <SkillTag key={skill} skill={skill} variant="matched" />
                      ))}
                    </div>
                  </div>
                )}
                {candidate.missingSkills.length > 0 && (
                  <div>
                    <p className="section-label mb-1.5">Missing Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {candidate.missingSkills.map(skill => (
                        <SkillTag key={skill} skill={skill} variant="missing" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Shared skills summary */}
      {commonSkills.length > 0 && comparisonCandidates.length > 1 && (
        <div className="glass p-4 animate-fade-in-up opacity-0 delay-300">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-3.5 h-3.5 text-blue-400/60" />
            <p className="section-label">Shared Skills Across All Compared Candidates</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {commonSkills.map(skill => (
              <SkillTag key={skill} skill={skill} variant="shared" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

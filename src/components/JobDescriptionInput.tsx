import { useState } from 'react';
import { Briefcase, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface JobDescriptionInputProps {
  jobDescription: string;
  jobTitle: string;
  onJobDescriptionChange: (value: string) => void;
  onJobTitleChange: (value: string) => void;
  isAnalyzing: boolean;
}

export default function JobDescriptionInput({
  jobDescription,
  jobTitle,
  onJobDescriptionChange,
  onJobTitleChange,
  isAnalyzing,
}: JobDescriptionInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors duration-200"
        style={{ background: isExpanded ? 'rgba(255, 255, 255, 0.01)' : 'transparent' }}
        disabled={isAnalyzing}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.1)' }}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-slate-200">Job Description</p>
            <p className="text-[11px] text-slate-600">
              {jobDescription.trim()
                ? `${jobDescription.trim().split(/\s+/).length} words — skills auto-extracted`
                : 'Optional — improves matching accuracy'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {jobDescription.trim() && (
            <Sparkles className="w-3.5 h-3.5 text-amber-400/50" />
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-600" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 pt-3 animate-fade-in"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}
        >
          <div>
            <label className="section-label block mb-1.5">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => onJobTitleChange(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="input-field"
              disabled={isAnalyzing}
            />
          </div>
          <div>
            <label className="section-label block mb-1.5">Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Paste the job description here. Required skills will be automatically extracted for matching..."
              rows={5}
              className="input-field resize-none"
              disabled={isAnalyzing}
            />
          </div>
        </div>
      )}
    </div>
  );
}

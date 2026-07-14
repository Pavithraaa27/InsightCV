import { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, FileText, Inbox, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import UploadZone from './components/UploadZone';
import JobDescriptionInput from './components/JobDescriptionInput';
import CandidateCard from './components/CandidateCard';
import TopCandidates from './components/TopCandidates';
import AnalyticsPanel from './components/AnalyticsPanel';
import CandidateComparison from './components/CandidateComparison';
import LoadingOverlay from './components/LoadingOverlay';
import { analyzeResumes } from './lib/api';
import type { CandidateResult } from './lib/types';

type SortOption = 'score-desc' | 'score-asc' | 'name-asc' | 'skills-desc';
type FilterOption = 'all' | 'high' | 'medium' | 'low';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [candidates, setCandidates] = useState<CandidateResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('score-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await analyzeResumes(files, jobDescription, jobTitle);
      setCandidates(prev => [...response.results, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobDescription, jobTitle]);

  const filteredCandidates = candidates
    .filter(c => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.candidateName.toLowerCase().includes(q) ||
          c.fileName.toLowerCase().includes(q) ||
          c.matchedSkills.some(s => s.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .filter(c => {
      switch (filterBy) {
        case 'high': return c.score >= 75;
        case 'medium': return c.score >= 50 && c.score < 75;
        case 'low': return c.score < 50;
        default: return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score-desc': return b.score - a.score;
        case 'score-asc': return a.score - b.score;
        case 'name-asc': return a.candidateName.localeCompare(b.candidateName);
        case 'skills-desc': return b.matchedSkills.length - a.matchedSkills.length;
        default: return 0;
      }
    });

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <UploadZone onFilesSelected={handleFilesSelected} isAnalyzing={isAnalyzing} />
          <JobDescriptionInput
            jobDescription={jobDescription}
            jobTitle={jobTitle}
            onJobDescriptionChange={setJobDescription}
            onJobTitleChange={setJobTitle}
            isAnalyzing={isAnalyzing}
          />
        </div>
        <div>
          <TopCandidates candidates={candidates} />
        </div>
      </div>

      {candidates.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-slate-200">
              All Candidates
              <span className="text-slate-600 font-normal ml-1.5">({filteredCandidates.length})</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredCandidates.map((candidate, i) => (
              <CandidateCard key={candidate.id} candidate={candidate} rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {candidates.length === 0 && !isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
          >
            <Inbox className="w-5 h-5 text-slate-600" />
          </div>
          <h3 className="text-[13px] font-semibold text-slate-300 mb-1">No candidates yet</h3>
          <p className="text-[11px] text-slate-600 max-w-[240px] leading-relaxed">
            Upload PDF resumes above to start screening. Add a job description for better matching.
          </p>
        </div>
      )}
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, file, or skill..."
            className="input-field pl-9 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="input-field pl-7 pr-6 py-2 w-auto appearance-none cursor-pointer text-[12px]"
            >
              <option value="all">All Scores</option>
              <option value="high">High (75%+)</option>
              <option value="medium">Medium (50-74%)</option>
              <option value="low">Low (&lt;50%)</option>
            </select>
          </div>
          <div className="relative">
            <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input-field pl-7 pr-6 py-2 w-auto appearance-none cursor-pointer text-[12px]"
            >
              <option value="score-desc">Score: High-Low</option>
              <option value="score-asc">Score: Low-High</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="skills-desc">Most Skills</option>
            </select>
          </div>
        </div>
      </div>

      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredCandidates.map((candidate, i) => (
            <CandidateCard key={candidate.id} candidate={candidate} rank={i + 1} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
          >
            <FileText className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-[12px] text-slate-500">
            {candidates.length === 0 ? 'No candidates uploaded yet' : 'No candidates match your filters'}
          </p>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => <AnalyticsPanel candidates={candidates} />;

  const renderCompare = () => <CandidateComparison candidates={candidates} />;

  const renderUpload = () => (
    <div className="max-w-xl mx-auto space-y-3 animate-fade-in">
      <UploadZone onFilesSelected={handleFilesSelected} isAnalyzing={isAnalyzing} />
      <JobDescriptionInput
        jobDescription={jobDescription}
        jobTitle={jobTitle}
        onJobDescriptionChange={setJobDescription}
        onJobTitleChange={setJobTitle}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="glass p-6 space-y-5">
        <div>
          <h3 className="text-[13px] font-semibold text-white mb-1">About ResumeScreen</h3>
          <p className="text-[12px] text-slate-500 leading-relaxed">
            AI-powered resume screening tool that extracts skills from PDF resumes and matches them against job descriptions.
            Uses keyword-based matching for fast, transparent results.
          </p>
        </div>
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)' }} className="pt-4">
          <h4 className="section-label mb-2.5">How Scoring Works</h4>
          <ul className="text-[12px] text-slate-500 space-y-2">
            <li className="flex items-start gap-2.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400 mt-[6px] flex-shrink-0" />
              With Job Description: Score = (matched skills / JD skills) x 100
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-[6px] flex-shrink-0" />
              Without Job Description: Score based on skill richness, diversity, and importance
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1 h-1 rounded-full bg-blue-400 mt-[6px] flex-shrink-0" />
              Important skills (Python, Java, SQL, React, Docker, AWS, etc.) carry higher weight
            </li>
          </ul>
        </div>
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)' }} className="pt-4">
          <h4 className="section-label mb-2.5">Supported Skills</h4>
          <p className="text-[12px] text-slate-500 leading-relaxed">
            100+ technical skills across programming languages, frameworks, databases, cloud platforms, DevOps tools, data engineering, testing, security, and architecture patterns.
          </p>
        </div>
      </div>
    </div>
  );

  const getActiveContent = () => {
    switch (activeView) {
      case 'dashboard': return renderDashboard();
      case 'upload': return renderUpload();
      case 'candidates': return renderCandidates();
      case 'analytics': return renderAnalytics();
      case 'compare': return renderCompare();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  const viewTitles: Record<string, string> = {
    dashboard: 'Resume Screening Dashboard',
    upload: 'Upload Resumes',
    candidates: 'Candidates',
    compare: 'Compare Candidates',
    analytics: 'Analytics',
    settings: 'Settings',
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#050710' }}>
      {/* Background gradient mesh */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 40%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 20%, rgba(99, 102, 241, 0.04) 0%, transparent 50%),
          radial-gradient(ellipse 50% 60% at 50% 90%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)
        `,
      }} />

      {isAnalyzing && <LoadingOverlay />}

      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        candidateCount={candidates.length}
      />

      <main className="ml-[220px] min-h-screen relative">
        <header className="sticky top-0 z-40 glass-header px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-[13px] font-semibold text-white tracking-tight">
              {viewTitles[activeView] || 'Dashboard'}
            </h1>
            {candidates.length > 0 && (
              <div className="flex items-center gap-3 text-[11px] text-slate-600 tabular-nums">
                <span>{candidates.length} candidate{candidates.length !== 1 ? 's' : ''}</span>
                <span className="text-white/10">·</span>
                <span>Avg {Math.round(candidates.reduce((s, c) => s + c.score, 0) / candidates.length)}%</span>
              </div>
            )}
          </div>
        </header>

        <div className="p-6">
          {error && (
            <div className="mb-5 text-[12px] px-4 py-2.5 rounded-lg flex items-center justify-between animate-fade-in"
              style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.12)', color: '#f87171' }}
            >
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-400/50 hover:text-red-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {getActiveContent()}
        </div>
      </main>
    </div>
  );
}

export default App;

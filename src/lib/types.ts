export interface Resume {
  id: string;
  file_name: string;
  extracted_text: string;
  candidate_name: string;
  raw_skills: string[];
  created_at: string;
}

export interface JobDescription {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  created_at: string;
}

export interface Analysis {
  id: string;
  resume_id: string;
  job_description_id: string | null;
  score: number;
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
  created_at: string;
}

export interface CandidateResult {
  id: string;
  resumeId: string;
  candidateName: string;
  fileName: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  totalSkills: number;
}

export interface AnalysisResponse {
  results: CandidateResult[];
  jdSkills: string[];
}

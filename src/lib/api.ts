import type { AnalysisResponse } from './types';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-resume`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function analyzeResumes(
  files: File[],
  jobDescription?: string,
  jobTitle?: string
): Promise<AnalysisResponse> {
  const formData = new FormData();

  for (const file of files) {
    formData.append('files', file);
  }

  if (jobDescription?.trim()) {
    formData.append('jobDescription', jobDescription);
  }
  if (jobTitle?.trim()) {
    formData.append('jobTitle', jobTitle);
  }

  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

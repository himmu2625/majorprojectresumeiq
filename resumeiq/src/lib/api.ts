import { ScreeningResult, ScreeningSummary, JobOpening, FeedbackResult } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function uploadResume(file: File, jobDescription: string, jobTitle?: string, company?: string): Promise<ScreeningResult> {
  const formData = new FormData();
  formData.append('resume_file', file);
  formData.append('job_description', jobDescription);
  if (jobTitle) formData.append('job_title', jobTitle);
  if (company) formData.append('company', company);
  
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getScreeningResult(id: string): Promise<ScreeningResult> {
  const res = await fetch(`${API_BASE}/results/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getHistory(limit = 20): Promise<ScreeningSummary[]> {
  const res = await fetch(`${API_BASE}/history?limit=${limit}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getJobs(): Promise<JobOpening[]> {
  const res = await fetch(`${API_BASE}/jobs`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getCandidates(jobId?: string): Promise<ScreeningResult[]> {
  const res = await fetch(`${API_BASE}/candidates${jobId ? `?job_id=${jobId}` : ''}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function submitFeedback(resumeText: string, jd: string): Promise<FeedbackResult> {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_text: resumeText, job_description: jd }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

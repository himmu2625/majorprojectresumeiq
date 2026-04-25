'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import AppLayout from '@/components/shared/AppLayout';
import { uploadResume } from '@/lib/api';

export default function RecruiterSinglePage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0];
      if (f.size > 5 * 1024 * 1024) {
        setError('File too large. Maximum size is 5MB.');
        return;
      }
      setFile(f);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!file) { setError('Please upload a resume PDF.'); return; }
    if (jobDescription.length < 50) { setError('Job description too short (min 50 characters).'); return; }
    setIsAnalyzing(true);
    setError('');
    try {
      const result = await uploadResume(file, jobDescription, jobTitle, company);
      // Redirect to the existing full results page
      router.push(`/results/${result.screening_id}`);
    } catch {
      setError('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center animate-fade-in">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#1B3F7A] to-[#2E7CF6] flex items-center justify-center pulse-glow">
              <span className="material-symbols-outlined text-white text-5xl">psychology</span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-primary mb-4">Deep Analysis in Progress…</h2>
            <p className="text-on-surface-variant text-lg mb-8">
              Computing semantic embeddings · Generating full XAI explanation
            </p>
            <div className="flex justify-center gap-8 text-sm">
              {['Parsing PDF', 'SBERT Embedding', 'Scoring', 'XAI Generation'].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2E7CF6] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                  <span className="text-on-surface-variant font-mono text-xs uppercase tracking-wider">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Page Title Strip */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-end">
          <div>
            <nav className="flex items-center gap-2 text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-2">
              <button onClick={() => router.push('/recruiter')} className="hover:text-primary transition-colors">
                Recruiter
              </button>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary font-bold">Single Deep Analysis</span>
            </nav>
            <h1 className="font-headline font-bold text-[28px] text-primary tracking-tight">
              One-by-One Screening
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B3F7A] text-white text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">psychology</span>
            Full XAI Mode
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Info Banner */}
        <div className="mb-8 p-4 rounded-xl bg-[#EBF2FF] border border-[#2E7CF6]/20 flex items-start gap-3">
          <span className="material-symbols-outlined text-[#2E7CF6] mt-0.5">info</span>
          <p className="text-sm text-[#1B3F7A] leading-relaxed">
            <strong>Recruiter Deep Analysis:</strong> Upload one resume to get the full XAI breakdown — matching score, skill gaps, section-level analysis, positive factors, and actionable improvement suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
          {/* Left: Job Description */}
          <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
            <div className="p-6 border-b border-outline-variant/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1B3F7A]/10 flex items-center justify-center text-[#1B3F7A]">
                <span className="material-symbols-outlined">work</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-lg text-primary">Job Description</h2>
                <p className="text-xs text-on-surface-variant">Role context for the AI match engine</p>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Job Title
                  </label>
                  <input
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-lg text-sm transition-all outline-none border-b-2 border-outline-variant/20 focus:border-[#2E7CF6]"
                    placeholder="e.g. Senior Software Engineer"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Company Name
                  </label>
                  <input
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-lg text-sm transition-all outline-none border-b-2 border-outline-variant/20 focus:border-[#2E7CF6]"
                    placeholder="e.g. Acme Tech Corp"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Full JD Content
                </label>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  className="w-full h-[320px] p-4 bg-surface-container-low rounded-lg text-sm transition-all outline-none border-b-2 border-outline-variant/20 focus:border-[#2E7CF6] resize-none font-body leading-relaxed"
                  placeholder="Paste the full job description here… include responsibilities, requirements, and tech stack."
                />
              </div>
            </div>
          </div>

          {/* Right: Resume Upload */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
              <div className="p-6 border-b border-outline-variant/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#2E7CF6]/10 flex items-center justify-center text-[#2E7CF6]">
                  <span className="material-symbols-outlined">cloud_upload</span>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-lg text-primary">Resume Upload</h2>
                  <p className="text-xs text-on-surface-variant">Single PDF (max 5MB)</p>
                </div>
              </div>
              <div className="p-8">
                <div
                  {...getRootProps()}
                  className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center group cursor-pointer transition-all ${
                    isDragActive ? 'border-[#2E7CF6] bg-[#2E7CF6]/10'
                      : file ? 'border-green-500 bg-green-50'
                      : 'border-[#2E7CF6]/30 bg-[#EBF2FF] hover:border-[#2E7CF6] hover:bg-[#2E7CF6]/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className={`material-symbols-outlined text-3xl ${file ? 'text-green-600' : 'text-[#2E7CF6]'}`}>
                      {file ? 'check_circle' : 'upload_file'}
                    </span>
                  </div>
                  {file ? (
                    <>
                      <p className="font-bold text-primary mb-1">{file.name}</p>
                      <p className="text-xs text-on-surface-variant">Click or drag to replace</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-primary mb-1">Drag and drop resume</p>
                      <p className="text-xs text-on-surface-variant mb-4">
                        or <span className="text-[#2E7CF6] underline font-medium">browse your files</span>
                      </p>
                    </>
                  )}
                  <div className="glass-insight px-3 py-1 rounded-full flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-[14px] text-primary">auto_awesome</span>
                    <span className="text-[10px] font-mono text-primary font-bold">FULL XAI ANALYSIS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Get */}
            <div className="bg-[#1B3F7A] p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 p-4">
                <span className="material-symbols-outlined text-6xl text-white">psychology</span>
              </div>
              <h3 className="font-headline font-bold text-white mb-3">Full Analysis Includes</h3>
              <ul className="space-y-2">
                {['Overall match score (0–100)', 'Section-level bar chart', 'Matched & missing skills', 'XAI reasoning paragraph', 'Improvement suggestions'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-blue-100/90">
                    <span className="material-symbols-outlined text-sm text-green-400">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-error-container rounded-lg text-on-error-container text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <div className="mt-12 flex flex-col items-center">
          <button
            onClick={handleAnalyze}
            className="flex items-center gap-3 bg-gradient-to-r from-[#1B3F7A] to-[#2E7CF6] text-white px-10 py-5 rounded-xl shadow-xl shadow-[#1B3F7A]/20 hover:shadow-2xl hover:shadow-[#1B3F7A]/30 transition-all hover:-translate-y-1 active:scale-95 group"
          >
            <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">psychology</span>
            <span className="font-headline font-extrabold text-lg tracking-tight">Run Deep Analysis</span>
          </button>
          <p className="mt-4 text-xs font-mono text-on-surface-variant/60 uppercase tracking-widest">
            Full XAI report in approx. 6–8 seconds
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import AppLayout from '@/components/shared/AppLayout';
import { uploadResume } from '@/lib/api';

export default function ScreenPage() {
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
    if (jobDescription.length < 50) { setError('Job description too short. Add more detail (min 50 characters).'); return; }
    setIsAnalyzing(true);
    setError('');
    try {
      const result = await uploadResume(file, jobDescription, jobTitle, company);
      router.push(`/results/${result.screening_id}`);
    } catch {
      setError('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  // Loading overlay
  if (isAnalyzing) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center animate-fade-in">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center pulse-glow">
              <span className="material-symbols-outlined text-white text-5xl">psychology</span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-primary mb-4">Analyzing Resume...</h2>
            <p className="text-on-surface-variant text-lg mb-8">Our AI is computing semantic embeddings and generating explanations</p>
            <div className="flex justify-center gap-8 text-sm">
              {['Parsing PDF', 'Embedding with SBERT', 'Computing Score', 'Generating XAI'].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}></div>
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
              <span>Home</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary font-bold">Screen Resume</span>
            </nav>
            <h1 className="font-headline font-bold text-[28px] text-primary tracking-tight">New Screening</h1>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-secondary">Step 1 of 1</p>
            <p className="text-xs text-on-surface-variant">— Upload &amp; Analyze</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
          {/* Left: Job Description */}
          <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
            <div className="p-6 border-b border-outline-variant/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">work</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-lg text-primary">Job Description</h2>
                <p className="text-xs text-on-surface-variant">Provide context for the AI match engine</p>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Job Title</label>
                  <input
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-lg text-sm transition-all outline-none border-b-2 border-outline-variant/20 focus:border-secondary"
                    placeholder="e.g. Senior Software Engineer"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Company Name</label>
                  <input
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-lg text-sm transition-all outline-none border-b-2 border-outline-variant/20 focus:border-secondary"
                    placeholder="e.g. Acme Tech Corp"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full JD Content</label>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  className="w-full h-[320px] p-4 bg-surface-container-low rounded-lg text-sm transition-all outline-none border-b-2 border-outline-variant/20 focus:border-secondary resize-none font-body leading-relaxed"
                  placeholder="Paste the job description here... include responsibilities, requirements, and benefits for better matching accuracy."
                />
              </div>
            </div>
          </div>

          {/* Right: Resume Upload */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
              <div className="p-6 border-b border-outline-variant/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">cloud_upload</span>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-lg text-primary">Resume Upload</h2>
                  <p className="text-xs text-on-surface-variant">PDF supported (max 5MB)</p>
                </div>
              </div>
              <div className="p-8">
                <div
                  {...getRootProps()}
                  className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center group cursor-pointer transition-all ${
                    isDragActive ? 'border-secondary bg-secondary/10' : file ? 'border-tertiary-fixed bg-tertiary-fixed/10' : 'border-secondary/30 bg-[#EBF2FF] hover:border-secondary hover:bg-secondary/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className={`material-symbols-outlined text-3xl ${file ? 'text-on-tertiary-container' : 'text-secondary'}`}>
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
                      <p className="text-xs text-on-surface-variant mb-4">or <span className="text-secondary underline font-medium">browse your files</span></p>
                    </>
                  )}
                  <div className="glass-insight px-3 py-1 rounded-full flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-[14px] text-on-tertiary-fixed-variant">auto_awesome</span>
                    <span className="text-[10px] font-mono text-on-tertiary-fixed-variant font-bold">AI ENHANCED PARSING</span>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  {['Privacy Shield Active', 'Skill Extraction Enabled', 'Format Validation (PDF)'].map((label, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <div className="w-6 h-6 rounded-full bg-tertiary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px] text-on-tertiary-fixed-variant font-bold">check</span>
                      </div>
                      <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pro Tip Card */}
            <div className="bg-primary-container p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl">psychology</span>
              </div>
              <h3 className="font-headline font-bold text-white mb-2">Pro Tip</h3>
              <p className="text-on-primary-container text-xs leading-relaxed">Detailed job descriptions lead to 40% more accurate candidate scoring. Include specific tech stacks and soft skills.</p>
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

        {/* Action Button */}
        <div className="mt-12 flex flex-col items-center">
          <button
            onClick={handleAnalyze}
            className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary-container text-white px-10 py-5 rounded-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 group"
          >
            <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">bar_chart</span>
            <span className="font-headline font-extrabold text-lg tracking-tight">Analyze Resume with AI</span>
          </button>
          <p className="mt-4 text-xs font-mono text-on-surface-variant/60 uppercase tracking-widest">Processing takes approx. 4 seconds</p>
        </div>
      </div>
    </AppLayout>
  );
}

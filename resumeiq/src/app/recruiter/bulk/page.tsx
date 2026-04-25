'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import AppLayout from '@/components/shared/AppLayout';
import { bulkUploadResumes } from '@/lib/api';
import { BulkScreeningResult } from '@/lib/types';

const MAX_FILES = 20;

function ScorePill({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-green-100 text-green-700' : score >= 45 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-mono font-bold text-sm ${color}`}>
      {score.toFixed(1)}%
    </span>
  );
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const map = { High: 'bg-green-100 text-green-700', Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-red-100 text-red-700' };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${map[confidence as keyof typeof map] || 'bg-gray-100 text-gray-600'}`}>
      {confidence}
    </span>
  );
}

function downloadCSV(results: BulkScreeningResult[], jobTitle: string) {
  const headers = ['Rank', 'Filename', 'Score', 'Confidence', 'Matched Skills', 'Missing Skills'];
  const rows = results.map(r => [
    r.rank,
    r.filename,
    r.overall_score.toFixed(1),
    r.confidence,
    r.matched_skills.join('; '),
    r.missing_skills.join('; '),
  ]);
  const csv = [headers, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bulk-screening-${jobTitle || 'results'}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RecruiterBulkPage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<BulkScreeningResult[] | null>(null);
  const [summary, setSummary] = useState({ total: 0, failed: 0, jobTitle: '' });
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    const pdfs = accepted.filter(f => f.name.toLowerCase().endsWith('.pdf'));
    const combined = [...files, ...pdfs].slice(0, MAX_FILES);
    setFiles(combined);
    setError('');
    if (accepted.length !== pdfs.length) {
      setError('Some files were skipped — only PDF files are supported.');
    }
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: MAX_FILES,
    multiple: true,
  });

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleAnalyze = async () => {
    if (files.length === 0) { setError('Please upload at least one resume PDF.'); return; }
    if (jobDescription.length < 50) { setError('Job description too short (min 50 characters).'); return; }

    setIsAnalyzing(true);
    setProgress({ current: 0, total: files.length });
    setError('');
    setResults(null);

    try {
      // Animate progress while waiting for response
      let fakeProgress = 0;
      const interval = setInterval(() => {
        fakeProgress = Math.min(fakeProgress + 1, files.length - 1);
        setProgress(p => ({ ...p, current: fakeProgress }));
      }, 800);

      const response = await bulkUploadResumes(files, jobDescription, jobTitle, company);
      clearInterval(interval);

      setProgress({ current: files.length, total: files.length });
      setResults(response.results);
      setSummary({ total: response.total_processed, failed: response.failed, jobTitle: response.job_title });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bulk analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAll = () => {
    setFiles([]);
    setResults(null);
    setError('');
    setProgress({ current: 0, total: 0 });
    setSummary({ total: 0, failed: 0, jobTitle: '' });
  };

  // ── Loading State ──────────────────────────────────────────────
  if (isAnalyzing) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center animate-fade-in max-w-lg w-full px-6">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#1B3F7A] to-[#2E7CF6] flex items-center justify-center pulse-glow">
              <span className="material-symbols-outlined text-white text-5xl">group</span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-primary mb-2">Screening {files.length} Resumes…</h2>
            <p className="text-on-surface-variant mb-8">Processing each resume with SBERT + scoring pipeline</p>

            {/* Progress bar */}
            <div className="w-full bg-surface-container-low rounded-full h-3 mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#1B3F7A] to-[#2E7CF6] h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-sm font-mono text-on-surface-variant">
              {progress.current} / {progress.total} analysed
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Results View ───────────────────────────────────────────────
  if (results && results.length > 0) {
    const top = results[0];
    const avgScore = results.reduce((a, r) => a + r.overall_score, 0) / results.length;
    const highCount = results.filter(r => r.confidence === 'High').length;

    return (
      <AppLayout>
        {/* Header */}
        <section className="bg-surface-container-lowest border-b border-outline-variant/10">
          <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-end">
            <div>
              <nav className="flex items-center gap-2 text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-2">
                <button onClick={() => router.push('/recruiter')} className="hover:text-primary transition-colors">Recruiter</button>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-primary font-bold">Bulk Results</span>
              </nav>
              <h1 className="font-headline font-bold text-[28px] text-primary tracking-tight">Ranked Candidates</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => downloadCSV(results, summary.jobTitle)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EBF2FF] text-[#1B3F7A] text-sm font-bold hover:bg-[#1B3F7A] hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Export CSV
              </button>
              <button
                onClick={resetAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-low text-on-surface-variant text-sm font-medium hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                New Batch
              </button>
            </div>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8 animate-fade-in">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-5">
            {[
              { icon: 'group', label: 'Resumes Screened', value: summary.total, color: 'text-primary' },
              { icon: 'leaderboard', label: 'Avg Match Score', value: `${avgScore.toFixed(1)}%`, color: 'text-primary' },
              { icon: 'verified', label: 'High Confidence', value: highCount, color: 'text-green-600' },
              { icon: 'error_outline', label: 'Failed / Skipped', value: summary.failed, color: 'text-red-500' },
            ].map(s => (
              <div key={s.label} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`material-symbols-outlined text-xl ${s.color}`}>{s.icon}</span>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">{s.label}</span>
                </div>
                <p className={`font-mono font-extrabold text-3xl ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Top Candidate Highlight */}
          <div className="bg-gradient-to-r from-[#1B3F7A] to-[#2E5BA8] rounded-2xl p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">emoji_events</span>
              </div>
              <div>
                <p className="text-blue-200/70 text-xs font-mono uppercase tracking-widest mb-1">Top Candidate · Rank #1</p>
                <p className="font-headline font-bold text-xl">{top.filename.replace('.pdf', '')}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono font-bold text-2xl text-white">{top.overall_score.toFixed(1)}%</span>
                  <span className="text-blue-200/70 text-sm">match score</span>
                  <ConfidenceBadge confidence={top.confidence} />
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push(`/results/${top.screening_id}`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#1B3F7A] font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              View Full Report
            </button>
          </div>

          {/* Ranked Table */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant/5 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">leaderboard</span>
              <h3 className="font-headline font-bold text-lg text-primary">
                Ranked Candidates — {summary.jobTitle || 'Bulk Screening'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    {['Rank', 'Resume File', 'Match Score', 'Confidence', 'Matched Skills', 'Missing Skills', 'Action'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {results.map((r, i) => (
                    <tr
                      key={r.screening_id}
                      className={`hover:bg-surface-container-low/50 transition-colors ${i === 0 ? 'bg-green-50/40' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm ${
                          i === 0 ? 'bg-[#1B3F7A] text-white' : i === 1 ? 'bg-[#2E7CF6]/20 text-[#2E7CF6]' : i === 2 ? 'bg-amber-100 text-amber-700' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          {r.rank}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-on-surface-variant text-base">description</span>
                          <span className="text-sm font-medium text-primary max-w-[180px] truncate" title={r.filename}>
                            {r.filename.replace('.pdf', '')}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <ScorePill score={r.overall_score} />
                          <div className="w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${r.overall_score >= 70 ? 'bg-green-500' : r.overall_score >= 45 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${r.overall_score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <ConfidenceBadge confidence={r.confidence} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {r.matched_skills.slice(0, 3).map(s => (
                            <span key={s} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">{s}</span>
                          ))}
                          {r.matched_skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-xs">+{r.matched_skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {r.missing_skills.slice(0, 3).map(s => (
                            <span key={s} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">{s}</span>
                          ))}
                          {r.missing_skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-xs">+{r.missing_skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => router.push(`/results/${r.screening_id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EBF2FF] text-[#1B3F7A] text-xs font-bold hover:bg-[#1B3F7A] hover:text-white transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Upload Form ────────────────────────────────────────────────
  return (
    <AppLayout>
      <section className="bg-surface-container-lowest border-b border-outline-variant/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-end">
          <div>
            <nav className="flex items-center gap-2 text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-2">
              <button onClick={() => router.push('/recruiter')} className="hover:text-primary transition-colors">Recruiter</button>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary font-bold">Bulk Screening</span>
            </nav>
            <h1 className="font-headline font-bold text-[28px] text-primary tracking-tight">Bulk Resume Screening</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B3F7A] text-white text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">group</span>
            Bulk Mode · Up to {MAX_FILES} PDFs
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">

          {/* Left — Job Description */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
            <div className="p-6 border-b border-outline-variant/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">work</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-lg text-primary">Job Description</h2>
                <p className="text-xs text-on-surface-variant">Shared across all resumes</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Job Title</label>
                  <input
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-container-low rounded-lg text-sm outline-none border-b-2 border-outline-variant/20 focus:border-primary"
                    placeholder="e.g. Data Scientist"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Company</label>
                  <input
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-container-low rounded-lg text-sm outline-none border-b-2 border-outline-variant/20 focus:border-primary"
                    placeholder="e.g. TechCorp"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full JD Content</label>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  className="w-full h-72 p-4 bg-surface-container-low rounded-lg text-sm outline-none border-b-2 border-outline-variant/20 focus:border-primary resize-none leading-relaxed"
                  placeholder="Paste the full job description here…"
                />
                <p className="text-right text-xs text-on-surface-variant font-mono">{jobDescription.length}/5000</p>
              </div>
            </div>
          </div>

          {/* Right — Multi-file Upload */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
              <div className="p-6 border-b border-outline-variant/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">cloud_upload</span>
                  </div>
                  <div>
                    <h2 className="font-headline font-bold text-lg text-primary">Resume Files</h2>
                    <p className="text-xs text-on-surface-variant">PDF only · max 5MB each · up to {MAX_FILES} files</p>
                  </div>
                </div>
                {files.length > 0 && (
                  <span className="font-mono text-sm font-bold text-primary">{files.length}/{MAX_FILES}</span>
                )}
              </div>
              <div className="p-6">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-primary/30 bg-[#EBF2FF] hover:border-primary hover:bg-primary/5'
                  } ${files.length >= MAX_FILES ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <input {...getInputProps()} />
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl text-primary">upload_file</span>
                  </div>
                  <p className="font-bold text-primary mb-1">
                    {isDragActive ? 'Drop PDFs here…' : 'Drag & drop resumes'}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    or <span className="text-primary underline font-medium">browse files</span> — multiple PDFs at once
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-5 space-y-2 max-h-64 overflow-y-auto pr-1">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg group">
                        <span className="material-symbols-outlined text-primary text-base shrink-0">description</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary truncate">{f.name}</p>
                          <p className="text-xs text-on-surface-variant">{(f.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <button
                          onClick={() => removeFile(i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-red-500"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* How bulk works */}
            <div className="bg-[#1B3F7A]/5 border border-[#1B3F7A]/10 rounded-xl p-5">
              <h4 className="font-bold text-sm text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">help_outline</span>
                How Bulk Screening Works
              </h4>
              <ol className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
                {[
                  'Upload up to 20 PDF resumes',
                  'All are scored against the same Job Description using SBERT',
                  'Results are ranked from highest to lowest match score',
                  'Click "Details" on any row to see the full XAI report',
                  'Export the ranked list as CSV for reporting',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
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

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center">
          <button
            onClick={handleAnalyze}
            disabled={files.length === 0}
            className="flex items-center gap-3 bg-gradient-to-r from-[#1B3F7A] to-[#2E5BA8] text-white px-10 py-5 rounded-xl shadow-xl shadow-[#1B3F7A]/20 hover:shadow-2xl hover:shadow-[#1B3F7A]/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
          >
            <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">group</span>
            <span className="font-headline font-extrabold text-lg tracking-tight">
              Screen {files.length > 0 ? files.length : 'All'} Resume{files.length !== 1 ? 's' : ''}
            </span>
          </button>
          <p className="mt-4 text-xs font-mono text-on-surface-variant/60 uppercase tracking-widest">
            Processing takes ~{files.length > 0 ? Math.max(5, files.length * 4) : '?'} seconds
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

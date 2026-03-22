'use client';
import { useState } from 'react';
import Link from 'next/link';
import { submitFeedback } from '@/lib/api';
import { FeedbackResult } from '@/lib/types';

export default function FeedbackPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FeedbackResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (resumeText.length < 100) { setError('Resume text too short (min 100 characters).'); return; }
    if (jobDescription.length < 50) { setError('Job description too short (min 50 characters).'); return; }
    setIsAnalyzing(true);
    setError('');
    try {
      const r = await submitFeedback(resumeText, jobDescription);
      setResult(r);
    } catch {
      setError('Analysis failed. Please try again.');
    }
    setIsAnalyzing(false);
  };

  const getScoreColor = (s: number) => s >= 70 ? 'score-high' : s >= 45 ? 'score-medium' : 'score-low';
  const getScoreBg = (s: number) => s >= 70 ? 'score-bg-high' : s >= 45 ? 'score-bg-medium' : 'score-bg-low';

  // Landing header for candidate portal
  const header = (
    <header className="bg-[#1B3F7A] sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white font-headline">ResumeIQ</Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link className="text-blue-100/80 hover:text-white transition-colors font-medium text-sm" href="/">Home</Link>
          <span className="text-white border-b-2 border-white pb-1 font-medium text-sm">For Candidates</span>
          <Link className="text-blue-100/80 hover:text-white transition-colors font-medium text-sm" href="/screen">For Recruiters</Link>
        </div>
        <Link href="/screen" className="bg-white text-[#1B3F7A] hover:opacity-90 transition-opacity px-4 py-2 rounded-lg font-bold text-sm">Recruiter Portal</Link>
      </nav>
    </header>
  );

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex flex-col">
        {header}
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center pulse-glow">
              <span className="material-symbols-outlined text-white text-4xl">psychology</span>
            </div>
            <h2 className="font-headline text-2xl font-bold text-primary mb-3">Analyzing Your Resume...</h2>
            <p className="text-on-surface-variant">Generating personalized feedback and improvement suggestions</p>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen flex flex-col">
        {header}
        <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in space-y-8 flex-grow">
          {/* Score Header */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm text-center">
            <h2 className="font-headline text-3xl font-bold text-primary mb-2">Your Resume Score</h2>
            <div className={`inline-block px-6 py-3 rounded-2xl font-mono text-5xl font-bold ${getScoreColor(result.overall_score)} ${getScoreBg(result.overall_score)}`}>
              {result.overall_score.toFixed(1)}%
            </div>
            <p className="mt-3 text-on-surface-variant">Confidence: <strong>{result.confidence}</strong></p>
          </div>

          {/* Section Ratings */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">bar_chart</span>
              Section Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(result.section_ratings).map(([key, val]) => (
                <div key={key} className="bg-surface-container-low rounded-lg p-4 text-center">
                  <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2 capitalize">{key}</p>
                  <p className={`font-mono text-2xl font-bold ${getScoreColor(val)}`}>{val.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps & Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-sm">
              <h3 className="font-headline font-bold text-base text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-error">warning</span>Skill Gaps
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.skill_gaps.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-error-container text-on-error-container rounded text-sm font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-sm">
              <h3 className="font-headline font-bold text-base text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">lightbulb</span>Keywords to Add
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.keyword_suggestions.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-secondary-container/30 text-on-secondary-container rounded text-sm font-medium">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">tips_and_updates</span>Improvement Action Plan
            </h3>
            <div className="space-y-3">
              {result.action_plan.map((a, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white font-mono font-bold text-sm shrink-0">{i + 1}</div>
                  <p className="text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Format Issues */}
          {result.format_issues.length > 0 && (
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-sm">
              <h3 className="font-headline font-bold text-base text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">format_list_bulleted</span>Format Issues
              </h3>
              <ul className="space-y-2">
                {result.format_issues.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm text-error mt-0.5">info</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-center">
            <button onClick={() => setResult(null)} className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-opacity">Analyze Another Resume</button>
          </div>
        </div>
      </div>
    );
  }

  // Input Form
  return (
    <div className="min-h-screen flex flex-col">
      {header}
      <div className="flex-grow">
        {/* Hero */}
        <section className="hero-gradient pt-16 pb-20 px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EBF2FF] text-[#2E7CF6] text-sm font-semibold mb-6">
              Free • No Signup Required
            </div>
            <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-[#1B3F7A] leading-tight mb-4">
              Get AI Feedback on Your Resume
            </h1>
            <p className="text-lg text-[#4A5568] max-w-xl mx-auto leading-relaxed">
              Paste your resume and a target job description. Our AI will tell you exactly what to improve.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 -mt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resume Text */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
              <div className="p-5 border-b border-outline-variant/5 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">description</span>
                <h2 className="font-headline font-bold text-primary">Your Resume Content</h2>
              </div>
              <div className="p-6">
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  className="w-full h-80 p-4 bg-surface-container-low rounded-lg text-sm outline-none border-b-2 border-outline-variant/20 focus:border-secondary resize-none leading-relaxed"
                  placeholder="Paste your resume text content here..."
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
              <div className="p-5 border-b border-outline-variant/5 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">work</span>
                <h2 className="font-headline font-bold text-primary">Target Job Description</h2>
              </div>
              <div className="p-6">
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  className="w-full h-80 p-4 bg-surface-container-low rounded-lg text-sm outline-none border-b-2 border-outline-variant/20 focus:border-secondary resize-none leading-relaxed"
                  placeholder="Paste the job description you're applying for..."
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-error-container rounded-lg text-on-error-container text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>{error}
            </div>
          )}

          <div className="mt-10 flex flex-col items-center">
            <button
              onClick={handleAnalyze}
              className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary-container text-white px-10 py-5 rounded-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 group"
            >
              <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">psychology</span>
              <span className="font-headline font-extrabold text-lg tracking-tight">Analyze My Resume</span>
            </button>
            <p className="mt-3 text-xs font-mono text-on-surface-variant/60 uppercase tracking-widest">AI-powered analysis in ~4 seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}

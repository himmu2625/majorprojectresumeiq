'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/shared/AppLayout';

export default function RecruiterDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('resumeiq_role');
    if (stored !== 'recruiter') {
      // Ensure role is set for AppLayout context
      localStorage.setItem('resumeiq_role', 'recruiter');
    }
    setRole('recruiter');
  }, []);

  if (!role) return null; // avoid hydration flicker

  return (
    <AppLayout>
      {/* Page Title Strip */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-end">
          <div>
            <nav className="flex items-center gap-2 text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-2">
              <button onClick={() => router.push('/role-select')} className="hover:text-primary transition-colors">
                Home
              </button>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary font-bold">Recruiter Dashboard</span>
            </nav>
            <h1 className="font-headline font-bold text-[28px] text-primary tracking-tight">
              Recruiter Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B3F7A] text-white text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">manage_accounts</span>
            Recruiter Mode
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#1B3F7A] to-[#2E5BA8] rounded-2xl p-8 mb-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white">waving_hand</span>
              </div>
              <span className="text-white/70 font-mono text-xs uppercase tracking-widest">Welcome Back</span>
            </div>
            <h2 className="font-headline text-3xl font-extrabold mb-2">
              Ready to find the best candidates?
            </h2>
            <p className="text-blue-100/80 max-w-xl leading-relaxed">
              Use bulk screening to rank multiple applicants at once, or perform a deep analysis on a single resume to understand every factor behind the score.
            </p>
          </div>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Bulk Screening Card */}
          <Link
            href="/recruiter/bulk"
            id="recruiter-bulk-link"
            className="group relative bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-xl border border-outline-variant/10 hover:border-[#1B3F7A]/30 transition-all duration-300 hover:-translate-y-1 p-8 overflow-hidden block"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#1B3F7A]/3 rounded-full -translate-y-1/4 translate-x-1/4 group-hover:bg-[#1B3F7A]/8 transition-colors" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-[#1B3F7A] flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-white text-2xl">group</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2FF] text-[#1B3F7A] text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B3F7A] animate-pulse" />
                Up to 20 Resumes
              </div>

              <h3 className="font-headline font-extrabold text-2xl text-primary mb-3">
                Bulk Resume Screening
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Upload multiple resumes at once. Our AI scores and ranks all candidates against your job description — most relevant candidates appear at the top.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { icon: 'upload_file', text: 'Upload 1–20 PDF resumes at once' },
                  { icon: 'leaderboard', text: 'Instant ranked leaderboard by AI score' },
                  { icon: 'download', text: 'Export ranked list as CSV' },
                ].map(f => (
                  <div key={f.text} className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <div className="w-7 h-7 rounded-lg bg-[#EBF2FF] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#1B3F7A] text-sm">{f.icon}</span>
                    </div>
                    {f.text}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[#1B3F7A] font-bold text-sm group-hover:gap-3 transition-all">
                Start Bulk Screening
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* One-by-One Screening Card */}
          <Link
            href="/recruiter/single"
            id="recruiter-single-link"
            className="group relative bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-xl border border-outline-variant/10 hover:border-[#2E7CF6]/30 transition-all duration-300 hover:-translate-y-1 p-8 overflow-hidden block"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#2E7CF6]/3 rounded-full -translate-y-1/4 translate-x-1/4 group-hover:bg-[#2E7CF6]/8 transition-colors" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-[#2E7CF6] flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-white text-2xl">person_search</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2FF] text-[#2E7CF6] text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7CF6] animate-pulse" />
                Full XAI Analysis
              </div>

              <h3 className="font-headline font-extrabold text-2xl text-primary mb-3">
                One-by-One Screening
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Deep-dive into a single candidate. Get the full AI explanation — why they scored high or low, their strengths, skill gaps, and specific improvement areas.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { icon: 'psychology', text: 'Full explainable AI reasoning (XAI)' },
                  { icon: 'bar_chart', text: 'Section-level breakdown (Skills, Exp, etc.)' },
                  { icon: 'tips_and_updates', text: 'Strengths, gaps & improvement plan' },
                ].map(f => (
                  <div key={f.text} className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <div className="w-7 h-7 rounded-lg bg-[#EBF2FF] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#2E7CF6] text-sm">{f.icon}</span>
                    </div>
                    {f.text}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[#2E7CF6] font-bold text-sm group-hover:gap-3 transition-all">
                Start Single Analysis
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-10 grid grid-cols-3 gap-6">
          {[
            { icon: 'speed', label: 'Avg. Analysis Time', value: '< 8 sec / resume' },
            { icon: 'verified', label: 'Matching Accuracy', value: '85%+ F1 Score' },
            { icon: 'lock', label: 'Privacy', value: 'No data stored' },
          ].map(s => (
            <div key={s.label} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-xl">{s.icon}</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-0.5">{s.label}</p>
                <p className="font-mono font-bold text-sm text-primary">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

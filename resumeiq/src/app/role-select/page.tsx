'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RoleSelectPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any previously stored role so user can choose fresh
    localStorage.removeItem('resumeiq_role');
  }, []);

  const selectRole = (role: 'recruiter' | 'candidate') => {
    localStorage.setItem('resumeiq_role', role);
    if (role === 'recruiter') {
      router.push('/recruiter');
    } else {
      router.push('/screen');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] via-[#EBF2FF] to-[#F5F7FA] flex flex-col">
      {/* Minimal Header */}
      <header className="bg-[#1B3F7A] py-4 px-8 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="text-2xl font-bold tracking-tight text-white font-headline hover:opacity-80 transition-opacity"
        >
          ResumeIQ
        </button>
        <span className="text-blue-200/60 text-sm font-mono uppercase tracking-widest">
          Select Your Role
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#2E7CF6]/20 text-[#2E7CF6] text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          AI-Powered Resume Screening
        </div>

        <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-[#1B3F7A] text-center mb-4 leading-tight">
          How are you using ResumeIQ today?
        </h1>
        <p className="text-[#4A5568] text-lg text-center max-w-xl mb-14 leading-relaxed">
          Choose your role to access the right set of tools. You can always switch later.
        </p>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">

          {/* Recruiter Card */}
          <button
            id="role-recruiter-btn"
            onClick={() => selectRole('recruiter')}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#1B3F7A] transition-all duration-300 hover:-translate-y-2 p-8 text-left overflow-hidden"
          >
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#1B3F7A]/5 rounded-full -translate-y-1/4 translate-x-1/4 group-hover:bg-[#1B3F7A]/10 transition-colors" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#1B3F7A] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-3xl">manage_accounts</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2FF] text-[#1B3F7A] text-xs font-bold uppercase tracking-wider mb-4">
                <span className="material-symbols-outlined text-sm">business_center</span>
                For Hiring Teams
              </div>

              <h2 className="font-headline font-extrabold text-2xl text-[#1B3F7A] mb-3">
                Recruiter
              </h2>
              <p className="text-[#4A5568] text-sm leading-relaxed mb-6">
                Screen multiple candidates at once, rank resumes by relevance, or dive deep into a single application with full AI explanations.
              </p>

              <ul className="space-y-2 mb-8">
                {[
                  { icon: 'group', label: 'Bulk Resume Screening (up to 20 PDFs)' },
                  { icon: 'leaderboard', label: 'Ranked candidate list by score' },
                  { icon: 'psychology', label: 'One-by-one deep analysis with XAI' },
                ].map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-sm text-[#4A5568]">
                    <span className="material-symbols-outlined text-[#1B3F7A] text-base">{f.icon}</span>
                    {f.label}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-[#1B3F7A] font-bold text-sm group-hover:gap-3 transition-all">
                Enter as Recruiter
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </div>
            </div>
          </button>

          {/* Candidate Card */}
          <button
            id="role-candidate-btn"
            onClick={() => selectRole('candidate')}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#2E7CF6] transition-all duration-300 hover:-translate-y-2 p-8 text-left overflow-hidden"
          >
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#2E7CF6]/5 rounded-full -translate-y-1/4 translate-x-1/4 group-hover:bg-[#2E7CF6]/10 transition-colors" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#2E7CF6] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-3xl">person_search</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2FF] text-[#2E7CF6] text-xs font-bold uppercase tracking-wider mb-4">
                <span className="material-symbols-outlined text-sm">school</span>
                For Job Seekers
              </div>

              <h2 className="font-headline font-extrabold text-2xl text-[#1B3F7A] mb-3">
                Candidate
              </h2>
              <p className="text-[#4A5568] text-sm leading-relaxed mb-6">
                Upload your resume against a job description and get a detailed AI-powered score, skill gap analysis, and actionable improvement tips.
              </p>

              <ul className="space-y-2 mb-8">
                {[
                  { icon: 'upload_file', label: 'Upload resume & get instant score' },
                  { icon: 'lightbulb', label: 'Explainable AI — understand your gaps' },
                  { icon: 'tips_and_updates', label: 'Personalized improvement suggestions' },
                ].map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-sm text-[#4A5568]">
                    <span className="material-symbols-outlined text-[#2E7CF6] text-base">{f.icon}</span>
                    {f.label}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-[#2E7CF6] font-bold text-sm group-hover:gap-3 transition-all">
                Enter as Candidate
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </div>
            </div>
          </button>
        </div>

        <p className="mt-10 text-xs text-[#4A5568]/60 font-mono uppercase tracking-widest">
          No sign-up required · Your data stays private
        </p>
      </main>
    </div>
  );
}

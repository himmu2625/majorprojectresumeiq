'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TopAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('resumeiq_role');
    setRole(stored);
  }, [pathname]);

  const isRecruiter = role === 'recruiter';

  const recruiterLinks = [
    { label: 'Dashboard', href: '/recruiter' },
    { label: 'Bulk Screen', href: '/recruiter/bulk' },
    { label: 'Single Screen', href: '/recruiter/single' },
    { label: 'History', href: '/history' },
  ];

  const candidateLinks = [
    { label: 'Screen Resume', href: '/screen' },
    { label: 'Get Feedback', href: '/feedback' },
    { label: 'History', href: '/history' },
  ];

  const navLinks = isRecruiter ? recruiterLinks : candidateLinks;

  return (
    <header className="bg-[#00285f] text-white font-headline tracking-tight shadow-lg shadow-blue-900/20 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-8 h-16 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
            ResumeIQ
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-white border-b-2 border-[#99f5c8] pb-1'
                    : 'text-blue-200/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Role Badge */}
          {role && (
            <button
              onClick={() => router.push('/role-select')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:opacity-80 ${
                isRecruiter
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-[#2E7CF6]/30 text-blue-100 border border-[#2E7CF6]/30'
              }`}
              title="Switch role"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isRecruiter ? 'manage_accounts' : 'person'}
              </span>
              {isRecruiter ? 'Recruiter' : 'Candidate'}
              <span className="material-symbols-outlined text-[12px] opacity-60">swap_horiz</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-3">
            {isRecruiter ? (
              <Link href="/recruiter/bulk" className="text-white/80 hover:text-white transition-all text-sm">
                Bulk Screen
              </Link>
            ) : (
              <Link href="/screen" className="text-white/80 hover:text-white transition-all text-sm">
                New Screening
              </Link>
            )}
          </div>

          <button className="material-symbols-outlined p-2 hover:bg-white/10 rounded-lg transition-all">notifications</button>
          <button className="material-symbols-outlined p-2 hover:bg-white/10 rounded-lg transition-all">settings</button>
          <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden border border-white/20 flex items-center justify-center text-xs font-bold text-on-secondary-container">
            {isRecruiter ? 'R' : 'C'}
          </div>
        </div>
      </div>
    </header>
  );
}

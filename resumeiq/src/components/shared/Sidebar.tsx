'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const recruiterItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '/recruiter' },
  { icon: 'group', label: 'Bulk Screen', href: '/recruiter/bulk' },
  { icon: 'person_search', label: 'Single Screen', href: '/recruiter/single' },
  { icon: 'history', label: 'History', href: '/history' },
  { icon: 'work', label: 'Jobs', href: '/jobs' },
];

const candidateItems = [
  { icon: 'cloud_upload', label: 'Upload', href: '/screen' },
  { icon: 'bar_chart', label: 'Results', href: '/candidates' },
  { icon: 'history', label: 'History', href: '/history' },
  { icon: 'feedback', label: 'Feedback', href: '/feedback' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string>('candidate');

  useEffect(() => {
    const stored = localStorage.getItem('resumeiq_role') || 'candidate';
    setRole(stored);
  }, [pathname]); // re-read on every route change

  const items = role === 'recruiter' ? recruiterItems : candidateItems;

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-16 hover:w-56 bg-surface-container-low transition-all duration-300 group/nav z-40 overflow-hidden flex-col py-4 gap-1">
      {/* Role indicator at top */}
      <div className="px-4 mb-3 opacity-0 group-hover/nav:opacity-100 transition-opacity">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          role === 'recruiter'
            ? 'bg-[#1B3F7A]/10 text-[#1B3F7A]'
            : 'bg-[#2E7CF6]/10 text-[#2E7CF6]'
        }`}>
          <span className="material-symbols-outlined text-[12px]">
            {role === 'recruiter' ? 'manage_accounts' : 'person'}
          </span>
          {role === 'recruiter' ? 'Recruiter' : 'Candidate'}
        </span>
      </div>

      {items.map(item => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center h-12 px-4 gap-4 transition-all duration-200 ${
              isActive
                ? 'bg-white text-[#00285f] rounded-r-xl border-l-4 border-[#3d5d9a]'
                : 'text-on-surface-variant hover:bg-white/50'
            }`}
          >
            <span className="material-symbols-outlined shrink-0">{item.icon}</span>
            <span className="opacity-0 group-hover/nav:opacity-100 transition-opacity font-medium text-sm whitespace-nowrap">
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Switch role at bottom */}
      <div className="mt-auto">
        <Link
          href="/role-select"
          className="flex items-center h-12 px-4 gap-4 text-on-surface-variant hover:bg-white/50 transition-all duration-200 border-t border-outline-variant/10"
        >
          <span className="material-symbols-outlined shrink-0 text-[18px]">swap_horiz</span>
          <span className="opacity-0 group-hover/nav:opacity-100 transition-opacity font-medium text-xs whitespace-nowrap text-on-surface-variant">
            Switch Role
          </span>
        </Link>
      </div>
    </aside>
  );
}

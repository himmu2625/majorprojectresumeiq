'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Dashboard', href: '/candidates' },
  { label: 'Candidates', href: '/candidates' },
  { label: 'Job Posts', href: '/jobs' },
  { label: 'History', href: '/history' },
];

export default function TopAppBar() {
  const pathname = usePathname();

  return (
    <header className="bg-[#00285f] text-white font-headline tracking-tight shadow-lg shadow-blue-900/20 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-8 h-16 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white">ResumeIQ</Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-white border-b-2 border-[#99f5c8] pb-1'
                    : 'text-blue-200/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 mr-4 border-r border-white/10 pr-4">
            <Link href="/screen" className="text-white/80 hover:text-white transition-all text-sm">New Screening</Link>
            <Link href="/feedback" className="text-white/80 hover:text-white transition-all text-sm">For Candidates</Link>
          </div>
          <button className="material-symbols-outlined p-2 hover:bg-white/10 rounded-lg transition-all">notifications</button>
          <button className="material-symbols-outlined p-2 hover:bg-white/10 rounded-lg transition-all">settings</button>
          <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden border border-white/20 flex items-center justify-center text-xs font-bold text-on-secondary-container">
            H
          </div>
        </div>
      </div>
    </header>
  );
}

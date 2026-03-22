'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sideItems = [
  { icon: 'cloud_upload', label: 'Upload', href: '/screen' },
  { icon: 'bar_chart', label: 'Results', href: '/candidates' },
  { icon: 'history', label: 'History', href: '/history' },
  { icon: 'work', label: 'Jobs', href: '/jobs' },
  { icon: 'feedback', label: 'Feedback', href: '/feedback' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-16 hover:w-56 bg-surface-container-low transition-all duration-300 group/nav z-40 overflow-hidden flex-col py-6 gap-1">
      {sideItems.map(item => {
        const isActive = pathname === item.href;
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
    </aside>
  );
}

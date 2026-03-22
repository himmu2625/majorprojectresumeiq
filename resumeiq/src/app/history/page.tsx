'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/shared/AppLayout';
import { getHistory } from '@/lib/api';
import { ScreeningSummary } from '@/lib/types';

export default function HistoryPage() {
  const [history, setHistory] = useState<ScreeningSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getHistory(50).then(h => { setHistory(h); setLoading(false); });
  }, []);

  const filtered = history.filter(h =>
    (h.candidate_name?.toLowerCase().includes(search.toLowerCase()) || '') ||
    (h.job_title?.toLowerCase().includes(search.toLowerCase()) || '') ||
    h.resume_filename.toLowerCase().includes(search.toLowerCase())
  );

  const getScoreColor = (s: number) => s >= 70 ? 'score-high score-bg-high' : s >= 45 ? 'score-medium score-bg-medium' : 'score-low score-bg-low';

  return (
    <AppLayout>
      <section className="bg-surface-container-lowest border-b border-outline-variant/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-end">
          <div>
            <nav className="flex items-center gap-2 text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-2">
              <span>Home</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary font-bold">History</span>
            </nav>
            <h1 className="font-headline font-bold text-[28px] text-primary tracking-tight">Screening History</h1>
          </div>
          <Link href="/screen" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-base">add</span>New Screening
          </Link>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in">
        {/* Search */}
        <div className="mb-8 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by candidate name, job title, or filename..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <span className="text-xs text-on-surface-variant">{filtered.length} results</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">history</span>
            <h3 className="font-headline font-bold text-xl text-primary mb-2">No screening history yet</h3>
            <p className="text-on-surface-variant mb-6">Start by screening your first resume.</p>
            <Link href="/screen" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-opacity">
              Screen a Resume <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(h => (
              <Link key={h.screening_id} href={`/results/${h.screening_id}`} className="block bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">
                      {h.candidate_name?.charAt(0) || 'R'}
                    </div>
                    <div>
                      <p className="font-medium text-primary group-hover:text-secondary transition-colors">{h.candidate_name || h.resume_filename}</p>
                      <p className="text-xs text-on-surface-variant">{h.job_title} • {h.resume_filename}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-3 py-1 rounded-full font-mono font-bold text-sm ${getScoreColor(h.overall_score)}`}>
                      {h.overall_score.toFixed(1)}%
                    </span>
                    <span className="text-xs text-on-surface-variant">{new Date(h.timestamp).toLocaleDateString()}</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

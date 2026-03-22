'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/shared/AppLayout';
import { getCandidates } from '@/lib/api';
import { ScreeningResult } from '@/lib/types';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(0);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    getCandidates().then(c => { setCandidates(c); setLoading(false); });
  }, []);

  const filtered = candidates
    .filter(c => c.overall_score >= threshold)
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'score') cmp = a.overall_score - b.overall_score;
      else if (sortBy === 'name') cmp = (a.candidate_name || '').localeCompare(b.candidate_name || '');
      else cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return sortDir === 'desc' ? -cmp : cmp;
    });

  const toggleSort = (field: 'score' | 'name' | 'date') => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const getScoreColor = (s: number) => s >= 70 ? 'score-high score-bg-high' : s >= 45 ? 'score-medium score-bg-medium' : 'score-low score-bg-low';

  const handleExport = () => {
    const header = 'Name,Title,Score,Confidence,Matched Skills,Missing Skills\n';
    const rows = filtered.map(c =>
      `"${c.candidate_name}","${c.candidate_title}",${c.overall_score},"${c.confidence}","${c.matched_skills.join('; ')}","${c.missing_skills.join('; ')}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'candidates_export.csv'; a.click();
  };

  return (
    <AppLayout>
      <section className="bg-surface-container-lowest border-b border-outline-variant/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-end">
          <div>
            <nav className="flex items-center gap-2 text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-2">
              <span>Home</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary font-bold">Candidates</span>
            </nav>
            <h1 className="font-headline font-bold text-[28px] text-primary tracking-tight">Candidate Pipeline</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-base">download</span>Export CSV
            </button>
            <Link href="/screen" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-base">add</span>New Screening
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in">
        {/* Filter Bar */}
        <div className="flex items-center gap-6 mb-8 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Min Score</span>
            <input
              type="range" min="0" max="100" value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="w-40 accent-primary"
            />
            <span className="font-mono text-sm font-bold text-primary w-10">{threshold}%</span>
          </div>
          <span className="text-xs text-on-surface-variant">{filtered.length} candidate{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low">
                  {[
                    { key: 'name' as const, label: 'Candidate' },
                    { key: 'score' as const, label: 'Match Score' },
                    { key: 'date' as const, label: 'Date' },
                  ].map(col => (
                    <th key={col.key} onClick={() => toggleSort(col.key)} className="text-left px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortBy === col.key && <span className="material-symbols-outlined text-sm">{sortDir === 'desc' ? 'arrow_downward' : 'arrow_upward'}</span>}
                      </div>
                    </th>
                  ))}
                  <th className="text-left px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Confidence</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Top Skills</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.screening_id} className="border-t border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">
                          {c.candidate_name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="font-medium text-primary">{c.candidate_name}</p>
                          <p className="text-xs text-on-surface-variant">{c.candidate_title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full font-mono font-bold text-sm ${getScoreColor(c.overall_score)}`}>
                        {c.overall_score.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(c.timestamp).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getScoreColor(c.overall_score)}`}>{c.confidence}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {c.matched_skills.slice(0, 3).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-tertiary-fixed/20 text-on-tertiary-fixed-variant rounded text-xs">{s}</span>
                        ))}
                        {c.matched_skills.length > 3 && <span className="text-xs text-on-surface-variant">+{c.matched_skills.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/results/${c.screening_id}`} className="text-secondary hover:text-primary transition-colors text-sm font-medium flex items-center gap-1">
                        View <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-4 block">search_off</span>
                <p>No candidates match the current filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/shared/AppLayout';
import { getScreeningResult } from '@/lib/api';
import { ScreeningResult } from '@/lib/types';
import { RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? '#16A34A' : score >= 45 ? '#B45309' : '#DC2626';
  const data = [{ value: score, fill: color }];
  return (
    <div className="relative w-48 h-48 mx-auto">
      <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={data} startAngle={180} endAngle={0} barSize={14}>
        <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#e8e5ff' }} />
      </RadialBarChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold" style={{ color }}>{score.toFixed(1)}</span>
        <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Match Score</span>
      </div>
    </div>
  );
}

function SectionScoresChart({ scores }: { scores: { skills: number; experience: number; education: number; summary: number } }) {
  const data = [
    { name: 'Skills', score: scores.skills },
    { name: 'Experience', score: scores.experience },
    { name: 'Education', score: scores.education },
    { name: 'Summary', score: scores.summary },
  ];
  const getColor = (score: number) => score >= 70 ? '#16A34A' : score >= 45 ? '#B45309' : '#DC2626';

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} width={90} />
        <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function ResultsPage() {
  const params = useParams();
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.screeningId as string;
    getScreeningResult(id).then(r => { setResult(r); setLoading(false); });
  }, [params.screeningId]);

  if (loading || !result) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  const confidenceColor = result.confidence === 'High' ? 'score-bg-high score-high' : result.confidence === 'Medium' ? 'score-bg-medium score-medium' : 'score-bg-low score-low';

  return (
    <AppLayout>
      {/* Page Title */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-end">
          <div>
            <nav className="flex items-center gap-2 text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-2">
              <span>Home</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span>Candidates</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary font-bold">Results</span>
            </nav>
            <h1 className="font-headline font-bold text-[28px] text-primary tracking-tight">Screening Results</h1>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${confidenceColor}`}>
            {result.confidence} Confidence
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-8 animate-fade-in">
        {/* Candidate Header */}
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-white font-headline text-2xl font-bold">
              {result.candidate_name?.charAt(0) || 'C'}
            </div>
            <div>
              <h2 className="font-headline text-2xl font-bold text-primary">{result.candidate_name || 'Candidate'}</h2>
              <p className="text-on-surface-variant">{result.candidate_title || 'Software Professional'}</p>
              <p className="text-xs text-on-surface-variant mt-1 font-mono">{result.resume_metadata.filename} • {result.resume_metadata.word_count} words</p>
            </div>
          </div>
          <ScoreGauge score={result.overall_score} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section Scores */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">bar_chart</span>
              Section-Level Analysis
            </h3>
            <SectionScoresChart scores={result.section_scores} />
          </div>

          {/* Confidence & Metadata */}
          <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-sm">
              <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Breakdown</h4>
              {Object.entries(result.section_scores).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-outline-variant/5 last:border-0">
                  <span className="text-sm capitalize font-medium">{key}</span>
                  <span className="font-mono text-sm font-bold">{val.toFixed(1)}%</span>
                </div>
              ))}
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-sm">
              <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Metadata</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Sections Found</span><span className="font-medium">{result.resume_metadata.sections_found.length}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Word Count</span><span className="font-medium">{result.resume_metadata.word_count}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Screened</span><span className="font-medium">{new Date(result.timestamp).toLocaleDateString()}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-on-tertiary-container">check_circle</span>
              Matched Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.matched_skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-tertiary-fixed/30 text-on-tertiary-fixed-variant rounded text-sm font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check</span>{skill}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-error">cancel</span>
              Missing Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missing_skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-error-container text-on-error-container rounded text-sm font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">close</span>{skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* XAI Explanation */}
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">psychology</span>
            AI Explanation (XAI)
          </h3>
          <div className="glass-insight p-6 rounded-xl mb-6">
            <p className="text-on-surface leading-relaxed">{result.xai.explanation_text}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-3">Top Positive Factors</h4>
              <ul className="space-y-2">
                {result.xai.positive_phrases.map((phrase, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="material-symbols-outlined text-on-tertiary-container text-base mt-0.5">add_circle</span>
                    <span>{phrase}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-3">Missing Keywords</h4>
              <ul className="space-y-2">
                {result.xai.missing_keywords.map((kw, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="material-symbols-outlined text-error text-base mt-0.5">remove_circle</span>
                    <span>{kw}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">tips_and_updates</span>
            Improvement Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.xai.improvement_suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-lg">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-mono font-bold text-sm shrink-0">{i + 1}</div>
                <p className="text-sm text-on-surface leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

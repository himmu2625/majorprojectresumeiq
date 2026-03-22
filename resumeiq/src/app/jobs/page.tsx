'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/shared/AppLayout';
import { getJobs } from '@/lib/api';
import { JobOpening } from '@/lib/types';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', department: '', description: '' });

  useEffect(() => {
    getJobs().then(j => { setJobs(j); setLoading(false); });
  }, []);

  const handleCreate = () => {
    const job: JobOpening = {
      job_id: `job-${Date.now()}`,
      ...newJob,
      created_at: new Date().toISOString(),
      is_active: true,
      screening_count: 0,
    };
    setJobs(prev => [job, ...prev]);
    setShowModal(false);
    setNewJob({ title: '', company: '', department: '', description: '' });
  };

  return (
    <AppLayout>
      <section className="bg-surface-container-lowest border-b border-outline-variant/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-end">
          <div>
            <nav className="flex items-center gap-2 text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-2">
              <span>Home</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary font-bold">Job Posts</span>
            </nav>
            <h1 className="font-headline font-bold text-[28px] text-primary tracking-tight">Job Openings</h1>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-base">add</span>Create Job Post
          </button>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div key={job.job_id} className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">work</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${job.is_active ? 'bg-tertiary-fixed/30 text-on-tertiary-fixed-variant' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    {job.is_active ? 'Active' : 'Archived'}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-lg text-primary mb-1">{job.title}</h3>
                <p className="text-sm text-on-surface-variant mb-1">{job.company} • {job.department}</p>
                <p className="text-xs text-on-surface-variant mb-4 line-clamp-3 flex-grow">{job.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
                  <span className="text-xs text-on-surface-variant font-mono">{job.screening_count} screenings</span>
                  <span className="text-xs text-on-surface-variant">{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <h2 className="font-headline font-bold text-2xl text-primary mb-6">Create Job Posting</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Job Title</label>
                <input value={newJob.title} onChange={e => setNewJob(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-3 bg-surface-container-low rounded-lg text-sm outline-none border-b-2 border-outline-variant/20 focus:border-secondary" placeholder="e.g. Senior Data Scientist" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Company</label>
                  <input value={newJob.company} onChange={e => setNewJob(p => ({ ...p, company: e.target.value }))} className="w-full px-4 py-3 bg-surface-container-low rounded-lg text-sm outline-none border-b-2 border-outline-variant/20 focus:border-secondary" placeholder="e.g. TechVista" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Department</label>
                  <input value={newJob.department} onChange={e => setNewJob(p => ({ ...p, department: e.target.value }))} className="w-full px-4 py-3 bg-surface-container-low rounded-lg text-sm outline-none border-b-2 border-outline-variant/20 focus:border-secondary" placeholder="e.g. Engineering" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Job Description</label>
                <textarea value={newJob.description} onChange={e => setNewJob(p => ({ ...p, description: e.target.value }))} className="w-full h-40 p-4 bg-surface-container-low rounded-lg text-sm outline-none border-b-2 border-outline-variant/20 focus:border-secondary resize-none leading-relaxed" placeholder="Paste the full job description..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={!newJob.title || !newJob.description} className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-40">Create Job Post</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

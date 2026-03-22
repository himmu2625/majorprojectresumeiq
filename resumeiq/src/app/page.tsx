import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-[#1B3F7A] sticky top-0 z-50">
        <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tight text-white font-headline">ResumeIQ</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-white border-b-2 border-white pb-1 font-medium" href="#how-it-works">How It Works</a>
            <a className="text-blue-100/80 hover:text-white transition-colors font-medium" href="#features">For Recruiters</a>
            <Link className="text-blue-100/80 hover:text-white transition-colors font-medium" href="/feedback">For Candidates</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/candidates" className="text-blue-100/80 hover:text-white transition-colors font-medium px-4 py-2">Sign In</Link>
            <Link href="/screen" className="bg-white text-[#1B3F7A] hover:opacity-90 transition-opacity px-6 py-2 rounded-lg font-bold">Start Free</Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-gradient pt-20 pb-24 px-8">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EBF2FF] text-[#2E7CF6] text-sm font-semibold mb-8 tracking-wide">
              Powered by Sentence-BERT &amp; Explainable AI
            </div>
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-[#1B3F7A] leading-tight max-w-4xl mb-6">
              Screen Resumes That Actually Match. Not Just Keywords.
            </h1>
            <p className="text-xl text-[#4A5568] max-w-2xl mb-10 leading-relaxed">
              ResumeIQ uses semantic AI to understand resume meaning, not just words. Every decision comes with a clear explanation.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <Link href="/screen" className="bg-[#2E7CF6] text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                Screen a Resume Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <a href="#how-it-works" className="bg-white text-[#1B3F7A] border-2 border-[#1B3F7A] px-8 py-4 rounded-lg font-bold text-lg hover:bg-surface-container-low transition-colors">
                See How It Works
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-[#4A5568] font-medium text-sm">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-base">check</span> No signup required</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-base">check</span> Results in 8 seconds</span>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#1B3F7A] py-12">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-5xl font-bold text-white tracking-tighter">85%+</span>
              <span className="text-blue-200/70 uppercase tracking-widest text-xs font-bold">Matching Accuracy</span>
            </div>
            <div className="flex flex-col gap-2 border-y md:border-y-0 md:border-x border-white/10 py-8 md:py-0">
              <span className="font-mono text-5xl font-bold text-white tracking-tighter">&lt; 8s</span>
              <span className="text-blue-200/70 uppercase tracking-widest text-xs font-bold">Analysis Time</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-5xl font-bold text-white tracking-tighter">0</span>
              <span className="text-blue-200/70 uppercase tracking-widest text-xs font-bold">Algorithmic Bias</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <span className="text-[#2E7CF6] text-xs font-bold tracking-[0.2em] uppercase block mb-4">Why ResumeIQ?</span>
              <h2 className="font-headline text-4xl text-primary font-extrabold">Next-Gen Talent Intelligence</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: 'bar_chart_4_bars', color: '#2E7CF6', bgClass: 'bg-secondary-container/30', title: 'Semantic Understanding', desc: 'Matches meaning, not just words. Machine Learning Engineer = ML Engineer. Our AI understands synonyms and career trajectories.' },
                { icon: 'lightbulb', color: '#1A7F5A', bgClass: 'bg-tertiary-fixed/30', title: 'Explainable AI', desc: 'See exactly WHY each candidate scored high or low. Every factor is visible, from skill proficiency to experience relevance.' },
                { icon: 'description', color: '#D4730A', bgClass: 'bg-error-container/40', title: 'Resume Feedback', desc: 'Tell candidates what to improve. Build better applications with AI guidance that humanizes the automated screening process.' },
              ].map((f, i) => (
                <div key={i} className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${f.bgClass} rounded-lg flex items-center justify-center mb-6`}>
                    <span className="material-symbols-outlined filled" style={{ color: f.color }}>{f.icon}</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-3 text-primary">{f.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-headline text-4xl text-primary font-extrabold mb-4">Three Steps to Better Hires</h2>
              <p className="text-on-surface-variant text-lg">Our streamlined workflow integrates directly into your existing process.</p>
            </div>
            <div className="relative flex flex-col md:flex-row justify-between items-center gap-12">
              {[
                { icon: 'upload_file', title: '1. Upload Context', desc: 'Paste Job Description + Upload Resume' },
                { icon: 'psychology', title: '2. AI Analysis', desc: 'AI Analyzes Semantic Match + Skills' },
                { icon: 'analytics', title: '3. Visual Insights', desc: 'Get Score + Full XAI Explanation' },
              ].map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center text-center z-10">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-surface-container">
                    <span className="material-symbols-outlined text-primary text-3xl">{step.icon}</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-primary">{step.title}</h4>
                  <p className="text-on-surface-variant max-w-xs">{step.desc}</p>
                </div>
              ))}
              {/* Arrows */}
              <div className="hidden md:block absolute left-[28%] top-[25%] text-outline-variant">
                <span className="material-symbols-outlined text-4xl">trending_flat</span>
              </div>
              <div className="hidden md:block absolute left-[62%] top-[25%] text-outline-variant">
                <span className="material-symbols-outlined text-4xl">trending_flat</span>
              </div>
            </div>
          </div>
        </section>

        {/* AI Insight Preview */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-headline text-4xl text-primary font-extrabold">Don&apos;t Just Reject. Understand.</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Our proprietary Explainable AI (XAI) engine dissects every bullet point. We don&apos;t just give you a &quot;78/100&quot; score; we show you the evidence behind the numbers.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-surface-container-low rounded-lg border-l-4 border-tertiary-fixed">
                  <span className="material-symbols-outlined text-on-tertiary-container mt-1">check_circle</span>
                  <div>
                    <span className="font-bold text-primary block">Skill Correlation Match</span>
                    <span className="text-sm text-on-surface-variant">Identified &quot;PyTorch&quot; experience as a 94% match for &quot;Deep Learning&quot; requirement.</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-surface-container-low rounded-lg border-l-4 border-secondary-container">
                  <span className="material-symbols-outlined text-secondary mt-1">info</span>
                  <div>
                    <span className="font-bold text-primary block">Contextual Relevance</span>
                    <span className="text-sm text-on-surface-variant">Calculated &quot;FinTech&quot; domain experience as high-value for this specific role.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative bg-surface-container-high rounded-2xl p-8 overflow-hidden">
              <div className="bg-white rounded-xl shadow-xl p-6 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-headline font-bold text-xl text-primary">Sarah Jenkins</h3>
                    <p className="text-sm text-on-surface-variant">Senior Data Scientist</p>
                  </div>
                  <div className="bg-[#1B3F7A] text-white font-mono px-3 py-1.5 rounded text-lg font-bold">92</div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Core Skills Match', value: 'HIGH', color: 'text-on-tertiary-container' },
                    { label: 'Seniority Fit', value: 'OPTIMAL', color: 'text-on-tertiary-container' },
                    { label: 'Domain Experience', value: 'MODERATE', color: 'text-secondary' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-surface-container rounded">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className={`font-mono text-sm font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="glass-insight mt-6 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-xs text-primary">psychology</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Reasoning</span>
                  </div>
                  <p className="text-xs text-primary/80 italic">&quot;Candidate shows strong leadership in large-scale ML deployment, compensating for limited finance-specific exposure.&quot;</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full translate-y-1/3 -translate-x-1/3"></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1B3F7A] border-t border-white/10 mt-auto">
        <div className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div>
            <div className="text-xl font-bold text-white mb-4 font-headline">ResumeIQ</div>
            <p className="text-blue-200/70 text-sm leading-relaxed">&copy; 2025 ResumeIQ. The Intelligent Layer for Recruitment.</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'API Docs'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Contact Support'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map((col, i) => (
            <div key={i}>
              <h5 className="text-white font-semibold mb-4">{col.title}</h5>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}><a className="text-blue-200/70 hover:text-white transition-colors text-sm" href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

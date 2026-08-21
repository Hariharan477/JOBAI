import React, { useState, useEffect } from 'react';
import { Compass, Moon, Sun, Bot, Zap, Radar, GitBranch, User } from 'lucide-react';

/**
 * Temporary self-contained shell so production builds succeed while
 * the full component tree is still being pushed to this repo.
 */
export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-[#0a0f1a] text-[#0f172a] dark:text-[#f1f5f9] font-sans antialiased transition-colors">
      <header className="sticky top-0 z-40 border-b border-[#e2e8f0] dark:border-[#1e293b] bg-white/95 dark:bg-[#0a0f1a]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight">
                JOB<span className="text-[#2563eb] dark:text-[#3b82f6]">AI</span>
              </span>
              <span className="ml-2 hidden sm:inline text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#eff6ff] dark:bg-[#1e293b] text-[#2563eb] dark:text-[#60a5fa] border border-[#bfdbfe] dark:border-[#334155]">
                Career Intelligence
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsDark((d) => !d)}
            className="p-2 rounded-xl border border-[#e2e8f0] dark:border-[#1e293b] text-[#64748b] hover:text-[#0f172a] dark:hover:text-[#f1f5f9] transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#d97706]" /> : <Moon className="w-4 h-4 text-[#2563eb]" />}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff6ff] dark:bg-[#1e293b] text-[#2563eb] dark:text-[#60a5fa] text-xs font-semibold mb-6 border border-[#bfdbfe] dark:border-[#334155]">
          <Zap className="w-3.5 h-3.5" />
          Deploying full source
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Turn your skills into your next opportunity
        </h1>
        <p className="text-[#64748b] dark:text-[#94a3b8] text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Explainable job–skill matching, gap analytics, career path guidance, and what-if simulation.
          Deterministic scoring where accuracy matters — AI only where explanation helps.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left mb-12">
          {[
            { icon: Radar, label: 'Opportunities' },
            { icon: User, label: 'Profile & evidence' },
            { icon: GitBranch, label: 'Career path' },
            { icon: Bot, label: 'AI Strategist' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="rounded-xl border border-[#e2e8f0] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-4 shadow-sm"
            >
              <Icon className="w-5 h-5 text-[#2563eb] mb-2" />
              <div className="text-sm font-semibold">{label}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#94a3b8]">
          Core shell is live. Full screens are being added to this repo — rebuild will pick them up automatically.
        </p>
      </main>
    </div>
  );
}

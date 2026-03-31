import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 bg-[#fcfcfc] dark:bg-[#0c0c11]">
        <header className="glass-panel sticky top-0 z-50 border-b border-slate-200 dark:border-[#2a2a3d]">
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="bg-slate-900 dark:bg-[#7c6af7] text-white font-bold text-sm px-2.5 py-1 rounded-md shadow-sm transition-colors duration-300">
                in
              </div>
              <Link to="/" className="font-semibold text-lg tracking-tight text-slate-900 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                AI Post Assistant
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                <span>v1.0.0</span>
                <span className="bg-slate-100 dark:bg-[#1c1c28] text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-[#2a2a3d]">Beta</span>
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={() => setDark(d => !d)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-[#2a2a3d] bg-white dark:bg-[#1c1c28] text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-[#3a3a52] transition-all shadow-sm"
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1400px] mx-auto min-h-[calc(100vh-140px)] py-8 px-4 md:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 dark:border-[#2a2a3d] bg-white/50 dark:bg-[#0c0c11]/50 backdrop-blur-sm py-8 mt-auto transition-colors duration-300">
          <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 tracking-tight">AI Post Assistant</h2>
            <div className="text-center md:text-right text-sm text-slate-500 dark:text-slate-400">
              <p>© {new Date().getFullYear()} Minimal Structure UI</p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
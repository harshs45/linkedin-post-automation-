import React from 'react';

const ContextForm = ({ context, setContext }) => {
  const handleChange = (e) => {
    setContext({ ...context, [e.target.name]: e.target.value });
  };

  const inputClass = "w-full text-sm text-zinc-900 dark:text-slate-100 bg-white dark:bg-[#1c1c28] border border-zinc-200 dark:border-[#2a2a3d] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#7c6af7]/30 focus:border-blue-500 dark:focus:border-[#7c6af7] placeholder:text-zinc-300 dark:placeholder:text-slate-600 transition-colors shadow-sm";

  return (
    <div className="space-y-5">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-zinc-700 dark:text-slate-200">User Context</h2>
        <p className="text-sm text-zinc-500 dark:text-slate-400 mt-1">Details used to tailor your generations.</p>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-500 dark:text-slate-400 uppercase tracking-wider">
            Experience Level
          </label>
          <div className="relative">
            <select 
              name="experience" 
              value={context.experience} 
              onChange={handleChange}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="Beginner">Beginner (0-2 yrs)</option>
              <option value="Mid-Level">Mid-Level (3-7 yrs)</option>
              <option value="Senior">Senior (8+ yrs)</option>
              <option value="Expert">Expert/Leader</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 dark:text-slate-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-500 dark:text-slate-400 uppercase tracking-wider">
            Key Achievements
          </label>
          <input 
            type="text" 
            name="achievements" 
            value={context.achievements} 
            onChange={handleChange}
            placeholder="e.g. scaled to 10k users, 2x revenue" 
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-500 dark:text-slate-400 uppercase tracking-wider">
            Post Goal
          </label>
          <input 
            type="text" 
            name="goal" 
            value={context.goal} 
            onChange={handleChange}
            placeholder="e.g. leads, networking, authority" 
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export default ContextForm;
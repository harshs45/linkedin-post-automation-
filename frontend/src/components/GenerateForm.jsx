import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const GenerateForm = ({ onGenerate, loading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-zinc-700 dark:text-slate-200">Topic Prompt</h2>
        <p className="text-sm text-zinc-500 dark:text-slate-400 mt-1">What do you want to talk about?</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-2">
          <textarea 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g. The hidden costs of ignoring code quality in early stage startups..." 
            className="w-full text-sm text-zinc-900 dark:text-slate-100 bg-white dark:bg-[#1c1c28] border border-zinc-200 dark:border-[#2a2a3d] rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#7c6af7]/30 focus:border-blue-500 dark:focus:border-[#7c6af7] min-h-[160px] resize-none placeholder:text-zinc-400 dark:placeholder:text-slate-600 leading-relaxed shadow-sm transition-colors"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || !topic.trim()}
          className="w-full bg-blue-600 dark:bg-[#7c6af7] text-white rounded-xl py-3.5 px-6 text-sm font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 dark:hover:bg-[#8f7fff] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Generate Post Variations
              <Sparkles className="w-4 h-4 ml-1 opacity-80" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default GenerateForm;
import React, { useState } from 'react';
import ContextForm from '../components/ContextForm';
import GenerateForm from '../components/GenerateForm';
import PostCard from '../components/PostCard';
import { generatePosts } from '../services/api';
import { FileText, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [context, setContext] = useState({
    experience: 'Mid-Level',
    achievements: '',
    goal: ''
  });
  
  const [topic, setTopic] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (submittedTopic) => {
    setLoading(true);
    setError('');
    setTopic(submittedTopic);
    try {
      const generatedPosts = await generatePosts(submittedTopic, context);
      setPosts(generatedPosts);
    } catch (err) {
      console.error(err);
      setError('Failed to generate posts. Ensure backend is running and API is accessible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-slate-100">Create New Post</h1>
        <p className="text-sm text-zinc-500 dark:text-slate-400 mt-2">Define parameters and generate tailored content for LinkedIn.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-[400px] shrink-0">
          <div className="bg-white dark:bg-[#13131c] border border-zinc-200 dark:border-[#2a2a3d] rounded-xl p-6 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col gap-8 hover:shadow-md dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-shadow duration-300">
            <ContextForm context={context} setContext={setContext} />
            <div className="border-t border-zinc-100 dark:border-[#2a2a3d]"></div>
            <GenerateForm onGenerate={handleGenerate} loading={loading} />
          </div>
          
          {error && (
            <div className="mt-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-red-800 dark:text-red-300 flex items-start gap-2">
                <span className="text-red-500 font-bold">Error:</span>
                {error}
              </p>
            </div>
          )}
        </aside>

        {/* Right Section */}
        <section className="flex-1 min-h-[500px]">
          {!posts.length && !loading && !error && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-zinc-300 dark:border-[#2a2a3d] bg-zinc-50 dark:bg-[#0f0f17] p-12 lg:p-16">
              <div className="w-16 h-16 bg-white dark:bg-[#1c1c28] rounded-2xl shadow-sm border border-zinc-200 dark:border-[#2a2a3d] flex items-center justify-center mb-6">
                <FileText size={28} className="text-zinc-400 dark:text-slate-500" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-slate-100 mb-2">No active outputs</h2>
              <p className="text-sm text-zinc-500 dark:text-slate-400 max-w-sm leading-relaxed">
                Configure your context and provide a topic on the left panel. We will generate highly-converting LinkedIn post variations for you.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center rounded-xl border border-zinc-200 dark:border-[#2a2a3d] bg-white dark:bg-[#13131c] shadow-sm p-12">
              <Loader2 className="w-10 h-10 text-blue-600 dark:text-[#7c6af7] animate-spin mb-6" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-slate-100 mb-2">Generating Variations</h2>
              <p className="text-sm text-zinc-500 dark:text-slate-400">Processing input parameters and analyzing optimal structures...</p>
            </div>
          )}

          {posts.length > 0 && !loading && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="flex justify-between items-end pb-4 border-b border-zinc-200 dark:border-[#2a2a3d]">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-slate-100">Generated Variations</h2>
                  <p className="text-sm text-zinc-500 dark:text-slate-400 mt-1">Review, edit, and schedule your content</p>
                </div>
                <span className="text-xs font-semibold bg-zinc-100 dark:bg-[#1c1c28] text-zinc-600 dark:text-slate-300 px-3 py-1 rounded-full border border-zinc-200 dark:border-[#2a2a3d]">
                  {posts.length} Options
                </span>
              </header>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
                {posts.map((post, idx) => (
                  <PostCard 
                    key={idx} 
                    post={post} 
                    index={idx}
                    onUpdate={(updated) => { 
                      const newPosts = [...posts];
                      newPosts[idx] = updated;
                      setPosts(newPosts);
                    }} 
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
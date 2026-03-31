import React, { useState } from 'react';
import { Edit2, RefreshCw, Calendar, Share, Save, Loader2, Copy } from 'lucide-react';
import { regenerateSection, schedulePost } from '../services/api';

const PostCard = ({ post, index, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.fullContent);
  const [loadingSection, setLoadingSection] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFullEditSave = () => {
    onUpdate({ ...post, fullContent: editedContent });
    setIsEditing(false);
  };

  const handleRegenerate = async (section) => {
    setLoadingSection(section);
    try {
      const newText = await regenerateSection(post, section);
      const updatedPost = { ...post, [section]: newText };
      const newFullContent = `${updatedPost.hook}\n\n${updatedPost.body}\n\n${updatedPost.cta}\n\n${updatedPost.hashtags}`;
      updatedPost.fullContent = newFullContent;
      onUpdate(updatedPost);
      setEditedContent(newFullContent);
    } catch (error) {
      alert(`Failed to regenerate ${section}`);
    } finally {
      setLoadingSection(null);
    }
  };

  const handleSchedule = async () => {
    if (!scheduledDate) return alert('Select a date');
    setIsScheduling(true);
    try {
      await schedulePost({ ...post, scheduledDate: new Date(scheduledDate).toISOString() });
      setScheduleSuccess(true);
      setTimeout(() => setScheduleSuccess(false), 3000);
    } catch (err) {
      alert('Failed to schedule post');
    } finally {
      setIsScheduling(false);
    }
  };

  const generateLinkedinShareUrl = (text) => {
    return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(post.fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreBadge = (label, score, type = 'number') => {
    let colorClass = 'bg-slate-100 dark:bg-[#1c1c28] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#2a2a3d]';
    
    if (type === 'number') {
      if (score >= 8) colorClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60';
      else if (score >= 5) colorClass = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60';
      else colorClass = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60';
    } else {
      if (score === 'high' || score === 'High') colorClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60';
      else if (score === 'medium' || score === 'Medium') colorClass = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60';
      else colorClass = 'bg-slate-50 dark:bg-[#1c1c28] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#2a2a3d]';
    }

    return (
      <div className="flex flex-col border-l border-slate-200 dark:border-[#2a2a3d] pl-3">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border inline-block w-max ${colorClass}`}>
          {score}{type === 'number' ? '/10' : ''}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#13131c] border text-sm border-slate-200 dark:border-[#2a2a3d] rounded-2xl shadow-subtle dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-elevated dark:hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-shadow duration-300 flex flex-col overflow-hidden group">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-[#2a2a3d] bg-slate-50/50 dark:bg-[#0f0f17]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 dark:bg-[#7c6af7] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
            {index + 1}
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 tracking-tight capitalize">
            {post.style} <span className="text-slate-400 dark:text-slate-500 font-normal">Variant</span>
          </h3>
        </div>
        
        {post.engagementScore && (
          <div className="flex gap-4">
            {scoreBadge('Hook', post.engagementScore.hook_strength)}
            {scoreBadge('Read', post.engagementScore.readability, 'text')}
            {scoreBadge('Engagement', post.engagementScore.engagement_potential)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 bg-white dark:bg-[#13131c] relative">
        {isEditing ? (
          <div className="flex flex-col h-full animate-in fade-in duration-200">
            <textarea 
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[300px] p-4 text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#0f0f17] border border-slate-200 dark:border-[#2a2a3d] rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-[#7c6af7] focus:bg-white dark:focus:bg-[#1c1c28] transition-colors resize-y shadow-inner leading-relaxed"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-3">
              <button 
                onClick={() => { setIsEditing(false); setEditedContent(post.fullContent); }} 
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1c1c28] border border-slate-200 dark:border-[#2a2a3d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#2a2a3d] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleFullEditSave} 
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 dark:bg-[#7c6af7] rounded-lg shadow-sm hover:bg-slate-800 dark:hover:bg-[#8f7fff] transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4"/> Save Edits
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setIsEditing(true)} 
                className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-[#1c1c28] shadow-sm border border-slate-100 dark:border-[#2a2a3d] rounded-md hover:border-slate-300 dark:hover:border-[#3a3a52] transition-all"
                title="Edit Post"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-[15px] leading-relaxed mb-6 font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap flex-1">
              {post.fullContent}
            </div>
          </div>
        )}
      </div>

      {/* Footer Tools */}
      {!isEditing && (
        <div className="p-4 border-t border-slate-100 dark:border-[#2a2a3d] bg-slate-50/50 dark:bg-[#0f0f17]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase hidden md:inline-block">Target Retry</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['hook', 'body', 'cta', 'hashtags'].map(section => (
                  <button 
                    key={section}
                    onClick={() => handleRegenerate(section)}
                    disabled={loadingSection !== null}
                    className="px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1c1c28] border border-slate-200 dark:border-[#2a2a3d] rounded hover:bg-slate-100 dark:hover:bg-[#2a2a3d] hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-50 transition-colors flex items-center gap-1.5 capitalize shadow-sm"
                    title={`Rewrite ${section}`}
                  >
                    {loadingSection === section ? <Loader2 className="w-3 h-3 animate-spin"/> : <RefreshCw className="w-3 h-3" />}
                    {section}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto">
              <div className="flex items-center bg-white dark:bg-[#1c1c28] border border-slate-200 dark:border-[#2a2a3d] rounded-lg p-1 shadow-sm focus-within:ring-1 focus-within:ring-slate-900 dark:focus-within:ring-[#7c6af7] focus-within:border-slate-900 dark:focus-within:border-[#7c6af7]">
                <input 
                  type="datetime-local" 
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="text-xs font-semibold bg-transparent text-slate-700 dark:text-slate-300 px-2 py-1 outline-none min-w-[130px]"
                />
                <button 
                  onClick={handleSchedule}
                  disabled={isScheduling}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#2a2a3d] rounded transition-colors"
                  title="Queue Post"
                >
                  {isScheduling ? <Loader2 className="w-4 h-4 animate-spin"/> : <Calendar className="w-4 h-4"/>}
                </button>
                {scheduleSuccess && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase pr-2">OK</span>}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-white dark:bg-[#1c1c28] border border-slate-200 dark:border-[#2a2a3d] text-slate-600 dark:text-slate-300 rounded-lg shadow-sm hover:border-slate-300 dark:hover:border-[#3a3a52] hover:text-slate-900 dark:hover:text-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-[#7c6af7]/30"
                  title="Copy to clipboard"
                >
                  {copied ? <span className="text-[11px] font-bold px-1 text-emerald-600 dark:text-emerald-400">Copied</span> : <Copy className="w-4 h-4" />}
                </button>
                <a 
                  href={generateLinkedinShareUrl(post.fullContent)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#0a66c2]/10 dark:bg-[#0a66c2]/20 text-[#0a66c2] dark:text-[#5b9bd5] text-sm font-bold border border-[#0a66c2]/20 dark:border-[#0a66c2]/30 rounded-lg hover:bg-[#0a66c2]/20 dark:hover:bg-[#0a66c2]/30 transition-colors flex items-center gap-2"
                >
                  <Share className="w-4 h-4" /> Share
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
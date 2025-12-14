import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquarePlus, RefreshCw, X, ArrowRight } from 'lucide-react';

interface Props {
  onImprove: () => void;
  onFeedback: (feedback: string) => void;
  className?: string;
  tooltip?: string;
}

export const AIMenu: React.FC<Props> = ({ onImprove, onFeedback, className, tooltip }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'MENU' | 'INPUT'>('MENU');
  const [feedback, setFeedback] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setMode('MENU');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };
  
  const handleMouseLeave = () => {
    // If user is typing, don't auto-close
    if (mode === 'INPUT') return;

    // Add a grace period to allow mouse to move from button to menu
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setMode('MENU');
    }, 300);
  };

  const handleToggle = (e: React.MouseEvent) => {
    // On mobile, this allows tap to open. 
    // On desktop, this allows click to anchor/close.
    if (isOpen) {
        setIsOpen(false);
    } else {
        setIsOpen(true);
    }
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
        onFeedback(feedback);
        setIsOpen(false);
        setMode('MENU');
        setFeedback('');
    }
  };

  return (
    <div 
        ref={containerRef}
        className={`relative inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
      <button 
        onClick={handleToggle}
        className={`p-1.5 text-blue-500 hover:text-blue-700 bg-white hover:bg-blue-50 rounded-full shadow-sm border border-blue-100 transition-all hover:scale-110 hover:border-blue-300 ${isOpen ? 'opacity-100 ring-2 ring-blue-100' : ''}`}
        title={tooltip || "AI Options"}
        type="button"
      >
        <Sparkles size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 max-w-[90vw] bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-2 animate-in fade-in slide-in-from-top-2">
            {mode === 'MENU' ? (
                <div className="flex flex-col gap-1">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                        <span>AI Assistant</span>
                        {/* Mobile close button since hover doesn't exist on phones */}
                        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 p-1">
                            <X size={14} />
                        </button>
                    </div>
                    <button 
                        onClick={() => { onImprove(); setIsOpen(false); }} 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors group w-full"
                    >
                        <div className="bg-blue-100 p-1.5 rounded-md text-blue-600 group-hover:bg-blue-200 transition-colors shrink-0">
                            <RefreshCw size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium">Improve text</span>
                            <span className="text-[10px] text-gray-400 font-normal">Rephrase for better impact</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => setMode('INPUT')} 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors group w-full"
                    >
                         <div className="bg-purple-100 p-1.5 rounded-md text-purple-600 group-hover:bg-purple-200 transition-colors shrink-0">
                            <MessageSquarePlus size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium">Custom instructions</span>
                            <span className="text-[10px] text-gray-400 font-normal">Tell Gemini what to change</span>
                        </div>
                    </button>
                </div>
            ) : (
                <form onSubmit={submitFeedback} className="p-2">
                    <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-gray-700">What should change?</span>
                         <button 
                            type="button" 
                            onClick={() => { setMode('MENU'); }} 
                            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
                        >
                            <X size={14}/>
                        </button>
                    </div>
                    <textarea
                        className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none mb-3 bg-gray-50 text-gray-800"
                        rows={3}
                        placeholder="e.g. Focus more on leadership..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                submitFeedback(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!feedback.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                        Generate with Gemini <ArrowRight size={12}/>
                    </button>
                </form>
            )}
        </div>
      )}
    </div>
  );
};
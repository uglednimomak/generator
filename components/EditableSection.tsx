import React, { useState, useEffect } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { AIMenu } from './AIMenu';

interface EditableSectionProps {
  content: string | string[];
  onSave: (newContent: string | string[]) => void;
  onAiImprove?: () => void;
  onAiFeedback?: (feedback: string) => void;
  className?: string;
  placeholder?: string;
  isList?: boolean;
}

// Helper to render text with **bold** support
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

export const EditableSection: React.FC<EditableSectionProps> = ({
  content,
  onSave,
  onAiImprove,
  onAiFeedback,
  className = "",
  placeholder = "Click to add content...",
  isList = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (Array.isArray(content)) {
      setValue(content.join('\n'));
    } else {
      setValue(content || '');
    }
  }, [content]);

  const handleSave = () => {
    if (isList) {
      // Filter out empty lines for lists
      const lines = value.split('\n').filter(line => line.trim() !== '');
      onSave(lines);
    } else {
      onSave(value);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (Array.isArray(content)) {
      setValue(content.join('\n'));
    } else {
      setValue(content || '');
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="w-full relative group">
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-3 border-2 border-blue-500 rounded-lg shadow-sm focus:outline-none bg-white text-gray-800 text-sm md:text-base leading-relaxed resize-y min-h-[100px]"
          rows={Array.isArray(content) ? Math.max(content.length + 2, 4) : 4}
        />
        <div className="flex gap-2 mt-2 justify-end">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <X size={14} /> Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Controls Container - Shows on hover or click on mobile */}
      <div className="absolute right-0 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 no-print z-10">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-gray-500 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-full shadow-sm border border-gray-200 transition-all hover:scale-110"
          title="Edit manually"
        >
          <Pencil size={14} />
        </button>
        {onAiImprove && onAiFeedback && (
          <AIMenu 
            onImprove={onAiImprove} 
            onFeedback={onAiFeedback}
          />
        )}
      </div>

      {/* Content Display */}
      <div className="cursor-text" onClick={() => { if(window.innerWidth < 768) setIsEditing(true) }}>
        {Array.isArray(content) && content.length > 0 ? (
          <ul className="list-disc list-outside ml-4 space-y-1 text-gray-600 text-sm">
            {content.map((item, i) => (
              <li key={i}>
                <FormattedText text={item} />
              </li>
            ))}
          </ul>
        ) : typeof content === 'string' && content ? (
           <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
             <FormattedText text={content} />
           </p>
        ) : (
           <p className="text-gray-400 italic text-sm py-2 hover:bg-gray-50 rounded px-2 border border-transparent hover:border-dashed hover:border-gray-300">
             {placeholder}
           </p>
        )}
      </div>
    </div>
  );
};
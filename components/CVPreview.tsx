import React, { useState } from 'react';
import { CVData, CVTheme, ThemeColor, ThemeFont, AvatarShape, Language } from '../types';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Printer, RefreshCw, Palette, Type, Layout, Languages } from 'lucide-react';
import { EditableSection } from './EditableSection';
import DonationModal from './DonationModal';

interface Props {
  data: CVData;
  onRegenerateSummary: (feedback?: string) => void;
  onRegenerateMonth: (monthIndex: number, feedback?: string) => void;
  onUpdateSummary: (newSummary: string) => void;
  onUpdateMonth: (monthIndex: number, newPoints: string[]) => void;
  onUpdateEducation: (newEducation: string[]) => void;
  onTranslate: (lang: Language) => void;
  isTranslating: boolean;
}

const THEME_COLORS: Record<ThemeColor, string> = {
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  violet: 'text-violet-600',
  rose: 'text-rose-600',
  amber: 'text-amber-600',
};

const BG_COLORS: Record<ThemeColor, string> = {
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-600',
  violet: 'bg-violet-600',
  rose: 'bg-rose-600',
  amber: 'bg-amber-600',
};

const BORDER_COLORS: Record<ThemeColor, string> = {
  blue: 'border-blue-600',
  emerald: 'border-emerald-600',
  violet: 'border-violet-600',
  rose: 'border-rose-600',
  amber: 'border-amber-600',
};

const FONTS: Record<ThemeFont, { header: string; body: string }> = {
  modern: { header: 'font-sans', body: 'font-sans' },
  classic: { header: 'font-serif', body: 'font-serif' },
  technical: { header: 'font-mono', body: 'font-sans' },
  minimal: { header: 'font-display', body: 'font-sans' },
};

const AVATAR_SHAPES: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-2xl',
  square: 'rounded-none',
  blob: 'rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]',
};

const CVPreview: React.FC<Props> = ({ 
  data, 
  onRegenerateSummary, 
  onRegenerateMonth, 
  onUpdateSummary,
  onUpdateMonth,
  onUpdateEducation,
  onTranslate,
  isTranslating
}) => {
  const [theme, setTheme] = useState<CVTheme>({
    color: 'blue',
    font: 'modern',
    shape: 'circle'
  });
  const [language, setLanguage] = useState<Language>('en');
  const [showDonation, setShowDonation] = useState(false);

  const handlePrintRequest = () => {
    setShowDonation(true);
  };

  const executePrint = () => {
    setShowDonation(false);
    // Slight delay to allow modal to close completely
    setTimeout(() => window.print(), 100);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    onTranslate(lang);
  };

  const textColorClass = THEME_COLORS[theme.color];
  const bgColorClass = BG_COLORS[theme.color];
  const borderColorClass = BORDER_COLORS[theme.color];
  const headerFont = FONTS[theme.font].header;
  const bodyFont = FONTS[theme.font].body;
  const avatarClass = AVATAR_SHAPES[theme.shape];

  return (
    <div className={`w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-6 print:p-0 print:max-w-none ${bodyFont}`}>
      
      {showDonation && <DonationModal onClose={() => setShowDonation(false)} onProceed={executePrint} />}

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-4 no-print">
         <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            Generated Portfolio
            </h2>
            <div className="flex gap-2">
            <button 
                onClick={handlePrintRequest}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <Printer size={16} />
                Print / PDF
            </button>
            <button 
                onClick={() => onRegenerateSummary()}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white ${bgColorClass} opacity-90 hover:opacity-100 rounded-lg transition-colors shadow-sm`}
            >
                <RefreshCw size={16} />
                Regenerate AI
            </button>
            </div>
         </div>

         {/* Settings Row */}
         <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
            {/* Colors */}
            <div className="flex items-center gap-3">
                <Palette size={16} className="text-gray-400" />
                <div className="flex gap-2">
                    {(Object.keys(THEME_COLORS) as ThemeColor[]).map(c => (
                        <button
                            key={c}
                            onClick={() => setTheme(prev => ({ ...prev, color: c }))}
                            className={`w-6 h-6 rounded-full ${BG_COLORS[c]} ${theme.color === c ? 'ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'} transition-all`}
                            title={c}
                        />
                    ))}
                </div>
            </div>

            {/* Fonts */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                <Type size={16} className="text-gray-400" />
                <select 
                    value={theme.font}
                    onChange={(e) => setTheme(prev => ({ ...prev, font: e.target.value as ThemeFont }))}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="technical">Technical</option>
                    <option value="minimal">Minimal</option>
                </select>
            </div>

            {/* Shape */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                <Layout size={16} className="text-gray-400" />
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setTheme(prev => ({ ...prev, shape: 'circle' }))} className={`p-1.5 rounded ${theme.shape === 'circle' ? 'bg-white shadow-sm' : 'text-gray-400'}`}><div className="w-3 h-3 bg-current rounded-full" /></button>
                    <button onClick={() => setTheme(prev => ({ ...prev, shape: 'rounded' }))} className={`p-1.5 rounded ${theme.shape === 'rounded' ? 'bg-white shadow-sm' : 'text-gray-400'}`}><div className="w-3 h-3 bg-current rounded-sm" /></button>
                    <button onClick={() => setTheme(prev => ({ ...prev, shape: 'square' }))} className={`p-1.5 rounded ${theme.shape === 'square' ? 'bg-white shadow-sm' : 'text-gray-400'}`}><div className="w-3 h-3 bg-current" /></button>
                </div>
            </div>

             {/* Language */}
             <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                <Languages size={16} className="text-gray-400" />
                <div className="flex gap-4 text-sm">
                    {['en', 'es', 'de'].map((lang) => (
                        <label key={lang} className="flex items-center gap-1 cursor-pointer">
                            <input 
                                type="radio" 
                                name="language" 
                                value={lang}
                                checked={language === lang}
                                onChange={() => handleLanguageChange(lang as Language)}
                                disabled={isTranslating}
                                className="text-blue-600 focus:ring-blue-500" 
                            />
                            <span className={`uppercase font-medium ${language === lang ? 'text-slate-900' : 'text-slate-500'}`}>{lang}</span>
                        </label>
                    ))}
                </div>
                {isTranslating && <RefreshCw size={14} className="animate-spin text-blue-500" />}
            </div>
         </div>
      </div>

      {/* CV Paper */}
      <div className={`bg-white shadow-xl rounded-sm w-full min-h-[1100px] overflow-hidden print:shadow-none print:w-full print:h-auto print:min-h-0 print:rounded-none print:overflow-visible transition-all duration-300 ${isTranslating ? 'opacity-50 blur-sm pointer-events-none' : ''}`}>
        <div className="flex flex-col md:flex-row h-full print:flex-row">
          
          {/* Sidebar / Left Column */}
          <div className="w-full md:w-1/3 bg-slate-850 text-white p-8 md:min-h-full print:bg-slate-850 print:text-white print:w-1/3 print:min-h-screen">
            <div className="flex flex-col items-center text-center mb-8">
              <img 
                src={data.profile.avatarUrl} 
                alt={data.profile.name} 
                className={`w-32 h-32 ${avatarClass} border-4 ${borderColorClass} shadow-lg mb-4 object-cover print:border-slate-600 transition-all duration-300`}
              />
              <h1 className={`text-2xl font-bold ${headerFont}`}>{data.profile.name}</h1>
              <p className="text-slate-400 mt-1">Senior Software Engineer</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3 text-sm">
                {data.profile.email && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Mail size={16} className="shrink-0" />
                    <span>{data.profile.email}</span>
                  </div>
                )}
                {data.profile.phone && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone size={16} className="shrink-0" />
                    <span>{data.profile.phone}</span>
                  </div>
                )}
                {data.profile.location && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin size={16} className="shrink-0" />
                    <span>{data.profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-slate-300">
                  <Github size={16} className="shrink-0" />
                  <span>github.com/{data.profile.username}</span>
                </div>
                {data.profile.linkedin && (
                   <div className="flex items-center gap-3 text-slate-300">
                    <Linkedin size={16} className="shrink-0" />
                    <span>{data.profile.linkedin.replace(/^https?:\/\//, '')}</span>
                  </div>
                )}
                 {data.profile.website && (
                   <div className="flex items-center gap-3 text-slate-300">
                    <Globe size={16} className="shrink-0" />
                    <span>{data.profile.website.replace(/^https?:\/\//, '')}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-700">
                <h3 className="uppercase tracking-wider text-xs font-bold text-slate-400 mb-4">Core Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-200 print:bg-slate-700 print:text-white print:border print:border-slate-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

               <div className="pt-6 border-t border-slate-700">
                <h3 className="uppercase tracking-wider text-xs font-bold text-slate-400 mb-4">Languages</h3>
                <ul className="text-sm space-y-2 text-slate-300">
                    <li>English (Native)</li>
                    {language === 'es' && <li>Spanish (Native)</li>}
                    {language === 'de' && <li>German (Native)</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content / Right Column */}
          <div className="w-full md:w-2/3 p-8 md:p-12 bg-white text-slate-900 print:w-2/3 print:p-8">
            
            {/* Summary */}
            <section className="mb-10 group relative print:mb-6">
              <div className="flex justify-between items-baseline border-b-2 border-slate-100 mb-4 pb-2">
                <h2 className={`text-xl font-bold ${textColorClass} uppercase tracking-wide ${headerFont}`}>
                    Executive Summary
                </h2>
              </div>
              <EditableSection 
                content={data.generatedSummary} 
                onSave={(newVal) => onUpdateSummary(newVal as string)}
                onAiImprove={() => onRegenerateSummary()} 
                onAiFeedback={(feedback) => onRegenerateSummary(feedback)}
                isList={false}
              />
            </section>

            {/* Experience / Timeline */}
            <section className="mb-10 print:mb-6">
              <h2 className={`text-xl font-bold ${textColorClass} border-b-2 border-slate-100 pb-2 mb-6 uppercase tracking-wide ${headerFont}`}>
                Development Activity & Experience
              </h2>
              
              <div className="space-y-8 border-l-2 border-gray-100 ml-2 pl-6 print:space-y-6">
                {data.timeline.map((month, index) => (
                  <div key={`${month.year}-${month.month}`} className="relative group print:break-inside-avoid">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white ${bgColorClass} shadow-sm print:bg-slate-600`}></div>
                    
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-gray-800 text-lg ${headerFont}`}>
                        {new Date(month.year, month.month).toLocaleString(language === 'es' ? 'es-ES' : language === 'de' ? 'de-DE' : 'default', { month: 'long', year: 'numeric' })}
                        </h3>
                    </div>
                    
                    {month.isGenerating ? (
                        <div className="animate-pulse space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-2 bg-gray-100 rounded w-full mt-2"></div>
                        </div>
                    ) : (
                        <EditableSection 
                            content={month.summary || []}
                            onSave={(newVal) => onUpdateMonth(index, newVal as string[])}
                            onAiImprove={() => onRegenerateMonth(index)}
                            onAiFeedback={(feedback) => onRegenerateMonth(index, feedback)}
                            isList={true}
                        />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Education & Certifications */}
            <section className="mb-10 print:mb-6 print:break-inside-avoid">
               <div className="flex justify-between items-baseline border-b-2 border-slate-100 mb-4 pb-2">
                    <h2 className={`text-xl font-bold ${textColorClass} uppercase tracking-wide ${headerFont}`}>
                        Education & Certifications
                    </h2>
               </div>
               <EditableSection 
                    content={data.education}
                    onSave={(newVal) => onUpdateEducation(newVal as string[])}
                    isList={true}
                    placeholder="Add your education (e.g., 'B.S. Computer Science, University Name')"
                />
            </section>

            {/* Key Projects */}
            <section className="print:break-inside-avoid">
              <h2 className={`text-xl font-bold ${textColorClass} border-b-2 border-slate-100 pb-2 mb-6 uppercase tracking-wide ${headerFont}`}>
                Notable Repositories
              </h2>
              <div className="grid gap-4">
                {data.repos.slice(0, 4).map((repo) => (
                  <div key={repo.name} className="p-4 bg-gray-50 rounded-lg border border-gray-100 print:border print:border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">{repo.name}</span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-slate-200 text-slate-700 rounded print:border print:border-gray-300">{repo.language}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{repo.description}</p>
                    <div className="text-xs text-gray-400">
                      ★ {repo.stars} stars • Updated {new Date(repo.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
      
      <div className="text-center text-gray-400 text-sm py-4 no-print">
        Generated by DevCV GenAI using GitHub Activity and Google Gemini
      </div>
    </div>
  );
};

export default CVPreview;
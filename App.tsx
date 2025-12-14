import React, { useState, useEffect } from 'react';
import { Github, Loader2, Wand2 } from 'lucide-react';
import { AppState, CVData, ExperienceMonth, UserProfile, Language } from './types';
import { connectGitHub } from './services/githubService';
import { generateProfessionalSummary, generateMonthExperience, extractSkills, translateCVData } from './services/geminiService';
import MissingInfoModal from './components/MissingInfoModal';
import CVPreview from './components/CVPreview';

// Helper to group commits by month
const groupCommitsByMonth = (commits: any[]): ExperienceMonth[] => {
  const grouped: Record<string, ExperienceMonth> = {};

  commits.forEach(commit => {
    const date = new Date(commit.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!grouped[key]) {
      grouped[key] = {
        year: date.getFullYear(),
        month: date.getMonth(),
        commits: [],
      };
    }
    grouped[key].commits.push(commit);
  });

  // Sort by date descending
  return Object.values(grouped).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loadingText, setLoadingText] = useState("Connecting to GitHub...");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleConnect = async () => {
    setAppState(AppState.CONNECTING);
    setLoadingText("Authenticating with GitHub...");
    
    try {
      const data = await connectGitHub();
      
      setAppState(AppState.FETCHING_DATA);
      setLoadingText("Scanning repositories and commits...");

      // Initial processing
      const timeline = groupCommitsByMonth(data.commits);
      const skills = await extractSkills(data.repos);
      
      const partialData: CVData = {
        profile: data.profile,
        repos: data.repos,
        timeline: timeline,
        generatedSummary: "Pending AI generation...",
        skills: skills,
        education: [] // Initialize empty education
      };

      setCvData(partialData);

      // Check for missing info
      if (!data.profile.email || !data.profile.phone || !data.profile.location) {
        setAppState(AppState.MISSING_INFO);
      } else {
        startAIGeneration(partialData);
      }

    } catch (error) {
      console.error(error);
      setAppState(AppState.LANDING);
      alert("Failed to connect to GitHub. Please try again.");
    }
  };

  const handleInfoUpdate = (updatedProfile: UserProfile) => {
    if (!cvData) return;
    const updatedData = { ...cvData, profile: updatedProfile };
    setCvData(updatedData);
    startAIGeneration(updatedData);
  };

  const startAIGeneration = async (data: CVData) => {
    setAppState(AppState.GENERATING_AI);
    setLoadingText("Gemini is analyzing your engineering profile...");

    // Generate Global Summary
    const summary = await generateProfessionalSummary(
      data.profile.name,
      data.repos,
      data.timeline.flatMap(t => t.commits).slice(0, 20)
    );

    // Generate Month Summaries in parallel
    const timelineWithSummaries = await Promise.all(
        data.timeline.map(async (month) => {
            const monthName = new Date(month.year, month.month).toLocaleString('default', { month: 'long' });
            const generatedPoints = await generateMonthExperience(monthName, month.year, month.commits);
            return { ...month, summary: generatedPoints, isGenerating: false };
        })
    );

    setCvData({
        ...data,
        generatedSummary: summary,
        timeline: timelineWithSummaries,
        education: ["B.Sc. Computer Science, Example University (2018-2022)"] // Add a default placeholder if empty
    });

    setAppState(AppState.READY);
  };
  
  // AI Handlers
  const handleRegenerateSummary = async (feedback?: string) => {
      if(!cvData) return;
      const newSummary = await generateProfessionalSummary(
          cvData.profile.name,
          cvData.repos,
          cvData.timeline.flatMap(t => t.commits).slice(0, 20),
          feedback
      );
      setCvData({ ...cvData, generatedSummary: newSummary });
  };

  const handleRegenerateMonth = async (index: number, feedback?: string) => {
      if(!cvData) return;
      
      const updatedTimeline = [...cvData.timeline];
      updatedTimeline[index] = { ...updatedTimeline[index], isGenerating: true };
      setCvData({ ...cvData, timeline: updatedTimeline });

      const month = updatedTimeline[index];
      const monthName = new Date(month.year, month.month).toLocaleString('default', { month: 'long' });
      const newPoints = await generateMonthExperience(monthName, month.year, month.commits, feedback);
      
      updatedTimeline[index] = { ...month, summary: newPoints, isGenerating: false };
      setCvData({ ...cvData, timeline: updatedTimeline });
  };

  const handleTranslate = async (lang: Language) => {
      if (!cvData || lang === 'en') return; // Assume English is default/original for now
      
      setIsTranslating(true);
      const translatedData = await translateCVData(cvData, lang);
      setCvData(translatedData);
      setIsTranslating(false);
  };

  // Manual Update Handlers
  const handleUpdateSummary = (newSummary: string) => {
    if (!cvData) return;
    setCvData({ ...cvData, generatedSummary: newSummary });
  };

  const handleUpdateMonth = (index: number, newPoints: string[]) => {
    if (!cvData) return;
    const updatedTimeline = [...cvData.timeline];
    updatedTimeline[index] = { ...updatedTimeline[index], summary: newPoints };
    setCvData({ ...cvData, timeline: updatedTimeline });
  };

  const handleUpdateEducation = (newEducation: string[]) => {
     if (!cvData) return;
     setCvData({ ...cvData, education: newEducation });
  };

  // ----------------------------------------------------------------------
  // Render Helpers
  // ----------------------------------------------------------------------

  if (appState === AppState.LANDING) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl space-y-8">
          <div className="space-y-4">
            <div className="inline-block p-3 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 mb-4">
                <Wand2 className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              DevCV <span className="text-blue-400">GenAI</span>
            </h1>
            <p className="text-xl text-slate-300 font-light leading-relaxed">
              Transform your GitHub commit history into a professional, data-driven resume instantly using Google Gemini.
            </p>
          </div>

          <button
            onClick={handleConnect}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <Github size={24} />
            Connect with GitHub
            <span className="absolute -top-2 -right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
            </span>
          </button>
          
          <p className="text-sm text-slate-500">
             Analyzing your repos, languages, and coding habits to build your story.
          </p>
        </div>
      </div>
    );
  }

  if (appState === AppState.CONNECTING || appState === AppState.FETCHING_DATA || appState === AppState.GENERATING_AI) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative">
             <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                 <Github className="text-slate-300" size={32} />
             </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{loadingText}</h2>
            <p className="text-slate-500 mt-2">
                {appState === AppState.GENERATING_AI 
                 ? "Using Gemini 2.5 Flash to summarize your hard work..." 
                 : "This might take a few seconds."}
            </p>
          </div>
          
          {appState === AppState.GENERATING_AI && (
             <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-blue-600 animate-progress"></div>
             </div>
          )}
        </div>
      </div>
    );
  }

  if (appState === AppState.MISSING_INFO && cvData) {
    return (
      <MissingInfoModal 
        profile={cvData.profile} 
        onSave={handleInfoUpdate} 
      />
    );
  }

  if (appState === AppState.READY && cvData) {
    return (
      <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:p-0">
        <CVPreview 
            data={cvData} 
            onRegenerateSummary={handleRegenerateSummary}
            onRegenerateMonth={handleRegenerateMonth}
            onUpdateSummary={handleUpdateSummary}
            onUpdateMonth={handleUpdateMonth}
            onUpdateEducation={handleUpdateEducation}
            onTranslate={handleTranslate}
            isTranslating={isTranslating}
        />
      </div>
    );
  }

  return <div>Unknown State</div>;
};

export default App;
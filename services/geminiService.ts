import { GoogleGenAI, Type } from "@google/genai";
import { Commit, Repository, CVData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model constants
const MODEL_FAST = "gemini-2.5-flash";

export const generateProfessionalSummary = async (
  name: string,
  repos: Repository[],
  recentCommits: Commit[],
  feedback?: string
): Promise<string> => {
  try {
    const repoList = repos.map(r => `${r.name} (${r.language}): ${r.description}`).join("\n");
    const commitSample = recentCommits.slice(0, 15).map(c => c.message).join("\n");

    let prompt = `
      Write a professional Executive Summary (max 80 words) for a developer CV.
      Developer Name: ${name}
      
      Key Projects:
      ${repoList}
      
      Recent Activity Sample:
      ${commitSample}
      
      Focus on their technical strengths, primary languages, and type of problems they solve. 
      Write in the third person. Keep it impactful and concise.
    `;

    if (feedback) {
      prompt += `\n\nCRITICAL INSTRUCTION: The user wants to change the existing summary. Feedback/Requirement: "${feedback}". Rewrite the summary strictly adhering to this feedback.`;
    }

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Experienced developer with a strong background in software engineering.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Experienced developer passionate about building high-quality software solutions.";
  }
};

export const generateMonthExperience = async (
  monthName: string,
  year: number,
  commits: Commit[],
  feedback?: string
): Promise<string[]> => {
  try {
    const commitMessages = commits.map(c => `- ${c.message} (Repo: ${c.repo})`).join("\n");

    let prompt = `
      You are a professional CV writer.
      Turn the following raw Git commit messages into 2-3 professional "achievement" bullet points for a CV.
      Time Period: ${monthName} ${year}
      
      Raw Commits:
      ${commitMessages}
      
      Rules:
      1. Use active verbs (Developed, Optimized, Refactored, Implemented).
      2. Group related small commits into one significant achievement.
      3. Mention the specific technologies or repositories if relevant.
      4. Return ONLY a JSON array of strings. No markdown formatting outside the JSON.
      5. CRITICAL: Identify the most significant impact (e.g., performance boost, specific feature, complex refactor) in each point and wrap that specific phrase in double asterisks like **this** to bold it.
    `;

    if (feedback) {
      prompt += `\n\nCRITICAL INSTRUCTION: The user is asking for a revision. Feedback: "${feedback}". Regenerate the bullet points to satisfy this request.`;
    }

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });
    
    // Parse JSON
    const text = response.text;
    if (!text) return ["Contributed to various projects with consistent code updates."];
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Experience Error:", error);
    return [
      `Active contributor in ${monthName} ${year} with ${commits.length} commits.`,
      "Maintained and improved codebase quality across multiple repositories."
    ];
  }
};

export const extractSkills = async (repos: Repository[]): Promise<string[]> => {
    // Simple mock or AI extraction. Let's use AI for a better list.
    try {
        const repoDescriptions = repos.map(r => `${r.name}: ${r.description} [${r.language}]`).join("\n");
        const prompt = `
            Extract a list of technical skills (Languages, Frameworks, Concepts) from these project descriptions.
            Return a JSON array of strings (max 10 items).
            
            Projects:
            ${repoDescriptions}
        `;
        
         const response = await ai.models.generateContent({
            model: MODEL_FAST,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        
        const text = response.text;
        if(!text) return ["Git", "Software Development"];
        return JSON.parse(text);

    } catch (e) {
        // Fallback to repo languages if AI fails
        const languages = new Set(repos.map(r => r.language));
        return Array.from(languages);
    }
}

export const translateCVData = async (data: CVData, targetLang: string): Promise<CVData> => {
  try {
    // We only assume standard ISO codes 'es', 'de', 'en'.
    const langMap: Record<string, string> = {
      'es': 'Spanish',
      'de': 'German',
      'en': 'English'
    };
    const languageName = langMap[targetLang] || 'English';

    // Prepare content for translation
    const contentToTranslate = {
      summary: data.generatedSummary,
      timeline: data.timeline.map((t, index) => ({ id: index, summary: t.summary })),
      education: data.education,
      skills: data.skills,
      bio: data.profile.bio
    };

    const prompt = `
      You are a professional translator. Translate the following CV content into ${languageName}.
      Maintain professional tone. Keep any Markdown formatting (like **bold**).
      
      Content to translate (JSON):
      ${JSON.stringify(contentToTranslate)}

      Return the result in the exact same JSON structure.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No translation response");

    const translated = JSON.parse(text);

    // Merge back
    const newTimeline = data.timeline.map((t, index) => {
      const transT = translated.timeline.find((item: any) => item.id === index);
      return {
        ...t,
        summary: transT ? transT.summary : t.summary
      };
    });

    return {
      ...data,
      generatedSummary: translated.summary,
      skills: translated.skills,
      education: translated.education,
      profile: {
        ...data.profile,
        bio: translated.bio
      },
      timeline: newTimeline
    };

  } catch (error) {
    console.error("Translation Error:", error);
    return data; // Return original on error
  }
};
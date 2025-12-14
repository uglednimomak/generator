import { UserProfile, Repository, Commit } from '../types';

// In a real app, this would call the GitHub API with an OAuth token.
// Here we simulate a rich history to demonstrate the capabilities.

const MOCK_USER: UserProfile = {
  username: "alexdev",
  name: "Alex Developer",
  avatarUrl: "https://picsum.photos/200/200",
  bio: "Full Stack Engineer passionate about React, Node.js and AI.",
  location: "San Francisco, CA",
  // Intentionally missing email and phone to trigger the modal flow
  website: "https://alexdev.io",
};

const MOCK_REPOS: Repository[] = [
  { name: "react-dashboard-pro", description: "A high-performance dashboard using React 18 and D3", language: "TypeScript", stars: 120, updatedAt: "2023-10-01" },
  { name: "gemini-chat-bot", description: "Slack bot integration with Google Gemini API", language: "Node.js", stars: 45, updatedAt: "2023-09-15" },
  { name: "fast-logger", description: "Zero-dependency logger for high-throughput services", language: "Rust", stars: 300, updatedAt: "2023-08-20" },
  { name: "dev-portfolio-gen", description: "Auto-generate portfolios from Git history", language: "TypeScript", stars: 89, updatedAt: "2023-11-05" },
];

const ACTIONS = ["feat", "fix", "refactor", "docs", "chore", "perf"];
const TOPICS = ["auth flow", "database schema", "UI components", "API integration", "unit tests", "CI/CD pipeline", "memory leak", "responsive layout"];

// Helper to generate fake commits
const generateCommits = (count: number, startDate: Date): Commit[] => {
  const commits: Commit[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - Math.floor(Math.random() * 5)); // Random days back
    startDate = new Date(date); // Move pointer back

    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const repo = MOCK_REPOS[Math.floor(Math.random() * MOCK_REPOS.length)].name;

    commits.push({
      hash: Math.random().toString(36).substring(7),
      message: `${action}: update ${topic} implementation`,
      date: date.toISOString(),
      repo
    });
  }
  return commits;
};

export const connectGitHub = async (): Promise<{ profile: UserProfile; repos: Repository[]; commits: Commit[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        profile: MOCK_USER,
        repos: MOCK_REPOS,
        commits: generateCommits(60, new Date()) // Last ~3-4 months of activity
      });
    }, 1500); // Simulate network delay
  });
};

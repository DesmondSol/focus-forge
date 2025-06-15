
export interface DailyTask {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
  isDone: boolean;
}

export interface MoodEnergyLog {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1-5
  energy: number; // 1-5
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  content: string;
  date: string; // YYYY-MM-DD
}

export interface WeeklyMission {
  id: string;
  text: string;
  deadline: string; // ISO string
}

export enum PomodoroMode {
  Work = 'Work',
  ShortBreak = 'ShortBreak',
  LongBreak = 'LongBreak',
}

export interface TimeLog {
  id: string;
  startTime: number;
  endTime: number;
  activity: string; // e.g., 'Focused Work on Project X', 'Break', 'Distraction: Social Media'
  type: 'focus' | 'break' | 'distraction';
  date: string; // YYYY-MM-DD
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  consequence?: string; // Optional consequence for not doing it
  targetDays?: number[]; // 0 (Sun) - 6 (Sat)
}

export interface ScheduledGoal { // For Calendar and Plans
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  isGoal: boolean; // true if it's a key goal, false if a task
  completed: boolean;
}

export interface WeeklyPlan {
  id: string;
  weekStartDate: string; // YYYY-MM-DD, typically a Monday
  mainGoal: string;
  majorTasks: { id: string; text: string; completed: boolean }[];
}

export interface WeeklyReviewData {
  id: string;
  weekStartDate: string; // YYYY-MM-DD
  wins: string;
  losses: string;
  distractionSummary: string; // AI summary or manual
  disciplineRating: number; // 1-5
  aiSummary?: string; // New field for AI-generated weekly review
}

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'am'; // Added Language type

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  // Optional fields for Template Creator mode
  expectsConfirmation?: 'generate_template' | 'apply_template'; 
  templateData?: FocusForgeTemplateData; // To hold generated template data before applying
}

// --- Import/Export Template Structure ---
export interface FocusForgeTemplateData {
  weeklyPlans: WeeklyPlan[];
  habits: Habit[];
  scheduledGoals: ScheduledGoal[];
  weeklyMission: WeeklyMission | null;
}

export interface FocusForgeTemplate {
  templateVersion: string;
  appName: string; // Could be a key if appName itself is translated, e.g. 'appNameKey'
  exportedDate: string; // ISO string
  data: FocusForgeTemplateData;
}

export enum AiFeatureMode {
  Coach = 'Coach',
  TemplateCreator = 'TemplateCreator',
}

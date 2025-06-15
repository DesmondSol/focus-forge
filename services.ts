
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DEFAULT_MOTIVATIONAL_QUOTE_KEY, GEMINI_API_KEY_ERROR_MESSAGE, GEMINI_GENERAL_ERROR_MESSAGE } from './constants';
import { ChatMessage, TimeLog, JournalEntry, Habit, ScheduledGoal, WeeklyPlan, FocusForgeTemplateData } from './types';
import { format, addDays } from 'date-fns';
import parseISO from 'date-fns/parseISO'; // Corrected import
import { translations } from './translations';

// --- Storage Service ---

export function loadData<T,>(key: string, defaultValue: T): T {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultValue;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.warn(`Error loading data for key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

export function saveData<T,>(key: string, value: T): void {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.warn(`Error saving data for key "${key}" to localStorage:`, error);
  }
}

// --- Gemini Service ---

let ai: GoogleGenAI | null = null;
let initializing = false; // Prevent race conditions during initialization

const getAiClient = (): GoogleGenAI | null => {
  if (ai) return ai;
  if (initializing) { // If already initializing, wait for it to complete or handle as needed
      console.warn("AI client is already initializing.");
      return null; // Or throw an error, or return a promise
  }
  initializing = true;
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error(GEMINI_API_KEY_ERROR_MESSAGE);
    initializing = false;
    return null;
  }
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
    ai = null;
  } finally {
    initializing = false;
  }
  return ai;
};

export async function fetchDailyQuote(): Promise<string> {
  const client = getAiClient();
  const defaultQuoteString = translations.en[DEFAULT_MOTIVATIONAL_QUOTE_KEY] || "The secret of getting ahead is getting started."; // Fallback if key itself is missing

  if (!client) {
    return defaultQuoteString;
  }

  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: 'Provide a short, powerful, and motivational quote or mantra suitable for a productivity app. Examples: "Discipline equals freedom.", "Do the hard thing first.", "Execute with precision." Keep it to one concise sentence. Avoid quotation marks in the response itself.',
    });
    return response.text.trim() || defaultQuoteString;
  } catch (error) {
    console.error("Error fetching daily quote from Gemini:", error);
    return defaultQuoteString;
  }
}

export async function summarizeText(textToSummarize: string, context?: string): Promise<string> {
  const client = getAiClient();
  if (!client) {
    return "AI summarization unavailable: API Key not configured.";
  }
  if (!textToSummarize.trim()) {
    return "No text provided for summarization.";
  }

  try {
    const prompt = `Summarize the following text ${context ? `in the context of ${context}` : ''}. Keep it concise and actionable:\n\n${textToSummarize}`;
    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
    });
    return response.text.trim() || "Could not generate summary.";
  } catch (error) {
    console.error("Error summarizing text with Gemini:", error);
    return GEMINI_GENERAL_ERROR_MESSAGE;
  }
}

export async function generateContentWithSystemInstruction(prompt: string, systemInstruction: string): Promise<string> {
    const client = getAiClient();
    if (!client) {
        return "AI features unavailable: API Key not configured.";
    }
    try {
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: { systemInstruction },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating content with system instruction:", error);
        return GEMINI_GENERAL_ERROR_MESSAGE;
    }
}

export async function getAiChatResponse(messages: ChatMessage[], systemInstruction: string): Promise<string> {
  const client = getAiClient();
  if (!client) {
    return "AI Coach unavailable: API Key not configured.";
  }
  
  const history = messages.map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');
  const currentPrompt = messages.length > 0 ? messages[messages.length -1].text : "Hello!";


  try {
    const response = await client.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: `Chat History:\n${history}\n\nUser's latest message (respond to this): ${currentPrompt}`,
        config: { systemInstruction },
    });
    return response.text.trim() || "I'm having a bit of trouble responding right now. Please try again.";
  } catch (error) {
    console.error("Error getting AI chat response:", error);
    return GEMINI_GENERAL_ERROR_MESSAGE;
  }
}


export async function generateTemplateDataFromConversation(
  messages: ChatMessage[],
  jsonGenerationSystemInstruction: string
): Promise<FocusForgeTemplateData | null> {
  const client = getAiClient();
  if (!client) {
    console.error("AI Template Creator unavailable: API Key not configured.");
    return null;
  }

  const conversationHistory = messages.map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');
  const prompt = `Conversation History:\n${conversationHistory}\n\nUser: Based on our conversation, please generate the FocusForgeTemplateData JSON.`;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        systemInstruction: jsonGenerationSystemInstruction,
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as FocusForgeTemplateData;
    // Basic validation (can be expanded)
    if (parsedData && parsedData.habits && parsedData.weeklyPlans && parsedData.scheduledGoals) {
        // Ensure IDs are strings and unique (basic check, could be more robust)
        const ensureStringId = (item: any, prefix: string, index: number) => {
            if (typeof item.id !== 'string' || !item.id) {
                item.id = `${prefix}_${Date.now()}_${index}`;
            }
            return item;
        };
        parsedData.habits = parsedData.habits.map((h, i) => ensureStringId(h, 'habit', i));
        parsedData.weeklyPlans = parsedData.weeklyPlans.map((p, i) => {
            p = ensureStringId(p, 'plan', i);
            p.majorTasks = p.majorTasks.map((mt, j) => ensureStringId(mt, `task_${p.id}`, j));
            return p;
        });
        parsedData.scheduledGoals = parsedData.scheduledGoals.map((g, i) => ensureStringId(g, 'goal', i));
        if(parsedData.weeklyMission && (typeof parsedData.weeklyMission.id !== 'string' || !parsedData.weeklyMission.id)) {
            parsedData.weeklyMission.id = `mission_${Date.now()}`;
        }
      return parsedData;
    }
    console.error("Generated JSON does not match expected FocusForgeTemplateData structure.", parsedData);
    return null;
  } catch (error) {
    console.error("Error generating or parsing template JSON from AI:", error);
    return null;
  }
}


const formatDurationForAI = (start: number, end: number): string => {
  const durationMs = end - start;
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${totalSeconds}s`;
};


export async function generateWeeklyAiReport(
  weekStartDateStr: string, 
  allTimeLogs: TimeLog[], 
  allJournalEntries: JournalEntry[], 
  allHabits: Habit[], 
  allGoals: ScheduledGoal[], 
  allPlans: WeeklyPlan[]
): Promise<string> {
  const client = getAiClient();
  if (!client) {
    return "AI Review generation unavailable: API Key not configured.";
  }

  const weekStart = parseISO(weekStartDateStr);
  const weekEnd = addDays(weekStart, 6);

  const relevantTimeLogs = allTimeLogs.filter(log => {
    const logDate = parseISO(log.date);
    return logDate >= weekStart && logDate <= weekEnd;
  });
  const relevantJournalEntries = allJournalEntries.filter(entry => {
    const entryDate = parseISO(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });
  const relevantHabits = allHabits; // Habits are ongoing, consider all for weekly reflection
  const relevantGoals = allGoals.filter(goal => {
    const goalDate = parseISO(goal.date);
    return goalDate >= weekStart && goalDate <= weekEnd;
  });
  const relevantPlan = allPlans.find(plan => plan.weekStartDate === weekStartDateStr);

  let prompt = `Analyze the following user data for the week starting ${format(weekStart, 'MMM d, yyyy')} and provide a productivity review.

Data:
`;

  if (relevantTimeLogs.length > 0) {
    prompt += "\nTime Logs (Focus on patterns, total focus time, common distractions):\n";
    relevantTimeLogs.forEach(log => {
      prompt += `- ${log.activity} (${log.type}), Duration: ${formatDurationForAI(log.startTime, log.endTime)}, Date: ${log.date}\n`;
    });
  } else {
    prompt += "\nNo specific time logs for this week.\n";
  }

  if (relevantJournalEntries.length > 0) {
    prompt += "\nJournal Entries (Identify key themes, sentiments, or recurring thoughts):\n";
    relevantJournalEntries.forEach(entry => {
      prompt += `- Date: ${entry.date}, Entry: "${entry.content.substring(0, 150)}..."\n`;
    });
  } else {
    prompt += "\nNo journal entries for this week.\n";
  }
  
  if (relevantHabits.length > 0) {
    prompt += "\nHabits (Review consistency, streaks, and impact):\n";
    relevantHabits.forEach(habit => {
      const completionsThisWeek = relevantTimeLogs.filter(tl => tl.activity.includes(habit.name) && tl.type === 'focus').length; // Approximation
      prompt += `- ${habit.name}: Current Streak: ${habit.streak}. Last completed: ${habit.lastCompletedDate || 'N/A'}. Target Days: ${habit.targetDays?.join(', ') || 'Any'}. Completions this week (approx): ${completionsThisWeek}.\n`;
    });
  } else {
    prompt += "\nNo habits tracked.\n";
  }

  if (relevantGoals.length > 0) {
    prompt += "\nScheduled Goals & Tasks (Assess completion and progress):\n";
    relevantGoals.forEach(goal => {
      prompt += `- ${goal.title} (Due: ${goal.date}): ${goal.completed ? 'Completed' : 'Pending/Incomplete'}. ${goal.isGoal ? '(Key Goal)' : ''}\n`;
    });
  } else {
    prompt += "\nNo specific goals scheduled for this week in the calendar.\n";
  }

  if (relevantPlan) {
    prompt += `\nWeekly Plan (Main Goal: ${relevantPlan.mainGoal}):\n`;
    relevantPlan.majorTasks.forEach(task => {
      prompt += `- Task: ${task.text} - ${task.completed ? 'Completed' : 'Pending/Incomplete'}\n`;
    });
  } else {
    prompt += "\nNo formal weekly plan set for this week.\n";
  }

  prompt += `
Instructions for AI:
Based on ALL the data provided above, generate a productivity review with the following sections:
1.  **Overall Summary & Key Themes:** Briefly summarize the week's productivity and highlight any overarching themes (e.g., high focus, many distractions, progress on goals).
2.  **Wins & Successes:** Identify specific achievements, completed tasks, positive habit streaks, or effective strategies.
3.  **Challenges & Obstacles:** Pinpoint areas where the user struggled, common distractions, incomplete goals, or broken habit streaks.
4.  **Distraction Analysis (if applicable):** If distraction logs exist, analyze them for patterns (time of day, type of distraction).
5.  **Actionable Recommendations for Next Week:** Provide 3-5 concrete, actionable suggestions for the user to improve focus, discipline, and productivity in the upcoming week. These should be tailored to the data.

Format the response clearly. Be encouraging and constructive.
`;

  const systemInstruction = "You are FocusForge AI, an expert productivity coach. Your task is to provide a detailed, data-driven weekly review based on the user's logged activities. Be insightful and supportive.";

  try {
    const response = await client.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: { systemInstruction },
    });
    return response.text.trim() || "Could not generate AI review for this week.";
  } catch (error) {
    console.error("Error generating weekly AI report:", error);
    return `${GEMINI_GENERAL_ERROR_MESSAGE} (Weekly Report Generation)`;
  }
}

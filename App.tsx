
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useTheme, useLocalStorage, usePomodoro } from './hooks'; // Added usePomodoro
import { Sidebar, MobileHeader, FloatingActionButtons, HelpModal, AiChatModal, AiFeatureSelectionModal } from './uiElements';
import { DashboardPage, CalendarPage, NotebookPage, TimeTrackerPage, ReviewPage, PlansPage, DisciplineBoardPage, ImportExportPage, OnboardingPage } from './Pages';
import { STORAGE_KEYS, APP_NAME_TRANSLATION_KEY } from './constants';
import { ChatMessage, Language, AiFeatureMode, FocusForgeTemplateData, Habit, WeeklyMission, WeeklyPlan, ScheduledGoal, TimeLog, PomodoroMode } from './types'; // Added TimeLog, PomodoroMode
import { getAiChatResponse, generateTemplateDataFromConversation, loadData, saveData } from './services';
import { LanguageProvider, useLanguageContext } from './contexts';
import { format, addDays } from 'date-fns';
import startOfWeek from 'date-fns/startOfWeek';
import { Analytics } from "@vercel/analytics/next"

const getTodayDateString = () => format(new Date(), 'yyyy-MM-dd');

const MainApp: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language, t, setLanguage } = useLanguageContext();
  const navigate = useNavigate();

  // Modals State
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAiChatModalOpen, setIsAiChatModalOpen] = useState(false);
  const [isAiFeatureSelectionModalOpen, setIsAiFeatureSelectionModalOpen] = useState(false);

  const [currentAiMode, setCurrentAiMode] = useState<AiFeatureMode>(AiFeatureMode.Coach);

  const [coachChatMessages, setCoachChatMessages] = useLocalStorage<ChatMessage[]>(STORAGE_KEYS.AI_CHAT_MESSAGES_COACH, []);
  const [templateCreatorChatMessages, setTemplateCreatorChatMessages] = useLocalStorage<ChatMessage[]>(STORAGE_KEYS.AI_CHAT_MESSAGES_TEMPLATE_CREATOR, []);

  const [isAiResponding, setIsAiResponding] = useState(false);
  const [currentTemplateDataToApply, setCurrentTemplateDataToApply] = useState<FocusForgeTemplateData | null>(null);


  const chatMessages = currentAiMode === AiFeatureMode.Coach ? coachChatMessages : templateCreatorChatMessages;
  const setChatMessages = currentAiMode === AiFeatureMode.Coach ? setCoachChatMessages : setTemplateCreatorChatMessages;

  // Pomodoro State Lifted
  const [breakInvitationMessage, setBreakInvitationMessage] = useState<string | null>(null);
  const pomodoro = usePomodoro((endedMode, newMode, completedPomodoros) => {
    const currentSettings = pomodoro.settings;
    const durationMinutes =
      endedMode === PomodoroMode.Work ? currentSettings.workDuration :
        endedMode === PomodoroMode.ShortBreak ? currentSettings.shortBreakDuration :
          currentSettings.longBreakDuration;

    const newLog: TimeLog = {
      id: Date.now().toString(),
      startTime: Date.now() - (durationMinutes * 60000),
      endTime: Date.now(),
      activity: endedMode === PomodoroMode.Work
        ? `${t('timeTrackerActivityTypeFocus')} #${completedPomodoros}`
        : `${t(endedMode === PomodoroMode.ShortBreak ? 'pomodoroModeShortBreak' : 'pomodoroModeLongBreak')}`,
      type: endedMode === PomodoroMode.Work ? 'focus' : 'break',
      date: getTodayDateString(),
    };

    const existingTimeLogs = loadData<TimeLog[]>(STORAGE_KEYS.TIME_LOGS, []);
    saveData<TimeLog[]>(STORAGE_KEYS.TIME_LOGS, [...existingTimeLogs, newLog]);

    if (endedMode === PomodoroMode.Work) {
      const breakTypeTranslationKey = newMode === PomodoroMode.ShortBreak ? 'pomodoroModeShortBreak' : 'pomodoroModeLongBreak';
      setBreakInvitationMessage(t('dashboardBreakInvitation', { breakType: t(breakTypeTranslationKey) }));
      setTimeout(() => setBreakInvitationMessage(null), 7000);
    }
  });


  const getSystemInstruction = (mode: AiFeatureMode): string => {
    if (mode === AiFeatureMode.TemplateCreator) {
      return t('aiTemplateCreatorSystemInstruction');
    }
    return t('aiCoachSystemInstruction');
  };

  const getJsonGenerationSystemInstruction = (): string => {
    return t('aiTemplateCreatorJsonSystemInstruction', {
      habitsSchema: JSON.stringify({ id: "string", name: "string", streak: "number (default 0)", lastCompletedDate: "yyyy-MM-dd | null (default null)", consequence: "string | undefined", targetDays: "number[] (0=Sun, 6=Sat) | undefined" }),
      weeklyMissionSchema: JSON.stringify({ id: "string", text: "string", deadline: "ISOString (7 days from now if not specified)" }),
      weeklyPlansSchema: JSON.stringify({ id: "string", weekStartDate: "yyyy-MM-dd (upcoming Monday)", mainGoal: "string", majorTasks: [{ id: "string", text: "string", completed: "boolean (default false)" }] }),
      scheduledGoalsSchema: JSON.stringify({ id: "string", title: "string", date: "yyyy-MM-dd", time: "HH:MM | undefined", isGoal: "boolean", completed: "boolean (default false)" })
    });
  };

  const handleAiChatSend = async (messageText: string, action?: 'confirm_generate_template' | 'confirm_apply_template') => {
    const userMessageText = action ? (action === 'confirm_generate_template' ? t('aiTemplateCreatorUserConfirmedGenerate') : messageText) : messageText;
    if (!userMessageText.trim() && !action) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      timestamp: Date.now(),
    };

    let updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setIsAiResponding(true);
    setCurrentTemplateDataToApply(null); // Clear any pending template

    try {
      let aiResponseText: string;
      let aiResponseMessage: ChatMessage;

      if (currentAiMode === AiFeatureMode.TemplateCreator && action === 'confirm_generate_template') {
        // User confirmed to generate the template JSON
        const templateData = await generateTemplateDataFromConversation(updatedMessages, getJsonGenerationSystemInstruction());
        if (templateData) {
          aiResponseText = t('aiTemplateCreatorGeneratedSuccess');
          // Present a summary of the template data for confirmation
          let summary = `${t('aiTemplateCreatorSummaryPrefix')}\n`;
          if (templateData.weeklyMission) summary += `- ${t('weeklyMissionLabel')}: ${templateData.weeklyMission.text}\n`;
          if (templateData.habits.length > 0) summary += `- ${t('habitsLabel')}: ${templateData.habits.map(h => h.name).join(', ')}\n`;
          if (templateData.weeklyPlans.length > 0) summary += `- ${t('weeklyPlansLabel')}: ${templateData.weeklyPlans[0].mainGoal}\n`; // Assuming one plan for now
          if (templateData.scheduledGoals.length > 0) summary += `- ${t('scheduledGoalsLabel')}: ${templateData.scheduledGoals.length} ${t('scheduledGoalsCountSuffix')}\n`;
          summary += `\n${t('aiTemplateCreatorConfirmApplyPrompt')}`;

          aiResponseText = summary;

          aiResponseMessage = {
            id: (Date.now() + 1).toString(),
            text: aiResponseText,
            sender: 'ai',
            timestamp: Date.now(),
            expectsConfirmation: 'apply_template',
            templateData: templateData
          };
        } else {
          aiResponseText = t('aiTemplateCreatorGeneratedError');
          aiResponseMessage = {
            id: (Date.now() + 1).toString(),
            text: aiResponseText,
            sender: 'ai',
            timestamp: Date.now(),
          };
        }
      } else if (currentAiMode === AiFeatureMode.TemplateCreator && action === 'confirm_apply_template') {
        // This case is handled by the Apply Template button, AI just acknowledges if user types "cancel" or similar.
        // If the user types something instead of clicking apply/cancel, the AI should respond normally.
        // For now, if action is confirm_apply_template, it means user clicked Cancel (or typed it).
        aiResponseText = t('aiTemplateCreatorApplyCancelledByResponse');
        aiResponseMessage = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          sender: 'ai',
          timestamp: Date.now(),
        };
      }
      else {
        // Standard chat response or initial phase of template creation
        aiResponseText = await getAiChatResponse(updatedMessages, getSystemInstruction(currentAiMode));

        aiResponseMessage = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          sender: 'ai',
          timestamp: Date.now(),
        };

        // Heuristic to check if AI is asking to proceed with JSON generation for Template Creator
        if (currentAiMode === AiFeatureMode.TemplateCreator &&
          (aiResponseText.toLowerCase().includes(t('aiTemplateCreatorReadyToGeneratePromptWord1').toLowerCase()) || aiResponseText.toLowerCase().includes(t('aiTemplateCreatorReadyToGeneratePromptWord2').toLowerCase())) &&
          !action) { // and no action means it's not already a confirmation
          aiResponseMessage.expectsConfirmation = 'generate_template';
        }
      }
      setChatMessages(prev => [...prev, aiResponseMessage]);

    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: t('errorAiChatResponse'),
        sender: 'ai',
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleApplyGeneratedTemplate = (templateData: FocusForgeTemplateData) => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dynamicData: FocusForgeTemplateData = {
      ...templateData,
      weeklyMission: templateData.weeklyMission
        ? { ...templateData.weeklyMission, deadline: templateData.weeklyMission.deadline || addDays(new Date(), 7).toISOString(), id: templateData.weeklyMission.id || `mission_${Date.now()}` }
        : null,
      scheduledGoals: templateData.scheduledGoals.map((goal, i) => ({
        ...goal,
        date: goal.date || format(addDays(weekStart, i % 7), 'yyyy-MM-dd'), // Distribute over the week if date missing
        id: goal.id || `goal_applied_${Date.now()}_${i}`
      })),
      weeklyPlans: templateData.weeklyPlans.map((plan, i) => ({
        ...plan,
        weekStartDate: plan.weekStartDate || format(weekStart, 'yyyy-MM-dd'),
        id: plan.id || `plan_applied_${Date.now()}_${i}`,
        majorTasks: plan.majorTasks.map((mt, j) => ({ ...mt, id: mt.id || `task_applied_${plan.id}_${Date.now()}_${j}` }))
      })),
      habits: templateData.habits.map((h, i) => ({
        ...h,
        streak: h.streak || 0,
        lastCompletedDate: h.lastCompletedDate || null,
        id: h.id || `habit_applied_${Date.now()}_${i}`
      }))
    };

    saveData<WeeklyPlan[]>(STORAGE_KEYS.WEEKLY_PLANS, dynamicData.weeklyPlans);
    saveData<Habit[]>(STORAGE_KEYS.HABITS, dynamicData.habits);
    saveData<ScheduledGoal[]>(STORAGE_KEYS.SCHEDULED_GOALS, dynamicData.scheduledGoals);
    saveData<WeeklyMission | null>(STORAGE_KEYS.WEEKLY_MISSION, dynamicData.weeklyMission);

    const successMessage: ChatMessage = {
      id: Date.now().toString(),
      text: t('aiTemplateCreatorApplySuccess'),
      sender: 'ai',
      timestamp: Date.now()
    };
    setTemplateCreatorChatMessages(prev => [...prev, successMessage]); // Add to template creator chat
    setCurrentTemplateDataToApply(null);
    setIsAiChatModalOpen(false); // Close modal after applying
    alert(t('aiTemplateCreatorApplySuccessAlert'));
    navigate('/'); // Navigate to dashboard
  };


  const handleOpenAiFeatureSelection = () => {
    setIsAiFeatureSelectionModalOpen(true);
  };

  const handleSelectAiFeature = (feature: AiFeatureMode) => {
    setCurrentAiMode(feature);
    setIsAiFeatureSelectionModalOpen(false);
    setIsAiChatModalOpen(true);
    // Add initial greeting message if chat is empty for template creator
    if (feature === AiFeatureMode.TemplateCreator && templateCreatorChatMessages.length === 0) {
      setTemplateCreatorChatMessages([{
        id: 'init_template_creator',
        text: t('aiTemplateCreatorInitialGreeting'),
        sender: 'ai',
        timestamp: Date.now()
      }]);
    } else if (feature === AiFeatureMode.Coach && coachChatMessages.length === 0) {
      setCoachChatMessages([{
        id: 'init_coach',
        text: t('aiCoachInitialGreeting'),
        sender: 'ai',
        timestamp: Date.now()
      }]);
    }
  };

  React.useEffect(() => {
    document.title = t(APP_NAME_TRANSLATION_KEY);
  }, [t, language]);


  return (
    <Analytics />
    <div className="flex h-screen bg-bglight dark:bg-bgdark text-textlight dark:text-textdark overflow-hidden">
      <Sidebar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex flex-col flex-1 w-full overflow-x-hidden relative">
        <MobileHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="flex-1 overflow-y-auto"> 
          <Routes>
            <Route path="/" element={<DashboardPage pomodoro={pomodoro} breakInvitationMessage={breakInvitationMessage} />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/notebook" element={<NotebookPage />} />
            <Route path="/timetracker" element={<TimeTrackerPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/discipline" element={<DisciplineBoardPage />} />
            <Route path="/import-export" element={<ImportExportPage />} />
            <Route path="*" element={<Navigate to="/" replace />} /> 
          </Routes>
        </main>
        
        <FloatingActionButtons
          onHelpClick={() => setIsHelpModalOpen(true)}
          onAiFeatureSelectClick={handleOpenAiFeatureSelection}
        />

        <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
        
        <AiFeatureSelectionModal
          isOpen={isAiFeatureSelectionModalOpen}
          onClose={() => setIsAiFeatureSelectionModalOpen(false)}
          onSelectFeature={handleSelectAiFeature}
        />

        {isAiChatModalOpen && (
            <AiChatModal
              isOpen={isAiChatModalOpen}
              onClose={() => {
                setIsAiChatModalOpen(false);
                setCurrentTemplateDataToApply(null); // Clear pending template on close
              }}
              aiMode={currentAiMode}
              chatMessages={chatMessages}
              onSendMessage={handleAiChatSend}
              onApplyGeneratedTemplate={handleApplyGeneratedTemplate}
              isAiResponding={isAiResponding}
              currentTemplateDataToApply={currentTemplateDataToApply}
            />
        )}
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED, false);
  const initialLanguage = loadData<Language>(STORAGE_KEYS.LANGUAGE, 'en');


  return (
    <LanguageProvider>
      <HashRouter>
        {!onboardingCompleted ? (
          <Routes>
            <Route
              path="*"
              element={
                <OnboardingPage
                  initialLanguage={initialLanguage}
                  onComplete={(selectedLang: Language) => {
                    saveData<Language>(STORAGE_KEYS.LANGUAGE, selectedLang);
                    setOnboardingCompleted(true);
                  }}
                />
              }
            />
          </Routes>
        ) : (
          <MainApp />
        )}
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;

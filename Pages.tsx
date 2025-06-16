
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage, usePomodoro } from './hooks';
import { loadData, saveData, fetchDailyQuote, summarizeText, generateWeeklyAiReport } from './services';
import { DailyTask, MoodEnergyLog, JournalEntry, WeeklyMission, TimeLog, Habit, ScheduledGoal, WeeklyPlan, WeeklyReviewData, PomodoroMode, FocusForgeTemplate, FocusForgeTemplateData, Language } from './types';
import { STORAGE_KEYS, Icons, DEFAULT_MOTIVATIONAL_QUOTE_KEY, APP_NAME_TRANSLATION_KEY, ENTREPRENEUR_STARTER_TEMPLATE_DATA } from './constants';
import { Modal, EditableField, LoadingSpinner, PomodoroControls, StarRating, Button, Card } from './uiElements';
import { format, addDays, eachDayOfInterval, differenceInSeconds, getDay, isToday, isFuture, isPast } from 'date-fns';
import startOfWeek from 'date-fns/startOfWeek';
import parseISO from 'date-fns/parseISO';
import { useLanguageContext } from './contexts';
import { translations } from './translations'; 

const getTodayDateString = () => format(new Date(), 'yyyy-MM-dd');

const formatDuration = (start: number, end: number): string => {
  const durationMs = end - start;
  if (durationMs < 0) return 'Invalid duration'; 
  
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `<1m`; 
};

// Helper for date differences, used in DisciplineBoardPage
const differenceInDays = (dateLeft: Date, dateRight: Date): number => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(dateLeft.getFullYear(), dateLeft.getMonth(), dateLeft.getDate());
  const utc2 = Date.UTC(dateRight.getFullYear(), dateRight.getMonth(), dateRight.getDate());
  return Math.floor((utc1 - utc2) / _MS_PER_DAY);
};

// --- Onboarding Page ---
interface OnboardingPageProps {
  initialLanguage: Language;
  onComplete: (selectedLang: Language) => void;
}
export const OnboardingPage: React.FC<OnboardingPageProps> = ({ initialLanguage, onComplete }) => {
  const [step, setStep] = useState(0);
  // Use a local state for language during onboarding, then call onComplete with it.
  const [currentOnboardingLang, setCurrentOnboardingLang] = useState<Language>(initialLanguage);
  const navigate = useNavigate();

  // Temporary t function for onboarding before full context is ready or if context is not used here.
  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    let translation = translations[currentOnboardingLang]?.[key] || translations['en']?.[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  }, [currentOnboardingLang]);
  
  // Update html lang attribute for onboarding page
  useEffect(() => {
    document.documentElement.lang = currentOnboardingLang;
  }, [currentOnboardingLang]);


  const onboardingSteps = [
    {
      titleKey: "onboardingWelcomeTitle",
      textKey: "onboardingWelcomeText",
      icon: <Icons.Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
    },
    {
      titleKey: "onboardingFeaturesTitle",
      textKey: "onboardingFeature1Title", // Main text here will be feature title
      descriptionKey: "onboardingFeature1Text",
      icon: <Icons.Dashboard className="w-12 h-12 text-primary mx-auto mb-3" />
    },
    {
      titleKey: "onboardingFeaturesTitle",
      textKey: "onboardingFeature2Title",
      descriptionKey: "onboardingFeature2Text",
      icon: <Icons.Calendar className="w-12 h-12 text-primary mx-auto mb-3" />
    },
    {
      titleKey: "onboardingFeaturesTitle",
      textKey: "onboardingFeature3Title",
      descriptionKey: "onboardingFeature3Text",
      icon: <Icons.Notebook className="w-12 h-12 text-primary mx-auto mb-3" />
    },
    {
      titleKey: "onboardingFeaturesTitle",
      textKey: "onboardingFeature4Title",
      descriptionKey: "onboardingFeature4Text",
      icon: <Icons.ShieldCheck className="w-12 h-12 text-primary mx-auto mb-3" />
    },
    {
      titleKey: "onboardingLanguageTitle",
      textKey: "onboardingLanguageText",
      isLanguageStep: true,
      icon: <Icons.GlobeAlt className="w-16 h-16 text-primary mx-auto mb-4" />
    }
  ];

  const currentStepContent = onboardingSteps[step];

  const handleNext = () => setStep(s => Math.min(s + 1, onboardingSteps.length - 1));
  const handlePrevious = () => setStep(s => Math.max(s - 1, 0));

  const handleLanguageSelect = (lang: Language) => {
    setCurrentOnboardingLang(lang); // Set language for immediate UI update on this page
    onComplete(lang); // This will save to localStorage and trigger App.tsx re-render
    navigate('/'); // Navigate to main app
  };
  
  // Set document title for onboarding
   useEffect(() => {
    document.title = t(APP_NAME_TRANSLATION_KEY) + " - " + t('onboardingWelcomeTitle');
  }, [t, currentOnboardingLang]);


  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-center bg-bglight dark:bg-bgdark text-textlight dark:text-textdark transition-colors duration-300`}>
      <Card className="w-full max-w-md sm:max-w-lg">
        {currentStepContent.icon}
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-primary">{t(currentStepContent.titleKey)}</h1>
        <p className="text-base sm:text-lg mb-3 text-textlight-muted dark:text-textdark-muted">{t(currentStepContent.textKey)}</p>
        {currentStepContent.descriptionKey && <p className="text-sm sm:text-base mb-6">{t(currentStepContent.descriptionKey)}</p>}

        {currentStepContent.isLanguageStep ? (
          <div className="space-y-3 my-4">
            <Button onClick={() => handleLanguageSelect('en')} variant={currentOnboardingLang === 'en' ? 'primary' : 'secondary'} className="w-full" size="lg">
              {t('languageEnglish')}
            </Button>
            <Button onClick={() => handleLanguageSelect('am')} variant={currentOnboardingLang === 'am' ? 'primary' : 'secondary'} className="w-full" size="lg">
              {t('languageAmharic')}
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center mt-6">
            <Button onClick={handlePrevious} disabled={step === 0} variant="secondary" size="md">
              {t('onboardingButtonPrevious')}
            </Button>
            <div className="flex space-x-1">
                {onboardingSteps.map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full ${step === index ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                ))}
            </div>
            <Button onClick={handleNext} disabled={step === onboardingSteps.length - 1} variant="primary" size="md">
              {t('onboardingButtonNext')}
            </Button>
          </div>
        )}
      </Card>
       <p className="text-xs text-textlight-muted dark:text-textdark-muted mt-8">
        {t(APP_NAME_TRANSLATION_KEY)} - {t('onboardingWelcomeTitle')}
      </p>
    </div>
  );
};


// --- Dashboard Page ---
interface DashboardPageProps {
  pomodoro: ReturnType<typeof usePomodoro>;
  breakInvitationMessage: string | null;
}
export const DashboardPage: React.FC<DashboardPageProps> = ({ pomodoro, breakInvitationMessage }) => {
  const { t } = useLanguageContext();
  const today = getTodayDateString();
  const [dailyTask, setDailyTask] = useLocalStorage<DailyTask | null>(`${STORAGE_KEYS.DAILY_TASK}_${today}`, null);
  const [moodLogs, setMoodLogs] = useLocalStorage<MoodEnergyLog[]>(STORAGE_KEYS.MOOD_LOGS, []);
  const [journalEntry, setJournalEntry] = useState('');
  const [allJournalEntries, setAllJournalEntries] = useLocalStorage<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES, []);
  const [dailyQuote, setDailyQuote] = useState(t(DEFAULT_MOTIVATIONAL_QUOTE_KEY));
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);
  const [weeklyMission, setWeeklyMission] = useLocalStorage<WeeklyMission | null>(STORAGE_KEYS.WEEKLY_MISSION, null);
  const [missionTimeLeft, setMissionTimeLeft] = useState('');
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [currentMood, setCurrentMood] = useState(3);
  const [currentEnergy, setCurrentEnergy] = useState(3);
  
  useEffect(() => {
    const fetchAndSetQuote = async () => {
      setIsLoadingQuote(true);
      const quoteText = await fetchDailyQuote(); 
      setDailyQuote(quoteText); 
      setIsLoadingQuote(false);
    };
    fetchAndSetQuote();
  }, [t]); 

  useEffect(() => {
    if (weeklyMission && weeklyMission.deadline) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const deadlineDate = parseISO(weeklyMission.deadline);
        const diff = differenceInSeconds(deadlineDate, now);

        if (diff <= 0) {
          setMissionTimeLeft(t("dashboardMissionEnded"));
          clearInterval(intervalId);
          return;
        }

        const d = Math.floor(diff / (3600 * 24));
        const h = Math.floor((diff % (3600 * 24)) / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = Math.floor(diff % 60);
        setMissionTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
        setMissionTimeLeft('');
    }
  }, [weeklyMission, t]);
  
  useEffect(() => {
    const now = new Date();
    if (now.getHours() >= 9 && now.getHours() < 12 && (!dailyTask || !dailyTask.text)) {
      const warningShownKey = `focusForge_warningShown_${today}`;
      if (!localStorage.getItem(warningShownKey)) {
          console.warn(t('dashboardReminderSetPriority'));
          localStorage.setItem(warningShownKey, 'true');
      }
    }
  }, [dailyTask, today, t]);


  const handleSaveDailyTask = (text: string) => {
    setDailyTask({ id: today, text, date: today, isDone: dailyTask?.isDone || false });
  };

  const toggleDailyTaskDone = () => {
    if (dailyTask) {
        setDailyTask({ ...dailyTask, isDone: !dailyTask.isDone });
    }
  };

  const handleSaveMoodEnergy = () => {
    const newLog: MoodEnergyLog = {
      id: Date.now().toString(),
      date: today,
      mood: currentMood,
      energy: currentEnergy,
      timestamp: Date.now(),
    };
    setMoodLogs([...moodLogs, newLog]);
    setShowMoodModal(false);
  };

  const handleSaveQuickNote = () => {
    if (journalEntry.trim() === '') return;
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      content: journalEntry,
      date: today,
    };
    setAllJournalEntries([...allJournalEntries, newEntry]);
    setJournalEntry(''); 
    // Consider adding a toast notification for "Note saved"
  };

  const handleSaveWeeklyMission = (text: string) => {
    const deadline = weeklyMission?.deadline && weeklyMission.text === text 
                     ? weeklyMission.deadline 
                     : addDays(new Date(), 7).toISOString();
    setWeeklyMission({ id: 'current_mission', text, deadline });
  };
  
  const todayMoodLog = moodLogs.find(log => log.date === today && new Date(log.timestamp).toDateString() === new Date().toDateString());

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-textlight dark:text-textdark">{t('pageTitleDashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card title={t('dashboardTopTaskTitle')} icon={<Icons.Flag />} className="lg:col-span-2">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <input 
                type="checkbox" 
                checked={dailyTask?.isDone || false} 
                onChange={toggleDailyTaskDone}
                className="h-5 w-5 sm:h-6 sm:w-6 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                disabled={!dailyTask?.text}
                aria-label="Mark task as done"
            />
            <EditableField
              initialValue={dailyTask?.text || ''}
              onSave={handleSaveDailyTask}
              placeholder={t('dashboardTopTaskPlaceholder')}
              textClassName={`text-lg sm:text-xl ${dailyTask?.isDone ? 'line-through text-textlight-muted dark:text-textdark-muted' : ''}`}
            />
          </div>
        </Card>

        <Card title={t('dashboardDailyWisdomTitle')} icon={<Icons.Notebook />}>
          {isLoadingQuote ? <LoadingSpinner /> : <p className="text-base sm:text-lg italic text-textlight-muted dark:text-textdark-muted">"{dailyQuote}"</p>}
        </Card>

        <Card title={t('dashboardFocusTimerTitle')} icon={<Icons.Clock />} className="lg:col-span-2">
          <PomodoroControls pomodoro={pomodoro} breakInvitationMessage={breakInvitationMessage} />
        </Card>

        <Card title={t('dashboardMoodEnergyTitle')} icon={<Icons.Star />}>
            {!todayMoodLog ? (
                <Button onClick={() => setShowMoodModal(true)} variant="secondary" className="w-full text-sm sm:text-base" translationKey="dashboardLogMoodButton"/>
            ) : (
                <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                    <p>{t('dashboardMoodLoggedText')}</p>
                    <div className="flex items-center">{t('moodModalMoodLabel')} <StarRating count={5} value={todayMoodLog.mood} onChange={() => {}} size={20} /> <span className="ml-1">({todayMoodLog.mood}/5)</span></div>
                    <div className="flex items-center">{t('moodModalEnergyLabel')} <StarRating count={5} value={todayMoodLog.energy} onChange={() => {}} size={20} /> <span className="ml-1">({todayMoodLog.energy}/5)</span></div>
                </div>
            )}
        </Card>

        <Card title={t('dashboardQuickNoteTitle')} icon={<Icons.Notebook />} className="lg:col-span-2">
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder={t('dashboardQuickNotePlaceholder')}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark focus:ring-2 focus:ring-primary focus:border-primary min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
            aria-label={t('dashboardQuickNotePlaceholder')}
          />
          <Button onClick={handleSaveQuickNote} className="mt-2 text-sm sm:text-base" disabled={!journalEntry.trim()} translationKey="dashboardSaveToNotebookButton"/>
        </Card>

        <Card title={t('dashboardWeeklyMissionTitle')} icon={<Icons.Flag />}>
          <EditableField
            initialValue={weeklyMission?.text || ''}
            onSave={handleSaveWeeklyMission}
            placeholder={t('dashboardWeeklyMissionPlaceholder')}
            textClassName="text-base sm:text-lg"
          />
          {weeklyMission?.text && (
            <div className="mt-2">
              <p className="text-xs sm:text-sm text-textlight-muted dark:text-textdark-muted">{t('dashboardMissionCountdownLabel')} <span className="font-semibold text-primary">{missionTimeLeft || t('dashboardCalculating')}</span></p>
              {weeklyMission.deadline && <p className="text-xs text-textlight-muted dark:text-textdark-muted">{t('dashboardMissionDeadlineLabel')} {format(parseISO(weeklyMission.deadline), 'PPp')}</p>}
            </div>
          )}
        </Card>
      </div>

      <Modal isOpen={showMoodModal} onClose={() => setShowMoodModal(false)} title={t('moodModalTitle')}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('moodModalMoodLabel')}</label>
            <StarRating count={5} value={currentMood} onChange={setCurrentMood} size={28}/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('moodModalEnergyLabel')}</label>
            <StarRating count={5} value={currentEnergy} onChange={setCurrentEnergy} size={28}/>
          </div>
          <Button onClick={handleSaveMoodEnergy} className="w-full" translationKey="moodModalSaveButton"/>
        </div>
      </Modal>
    </div>
  );
};

// --- Calendar Page ---
export const CalendarPage: React.FC = () => {
  const { t } = useLanguageContext();
  const [goals, setGoals] = useLocalStorage<ScheduledGoal[]>(STORAGE_KEYS.SCHEDULED_GOALS, []);
  const [showModal, setShowModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDate, setNewGoalDate] = useState(getTodayDateString());
  const [newGoalTime, setNewGoalTime] = useState('');
  const [newGoalIsGoal, setNewGoalIsGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<ScheduledGoal | null>(null);

  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 })); 

  const weekDays = eachDayOfInterval({ start: currentWeekStart, end: addDays(currentWeekStart, 6) });

  const dayNameKeys = ['daySun', 'dayMon', 'dayTue', 'dayWed', 'dayThu', 'dayFri', 'daySat'];

  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || !newGoalDate) return;
    const goal: ScheduledGoal = {
      id: selectedGoal?.id || Date.now().toString(),
      title: newGoalTitle,
      date: newGoalDate,
      time: newGoalTime,
      isGoal: newGoalIsGoal,
      completed: selectedGoal?.completed || false,
    };
    if (selectedGoal) {
      setGoals(goals.map(g => g.id === selectedGoal.id ? goal : g));
    } else {
      setGoals([...goals, goal]);
    }
    closeModal();
  };

  const openModalForEdit = (goal: ScheduledGoal) => {
    setSelectedGoal(goal);
    setNewGoalTitle(goal.title);
    setNewGoalDate(goal.date);
    setNewGoalTime(goal.time || '');
    setNewGoalIsGoal(goal.isGoal);
    setShowModal(true);
  };
  
  const openModalForNew = (date?: Date) => {
    setSelectedGoal(null);
    setNewGoalTitle('');
    setNewGoalDate(date ? format(date, 'yyyy-MM-dd') : getTodayDateString());
    setNewGoalTime('');
    setNewGoalIsGoal(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedGoal(null);
    setNewGoalTitle('');
    setNewGoalDate(getTodayDateString());
    setNewGoalTime('');
    setNewGoalIsGoal(false);
  };

  const toggleComplete = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };
  
  const deleteGoal = (id: string) => {
    if (window.confirm(t('deleteConfirmation'))) {
        setGoals(goals.filter(g => g.id !== id));
    }
  };

  const goalsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return goals
      .filter(g => g.date === dateString)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">{t('pageTitleCalendar')}</h1>
        <Button onClick={() => openModalForNew()} leftIcon={<Icons.PlusCircle className="w-4 h-4 sm:w-5 sm:h-5"/>} size="sm" translationKey="calendarAddEventButton"/>
      </div>

      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <Button onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))} size="sm" translationKey="calendarPreviousWeekButton"/>
        <h2 className="text-lg sm:text-xl font-semibold text-center">{format(currentWeekStart, 'MMM yyyy')} - {t('calendarWeekDisplay', {weekNumber: format(currentWeekStart, 'w')})}</h2>
        <Button onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))} size="sm" translationKey="calendarNextWeekButton"/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-1 sm:gap-2">
        {weekDays.map(day => (
          <div key={day.toString()} className={`p-2 sm:p-3 rounded-lg min-h-[150px] sm:min-h-[200px]
            ${isToday(day) ? 'bg-primary/10 dark:bg-primary/20 ring-1 sm:ring-2 ring-primary' : 'bg-bglight-surface dark:bg-bgdark-surface'}
            ${(isPast(day) && !isToday(day)) ? 'opacity-70' : ''}
          `}>
            <div className="flex justify-between items-center text-xs sm:text-sm">
                 <p className={`font-semibold ${isToday(day) ? 'text-primary' : ''}`}>{t(dayNameKeys[getDay(day)])}</p>
                 <p className={`text-xl sm:text-2xl font-bold ${isToday(day) ? 'text-primary' : 'text-textlight-muted dark:text-textdark-muted'}`}>{format(day, 'd')}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => openModalForNew(day)} className="w-full mt-1 text-xs justify-start p-1">
                <Icons.PlusCircle className="w-3 h-3 mr-1"/> {t('calendarButtonAddForDay')}
            </Button>
            <ul className="mt-1 sm:mt-2 space-y-1">
              {goalsForDate(day).map(goal => (
                <li key={goal.id} 
                    onClick={() => openModalForEdit(goal)}
                    className={`p-1 text-[10px] sm:text-xs rounded cursor-pointer group relative
                                ${goal.isGoal ? 'bg-accent/20 dark:bg-accent/30' : 'bg-bglight-muted dark:bg-bgdark-muted'} 
                                ${goal.completed ? 'line-through opacity-60' : ''}
                                hover:ring-1 hover:ring-primary`}
                >
                  <div className="flex items-start justify-between">
                    <div className="break-words w-[calc(100%-20px)]"> 
                        {goal.time && <span className="font-medium mr-1">{goal.time}</span>}
                        {goal.title}
                        {goal.isGoal && <span className="ml-1 text-accent dark:text-accent font-bold">{t('calendarEventGoalLabel')}</span>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleComplete(goal.id);}} className="ml-1 opacity-50 group-hover:opacity-100 flex-shrink-0">
                        {goal.completed ? <Icons.CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500"/> : <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border border-gray-400 rounded-sm"></div> }
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={closeModal} title={selectedGoal ? t('calendarModalTitleEdit') : t('calendarModalTitleAdd')} size="md">
        <div className="space-y-3">
          <input type="text" placeholder={t('calendarModalPlaceholderTitle')} value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)} className="w-full p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm sm:text-base" />
          <input type="date" value={newGoalDate} onChange={e => setNewGoalDate(e.target.value)} className="w-full p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm sm:text-base" />
          <input type="time" value={newGoalTime} onChange={e => setNewGoalTime(e.target.value)} className="w-full p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm sm:text-base" />
          <label className="flex items-center text-sm sm:text-base">
            <input type="checkbox" checked={newGoalIsGoal} onChange={e => setNewGoalIsGoal(e.target.checked)} className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
            {t('calendarModalCheckboxGoal')}
          </label>
          <div className="flex justify-end space-x-2">
            {selectedGoal && <Button onClick={() => deleteGoal(selectedGoal.id)} variant="danger" size="sm" translationKey="calendarModalDeleteButton"/>}
            <Button onClick={handleAddGoal} variant="primary" size="sm" translationKey={selectedGoal ? "calendarModalSaveButton" : "calendarModalAddButton"}/>
          </div>
        </div>
      </Modal>
    </div>
  );
};


// --- Notebook Page ---
export const NotebookPage: React.FC = () => {
  const { t } = useLanguageContext();
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES, []);
  const [newEntryContent, setNewEntryContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const handleAddOrUpdateEntry = () => {
    if (!newEntryContent.trim()) return;
    if (editingEntry) {
      setEntries(entries.map(e => e.id === editingEntry.id ? { ...e, content: newEntryContent, timestamp: Date.now() } : e));
      setEditingEntry(null);
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        content: newEntryContent,
        date: getTodayDateString(),
      };
      setEntries([newEntry, ...entries]); 
    }
    setNewEntryContent('');
  };

  const startEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntryContent(entry.content);
    window.scrollTo(0, 0); 
  };
  
  const cancelEdit = () => {
    setEditingEntry(null);
    setNewEntryContent('');
  };

  const deleteEntry = (id: string) => {
    if (window.confirm(t('deleteConfirmation'))) {
      setEntries(entries.filter(e => e.id !== id));
      if(editingEntry?.id === id) cancelEdit();
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    format(new Date(entry.timestamp), 'PPp').toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => b.timestamp - a.timestamp);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{t('pageTitleNotebook')}</h1>
      <Card title={editingEntry ? t('notebookEditEntryTitle') : t('notebookNewEntryTitle')} className="mb-4 sm:mb-6">
        <textarea
          value={newEntryContent}
          onChange={(e) => setNewEntryContent(e.target.value)}
          placeholder={t('notebookEntryPlaceholder')}
          className="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark focus:ring-2 focus:ring-primary focus:border-primary min-h-[120px] sm:min-h-[150px] text-sm sm:text-base"
          aria-label={t('notebookEntryPlaceholder')}
        />
        <div className="mt-2 sm:mt-3 flex space-x-2">
            <Button onClick={handleAddOrUpdateEntry} variant="primary" size="sm" translationKey={editingEntry ? "notebookUpdateButton" : "notebookAddButton"}/>
            {editingEntry && <Button onClick={cancelEdit} variant="secondary" size="sm" translationKey="notebookCancelEditButton"/>}
        </div>
      </Card>

      <Card title={t('notebookEntriesTitle')} className="mb-4 sm:mb-6">
        <input
            type="text"
            placeholder={t('notebookSearchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 mb-3 sm:mb-4 border border-gray-300 dark:border-gray-600 rounded-md bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm sm:text-base"
            aria-label={t('notebookSearchPlaceholder')}
        />
        {filteredEntries.length === 0 && <p className="text-sm sm:text-base">{t('notebookNoEntriesFound')}</p>}
        <ul className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
          {filteredEntries.map(entry => (
            <li key={entry.id} className="p-3 sm:p-4 rounded-md bg-bglight dark:bg-bgdark-muted shadow">
              <p className="text-xs sm:text-sm text-textlight-muted dark:text-textdark-muted mb-1">{format(new Date(entry.timestamp), 'PPp')}</p>
              <p className="whitespace-pre-wrap break-words text-sm sm:text-base">{entry.content}</p>
              <div className="mt-2 space-x-1 sm:space-x-2">
                <Button onClick={() => startEdit(entry)} size="sm" variant="ghost" translationKey="notebookEditEntryButton"/>
                <Button onClick={() => deleteEntry(entry.id)} size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10" translationKey="notebookDeleteEntryButton"/>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

// --- TimeTracker Page ---
export const TimeTrackerPage: React.FC = () => {
  const { t } = useLanguageContext();
  const [timeLogs, setTimeLogs] = useLocalStorage<TimeLog[]>(STORAGE_KEYS.TIME_LOGS, []);
  const [showModal, setShowModal] = useState(false);
  
  const [activity, setActivity] = useState('');
  const [type, setType] = useState<'focus' | 'break' | 'distraction'>('focus');
  const [startTime, setStartTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [endTime, setEndTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [editingLog, setEditingLog] = useState<TimeLog | null>(null);

  const handleAddOrUpdateLog = () => {
    if (!activity.trim()) return;
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    if (start >= end) {
        alert(t('timeTrackerErrorEndTimeBeforeStart'));
        return;
    }

    if (editingLog) {
      const updatedLog: TimeLog = { ...editingLog, activity, type, startTime: start, endTime: end, date: format(new Date(start), 'yyyy-MM-dd') };
      setTimeLogs(timeLogs.map(log => log.id === editingLog.id ? updatedLog : log));
    } else {
      const newLog: TimeLog = {
        id: Date.now().toString(),
        activity,
        type,
        startTime: start,
        endTime: end,
        date: format(new Date(start), 'yyyy-MM-dd'),
      };
      setTimeLogs([newLog, ...timeLogs]);
    }
    closeModal();
  };
  
  const openModalForNew = () => {
    setEditingLog(null);
    setActivity('');
    setType('focus');
    const now = new Date();
    setStartTime(format(now, "yyyy-MM-dd'T'HH:mm"));
    setEndTime(format(addDays(now, 0), "yyyy-MM-dd'T'HH:mm")); // Should be same time or slightly after
    setShowModal(true);
  };

  const openModalForEdit = (log: TimeLog) => {
    setEditingLog(log);
    setActivity(log.activity);
    setType(log.type);
    setStartTime(format(new Date(log.startTime), "yyyy-MM-dd'T'HH:mm"));
    setEndTime(format(new Date(log.endTime), "yyyy-MM-dd'T'HH:mm"));
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setEditingLog(null);
  };

  const deleteLog = (id: string) => {
    if (window.confirm(t('deleteConfirmation'))) {
      setTimeLogs(timeLogs.filter(log => log.id !== id));
    }
  };
  
  const logsByDate = timeLogs.reduce((acc, log) => {
    const date = format(new Date(log.startTime), 'PP'); 
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, TimeLog[]>);

  const sortedDates = Object.keys(logsByDate).sort((a,b) => new Date(b).getTime() - new Date(a).getTime());

  const typeTranslations = {
    focus: t('timeTrackerActivityTypeFocus'),
    break: t('timeTrackerActivityTypeBreak'),
    distraction: t('timeTrackerActivityTypeDistraction'),
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">{t('pageTitleTimeTracker')}</h1>
        <Button onClick={openModalForNew} leftIcon={<Icons.PlusCircle className="w-4 h-4 sm:w-5 sm:h-5"/>} size="sm" translationKey="timeTrackerLogActivityButton"/>
      </div>

      {sortedDates.length === 0 && <Card><p className="text-sm sm:text-base">{t('timeTrackerNoLogs')}</p></Card>}

      {sortedDates.map(dateStr => (
        <Card key={dateStr} title={dateStr} className="mb-4 sm:mb-6">
          <ul className="space-y-2 sm:space-y-3">
            {logsByDate[dateStr].sort((a,b) => b.startTime - a.startTime).map(log => (
              <li key={log.id} className="p-2 sm:p-3 rounded-md bg-bglight dark:bg-bgdark-muted shadow-sm flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="mb-1 sm:mb-0">
                  <p className="font-semibold text-sm sm:text-base">{log.activity} 
                    <span className={`ml-2 text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                        log.type === 'focus' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
                        log.type === 'break' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100' :
                        'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'
                    }`}>{typeTranslations[log.type]}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-textlight-muted dark:text-textdark-muted">
                    {format(new Date(log.startTime), 'p')} - {format(new Date(log.endTime), 'p')} 
                    <span className="font-medium"> ({formatDuration(log.startTime, log.endTime)})</span>
                  </p>
                </div>
                <div className="space-x-1 sm:space-x-2 flex-shrink-0">
                    <Button onClick={() => openModalForEdit(log)} size="sm" variant="ghost" className="p-1"><Icons.Notebook className="w-4 h-4"/></Button>
                    <Button onClick={() => deleteLog(log.id)} size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10 p-1"><Icons.Trash className="w-4 h-4"/></Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ))}

      <Modal isOpen={showModal} onClose={closeModal} title={editingLog ? t('timeTrackerModalTitleEdit') : t('timeTrackerModalTitleNew')} size="md">
        <div className="space-y-3">
          <input type="text" placeholder={t('timeTrackerModalPlaceholderActivity')} value={activity} onChange={e => setActivity(e.target.value)} className="w-full p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm sm:text-base" />
          <select value={type} onChange={e => setType(e.target.value as any)} className="w-full p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm sm:text-base">
            <option value="focus">{typeTranslations.focus}</option>
            <option value="break">{typeTranslations.break}</option>
            <option value="distraction">{typeTranslations.distraction}</option>
          </select>
          <div>
            <label className="block text-xs sm:text-sm">{t('timeTrackerModalLabelStartTime')}</label>
            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm sm:text-base" />
          </div>
          <div>
            <label className="block text-xs sm:text-sm">{t('timeTrackerModalLabelEndTime')}</label>
            <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm sm:text-base" />
          </div>
          <Button onClick={handleAddOrUpdateLog} variant="primary" className="w-full" size="sm" translationKey={editingLog ? "timeTrackerModalUpdateButton" : "timeTrackerModalAddButton"}/>
        </div>
      </Modal>
    </div>
  );
};


// --- Review Page ---
export const ReviewPage: React.FC = () => {
    const { t } = useLanguageContext();
    const [reviews, setReviews] = useLocalStorage<WeeklyReviewData[]>(STORAGE_KEYS.WEEKLY_REVIEWS, []);
    const [allTimeLogs] = useLocalStorage<TimeLog[]>(STORAGE_KEYS.TIME_LOGS, []);
    const [allJournalEntries] = useLocalStorage<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES, []);
    const [allHabits] = useLocalStorage<Habit[]>(STORAGE_KEYS.HABITS, []);
    const [allScheduledGoals] = useLocalStorage<ScheduledGoal[]>(STORAGE_KEYS.SCHEDULED_GOALS, []);
    const [allWeeklyPlans] = useLocalStorage<WeeklyPlan[]>(STORAGE_KEYS.WEEKLY_PLANS, []);
    
    const [showModal, setShowModal] = useState(false);
    const [currentReview, setCurrentReview] = useState<Partial<WeeklyReviewData>>({});
    const [selectedWeekStart, setSelectedWeekStart] = useState(format(startOfWeek(new Date(), {weekStartsOn: 1}), 'yyyy-MM-dd'));
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [isGeneratingAiReview, setIsGeneratingAiReview] = useState(false);

    const openReviewModal = (weekStart?: string) => {
        const targetWeekStart = weekStart || selectedWeekStart;
        const existingReview = reviews.find(r => r.weekStartDate === targetWeekStart);
        setCurrentReview(existingReview || { weekStartDate: targetWeekStart, wins: '', losses: '', distractionSummary: '', disciplineRating: 3, aiSummary: '' });
        setSelectedWeekStart(targetWeekStart); 
        setShowModal(true);
    };

    const handleSaveReview = () => {
        if (!currentReview.weekStartDate) return;
        const reviewToSave: WeeklyReviewData = {
            id: currentReview.id || currentReview.weekStartDate || Date.now().toString(),
            weekStartDate: currentReview.weekStartDate,
            wins: currentReview.wins || '',
            losses: currentReview.losses || '',
            distractionSummary: currentReview.distractionSummary || '',
            disciplineRating: currentReview.disciplineRating || 3,
            aiSummary: currentReview.aiSummary || '',
        };

        const existingIndex = reviews.findIndex(r => r.id === reviewToSave.id || r.weekStartDate === reviewToSave.weekStartDate);
        if (existingIndex > -1) {
            const updatedReviews = [...reviews];
            updatedReviews[existingIndex] = reviewToSave;
            setReviews(updatedReviews);
        } else {
            setReviews([...reviews, reviewToSave]);
        }
        setShowModal(false);
    };
    
    const generateAIDistractionSummary = async () => {
        setIsGeneratingSummary(true);
        const weekStartValue = parseISO(selectedWeekStart);
        const weekEnd = addDays(weekStartValue, 6);

        const relevantLogs = allTimeLogs.filter(log => {
            const logDate = parseISO(log.date); 
            return logDate >= weekStartValue && logDate <= weekEnd && log.type === 'distraction';
        });
        const relevantJournal = allJournalEntries.filter(entry => {
            const entryDate = parseISO(entry.date);
            return entryDate >= weekStartValue && entryDate <= weekEnd;
        });

        let summaryPrompt = "Based on the following data for the week, identify common distractions and themes from journal entries:\n";
        if (relevantLogs.length > 0) {
            summaryPrompt += "\nDistraction Logs:\n" + relevantLogs.map(l => `- ${l.activity} (${formatDuration(l.startTime, l.endTime)})`).join('\n');
        }
        if (relevantJournal.length > 0) {
            summaryPrompt += "\nJournal Entries:\n" + relevantJournal.map(j => `- ${j.content.substring(0,100)}...`).join('\n');
        }
        
        if (relevantLogs.length === 0 && relevantJournal.length === 0) {
            setCurrentReview(prev => ({ ...prev, distractionSummary: t('reviewModalNoDataForAiSummary') }));
            setIsGeneratingSummary(false);
            return;
        }

        const summary = await summarizeText(summaryPrompt, "weekly productivity review focusing on distractions");
        setCurrentReview(prev => ({ ...prev, distractionSummary: summary }));
        setIsGeneratingSummary(false);
    };

    const handleGenerateFullAiReview = async () => {
        if (!currentReview.weekStartDate) return;
        setIsGeneratingAiReview(true);
        const aiGeneratedSummary = await generateWeeklyAiReport(
            currentReview.weekStartDate,
            allTimeLogs,
            allJournalEntries,
            allHabits,
            allScheduledGoals,
            allWeeklyPlans
        );
        setCurrentReview(prev => ({...prev, aiSummary: aiGeneratedSummary}));
        const reviewToUpdate: WeeklyReviewData = {
            id: currentReview.id || currentReview.weekStartDate || Date.now().toString(),
            weekStartDate: currentReview.weekStartDate,
            wins: currentReview.wins || '',
            losses: currentReview.losses || '',
            distractionSummary: currentReview.distractionSummary || '',
            disciplineRating: currentReview.disciplineRating || 3,
            aiSummary: aiGeneratedSummary,
        };
        const existingIndex = reviews.findIndex(r => r.id === reviewToUpdate.id || r.weekStartDate === reviewToUpdate.weekStartDate);
        if (existingIndex > -1) {
            const updatedReviews = [...reviews];
            updatedReviews[existingIndex] = reviewToUpdate;
            setReviews(updatedReviews);
        } else {
            setReviews([...reviews, reviewToUpdate]);
        }
        setIsGeneratingAiReview(false);
    };
    
    const getWeekDisplay = (dateStr: string) => {
        const start = parseISO(dateStr);
        const end = addDays(start, 6);
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    };

    const sortedReviews = [...reviews].sort((a,b) => parseISO(b.weekStartDate).getTime() - parseISO(a.weekStartDate).getTime());

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">{t('pageTitleReview')}</h1>
        <Button onClick={() => openReviewModal()} leftIcon={<Icons.PlusCircle className="w-4 h-4 sm:w-5 sm:h-5"/>} size="sm" translationKey="reviewNewButton"/>
      </div>
      
      {sortedReviews.length === 0 && <Card><p className="text-sm sm:text-base">{t('reviewNoReviews')}</p></Card>}

      <div className="space-y-3 sm:space-y-4">
        {sortedReviews.map(review => (
            <Card key={review.id} title={`${t('reviewCardTitlePrefix')} ${getWeekDisplay(review.weekStartDate)}`} titleClassName="text-base sm:text-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-textlight dark:text-textdark">{t('reviewWinsLabel')}</h4>
                        <p className="text-sm whitespace-pre-wrap text-textlight-muted dark:text-textdark-muted">{review.wins || t('loading')}</p>
                        <h4 className="font-semibold text-textlight dark:text-textdark mt-2">{t('reviewLossesLabel')}</h4>
                        <p className="text-sm whitespace-pre-wrap text-textlight-muted dark:text-textdark-muted">{review.losses || t('loading')}</p>
                        <h4 className="font-semibold text-textlight dark:text-textdark mt-2">{t('reviewDistractionSummaryLabelManual')}</h4>
                        <p className="text-sm whitespace-pre-wrap text-textlight-muted dark:text-textdark-muted">{review.distractionSummary || t('loading')}</p>
                        <div className="mt-2 flex items-center">
                            <h4 className="font-semibold text-textlight dark:text-textdark mr-2">{t('reviewDisciplineRatingLabel')}</h4>
                            <StarRating count={5} value={review.disciplineRating} onChange={()=>{}} size={16}/> 
                            <span className="ml-1 text-sm">({review.disciplineRating}/5)</span>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-textlight dark:text-textdark">{t('reviewAiGeneratedSummaryLabel')}</h4>
                        {isGeneratingAiReview && review.weekStartDate === currentReview.weekStartDate && <LoadingSpinner />}
                        {!isGeneratingAiReview && review.aiSummary && <p className="text-sm whitespace-pre-wrap text-textlight-muted dark:text-textdark-muted">{review.aiSummary}</p>}
                        {!isGeneratingAiReview && !review.aiSummary && <p className="text-sm text-textlight-muted dark:text-textdark-muted">{t('reviewNoAiSummary')}</p>}
                         {!review.aiSummary && !isGeneratingAiReview &&
                            <Button 
                                onClick={() => {
                                    // Ensure currentReview is set for this specific review before generating
                                    setCurrentReview(review);
                                    setSelectedWeekStart(review.weekStartDate); // Important for context
                                    handleGenerateFullAiReview();
                                }} 
                                variant="secondary" size="sm" className="mt-2" 
                                translationKey="reviewGenerateAiButton"
                                disabled={isGeneratingAiReview}
                            />
                        }
                         {review.aiSummary && !isGeneratingAiReview &&
                            <Button 
                                onClick={() => {
                                    setCurrentReview(review);
                                    setSelectedWeekStart(review.weekStartDate);
                                    handleGenerateFullAiReview();
                                }} 
                                variant="ghost" size="sm" className="mt-2" 
                                translationKey="reviewRegenerateAiButton"
                                disabled={isGeneratingAiReview}
                            />
                        }
                    </div>
                </div>
                <Button onClick={() => openReviewModal(review.weekStartDate)} variant="secondary" size="sm" className="mt-4" translationKey="reviewEditManualButton"/>
            </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${t('reviewModalTitlePrefix')} ${getWeekDisplay(selectedWeekStart)}`} size="lg">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">{t('reviewModalWinsLabel')}</label>
            <textarea value={currentReview.wins || ''} onChange={e => setCurrentReview(prev => ({ ...prev, wins: e.target.value }))} className="w-full p-2 border rounded min-h-[80px] bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('reviewModalLossesLabel')}</label>
            <textarea value={currentReview.losses || ''} onChange={e => setCurrentReview(prev => ({ ...prev, losses: e.target.value }))} className="w-full p-2 border rounded min-h-[80px] bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('reviewModalDistractionSummaryLabel')}</label>
            <textarea value={currentReview.distractionSummary || ''} onChange={e => setCurrentReview(prev => ({ ...prev, distractionSummary: e.target.value }))} className="w-full p-2 border rounded min-h-[80px] bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark"/>
            <Button onClick={generateAIDistractionSummary} variant="ghost" size="sm" className="mt-1" disabled={isGeneratingSummary} translationKey="reviewModalAiDistractionButton">
              {isGeneratingSummary && <LoadingSpinner size="w-4 h-4 mr-2"/>}
            </Button>
          </div>
           <div>
            <label className="block text-sm font-medium mb-1">{t('reviewModalDisciplineRatingLabel')}</label>
            <StarRating count={5} value={currentReview.disciplineRating || 3} onChange={val => setCurrentReview(prev => ({ ...prev, disciplineRating: val }))} />
          </div>

          {currentReview.weekStartDate && (
            <div>
              <h4 className="font-semibold text-textlight dark:text-textdark mt-3 mb-1">{t('reviewAiGeneratedSummaryLabel')}</h4>
              {isGeneratingAiReview && <LoadingSpinner />}
              {!isGeneratingAiReview && currentReview.aiSummary && <p className="text-sm whitespace-pre-wrap bg-bglight-muted dark:bg-bgdark-muted p-2 rounded">{currentReview.aiSummary}</p>}
              {!isGeneratingAiReview && !currentReview.aiSummary && <p className="text-sm text-textlight-muted dark:text-textdark-muted">{t('reviewNoAiSummary')}</p>}
              <Button 
                onClick={handleGenerateFullAiReview} 
                variant={currentReview.aiSummary ? "ghost" : "secondary"} 
                size="sm" 
                className="mt-2" 
                disabled={isGeneratingAiReview}
                translationKey={currentReview.aiSummary ? "reviewRegenerateAiButton" : "reviewGenerateAiButton"}
              />
            </div>
          )}
          <Button onClick={handleSaveReview} variant="primary" className="w-full mt-4" translationKey="reviewModalSaveButton"/>
        </div>
      </Modal>
    </div>
  );
};


// --- Plans Page ---
export const PlansPage: React.FC = () => {
  const { t } = useLanguageContext();
  const [weeklyPlans, setWeeklyPlans] = useLocalStorage<WeeklyPlan[]>(STORAGE_KEYS.WEEKLY_PLANS, []);
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<WeeklyPlan> & { tasksInput?: string[] }>({});
  const [selectedWeekStart, setSelectedWeekStart] = useState(format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));

  const openPlanModal = (weekStart?: string) => {
    const targetWeekStart = weekStart || selectedWeekStart;
    const existingPlan = weeklyPlans.find(p => p.weekStartDate === targetWeekStart);
    if (existingPlan) {
      setCurrentPlan({ 
        ...existingPlan, 
        tasksInput: existingPlan.majorTasks.map(task => task.text) 
      });
    } else {
      setCurrentPlan({ 
        weekStartDate: targetWeekStart, 
        mainGoal: '', 
        majorTasks: [], 
        tasksInput: [''] 
      });
    }
    setSelectedWeekStart(targetWeekStart);
    setShowModal(true);
  };

  const handleSavePlan = () => {
    if (!currentPlan.weekStartDate || !currentPlan.mainGoal?.trim()) return;

    const planToSave: WeeklyPlan = {
      id: currentPlan.id || currentPlan.weekStartDate || Date.now().toString(),
      weekStartDate: currentPlan.weekStartDate,
      mainGoal: currentPlan.mainGoal.trim(),
      majorTasks: (currentPlan.tasksInput || [])
        .map((text, index) => ({
          id: currentPlan.majorTasks?.[index]?.id || `${Date.now()}_${index}`,
          text: text.trim(),
          completed: currentPlan.majorTasks?.[index]?.completed || false,
        }))
        .filter(task => task.text !== ''),
    };

    const existingIndex = weeklyPlans.findIndex(p => p.id === planToSave.id || p.weekStartDate === planToSave.weekStartDate);
    if (existingIndex > -1) {
      const updatedPlans = [...weeklyPlans];
      updatedPlans[existingIndex] = planToSave;
      setWeeklyPlans(updatedPlans);
    } else {
      setWeeklyPlans([...weeklyPlans, planToSave]);
    }
    setShowModal(false);
  };
  
  const handleTaskInputChange = (index: number, value: string) => {
    const newTasksInput = [...(currentPlan.tasksInput || [])];
    newTasksInput[index] = value;
    setCurrentPlan(prev => ({ ...prev, tasksInput: newTasksInput }));
  };

  const addMoreTaskInput = () => {
    setCurrentPlan(prev => ({ ...prev, tasksInput: [...(prev.tasksInput || []), ''] }));
  };

  const removeTaskInput = (index: number) => {
    const newTasksInput = [...(currentPlan.tasksInput || [])];
    if (newTasksInput.length > 1) { // Prevent removing the last input field
        newTasksInput.splice(index, 1);
        setCurrentPlan(prev => ({...prev, tasksInput: newTasksInput}));
    } else if (newTasksInput.length === 1) { // Clear the last input field if it's the only one
        newTasksInput[0] = '';
        setCurrentPlan(prev => ({...prev, tasksInput: newTasksInput}));
    }
  };

  const toggleTaskCompletion = (planId: string, taskId: string) => {
    setWeeklyPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          majorTasks: plan.majorTasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return plan;
    }));
  };
  
  const getWeekDisplay = (dateStr: string) => {
    const start = parseISO(dateStr);
    const end = addDays(start, 6);
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  const currentActualPlan = weeklyPlans.find(p => p.weekStartDate === selectedWeekStart);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">{t('pageTitlePlans')}</h1>
        <div className="flex items-center space-x-2">
            <input 
                type="week" 
                value={`${format(parseISO(selectedWeekStart), 'yyyy')}-W${format(parseISO(selectedWeekStart), 'II')}`} // Use 'II' for ISO week
                onChange={(e) => {
                    const [year, weekNumISO] = e.target.value.split('-W');
                    const weekNum = parseInt(weekNumISO);
                    if (isNaN(weekNum) || weekNum < 1 || weekNum > 53) return;

                    // Calculate the date for the start of this ISO week (Monday)
                    // The first week of the year is the week with the first Thursday of that year.
                    // Or, the week with January 4th in it.
                    let jan4 = new Date(parseInt(year), 0, 4);
                    let dayOfWeekJan4 = getDay(jan4); // 0 (Sun) to 6 (Sat)
                    if (dayOfWeekJan4 === 0) dayOfWeekJan4 = 7; // Adjust Sunday to be 7 for ISO week

                    // Days to Monday of week 1
                    let daysToMondayOfWeek1 = 1 - dayOfWeekJan4; 
                    if (dayOfWeekJan4 > 4) { // If Jan 4th is Fri, Sat, Sun, then week 1 starts next Mon
                         daysToMondayOfWeek1 += 7;
                    }
                    
                    let firstMonday = addDays(jan4, daysToMondayOfWeek1);
                    let targetMonday = addDays(firstMonday, (weekNum - 1) * 7);
                    
                    setSelectedWeekStart(format(targetMonday, 'yyyy-MM-dd'));
                }}
                className="p-1.5 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm"
            />
            <Button onClick={() => openPlanModal()} leftIcon={<Icons.PlusCircle className="w-4 h-4 sm:w-5 sm:h-5"/>} size="sm" translationKey="plansNewButton"/>
        </div>
      </div>

      {currentActualPlan ? (
        <Card title={`${t('plansCardTitlePrefix')} ${getWeekDisplay(currentActualPlan.weekStartDate)}`} icon={<Icons.Flag />}>
          <div className="mb-3">
            <h4 className="font-semibold text-textlight dark:text-textdark">{t('plansMainGoalLabel')}</h4>
            <p className="text-textlight-muted dark:text-textdark-muted whitespace-pre-wrap">{currentActualPlan.mainGoal}</p>
          </div>
          <div>
            <h4 className="font-semibold text-textlight dark:text-textdark">{t('plansMajorTasksLabel')}</h4>
            {currentActualPlan.majorTasks.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 mt-1">
                {currentActualPlan.majorTasks.map(task => (
                  <li key={task.id} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleTaskCompletion(currentActualPlan.id, task.id)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className={`${task.completed ? 'line-through text-textlight-muted dark:text-textdark-muted' : ''}`}>{task.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-textlight-muted dark:text-textdark-muted text-sm">{t('plansNoMajorTasks')}</p>
            )}
          </div>
          <Button onClick={() => openPlanModal(currentActualPlan.weekStartDate)} variant="secondary" size="sm" className="mt-4" translationKey="plansEditButton"/>
        </Card>
      ) : (
         <Card>
            <p className="text-textlight-muted dark:text-textdark-muted">{t('plansNoPlans')} {t('reviewModalSelectWeekLabel')} {getWeekDisplay(selectedWeekStart)}.</p>
            <Button onClick={() => openPlanModal()} leftIcon={<Icons.PlusCircle className="w-4 h-4"/>} size="sm" className="mt-2" translationKey="plansNewButton"/>
        </Card>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${t('plansModalTitlePrefix')} ${getWeekDisplay(selectedWeekStart)}`} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('plansModalMainGoalLabel')}</label>
            <textarea
              value={currentPlan.mainGoal || ''}
              onChange={e => setCurrentPlan(prev => ({ ...prev, mainGoal: e.target.value }))}
              placeholder={t('plansModalMainGoalPlaceholder')}
              className="w-full p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark min-h-[60px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('plansModalMajorTasksLabel')}</label>
            {(currentPlan.tasksInput || []).map((taskText, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={taskText}
                  onChange={e => handleTaskInputChange(index, e.target.value)}
                  placeholder={t('plansModalNewTaskPlaceholder')}
                  className="flex-grow p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark"
                />
                <Button onClick={() => removeTaskInput(index)} variant="danger" size="sm" isRound>
                    <Icons.Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addMoreTaskInput} variant="ghost" size="sm" leftIcon={<Icons.PlusCircle className="w-4 h-4"/>} translationKey="plansModalAddTaskButton"/>
          </div>
          <Button onClick={handleSavePlan} variant="primary" className="w-full" translationKey="plansModalSaveButton"/>
        </div>
      </Modal>
    </div>
  );
};


// --- DisciplineBoard Page ---
export const DisciplineBoardPage: React.FC = () => {
  const { t } = useLanguageContext();
  const [habits, setHabits] = useLocalStorage<Habit[]>(STORAGE_KEYS.HABITS, []);
  const [showModal, setShowModal] = useState(false);
  const [currentHabit, setCurrentHabit] = useState<Partial<Habit>>({});
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);

  const daysOfWeek = [
    { key: 'daySun', value: 0 }, { key: 'dayMon', value: 1 }, { key: 'dayTue', value: 2 },
    { key: 'dayWed', value: 3 }, { key: 'dayThu', value: 4 }, { key: 'dayFri', value: 5 },
    { key: 'daySat', value: 6 }
  ];

  const openHabitModal = (habit?: Habit) => {
    if (habit) {
      setCurrentHabit(habit);
      setEditingHabitId(habit.id);
    } else {
      setCurrentHabit({ name: '', streak: 0, consequence: '', targetDays: [] });
      setEditingHabitId(null);
    }
    setShowModal(true);
  };

  const handleSaveHabit = () => {
    if (!currentHabit.name?.trim()) return;

    const habitToSave: Habit = {
      id: editingHabitId || Date.now().toString(),
      name: currentHabit.name.trim(),
      streak: Number(currentHabit.streak) || 0,
      lastCompletedDate: currentHabit.lastCompletedDate || null,
      consequence: currentHabit.consequence?.trim() || '',
      targetDays: currentHabit.targetDays || [],
    };

    if (editingHabitId) {
      setHabits(habits.map(h => h.id === editingHabitId ? habitToSave : h));
    } else {
      setHabits([...habits, habitToSave]);
    }
    setShowModal(false);
  };

  const handleDeleteHabit = (id: string) => {
    if (window.confirm(t('deleteConfirmation'))) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const toggleHabitCompletion = (id: string) => {
    const todayStr = getTodayDateString();
    setHabits(habits.map(h => {
      if (h.id === id) {
        if (h.lastCompletedDate === todayStr) { 
          return { ...h, streak: Math.max(0, h.streak -1) , lastCompletedDate: null }; 
        } else { 
          let newStreak = 1;
          if (h.lastCompletedDate) {
            const diff = differenceInDays(parseISO(todayStr), parseISO(h.lastCompletedDate));
            if (diff === 1) { // Completed yesterday
              newStreak = h.streak + 1;
            }
          }
          return { ...h, streak: newStreak, lastCompletedDate: todayStr };
        }
      }
      return h;
    }));
  };

  const resetHabitStreak = (id: string) => {
    if (window.confirm(t('disciplineResetStreakConfirm'))) {
      setHabits(habits.map(h => h.id === id ? { ...h, streak: 0, lastCompletedDate: null } : h));
    }
  };
  
  const handleTargetDayChange = (dayValue: number) => {
    const currentTargetDays = currentHabit.targetDays || [];
    if (currentTargetDays.includes(dayValue)) {
      setCurrentHabit(prev => ({ ...prev, targetDays: currentTargetDays.filter(d => d !== dayValue) }));
    } else {
      setCurrentHabit(prev => ({ ...prev, targetDays: [...currentTargetDays, dayValue] }));
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">{t('pageTitleDisciplineBoard')}</h1>
        <Button onClick={() => openHabitModal()} leftIcon={<Icons.PlusCircle className="w-4 h-4 sm:w-5 sm:h-5"/>} size="sm" translationKey="disciplineAddHabitButton"/>
      </div>

      {habits.length === 0 && <Card><p className="text-sm sm:text-base">{t('disciplineNoHabits')}</p></Card>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {habits.map(habit => {
          const todayDay = getDay(new Date());
          const isTargetToday = !habit.targetDays || habit.targetDays.length === 0 || habit.targetDays.includes(todayDay);
          const isCompletedToday = habit.lastCompletedDate === getTodayDateString();
          return (
            <Card key={habit.id} title={habit.name} icon={<Icons.ShieldCheck />}>
              <p className="text-sm text-textlight-muted dark:text-textdark-muted">{t('disciplineStreakText', { streakCount: habit.streak })}</p>
              {habit.lastCompletedDate && <p className="text-xs text-textlight-muted dark:text-textdark-muted">{t('disciplineLastCompletedLabel', { date: format(parseISO(habit.lastCompletedDate), 'PP') })}</p>}
              {habit.consequence && <p className="text-xs text-textlight-muted dark:text-textdark-muted mt-1"><span className="font-semibold">{t('disciplineConsequencePrefix')}</span> {habit.consequence}</p>}
              {habit.targetDays && habit.targetDays.length > 0 && 
                <p className="text-xs text-textlight-muted dark:text-textdark-muted mt-1">{t('disciplineTargetDaysLabel', { days: habit.targetDays.map(dVal => t(daysOfWeek.find(d=>d.value===dVal)?.key || '')).join(', ') })}
                {isTargetToday && <span className="text-green-500 font-semibold ml-1">{t('disciplineTargetTodaySuffix')}</span>}
                </p>
              }

              <div className="mt-3 space-y-2">
                {isTargetToday ? (
                  isCompletedToday ? (
                    <Button onClick={() => toggleHabitCompletion(habit.id)} variant="secondary" leftIcon={<Icons.CheckCircle className="text-green-500 w-4 h-4"/>} className="w-full text-sm" translationKey="disciplineCompletedTodayButton"/>
                  ) : (
                    <Button onClick={() => toggleHabitCompletion(habit.id)} variant="primary" className="w-full text-sm" translationKey="disciplineMarkDoneButton"/>
                  )
                ) : (
                  <Button variant="ghost" disabled className="w-full text-sm italic" translationKey="disciplineNotTargetDayButton"/>
                )}
                <div className="flex space-x-2">
                    <Button onClick={() => openHabitModal(habit)} variant="ghost" size="sm" className="flex-1" translationKey="disciplineEditButton"/>
                    <Button onClick={() => resetHabitStreak(habit.id)} variant="ghost" size="sm" className="flex-1 text-orange-500 hover:bg-orange-500/10" translationKey="disciplineResetButton"/>
                    <Button onClick={() => handleDeleteHabit(habit.id)} variant="ghost" size="sm" className="flex-1 text-red-500 hover:bg-red-500/10" translationKey="disciplineDeleteButton"/>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingHabitId ? t('disciplineModalTitleEdit') : t('disciplineModalTitleAdd')}
        size="md"
      >
        <div className="space-y-3">
          <input
            type="text"
            placeholder={t('disciplineModalPlaceholderName')}
            value={currentHabit.name || ''}
            onChange={e => setCurrentHabit(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm"
          />
          <input
            type="number"
            placeholder={t('disciplineModalPlaceholderStreak')}
            value={currentHabit.streak || 0}
            min="0"
            onChange={e => setCurrentHabit(prev => ({ ...prev, streak: parseInt(e.target.value) || 0 }))}
            className="w-full p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm"
          />
          <textarea
            placeholder={t('disciplineModalPlaceholderConsequence')}
            value={currentHabit.consequence || ''}
            onChange={e => setCurrentHabit(prev => ({ ...prev, consequence: e.target.value }))}
            className="w-full p-2 border rounded bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark text-sm min-h-[60px]"
          />
          <div>
            <label className="block text-sm font-medium mb-1">{t('disciplineModalTargetDaysLabel')}</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {daysOfWeek.map(day => (
                    <label key={day.value} className="flex items-center space-x-1.5 p-1.5 border rounded-md hover:bg-bglight-muted dark:hover:bg-bgdark-muted text-xs cursor-pointer">
                        <input 
                            type="checkbox"
                            checked={currentHabit.targetDays?.includes(day.value) || false}
                            onChange={() => handleTargetDayChange(day.value)}
                            className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{t(day.key)}</span>
                    </label>
                ))}
            </div>
             <p className="text-xs text-textlight-muted dark:text-textdark-muted mt-1">{t('helpDisciplineTip')}</p>
          </div>
          <Button onClick={handleSaveHabit} variant="primary" className="w-full" size="sm" translationKey={editingHabitId ? "disciplineModalSaveButton" : "disciplineModalAddButton"}/>
        </div>
      </Modal>
    </div>
  );
};


// --- ImportExportPage ---
export const ImportExportPage: React.FC = () => {
    const { t, language } = useLanguageContext(); // language needed for default quote if appName is a key
    const navigate = useNavigate();

    // Data hooks for export
    const [weeklyPlans] = useLocalStorage<WeeklyPlan[]>(STORAGE_KEYS.WEEKLY_PLANS, []);
    const [habits] = useLocalStorage<Habit[]>(STORAGE_KEYS.HABITS, []);
    const [scheduledGoals] = useLocalStorage<ScheduledGoal[]>(STORAGE_KEYS.SCHEDULED_GOALS, []);
    const [weeklyMission] = useLocalStorage<WeeklyMission | null>(STORAGE_KEYS.WEEKLY_MISSION, null);

    const handleExport = () => {
        const templateData: FocusForgeTemplateData = {
            weeklyPlans,
            habits,
            scheduledGoals,
            weeklyMission,
        };
        const template: FocusForgeTemplate = {
            templateVersion: "1.0",
            appName: t(APP_NAME_TRANSLATION_KEY), // Use translated app name
            exportedDate: new Date().toISOString(),
            data: templateData,
        };

        try {
            const jsonString = JSON.stringify(template, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = `focus_forge_template_${format(new Date(), 'yyyyMMdd_HHmm')}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
            alert(t('exportSuccess'));
        } catch (error) {
            console.error("Error exporting template:", error);
            alert(t('exportError'));
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            alert(t('importExportNoFileSelected'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const parsedTemplate: FocusForgeTemplate = JSON.parse(text);

                // Basic validation
                if (parsedTemplate.appName !== t(APP_NAME_TRANSLATION_KEY) && parsedTemplate.appName !== translations.en[APP_NAME_TRANSLATION_KEY] && parsedTemplate.appName !== translations.am[APP_NAME_TRANSLATION_KEY]) {
                    // Check against current and default English/Amharic app names if appName itself was exported as a string.
                   // More robust would be to use a non-translated app identifier.
                    throw new Error("Incompatible app name in template.");
                }
                if (!parsedTemplate.data || typeof parsedTemplate.data !== 'object') {
                    throw new Error("Invalid template data structure.");
                }
                
                // Confirm before overwriting
                const dataTypesToOverwrite = Object.keys(parsedTemplate.data).join(', ');
                if (window.confirm(t('importWarning', { dataType: dataTypesToOverwrite }))) {
                    if(parsedTemplate.data.weeklyPlans) saveData(STORAGE_KEYS.WEEKLY_PLANS, parsedTemplate.data.weeklyPlans);
                    if(parsedTemplate.data.habits) saveData(STORAGE_KEYS.HABITS, parsedTemplate.data.habits);
                    if(parsedTemplate.data.scheduledGoals) saveData(STORAGE_KEYS.SCHEDULED_GOALS, parsedTemplate.data.scheduledGoals);
                    if(parsedTemplate.data.weeklyMission !== undefined) saveData(STORAGE_KEYS.WEEKLY_MISSION, parsedTemplate.data.weeklyMission); // Allow null
                    
                    alert(t('importSuccess'));
                    navigate('/'); // Navigate to dashboard to reflect changes
                } else {
                    alert(t('importCancelled'));
                }

            } catch (error) {
                console.error("Error importing template:", error);
                alert(t('importErrorGeneral') + ` (${(error as Error).message})`);
            } finally {
                event.target.value = ''; // Reset file input
            }
        };
        reader.readAsText(file);
    };

    const applyStarterTemplate = (templateData: FocusForgeTemplateData) => {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const dynamicData: FocusForgeTemplateData = {
            ...templateData,
            weeklyMission: templateData.weeklyMission 
                ? { ...templateData.weeklyMission, deadline: addDays(new Date(), 7).toISOString() } 
                : null,
            scheduledGoals: templateData.scheduledGoals.map(goal => {
                let goalDate = parseISO(goal.date); // Assume 'DYNAMIC_MONDAY' etc. are not ISO
                if (goal.date === "DYNAMIC_MONDAY") goalDate = weekStart;
                else if (goal.date === "DYNAMIC_TUESDAY") goalDate = addDays(weekStart, 1);
                else if (goal.date === "DYNAMIC_WEDNESDAY") goalDate = addDays(weekStart, 2);
                else if (goal.date === "DYNAMIC_THURSDAY") goalDate = addDays(weekStart, 3);
                else if (goal.date === "DYNAMIC_FRIDAY") goalDate = addDays(weekStart, 4);
                // Add more days if needed
                return { ...goal, date: format(goalDate, 'yyyy-MM-dd') };
            }),
            weeklyPlans: templateData.weeklyPlans.map(plan => ({
                ...plan,
                weekStartDate: format(weekStart, 'yyyy-MM-dd') // Assume only one plan, for current week
            })),
        };
        
        // Translate relevant fields if they were stored as keys
        // For brevity, assuming names/titles in ENTREPRENEUR_STARTER_TEMPLATE_DATA are already in English
        // A more robust solution would store keys and translate them here.

        const templateName = t('entrepreneurTemplateName');
        if (window.confirm(t('importWarning', { dataType: "Weekly Plans, Habits, Scheduled Goals, and Weekly Mission" }) + `\n\nApply '${templateName}' template?`)) {
            saveData(STORAGE_KEYS.WEEKLY_PLANS, dynamicData.weeklyPlans);
            saveData(STORAGE_KEYS.HABITS, dynamicData.habits);
            saveData(STORAGE_KEYS.SCHEDULED_GOALS, dynamicData.scheduledGoals);
            saveData(STORAGE_KEYS.WEEKLY_MISSION, dynamicData.weeklyMission);
            alert(t('starterTemplateApplySuccess', {templateName}));
            navigate('/');
        } else {
            alert(t('starterTemplateApplyCancelled'));
        }
    };


    return (
        <div className="p-4 sm:p-6 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold">{t('pageTitleImportExport')}</h1>

            <Card title={t('importExportExportTitle')} icon={<Icons.ArrowDownTray />}>
                <p className="text-sm text-textlight-muted dark:text-textdark-muted mb-3">{t('importExportExportDescription')}</p>
                <Button onClick={handleExport} translationKey="importExportExportButton" />
            </Card>

            <Card title={t('importExportImportTitle')} icon={<Icons.ArrowUpTray />}>
                <p className="text-sm text-textlight-muted dark:text-textdark-muted mb-3" dangerouslySetInnerHTML={{ __html: t('importExportImportDescription') }} />
                <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="block w-full text-sm text-textlight-muted dark:text-textdark-muted
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-primary/10 file:text-primary
                               hover:file:bg-primary/20"
                    aria-label={t('importExportImportPlaceholderFile')}
                />
                 <p className="text-xs text-textlight-muted dark:text-textdark-muted mt-2">{t('importExportImportGuidance')}</p>
            </Card>

            <Card title={t('importExportStarterTemplatesTitle')} icon={<Icons.Sparkles />}>
                 <p className="text-sm text-textlight-muted dark:text-textdark-muted mb-3" dangerouslySetInnerHTML={{ __html: t('importExportStarterTemplatesDescription') }} />
                 <Button 
                    onClick={() => applyStarterTemplate(ENTREPRENEUR_STARTER_TEMPLATE_DATA)} 
                    variant="secondary"
                    translationKey="importExportApplyEntrepreneurButton"
                 />
            </Card>
        </div>
    );
};

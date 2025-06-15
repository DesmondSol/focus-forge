
import { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // App Wide
    appName: "Focus Forge",
    defaultMotivationalQuote: "The secret of getting ahead is getting started.",
    errorApiKeyNotConfigured: "Gemini API key not configured. AI features will be limited.",
    errorAiGeneral: "Could not retrieve data from AI. Please try again later.",
    errorAiChatResponse: "I'm having a bit of trouble responding right now. Please try again.",
    errorAiReviewGeneration: "Could not generate AI review for this week.",
    loading: "Loading...",
    confirmAction: "Are you sure?",
    deleteConfirmation: "Are you sure you want to delete this item? This action cannot be undone.",
    importWarning: "Importing this template will REPLACE your current {dataType} with the data from this file.\n\nThis action cannot be undone.\n\nAre you sure you want to proceed?",
    importSuccess: "Template imported successfully! Your data has been updated.",
    importCancelled: "Import cancelled by user.",
    importErrorInvalidFile: "Invalid or incompatible template file.",
    importErrorGeneral: "Error importing template. File might be corrupted or not a valid template.",
    exportSuccess: "Template exported successfully!",
    exportError: "Error exporting template.",
    starterTemplateApplySuccess: "'{templateName}' template applied successfully! Your data has been updated.",
    starterTemplateApplyCancelled: "Starter template application cancelled.",


    // Onboarding
    onboardingWelcomeTitle: "Welcome to Focus Forge!",
    onboardingWelcomeText: "Your personal command center for peak productivity and well-being. Let's get you set up.",
    onboardingFeaturesTitle: "Key Features",
    onboardingFeature1Title: "Unified Dashboard",
    onboardingFeature1Text: "See your top task, focus timer, mood, notes, and mission all in one place.",
    onboardingFeature2Title: "Plan & Track",
    onboardingFeature2Text: "Manage weekly plans, daily goals, habits, and track your time effectively.",
    onboardingFeature3Title: "Reflect & Grow",
    onboardingFeature3Text: "Use the notebook for journaling and review your progress weekly with AI insights.",
    onboardingFeature4Title: "Discipline & Focus",
    onboardingFeature4Text: "Build habits with the discipline board and stay focused with the Pomodoro timer.",
    onboardingLanguageTitle: "Choose Your Language",
    onboardingLanguageText: "Select your preferred language for the app interface.",
    onboardingButtonNext: "Next",
    onboardingButtonPrevious: "Previous",
    onboardingButtonFinish: "Get Started", // Implicitly by choosing language

    // Languages
    languageEnglish: "English",
    languageAmharic: "Amharic",
    languageLabelEN: "EN",
    languageLabelAM: "አማ",

    // Sidebar & Mobile Header
    sidebarNavDashboard: "Dashboard",
    sidebarNavCalendar: "Calendar",
    sidebarNavNotebook: "Notebook",
    sidebarNavTimeTracker: "Time Tracker",
    sidebarNavReview: "Review",
    sidebarNavPlans: "Plans",
    sidebarNavDiscipline: "Discipline",
    sidebarNavImportExport: "Import/Export",
    
    // Page Titles (used in <h1>)
    pageTitleDashboard: "Dashboard",
    pageTitleCalendar: "Calendar",
    pageTitleNotebook: "Notebook",
    pageTitleTimeTracker: "Time Tracker",
    pageTitleReview: "Weekly Review",
    pageTitlePlans: "Weekly Plans",
    pageTitleDisciplineBoard: "Discipline Board",
    pageTitleImportExport: "Import/Export Templates",

    // Dashboard Page
    dashboardTopTaskTitle: "Today's Top Task",
    dashboardTopTaskPlaceholder: "What's your ONE thing today?",
    dashboardDailyWisdomTitle: "Daily Wisdom",
    dashboardFocusTimerTitle: "Focus Timer",
    dashboardMoodEnergyTitle: "Mood & Energy",
    dashboardLogMoodButton: "Log Today's Mood & Energy",
    dashboardMoodLoggedText: "Logged for today:",
    dashboardQuickNoteTitle: "Quick Note / Idea Dump",
    dashboardQuickNotePlaceholder: "Jot down a quick thought or idea...",
    dashboardSaveToNotebookButton: "Save to Notebook",
    dashboardWeeklyMissionTitle: "This Week's Mission",
    dashboardWeeklyMissionPlaceholder: "Define your mission for this week...",
    dashboardMissionCountdownLabel: "Countdown:",
    dashboardMissionDeadlineLabel: "Deadline:",
    dashboardCalculating: "Calculating...",
    dashboardMissionEnded: "Mission Ended!",
    dashboardPomodorosCompleted: "Pomodoros completed: {count}",
    dashboardReminderSetPriority: "Reminder: It's past 9 AM! Have you set your ONE priority task for today?",
    dashboardBreakInvitation: "Focus time ended! Time for a {breakType}.",


    // Calendar Page
    calendarAddEventButton: "Add Event",
    calendarPreviousWeekButton: "Prev",
    calendarNextWeekButton: "Next",
    calendarWeekDisplay: "Week {weekNumber}", // Example: "MMM yyyy - Week w" format from date-fns
    calendarModalTitleAdd: "Add New Event",
    calendarModalTitleEdit: "Edit Event",
    calendarModalPlaceholderTitle: "Title",
    calendarModalCheckboxGoal: "Mark as Key Goal",
    calendarModalSaveButton: "Save Changes",
    calendarModalAddButton: "Add Event",
    calendarModalDeleteButton: "Delete",
    calendarEventGoalLabel: "GOAL",
    calendarButtonAddForDay: "Add",


    // Notebook Page
    notebookNewEntryTitle: "New Journal Entry",
    notebookEditEntryTitle: "Edit Entry",
    notebookEntryPlaceholder: "Write your thoughts, reflections, or daily summary...",
    notebookAddButton: "Add Entry",
    notebookUpdateButton: "Update Entry",
    notebookCancelEditButton: "Cancel Edit",
    notebookEntriesTitle: "Entries",
    notebookSearchPlaceholder: "Search entries...",
    notebookNoEntriesFound: "No entries found.",
    notebookEditEntryButton: "Edit",
    notebookDeleteEntryButton: "Delete",

    // Time Tracker Page
    timeTrackerLogActivityButton: "Log Activity",
    timeTrackerNoLogs: "No time logs yet. Start a Pomodoro session or add manually!",
    timeTrackerActivityTypeFocus: "Focus",
    timeTrackerActivityTypeBreak: "Break",
    timeTrackerActivityTypeDistraction: "Distraction",
    timeTrackerModalTitleNew: "Log New Activity",
    timeTrackerModalTitleEdit: "Edit Time Log",
    timeTrackerModalPlaceholderActivity: "Activity (e.g., Work on Project X)",
    timeTrackerModalLabelStartTime: "Start Time",
    timeTrackerModalLabelEndTime: "End Time",
    timeTrackerModalAddButton: "Add Log",
    timeTrackerModalUpdateButton: "Update Log",
    timeTrackerErrorEndTimeBeforeStart: "End time must be after start time.",

    // Review Page
    reviewNewButton: "New Weekly Review",
    reviewNoReviews: "No weekly reviews yet. Time to reflect!",
    reviewCardTitlePrefix: "Review:", // "Review: Oct 26 - Nov 1, 2023"
    reviewWinsLabel: "Wins:",
    reviewLossesLabel: "Losses/Challenges:",
    reviewDistractionSummaryLabelManual: "Distraction Report/Summary (Manual):",
    reviewDisciplineRatingLabel: "Discipline Rating:",
    reviewAiGeneratedSummaryLabel: "AI Generated Weekly Review:",
    reviewNoAiSummary: "No AI review generated for this week yet.",
    reviewEditManualButton: "Edit Manual Review",
    reviewGenerateAiButton: "Generate AI Review",
    reviewRegenerateAiButton: "Regenerate AI Review",
    reviewModalTitlePrefix: "Review:",
    reviewModalSelectWeekLabel: "Select Week (starts Monday):",
    reviewModalWinsLabel: "Wins this week:",
    reviewModalLossesLabel: "Losses/Challenges this week:",
    reviewModalDistractionSummaryLabel: "Distraction Summary / Key Learnings (Manual):",
    reviewModalAiDistractionButton: "AI Summary (Distractions)",
    reviewModalNoDataForAiSummary: "No specific distraction data or journal entries for AI summary this week.",
    reviewModalDisciplineRatingLabel: "Discipline Rating (1-5):",
    reviewModalSaveButton: "Save Review",


    // Plans Page
    plansNewButton: "New Weekly Plan",
    plansNoPlans: "No weekly plans yet. Start planning your success!",
    plansCardTitlePrefix: "Plan:", // "Plan: Oct 26 - Nov 1, 2023"
    plansMainGoalLabel: "Main Goal:",
    plansMajorTasksLabel: "Major Tasks:",
    plansNoMajorTasks: "No major tasks defined.",
    plansEditButton: "Edit Plan",
    plansModalTitlePrefix: "Plan:",
    plansModalSelectWeekLabel: "Select Week (starts Monday):",
    plansModalMainGoalLabel: "Main Goal for the Week:",
    plansModalMainGoalPlaceholder: "e.g., Launch new feature",
    plansModalMajorTasksLabel: "Major Tasks:",
    plansModalNewTaskPlaceholder: "New task",
    plansModalAddTaskButton: "Add Task",
    plansModalSaveButton: "Save Plan",

    // Discipline Board Page
    disciplineAddHabitButton: "Add Habit",
    disciplineNoHabits: "No habits defined yet. Start building your discipline!",
    disciplineStreakText: "{streakCount} day streak",
    disciplineLastCompletedLabel: "Last completed: {date}",
    disciplineTargetDaysLabel: "Target Days: {days}",
    disciplineTargetTodaySuffix: "(Today!)",
    disciplineMarkDoneButton: "Mark Done for Today",
    disciplineCompletedTodayButton: "Completed Today!",
    disciplineNotTargetDayButton: "Not a Target Day",
    disciplineConsequencePrefix: "Consequence:",
    disciplineEditButton: "Edit",
    disciplineResetButton: "Reset",
    disciplineDeleteButton: "Delete",
    disciplineModalTitleAdd: "Add New Habit",
    disciplineModalTitleEdit: "Edit Habit",
    disciplineModalPlaceholderName: "Habit Name (e.g., Morning Exercise)",
    disciplineModalPlaceholderStreak: "Current Streak (optional)",
    disciplineModalPlaceholderConsequence: "Consequence for skipping (optional)",
    disciplineModalTargetDaysLabel: "Target Days (optional, if none selected, assumes daily):",
    disciplineModalSaveButton: "Save Changes",
    disciplineModalAddButton: "Add Habit",
    disciplineResetStreakConfirm: "Are you sure you want to reset this habit's streak? This cannot be undone.",


    // Import/Export Page
    importExportTitle: "Import/Export Templates",
    importExportExportTitle: "Export My Setup",
    importExportExportDescription: "Export your current Weekly Plans, Habits, Scheduled Goals, and Weekly Mission as a JSON template file. You can use this file as a backup or share it with others.",
    importExportExportButton: "Export Template",
    importExportImportTitle: "Import Template from File",
    importExportImportDescription: "Import a Focus Forge template file (.json) to set up your plans. <strong class='text-red-500 dark:text-red-400'>Warning: This will overwrite your existing data for Weekly Plans, Habits, Scheduled Goals, and Weekly Mission.</strong>",
    importExportImportPlaceholderFile: "Choose template file",
    importExportImportGuidance: "After selecting a file, you will be asked to confirm the import.",
    importExportNoFileSelected: "No file selected.",
    importExportStarterTemplatesTitle: "Starter Templates",
    importExportStarterTemplatesDescription: "Quickly apply a pre-defined template to get started. <strong class='text-red-500 dark:text-red-400'>Warning: This will overwrite your existing data for Weekly Plans, Habits, Scheduled Goals, and Weekly Mission.</strong>",
    importExportApplyEntrepreneurButton: "Apply 'Entrepreneur Die or Succeed' Template",
    entrepreneurTemplateName: "Entrepreneur Die or Succeed", // For confirmation messages


    // Modals (general)
    modalCloseButtonLabel: "Close modal",
    moodModalTitle: "How are you feeling?",
    moodModalMoodLabel: "Mood (1-5):",
    moodModalEnergyLabel: "Energy (1-5):",
    moodModalSaveButton: "Save Log",

    // Pomodoro Controls
    pomodoroModeFocus: "Focus",
    pomodoroModeShortBreak: "Short Break",
    pomodoroModeLongBreak: "Long Break",
    pomodoroButtonStart: "Start",
    pomodoroButtonPause: "Pause",
    pomodoroButtonReset: "Reset",
    pomodoroButtonSkipBreak: "Skip Break",
    pomodoroUploadFocusMusicLabel: "Upload Focus Music",
    pomodoroClearFocusMusicLabel: "Clear Music",
    pomodoroFocusMusicPlaying: "Playing: {fileName}",
    pomodoroNoFocusMusicSelected: "No focus music selected.",
    pomodoroMuteFocusMusic: "Mute focus music",
    pomodoroUnmuteFocusMusic: "Unmute focus music",
    pomodoroFocusMusicNote: "Music is for current session only, not saved on page reload.",

    // EditableField
    editableFieldDefaultPlaceholder: "Click to edit",

    // --- AI Features ---
    aiFeatureSelectionTitle: "Choose AI Feature",
    aiFeatureCoachButton: "AI Productivity Coach",
    aiFeatureTemplateCreatorButton: "AI Template Creator",

    // AI Coach
    aiCoachModalTitle: "AI Productivity Coach",
    aiCoachInputPlaceholder: "Ask your AI Coach...",
    aiCoachSendButtonLabel: "Send message",
    aiCoachSystemInstruction: "You are FocusForge AI, an expert productivity coach. Your goal is to help the user stay focused, build discipline, and achieve their goals. Analyze their input and provide actionable advice, summaries of their performance based on the chat, and suggestions for improvement. Keep responses concise and encouraging. If asked for a detailed weekly report, gently guide them to use the 'Generate AI Review' button in the Review section for a comprehensive analysis of their logged data, but offer to give a brief conceptual summary if they press.",
    aiCoachInitialGreeting: "Hello! I'm your AI Productivity Coach. How can I help you be more focused and disciplined today?",


    // AI Template Creator
    aiTemplateCreatorModalTitle: "AI Template Creator",
    aiTemplateCreatorInputPlaceholder: "Tell me about your goals...",
    aiTemplateCreatorSystemInstruction: `You are an AI assistant helping users create personalized productivity templates for an app called Focus Forge. Your goal is to guide the user step-by-step to gather information for their template. Ask ONE question at a time. For each question, provide a clear example and a specific format for their answer. Ensure you get enough detail before moving to the next step.

Follow this sequence:

1.  **Understand Primary Goal:** (The initial greeting covers this. User states their main goal like 'studying for exams' or 'launching a new product'.) Wait for the user's response to the initial greeting: "Hello! I can help you create a personalized productivity template. To start, what's your primary goal or area you want to improve? (e.g., studying for exams, managing a side project, improving daily habits)".

2.  **Define Weekly Mission:**
    *   After they state their primary goal, ask: "Okay, let's define a **Weekly Mission** related to your goal: '{User's Primary Goal}'. What single, inspiring statement sums up what you want to achieve or embody this week regarding this goal?
        *   _Example Mission:_ 'Launch the beta version of my app' or 'Complete all readings for History and draft the essay outline'.
        *   _Your Mission:_ [Please type your mission here]"
    *   Wait for their mission text.

3.  **Gather Habits (one by one):**
    *   Then say: "Great. Now, let's think about **Habits** that will support your mission and goal. We'll add them one by one. For the first habit:
        1.  **Name:** What is the habit? (e.g., 'Morning Deep Work for 90 mins', 'Daily 30-min run')
        2.  **Target Days (Optional):** On which days of the week do you want to do this habit? (Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday - you can list multiple, or say 'Every day'. If unsure, you can skip this.)
        3.  **Consequence (Optional):** What's a minor, self-imposed consequence if you miss this habit? (e.g., 'No social media until done', '10 extra push-ups'. If unsure, you can skip this.)
        *   _Please provide the habit details in this format:_
            *   Name: [Your Habit Name]
            *   Target Days: [e.g., Monday, Wednesday, Friday OR Every day OR leave blank]
            *   Consequence: [e.g., Skip one leisure activity OR leave blank]"
    *   After they provide details for one habit, ask: "Got it. Do you want to add another habit? (Yes/No)"
    *   If "Yes", repeat the habit questions. If "No", move to the next step.

4.  **Gather Scheduled Goals/Tasks (one by one for a typical week):**
    *   Then ask: "Excellent. Let's list some **Scheduled Goals or Key Tasks** for a typical week that align with your main goal. These are specific items you'd put on your calendar. We'll add them one by one. For the first scheduled item:
        1.  **Title:** What is the goal or task? (e.g., 'Client Meeting for Project X', 'Study Chapter 5 of Textbook')
        2.  **Day of the Week:** On which day of a typical week would this occur? (e.g., Monday, Tuesday)
        3.  **Time (Optional):** At what time? (e.g., 10:00 AM, 2:30 PM. If flexible, you can skip this.)
        4.  **Is it a Key Goal?** (Yes/No - Key goals are major milestones, others are supporting tasks)
        *   _Please provide the item details in this format:_
            *   Title: [Your Goal/Task Title]
            *   Day: [e.g., Monday]
            *   Time: [e.g., 10:00 AM OR leave blank]
            *   Key Goal: [Yes/No]"
    *   After they provide details for one item, ask: "Understood. Do you want to add another scheduled goal or task for your typical week? (Yes/No)"
    *   If "Yes", repeat the scheduled item questions. If "No", move to the next step.

5.  **Outline Weekly Plan Structure:**
    *   Then say: "Now, let's outline a **Weekly Plan** structure.
        1.  **Main Weekly Goal:** What is the overarching main goal for a typical week, directly related to your primary goal '{User's Primary Goal}'? This should be a bit broader than the scheduled tasks.
            *   _Example Main Weekly Goal:_ 'Make significant progress on developing the new marketing strategy.'
            *   _Your Main Weekly Goal:_ [Please type your main weekly goal here]
        2.  **Major Tasks:** List 3-5 major tasks that would typically help you achieve this Main Weekly Goal. Please list each task on a new line, starting with a hyphen or bullet.
            *   _Example Major Tasks:_
                *   - Research competitor strategies
                *   - Draft initial marketing campaign ideas
                *   - Get feedback from the sales team
            *   _Your Major Tasks (list each on a new line):_
                *   - [Task 1]
                *   - [Task 2]
                *   ..."
    *   Wait for their response.

6.  **Confirm Readiness to Structure:**
    *   Once all information is gathered, say something like: "Okay, I think I have a good understanding of your needs for the Weekly Mission, Habits, Scheduled Goals, and Weekly Plan structure. Shall I try to structure this information into a template for you?"
    *   Do NOT generate JSON yourself. Wait for the user to confirm they want you to proceed with structuring. Only respond to the user's input conversationally based on these steps.
`,
    aiTemplateCreatorJsonSystemInstruction: "You are a data formatting AI. Your task is to take a conversation transcript and extract specific information to populate a JSON object according to a predefined `FocusForgeTemplateData` schema. The schema is: { \"weeklyPlans\": {weeklyPlansSchema}, \"habits\": {habitsSchema}, \"scheduledGoals\": {scheduledGoalsSchema}, \"weeklyMission\": {weeklyMissionSchema} }. Details: `id` fields must be unique strings (e.g., generate a short unique ID like \"template_habit_123\"). `weekStartDate` for weeklyPlans should be the Monday of the relevant week, formatted 'yyyy-MM-dd'. If not specified, assume the upcoming Monday. `majorTasks` in weeklyPlans: `completed` should be `false` by default. `habits`: `streak` should be `0` by default. `lastCompletedDate` should be `null` by default. `targetDays` is an array of numbers (0=Sunday, 1=Monday, ..., 6=Saturday). `scheduledGoals`: `completed` should be `false` by default. `time` is optional. `weeklyMission`: `deadline` should be an ISO string, typically 7 days from the start of the plan if not specified. If information for a field is missing or unclear from the conversation, use sensible defaults or omit optional fields. The output MUST be ONLY the JSON object, starting with `{` and ending with `}`. Do not include any other text, explanations, or markdown fences.",
    aiTemplateCreatorInitialGreeting: "Hello! I can help you create a personalized productivity template. To start, what's your primary goal or area you want to improve? (e.g., studying for exams, managing a side project, improving daily habits)",
    aiTemplateCreatorReadyToGeneratePromptWord1: "structure this into a template", // For matching AI readiness
    aiTemplateCreatorReadyToGeneratePromptWord2: "create a template based on this", // Alternative matching
    aiTemplateCreatorConfirmGenerateButton: "Yes, Structure the Template",
    aiTemplateCreatorUserConfirmedGenerate: "Yes, please structure the template.", // User message when button clicked
    aiTemplateCreatorGeneratedSuccess: "Great! I've structured the information into a template format.",
    aiTemplateCreatorGeneratedError: "I had some trouble structuring the template. Could you try rephrasing some of your needs or provide more details, and we can try again?",
    aiTemplateCreatorSummaryPrefix: "Here's a summary of the template I've created:",
    weeklyMissionLabel: "Weekly Mission",
    habitsLabel: "Habits",
    weeklyPlansLabel: "Weekly Plan Goal",
    scheduledGoalsLabel: "Scheduled Goals/Tasks",
    scheduledGoalsCountSuffix: "items",
    aiTemplateCreatorConfirmApplyPrompt: "Would you like to apply this template to your Focus Forge setup? \n\n<strong class='text-red-500 dark:text-red-400'>Warning: This will overwrite your existing Weekly Plans, Habits, Scheduled Goals, and Weekly Mission.</strong>",
    aiTemplateCreatorApplyButton: "Apply Template",
    aiTemplateCreatorCancelButton: "Cancel",
    aiTemplateCreatorApplySuccess: "Template applied successfully! Your setup has been updated.",
    aiTemplateCreatorApplySuccessAlert: "AI Generated Template has been applied!",
    aiTemplateCreatorApplyCancelledByResponse: "Okay, I won't apply the template right now. Let me know if you change your mind or want to make adjustments.",
    aiTemplateCreatorUserCancelledApply: "No, don't apply it yet.",


    // Help Modal
    helpModalTitle: "Focus Forge Help",
    helpTipLabel: "Tip",
    
    helpDashboardTitle: "Dashboard",
    helpDashboardDesc: "Your daily command center. Shows everything at a glance: Today’s Top Task, Focus Timer (Pomodoro), Mood & Energy Check-in, Quick Note dump, Daily Quote, and your One Week Mission countdown.",
    helpDashboardTip: "Start your day by setting ONE Top Task. Use the Pomodoro timer for deep work sessions on this task. Log your mood and energy regularly to understand patterns. Capture fleeting ideas with Quick Note.",
    helpCalendarTitle: "Calendar",
    helpCalendarDesc: "Schedule important tasks, appointments, and key goals. Visualize your commitments and plan your days effectively.",
    helpCalendarTip: "Block out time for your most important tasks and goals. Regularly review upcoming deadlines and events to stay prepared.",
    helpNotebookTitle: "Notebook",
    helpNotebookDesc: "Your digital journal for reflections, daily summaries, brainstorming, and any long-form writing. Notes are timestamped and searchable.",
    helpNotebookTip: "Use this space for daily reflection, to expand on Quick Notes, or to summarize your achievements and learnings at the end of the day.",
    helpTimeTrackerTitle: "Time Tracker",
    helpTimeTrackerDesc: "Log your focused work sessions, breaks, and distractions. Understand where your time truly goes. Pomodoro sessions are automatically logged.",
    helpTimeTrackerTip: "Be honest when logging distractions – awareness is the first step to overcoming them. Manually add other significant activities or breaks not covered by Pomodoro.",
    helpReviewTitle: "Review",
    helpReviewDesc: "Conduct weekly reviews by tracking wins, losses/challenges, and analyzing distractions. Features both manual input and an AI-generated summary (AI Review) based on your weekly data.",
    helpReviewTip: "At the end of each week, take time to reflect. Fill in your wins and losses. Use the 'Generate AI Review' button for an objective analysis of your week's activities and get tailored suggestions.",
    helpPlansTitle: "Plans",
    helpPlansDesc: "Set up your weekly goals and break down major objectives into actionable tasks. Define your main mission for the week ahead.",
    helpPlansTip: "Start your week by setting a clear Main Goal. Then, break this down into 3-5 Major Tasks that will help you achieve it. This provides structure and direction.",
    helpDisciplineTitle: "Discipline Board",
    helpDisciplineDesc: "Track your habits, build satisfying streaks, and optionally set consequences for skipping them. Reinforce positive behaviors.",
    helpDisciplineTip: "Focus on 1-3 key habits at a time. Mark your completion daily to build streaks. Defining a 'consequence' can provide extra motivation to stick to your commitments.",
    helpAiCoachTitle: "AI Productivity Coach",
    helpAiCoachDesc: "Chat with your personal AI productivity coach. Get quick advice, summaries of your chat-based inputs, or ask for motivation. For detailed weekly reports, use the AI Review feature in the Review section.",
    helpAiCoachTip: "Use the AI Coach for quick questions, brainstorming, or when you need a motivational nudge. It can help you process your thoughts and actions in real-time.",
    helpAiTemplateCreatorTitle: "AI Template Creator",
    helpAiTemplateCreatorDesc: "Engage in a conversation with the AI to build a custom productivity template (Weekly Mission, Habits, Plans, Goals). The AI will ask questions to understand your needs and then structure a template for you to review and apply.",
    helpAiTemplateCreatorTip: "Be descriptive about your goals and how you work. The more information you provide, the better the AI can tailor a template for you. You'll always get to confirm before the template is applied.",
    helpImportExportTitle: "Import/Export Templates",
    helpImportExportDesc: "Allows you to export your current setup (Weekly Plans, Habits, Scheduled Goals, Weekly Mission) as a downloadable JSON template file. You can also import a template file shared by others, or apply a built-in starter template like the 'Entrepreneur Die or Succeed' template, to quickly adopt their setup.",
    helpImportExportTip: "Use export to back up your planning structure or share successful setups. When importing (either from a file or a starter template), be cautious as it will replace your existing data in these categories after confirmation.",
    helpAboutTitle: "About Focus Forge",
    helpAboutDesc: "Made by: Solomon Tigabu.\n\nA full-time entrepreneur struggling to manage my time, Focus Forge was created to help bring focus and productivity into one place. Enjoy!\n\nContact: For any inquiries or other projects, reach out at soltig66@gmail.com",
    helpAboutTip: "Your feedback is valuable for improving Focus Forge!",
    helpTelegramGroupTitle: "Feedback & Community",
    helpTelegramGroupDesc: "Share your feedback, report issues, suggest new features, and discover community-created templates. Let's build Focus Forge together!",
    helpTelegramGroupButton: "Join Telegram Group",


    // Theme Toggle
    themeToggleToDark: "Switch to dark theme",
    themeToggleToLight: "Switch to light theme",

    // Star Rating
    starRatingLabel: "Rate {value} of {count}",

    // Days of the week (short)
    daySun: "Sun",
    dayMon: "Mon",
    dayTue: "Tue",
    dayWed: "Wed",
    dayThu: "Thu",
    dayFri: "Fri",
    daySat: "Sat",

  },
  am: {
    // App Wide
    appName: "ፎከስ ፎርጅ",
    defaultMotivationalQuote: "ወደፊት ለመራመድ ሚስጥሩ መጀመር ነው።",
    errorApiKeyNotConfigured: "የGemini ኤፒአይ ቁልፍ አልተዋቀረም። የAI አገልግሎቶች የተገደቡ ይሆናሉ።",
    errorAiGeneral: "ከAI መረጃ ማግኘት አልተቻለም። እባክዎ ቆይተው እንደገና ይሞክሩ።",
    errorAiChatResponse: "አሁን ምላሽ ለመስጠት ትንሽ ተቸግሬያለሁ። እባክዎ እንደገና ይሞክሩ።",
    errorAiReviewGeneration: "የዚህን ሳምንት የAI ግምገማ ማመንጨት አልተቻለም።",
    loading: "በመጫን ላይ...",
    confirmAction: "እርግጠኛ ነዎት?",
    deleteConfirmation: "ይህን ንጥል መሰረዝ እንደሚፈልጉ እርግጠኛ ነዎት? ይህ እርምጃ ሊቀለበስ አይችልም።",
    importWarning: "ይህንን አብነት ማስመጣት አሁን ያሉትን {dataType} በዚህ ፋይል ውስጥ ባለው መረጃ ይተካል።\n\nይህ እርምጃ ሊቀለበስ አይችልም።\n\nለመቀጠል እርግጠኛ ነዎት?",
    importSuccess: "አብነት በተሳካ ሁኔታ ገብቷል! የእርስዎ መረጃ ተዘምኗል።",
    importCancelled: "ማስመጣት በተጠቃሚ ተሰርዟል።",
    importErrorInvalidFile: "የማይሰራ ወይም ተኳሃኝ ያልሆነ የአብነት ፋይል።",
    importErrorGeneral: "አብነት በማስገባት ላይ ስህተት ተፈጥሯል። ፋይሉ የተበላሸ ወይም ትክክለኛ አብነት ላይሆን ይችላል።",
    exportSuccess: "አብነት በተሳካ ሁኔታ ወጥቷል!",
    exportError: "አብነት በማውጣት ላይ ስህተት ተፈጥሯል።",
    starterTemplateApplySuccess: "'{templateName}' አብነት በተሳካ ሁኔታ ተተግብሯል! የእርስዎ መረጃ ተዘምኗል።",
    starterTemplateApplyCancelled: "የጀማሪ አብነት ትግበራ ተሰርዟል።",


    // Onboarding
    onboardingWelcomeTitle: "ወደ ፎከስ ፎርጅ እንኳን በደህና መጡ!",
    onboardingWelcomeText: "የግል ምርታማነትና ደህንነት ማዘዣ ማዕከልዎ። እስቲ እናዋቅርዎ።",
    onboardingFeaturesTitle: "ቁልፍ ባህሪያት",
    onboardingFeature1Title: "የተቀናጀ ዳሽቦርድ",
    onboardingFeature1Text: "ዋና ተግባርዎን፣ የትኩረት ሰዓት ቆጣሪን፣ ስሜትዎን፣ ማስታወሻዎችዎን እና ተልዕኮዎን በአንድ ቦታ ይመልከቱ።",
    onboardingFeature2Title: "ያቅዱ እና ይከታተሉ",
    onboardingFeature2Text: "የሳምንት ዕቅዶችን، ዕለታዊ ግቦችን، ልምዶችን ያስተዳድሩ እና ጊዜዎን በብቃት ይከታተሉ።",
    onboardingFeature3Title: "ያውጠነጥኑ እና ያድጉ",
    onboardingFeature3Text: "የማስታወሻ ደብተሩን ለሀሳብ ማንሸራሸር ይጠቀሙ እና ሳምንታዊ እድገትዎን በAI ግንዛቤዎች ይገምግሙ።",
    onboardingFeature4Title: "ስነ-ስርዓት እና ትኩረት",
    onboardingFeature4Text: "በስነ-ስርዓት ሰሌዳው ልምዶችን ይገንቡ እና በፖሞዶሮ ሰዓት ቆጣሪ ትኩረትዎን ይጠብቁ።",
    onboardingLanguageTitle: "ቋንቋዎን ይምረጡ",
    onboardingLanguageText: "ለአፑ በይነገጽ የሚመርጡትን ቋንቋ ይምረጡ።",
    onboardingButtonNext: "ቀጣይ",
    onboardingButtonPrevious: "የቀድሞ",
    onboardingButtonFinish: "ይጀምሩ",

    // Languages
    languageEnglish: "English",
    languageAmharic: "አማርኛ",
    languageLabelEN: "EN",
    languageLabelAM: "አማ",

    // Sidebar & Mobile Header
    sidebarNavDashboard: "ዳሽቦርድ",
    sidebarNavCalendar: "የቀን መቁጠሪያ",
    sidebarNavNotebook: "ማስታወሻ ደብተር",
    sidebarNavTimeTracker: "የጊዜ መከታተያ",
    sidebarNavReview: "ግምገማ",
    sidebarNavPlans: "ዕቅዶች",
    sidebarNavDiscipline: "ስነ-ስርዓት",
    sidebarNavImportExport: "ማስመጣት/ማውጣት",

    // Page Titles
    pageTitleDashboard: "ዳሽቦርድ",
    pageTitleCalendar: "የቀን መቁጠሪያ",
    pageTitleNotebook: "ማስታወሻ ደብተር",
    pageTitleTimeTracker: "የጊዜ መከታተያ",
    pageTitleReview: "ሳምንታዊ ግምገማ",
    pageTitlePlans: "ሳምንታዊ ዕቅዶች",
    pageTitleDisciplineBoard: "የስነ-ስርዓት ሰሌዳ",
    pageTitleImportExport: "አብነቶችን ማስመጣት/ማውጣት",

    // Dashboard Page
    dashboardTopTaskTitle: "የዛሬው ዋና ተግባር",
    dashboardTopTaskPlaceholder: "የዛሬው አንድ ነገርዎ ምንድን ነው?",
    dashboardDailyWisdomTitle: "የዕለት ጥበብ",
    dashboardFocusTimerTitle: "የትኩረት ሰዓት ቆጣሪ",
    dashboardMoodEnergyTitle: "ስሜት እና ጉልበት",
    dashboardLogMoodButton: "የዛሬን ስሜት እና ጉልበት ይመዝግቡ",
    dashboardMoodLoggedText: "ለዛሬ ተመዝግቧል:",
    dashboardQuickNoteTitle: "ፈጣን ማስታወሻ / ሀሳብ መጣያ",
    dashboardQuickNotePlaceholder: "ፈጣን ሀሳብ ወይም ሃሳብ ይጻፉ...",
    dashboardSaveToNotebookButton: "ወደ ማስታወሻ ደብተር ያስቀምጡ",
    dashboardWeeklyMissionTitle: "የዚህ ሳምንት ተልዕኮ",
    dashboardWeeklyMissionPlaceholder: "የዚህ ሳምንት ተልዕኮዎን ይግለጹ...",
    dashboardMissionCountdownLabel: "የቀረው ጊዜ:",
    dashboardMissionDeadlineLabel: "የመጨረሻ ቀን:",
    dashboardCalculating: "በማስላት ላይ...",
    dashboardMissionEnded: "ተልዕኮ ተጠናቋል!",
    dashboardPomodorosCompleted: "የተጠናቀቁ ፖሞዶሮዎች: {count}",
    dashboardReminderSetPriority: "ማስታወሻ: ከጠዋቱ 3 ሰዓት አልፏል! የዛሬውን አንድ ዋና ተግባርዎን መርጠዋል?",
    dashboardBreakInvitation: "የትኩረት ጊዜ አልቋል! ለ {breakType} ጊዜው አሁን ነው።",

    // Calendar Page
    calendarAddEventButton: "ክስተት ጨምር",
    calendarPreviousWeekButton: "ያለፈው",
    calendarNextWeekButton: "ቀጣይ",
    calendarWeekDisplay: "ሳምንት {weekNumber}",
    calendarModalTitleAdd: "አዲስ ክስተት ጨምር",
    calendarModalTitleEdit: "ክስተት አስተካክል",
    calendarModalPlaceholderTitle: "ርዕስ",
    calendarModalCheckboxGoal: "እንደ ቁልፍ ግብ ምልክት አድርግ",
    calendarModalSaveButton: "ለውጦችን አስቀምጥ",
    calendarModalAddButton: "ክስተት ጨምር",
    calendarModalDeleteButton: "ሰርዝ",
    calendarEventGoalLabel: "ግብ",
    calendarButtonAddForDay: "ጨምር",

    // Notebook Page
    notebookNewEntryTitle: "አዲስ የማስታወሻ ግቤት",
    notebookEditEntryTitle: "ግቤት አስተካክል",
    notebookEntryPlaceholder: "ሀሳቦችዎን፣ አስተያየቶችዎን ወይም ዕለታዊ ማጠቃለያዎን ይጻፉ...",
    notebookAddButton: "ግቤት ጨምር",
    notebookUpdateButton: "ግቤት አዘምን",
    notebookCancelEditButton: "ማስተካከል ሰርዝ",
    notebookEntriesTitle: "ግቤቶች",
    notebookSearchPlaceholder: "ግቤቶችን ፈልግ...",
    notebookNoEntriesFound: "ምንም ግቤቶች አልተገኙም።",
    notebookEditEntryButton: "አስተካክል",
    notebookDeleteEntryButton: "ሰርዝ",

    // Time Tracker Page
    timeTrackerLogActivityButton: "እንቅስቃሴ መዝግብ",
    timeTrackerNoLogs: "እስካሁን ምንም የጊዜ ምዝገባዎች የሉም። የፖሞዶሮ ክፍለ ጊዜ ይጀምሩ ወይም በእጅ ይጨምሩ!",
    timeTrackerActivityTypeFocus: "ትኩረት",
    timeTrackerActivityTypeBreak: "እረፍት",
    timeTrackerActivityTypeDistraction: "መዘናጊያ",
    timeTrackerModalTitleNew: "አዲስ እንቅስቃሴ መዝግብ",
    timeTrackerModalTitleEdit: "የጊዜ ምዝገባ አስተካክል",
    timeTrackerModalPlaceholderActivity: "እንቅስቃሴ (ለምሳሌ፣ በፕሮጀክት ኤክስ ላይ መስራት)",
    timeTrackerModalLabelStartTime: "የመጀመሪያ ሰዓት",
    timeTrackerModalLabelEndTime: "የመጨረሻ ሰዓት",
    timeTrackerModalAddButton: "ምዝገባ ጨምር",
    timeTrackerModalUpdateButton: "ምዝገባ አዘምን",
    timeTrackerErrorEndTimeBeforeStart: "የመጨረሻ ሰዓት ከመጀመሪያ ሰዓት በኋላ መሆን አለበት።",

    // Review Page
    reviewNewButton: "አዲስ ሳምንታዊ ግምገማ",
    reviewNoReviews: "እስካሁን ምንም ሳምንታዊ ግምገማዎች የሉም። ለማሰላሰል ጊዜው ነው!",
    reviewCardTitlePrefix: "ግምገማ:",
    reviewWinsLabel: "ድሎች:",
    reviewLossesLabel: "ሽንፈቶች/ተግዳሮቶች:",
    reviewDistractionSummaryLabelManual: "የመዘናጊያ ሪፖርት/ማጠቃለያ (በእጅ):",
    reviewDisciplineRatingLabel: "የስነ-ስርዓት ደረጃ:",
    reviewAiGeneratedSummaryLabel: "በAI የተፈጠረ ሳምንታዊ ግምገማ:",
    reviewNoAiSummary: "ለዚህ ሳምንት እስካሁን የAI ግምገማ አልተፈጠረም።",
    reviewEditManualButton: "በእጅ የተደረገ ግምገማ አስተካክል",
    reviewGenerateAiButton: "የAI ግምገማ ፍጠር",
    reviewRegenerateAiButton: "የAI ግምገማ እንደገና ፍጠር",
    reviewModalTitlePrefix: "ግምገማ:",
    reviewModalSelectWeekLabel: "ሳምንት ይምረጡ (ከሰኞ ይጀምራል):",
    reviewModalWinsLabel: "የዚህ ሳምንት ድሎች:",
    reviewModalLossesLabel: "የዚህ ሳምንት ሽንፈቶች/ተግዳሮቶች:",
    reviewModalDistractionSummaryLabel: "የመዘናጊያ ማጠቃለያ / ቁልፍ ትምህርቶች (በእጅ):",
    reviewModalAiDistractionButton: "የAI ማጠቃለያ (መዘናጊያዎች)",
    reviewModalNoDataForAiSummary: "ለዚህ ሳምንት ለAI ማጠቃለያ ምንም የተለየ የመዘናጊያ መረጃ ወይም የማስታወሻ ግቤቶች የሉም።",
    reviewModalDisciplineRatingLabel: "የስነ-ስርዓት ደረጃ (1-5):",
    reviewModalSaveButton: "ግምገማ አስቀምጥ",

    // Plans Page
    plansNewButton: "አዲስ ሳምንታዊ ዕቅድ",
    plansNoPlans: "እስካሁን ምንም ሳምንታዊ ዕቅዶች የሉም። ስኬትዎን ማቀድ ይጀምሩ!",
    plansCardTitlePrefix: "ዕቅድ:",
    plansMainGoalLabel: "የሳምንቱ ዋና ግብ:",
    plansMajorTasksLabel: "ዋና ተግባራት:",
    plansNoMajorTasks: "ምንም ዋና ተግባራት አልተገለጹም።",
    plansEditButton: "ዕቅድ አስተካክል",
    plansModalTitlePrefix: "ዕቅድ:",
    plansModalSelectWeekLabel: "ሳምንት ይምረጡ (ከሰኞ ይጀምራል):",
    plansModalMainGoalLabel: "የሳምንቱ ዋና ግብ:",
    plansModalMainGoalPlaceholder: "ለምሳሌ፣ አዲስ ባህሪ ማስጀመር",
    plansModalMajorTasksLabel: "ዋና ተግባራት:",
    plansModalNewTaskPlaceholder: "አዲስ ተግባር",
    plansModalAddTaskButton: "ተግባር ጨምር",
    plansModalSaveButton: "ዕቅድ አስቀምጥ",

    // Discipline Board Page
    disciplineAddHabitButton: "ልማድ ጨምር",
    disciplineNoHabits: "እስካሁን ምንም ልማዶች አልተገለጹም። ስነ-ስርዓትዎን መገንባት ይጀምሩ!",
    disciplineStreakText: "{streakCount} የቀን ተከታታይነት",
    disciplineLastCompletedLabel: "ለመጨረሻ ጊዜ የተጠናቀቀው: {date}",
    disciplineTargetDaysLabel: "የታለመላቸው ቀናት: {days}",
    disciplineTargetTodaySuffix: "(ዛሬ!)",
    disciplineMarkDoneButton: "ለዛሬ እንደተጠናቀቀ ምልክት አድርግ",
    disciplineCompletedTodayButton: "ዛሬ ተጠናቋል!",
    disciplineNotTargetDayButton: "የታለመለት ቀን አይደለም",
    disciplineConsequencePrefix: "ውጤት:",
    disciplineEditButton: "አስተካክል",
    disciplineResetButton: "እንደገና አስጀምር",
    disciplineDeleteButton: "ሰርዝ",
    disciplineModalTitleAdd: "አዲስ ልማድ ጨምር",
    disciplineModalTitleEdit: "ልማድ አስተካክል",
    disciplineModalPlaceholderName: "የልማድ ስም (ለምሳሌ፣ የጠዋት የአካል ብቃት እንቅስቃሴ)",
    disciplineModalPlaceholderStreak: "የአሁኑ ተከታታይነት (አማራጭ)",
    disciplineModalPlaceholderConsequence: "ለመዝለል የሚያስከትለው ውጤት (አማራጭ)",
    disciplineModalTargetDaysLabel: "የታለመላቸው ቀናት (አማራጭ፣ ካልተመረጠ በየቀኑ እንደሆነ ይቆጠራል):",
    disciplineModalSaveButton: "ለውጦችን አስቀምጥ",
    disciplineModalAddButton: "ልማድ ጨምር",
    disciplineResetStreakConfirm: "የዚህን ልማድ ተከታታይነት እንደገና ማስጀመር እንደሚፈልጉ እርግጠኛ ነዎት? ይህ እርምጃ ሊቀለበስ አይችልም።",

    // Import/Export Page
    importExportTitle: "አብነቶችን ማስመጣት/ማውጣት",
    importExportExportTitle: "የእኔን ማዋቀር አውጣ",
    importExportExportDescription: "የአሁኑን ሳምንታዊ ዕቅዶችዎን፣ ልምዶችዎን፣ የታቀዱ ግቦችዎን እና ሳምንታዊ ተልዕኮዎን እንደ JSON አብነት ፋይል ያውጡ። ይህንን ፋይል እንደ ምትኬ መጠቀም ወይም ለሌሎች ማጋራት ይችላሉ።",
    importExportExportButton: "አብነት አውጣ",
    importExportImportTitle: "አብነት ከፋይል አስገባ",
    importExportImportDescription: "ዕቅዶችዎን ለማዋቀር የፎከስ ፎርጅ አብነት ፋይል (.json) ያስገቡ። <strong class='text-red-500 dark:text-red-400'>ማስጠንቀቂያ: ይህ አሁን ያሉትን ሳምንታዊ ዕቅዶችዎን፣ ልምዶችዎን፣ የታቀዱ ግቦችዎን እና ሳምንታዊ ተልዕኮዎን ይተካል።</strong>",
    importExportImportPlaceholderFile: "አብነት ፋይል ይምረጡ",
    importExportImportGuidance: "ፋይል ከመረጡ በኋላ ማስገባቱን እንዲያረጋግጡ ይጠየቃሉ።",
    importExportNoFileSelected: "ምንም ፋይል አልተመረጠም።",
    importExportStarterTemplatesTitle: "የጀማሪ አብነቶች",
    importExportStarterTemplatesDescription: "ለመጀመር አስቀድሞ የተገለጸ አብነት በፍጥነት ይተግብሩ። <strong class='text-red-500 dark:text-red-400'>ማስጠንቀቂያ: ይህ አሁን ያሉትን ሳምንታዊ ዕቅዶችዎን፣ ልምዶችዎን፣ የታቀዱ ግቦችዎን እና ሳምንታዊ ተልዕኮዎን ይተካል።</strong>",
    importExportApplyEntrepreneurButton: "'ሥራ ፈጣሪ ሞት ወይም ስኬት' አብነት ተግብር",
    entrepreneurTemplateName: "ሥራ ፈጣሪ ሞት ወይም ስኬት",

    // Modals (general)
    modalCloseButtonLabel: "ዝጋ",
    moodModalTitle: "እንዴት እየተሰማዎት ነው?",
    moodModalMoodLabel: "ስሜት (1-5):",
    moodModalEnergyLabel: "ጉልበት (1-5):",
    moodModalSaveButton: "ምዝገባ አስቀምጥ",

    // Pomodoro Controls
    pomodoroModeFocus: "ትኩረት",
    pomodoroModeShortBreak: "አጭር እረፍት",
    pomodoroModeLongBreak: "ረጅም እረፍት",
    pomodoroButtonStart: "ጀምር",
    pomodoroButtonPause: "አቁም",
    pomodoroButtonReset: "እንደገና አስጀምር",
    pomodoroButtonSkipBreak: "እረፍት ዝለል",
    pomodoroUploadFocusMusicLabel: "የትኩረት ሙዚቃ ስቀል",
    pomodoroClearFocusMusicLabel: "ሙዚቃ አጽዳ",
    pomodoroFocusMusicPlaying: "እየተጫወተ፡ {fileName}",
    pomodoroNoFocusMusicSelected: "ምንም የትኩረት ሙዚቃ አልተመረጠም።",
    pomodoroMuteFocusMusic: "የትኩረት ሙዚቃ ድምጸ ከል አድርግ",
    pomodoroUnmuteFocusMusic: "የትኩረት ሙዚቃ ድምጽ ክፈት",
    pomodoroFocusMusicNote: "ሙዚቃው ለአሁኑ ክፍለ ጊዜ ብቻ ነው፣ ገጹ እንደገና ሲጫን አይቀመጥም።",

    // EditableField
    editableFieldDefaultPlaceholder: "ለማስተካከል ጠቅ ያድርጉ",

    // --- AI Features ---
    aiFeatureSelectionTitle: "የAI አገልግሎት ይምረጡ",
    aiFeatureCoachButton: "የAI ምርታማነት አሰልጣኝ",
    aiFeatureTemplateCreatorButton: "የAI አብነት ፈጣሪ",

    // AI Coach
    aiCoachModalTitle: "የAI ምርታማነት አሰልጣኝ",
    aiCoachInputPlaceholder: "የAI አሰልጣኝዎን ይጠይቁ...",
    aiCoachSendButtonLabel: "ላክ",
    aiCoachSystemInstruction: "እርስዎ ፎከስ ፎርጅ AI፣ የባለሙያ ምርታማነት አሰልጣኝ ነዎት። ግብዎ ተጠቃሚው ትኩረቱን እንዲጠብቅ፣ ስነ-ስርዓት እንዲገነባ እና ግቦቹን እንዲያሳካ መርዳት ነው። ግብአታቸውን ይተንትኑ እና ተግባራዊ ምክር፣ በውይይቱ ላይ የተመሰረተ የአፈጻጸማቸውን ማጠቃለያ፣ እና የማሻሻያ ሀሳቦችን ያቅርቡ። ምላሾችን አጭር እና አበረታች ያድርጉ። ዝርዝር ሳምንታዊ ሪፖርት ከተጠየቁ፣ ለተሟላ የመረጃ ትንተና በግምገማ ክፍል ውስጥ ያለውን 'የAI ግምገማ ፍጠር' የሚለውን ቁልፍ እንዲጠቀሙ በቀስታ ይምሯቸው፣ ነገር ግን ከጫኑ አጭር ፅንሰ-ሀሳባዊ ማጠቃለያ ለመስጠት ፈቃደኛ ይሁኑ።",
    aiCoachInitialGreeting: "ሰላም! እኔ የእርስዎ የAI ምርታማነት አሰልጣኝ ነኝ። ዛሬ የበለጠ ትኩረት እና ስነ-ስርዓት እንዲኖርዎት እንዴት ልረዳዎት እችላለሁ?",


    // AI Template Creator
    aiTemplateCreatorModalTitle: "የAI አብነት ፈጣሪ",
    aiTemplateCreatorInputPlaceholder: "ስለ ግቦችዎ ይንገሩኝ...",
    aiTemplateCreatorSystemInstruction: `እርስዎ ፎከስ ፎርጅ ለተባለ መተግበሪያ ተጠቃሚዎች ግላዊ የሆኑ ምርታማነት አብነቶችን እንዲፈጥሩ የሚረዳ AI ረዳት ነዎት። ግብዎ ተጠቃሚውን ደረጃ በደረጃ በመምራት ለአብነታቸው መረጃ መሰብሰብ ነው። በአንድ ጊዜ አንድ ጥያቄ ብቻ ይጠይቁ። ለእያንዳንዱ ጥያቄ፣ ግልጽ ምሳሌ እና ለሚሰጡት መልስ የተወሰነ ቅርጸት ያቅርቡ። ወደሚቀጥለው ደረጃ ከመሄድዎ በፊት በቂ ዝርዝር መረጃ ማግኘትዎን ያረጋግጡ።

ይህንን ቅደም ተከተል ይከተሉ፦

1.  **ዋና ግብን መረዳት፦** (የመጀመሪያው ሰላምታ ይህንን ይሸፍናል። ተጠቃሚው ዋና ግባቸውን ይገልጻል፣ ለምሳሌ 'ለፈተና መዘጋጀት' ወይም 'አዲስ ምርት ማስጀመር'።) ተጠቃሚው ለመጀመሪያው ሰላምታ የሚሰጠውን ምላሽ ይጠብቁ፦ "ሰላም! ግላዊ የሆነ ምርታማነት አብነት እንዲፈጥሩ ልረዳዎት እችላለሁ። ለመጀመር፣ ዋና ግብዎ ወይም ማሻሻል የሚፈልጉት አካባቢ ምንድን ነው? (ለምሳሌ፣ ለፈተና መዘጋጀት፣ የጎን ፕሮጀክት ማስተዳደር፣ ዕለታዊ ልምዶችን ማሻሻል)"

2.  **ሳምንታዊ ተልዕኮን መግለጽ፦**
    *   ዋና ግባቸውን ከገለጹ በኋላ እንዲህ ይጠይቁ፦ "እሺ፣ ከግብዎ '{የተጠቃሚው ዋና ግብ}' ጋር የተያያዘ **ሳምንታዊ ተልዕኮ** እንግለጽ። በዚህ ሳምንት ይህንን ግብ በተመለከተ ሊያሳኩት ወይም ሊያካትቱት የሚፈልጉትን ነገር በአንድ አነቃቂ አረፍተ ነገር እንዴት ያጠቃልላሉት?
        *   _የተልዕኮ ምሳሌ፦_ 'የመተግበሪያዬን ቤታ ስሪት አስጀምራለሁ' ወይም 'የታሪክ ትምህርቱን ንባቦች በሙሉ አጠናቅቄ የጽሑፉን ረቂቅ አዘጋጃለሁ'።
        *   _የእርስዎ ተልዕኮ፦_ [ተልዕኮዎን እዚህ ይጻፉ]"
    *   የሚሰጡትን የተልዕኮ ጽሑፍ ይጠብቁ።

3.  **ልምዶችን መሰብሰብ (አንድ በአንድ)፦**
    *   ከዚያ እንዲህ ይበሉ፦ "በጣም ጥሩ። አሁን፣ ተልዕኮዎንና ግብዎን የሚደግፉ **ልምዶችን** እናስብ። አንድ በአንድ እንጨምራቸዋለን። ለመጀመሪያው ልማድ፦
        1.  **ስም፦** ልማዱ ምንድን ነው? (ለምሳሌ፣ 'የጠዋት ጥልቅ ሥራ ለ90 ደቂቃ'፣ 'ዕለታዊ የ30 ደቂቃ ሩጫ')
        2.  **የታለመላቸው ቀናት (አማራጭ)፦** ይህንን ልማድ በሳምንቱ የትኞቹ ቀናት ማድረግ ይፈልጋሉ? (እሑድ፣ ሰኞ፣ ማክሰኞ፣ ረቡዕ، ሐሙስ፣ ዓርብ፣ ቅዳሜ - ብዙ መዘርዘር ወይም 'በየቀኑ' ማለት ይችላሉ። እርግጠኛ ካልሆኑ ይህንን መዝለል ይችላሉ።)
        3.  **ውጤት (አማራጭ)፦** ይህንን ልማድ ካመለጡ በራስዎ ላይ የሚጥሉት ቀላል ቅጣት ምንድን ነው? (ለምሳሌ፣ 'እስኪጠናቀቅ ድረስ ማኅበራዊ ሚዲያ የለም'፣ '10 ተጨማሪ ፑሽአፕ'። እርግጠኛ ካልሆኑ ይህንን መዝለል ይችላሉ።)
        *   _እባክዎ የልማዱን ዝርዝሮች በዚህ ቅርጸት ያቅርቡ፦_
            *   ስም፦ [የልማድዎ ስም]
            *   የታለመላቸው ቀናት፦ [ለምሳሌ፣ ሰኞ፣ ረቡዕ፣ ዓርብ ወይም በየቀኑ ወይም ባዶ ይተው]
            *   ውጤት፦ [ለምሳሌ፣ አንድ የመዝናኛ እንቅስቃሴ መዝለል ወይም ባዶ ይተው]"
    *   ለአንድ ልማድ ዝርዝሮችን ከሰጡ በኋላ እንዲህ ይጠይቁ፦ "ገባኝ። ሌላ ልማድ ማከል ይፈልጋሉ? (አዎ/አይደለም)"
    *   "አዎ" ከሆነ፣ የልማድ ጥያቄዎቹን ይድገሙ። "አይደለም" ከሆነ፣ ወደሚቀጥለው ደረጃ ይሂዱ።

4.  **የታቀዱ ግቦችን/ተግባራትን መሰብሰብ (አንድ በአንድ ለተለመደ ሳምንት)፦**
    *   ከዚያ እንዲህ ይጠይቁ፦ "በጣም ጥሩ። ከዋና ግብዎ ጋር የሚጣጣሙ ለተለመደ ሳምንት ጥቂት **የታቀዱ ግቦችን ወይም ቁልፍ ተግባራትን** እንዘርዝር። እነዚህ በቀን መቁጠሪያዎ ላይ የሚያስቀምጧቸው የተወሰኑ ንጥሎች ናቸው። አንድ በአንድ እንጨምራቸዋለን። ለመጀመሪያው የታቀደ ንጥል፦
        1.  **ርዕስ፦** ግቡ ወይም ተግባሩ ምንድን ነው? (ለምሳሌ፣ 'ለፕሮጀክት ኤክስ የደንበኛ ስብሰባ'፣ 'የመማሪያ መጽሐፍ ምዕራፍ 5 ማጥናት')
        2.  **የሳምንቱ ቀን፦** በተለመደው ሳምንት ይህ በየትኛው ቀን ይከናወናል? (ለምሳሌ፣ ሰኞ፣ ማክሰኞ)
        3.  **ሰዓት (አማራጭ)፦** በስንት ሰዓት? (ለምሳሌ፣ 10:00 ጥዋት፣ 2:30 ከሰዓት። ተለዋዋጭ ከሆነ ይህንን መዝለል ይችላሉ።)
        4.  **ቁልፍ ግብ ነው?** (አዎ/አይደለም - ቁልፍ ግቦች ዋና ዋና ምዕራፎች ሲሆኑ፣ ሌሎቹ ደጋፊ ተግባራት ናቸው)
        *   _እባክዎ የንጥሉን ዝርዝሮች በዚህ ቅርጸት ያቅርቡ፦_
            *   ርዕስ፦ [የግብዎ/ተግባርዎ ርዕስ]
            *   ቀን፦ [ለምሳሌ፣ ሰኞ]
            *   ሰዓት፦ [ለምሳሌ፣ 10:00 ጥዋት ወይም ባዶ ይተው]
            *   ቁልፍ ግብ፦ [አዎ/አይደለም]"
    *   ለአንድ ንጥል ዝርዝሮችን ከሰጡ በኋላ እንዲህ ይጠይቁ፦ "ገባኝ። ለተለመደው ሳምንትዎ ሌላ የታቀደ ግብ ወይም ተግባር ማከል ይፈልጋሉ? (አዎ/አይደለም)"
    *   "አዎ" ከሆነ፣ የታቀዱ ንጥሎች ጥያቄዎቹን ይድገሙ። "አይደለም" ከሆነ፣ ወደሚቀጥለው ደረጃ ይሂዱ።

5.  **የሳምንታዊ ዕቅድ አወቃቀርን መዘርዘር፦**
    *   ከዚያ እንዲህ ይበሉ፦ "አሁን፣ የ**ሳምንታዊ ዕቅድ** አወቃቀርን እንዘርዝር።
        1.  **ዋና ሳምንታዊ ግብ፦** ከዋና ግብዎ '{የተጠቃሚው ዋና ግብ}' ጋር በቀጥታ የተያያዘ ለተለመደ ሳምንት ያለው አጠቃላይ ዋና ግብ ምንድን ነው? ይህ ከታቀዱት ተግባራት ትንሽ ሰፋ ያለ መሆን አለበት።
            *   _የዋና ሳምንታዊ ግብ ምሳሌ፦_ 'አዲሱን የገበያ ስትራቴጂ በማዘጋጀት ላይ ጉልህ መሻሻል ማድረግ።'
            *   _የእርስዎ ዋና ሳምንታዊ ግብ፦_ [ዋና ሳምንታዊ ግብዎን እዚህ ይጻፉ]
        2.  **ዋና ተግባራት፦** ይህንን ዋና ሳምንታዊ ግብ ለማሳካት በተለምዶ የሚረዱዎትን 3-5 ዋና ተግባራት ይዘርዝሩ። እባክዎ እያንዳንዱን ተግባር በአዲስ መስመር ላይ፣ በሰረዝ ወይም በጥይት በመጀመር ይዘርዝሩ።
            *   _የዋና ተግባራት ምሳሌ፦_
                *   - የተፎካካሪ ስትራቴጂዎችን መመርመር
                *   - የመጀመሪያ የገበያ ዘመቻ ሀሳቦችን መቅረጽ
                *   - ከሽያጭ ቡድኑ አስተያየት ማግኘት
            *   _የእርስዎ ዋና ተግባራት (እያንዳንዱን በአዲስ መስመር ይዘርዝሩ)፦_
                *   - [ተግባር 1]
                *   - [ተግባር 2]
                *   ..."
    *   የሚሰጡትን ምላሽ ይጠብቁ።

6.  **ለማዋቀር ዝግጁነትን ማረጋገጥ፦**
    *   ሁሉም መረጃ ከተሰበሰበ በኋላ፣ እንዲህ ያለ ነገር ይበሉ፦ "እሺ፣ ለሳምንታዊ ተልዕኮዎ፣ ለልምዶችዎ፣ ለታቀዱ ግቦችዎ፣ እና ለሳምንታዊ ዕቅድ አወቃቀርዎ የሚያስፈልጉዎትን ነገሮች ጥሩ ግንዛቤ ያገኘሁ ይመስለኛል። ይህንን መረጃ ወደ አብነት ልቀይርልዎት?"
    *   እርስዎ እራስዎ JSON አይፍጠሩ። ተጠቃሚው አወቃቀሩን እንዲቀጥሉበት እስኪያረጋግጥ ይጠብቁ። በእነዚህ ደረጃዎች ላይ በመመስረት ለተጠቃሚው ግብአት በውይይት መልክ ብቻ ምላሽ ይስጡ።
`,
    aiTemplateCreatorJsonSystemInstruction: "እርስዎ የውሂብ ቅርጸት AI ነዎት። ተግባርዎ የውይይት ቅጂን ወስደው አስቀድሞ በተገለጸው `FocusForgeTemplateData` እቅድ መሰረት የJSON ነገርን ለመሙላት የተወሰነ መረጃ ማውጣት ነው። እቅዱ ይህ ነው፦ { \"weeklyPlans\": {weeklyPlansSchema}, \"habits\": {habitsSchema}, \"scheduledGoals\": {scheduledGoalsSchema}, \"weeklyMission\": {weeklyMissionSchema} }። ዝርዝሮች፦ `id` መስኮች ልዩ የሆኑ ሕብረቁምፊዎች መሆን አለባቸው (ለምሳሌ፣ እንደ \"template_habit_123\" ያለ አጭር ልዩ መታወቂያ ይፍጠሩ)። ለሳምንታዊ ዕቅዶች `weekStartDate` የሚመለከተው ሳምንት ሰኞ፣ 'yyyy-MM-dd' ተብሎ የተቀረጸ መሆን አለበት። ካልተገለጸ፣ የሚመጣውን ሰኞ ይገምቱ። በሳምንታዊ ዕቅዶች ውስጥ `majorTasks`፦ `completed` በነባሪ `false` መሆን አለበት። `habits`፦ `streak` በነባሪ `0` መሆን አለበት። `lastCompletedDate` በነባሪ `null` መሆን አለበት። `targetDays` የቁጥሮች ድርድር (0=እሑድ፣ 1=ሰኞ፣ ...፣ 6=ቅዳሜ) ነው። `scheduledGoals`፦ `completed` በነባሪ `false` መሆን አለበት። `time` አማራጭ ነው። `weeklyMission`፦ `deadline` የISO ሕብረቁምፊ መሆን አለበት፣ ብዙውን ጊዜ ካልተገለጸ ከዕቅዱ መጀመሪያ 7 ቀናት በኋላ። ለመስክ መረጃ ከውይይቱ ከጠፋ ወይም ግልጽ ካልሆነ፣ አስተዋይ ነባሪዎችን ይጠቀሙ ወይም አማራጭ መስኮችን ይተው። ውጤቱ የJSON ነገር ብቻ መሆን አለበት፣ በ `{` የሚጀምር እና በ `}` የሚጨርስ። ምንም ሌላ ጽሑፍ፣ ማብራሪያ፣ ወይም የማርክዳውን አጥር አያካትቱ።",
    aiTemplateCreatorInitialGreeting: "ሰላም! ግላዊ የሆነ ምርታማነት አብነት እንዲፈጥሩ ልረዳዎት እችላለሁ። ለመጀመር፣ ዋና ግብዎ ወይም ማሻሻል የሚፈልጉት አካባቢ ምንድን ነው? (ለምሳሌ፣ ለፈተና መዘጋጀት፣ የጎን ፕሮጀክት ማስተዳደር፣ ዕለታዊ ልምዶችን ማሻሻል)",
    aiTemplateCreatorReadyToGeneratePromptWord1: "ወደ አብነት ልቀይርልዎት", // AI ዝግጁነትን ለማዛመድ
    aiTemplateCreatorReadyToGeneratePromptWord2: "በዚህ ላይ ተመስርቼ አብነት ልፍጠር", // አማራጭ ማዛመጃ
    aiTemplateCreatorConfirmGenerateButton: "አዎ፣ አብነቱን ፍጠር",
    aiTemplateCreatorUserConfirmedGenerate: "አዎ፣ እባክዎ አብነቱን ይፍጠሩ።", // ቁልፉ ሲጫን የተጠቃሚ መልዕክት
    aiTemplateCreatorGeneratedSuccess: "በጣም ጥሩ! መረጃውን ወደ አብነት ቅርጸት ቀይሬዋለሁ።",
    aiTemplateCreatorGeneratedError: "አብነቱን በመፍጠር ላይ የተወሰነ ችግር አጋጥሞኛል። ጥቂት ፍላጎቶችዎን እንደገና በመግለጽ ወይም ተጨማሪ ዝርዝሮችን በማቅረብ እንደገና መሞከር ይችላሉ?",
    aiTemplateCreatorSummaryPrefix: "የፈጠርኩት አብነት ማጠቃለያ ይኸውና፦",
    weeklyMissionLabel: "ሳምንታዊ ተልዕኮ",
    habitsLabel: "ልምዶች",
    weeklyPlansLabel: "የሳምንታዊ ዕቅድ ግብ",
    scheduledGoalsLabel: "የታቀዱ ግቦች/ተግባራት",
    scheduledGoalsCountSuffix: "ንጥሎች",
    aiTemplateCreatorConfirmApplyPrompt: "ይህንን አብነት በፎከስ ፎርጅ ማዋቀርዎ ላይ መተግበር ይፈልጋሉ? \n\n<strong class='text-red-500 dark:text-red-400'>ማስጠንቀቂያ: ይህ አሁን ያሉትን ሳምንታዊ ዕቅዶችዎን፣ ልምዶችዎን፣ የታቀዱ ግቦችዎን እና ሳምንታዊ ተልዕኮዎን ይተካል።</strong>",
    aiTemplateCreatorApplyButton: "አብነት ተግብር",
    aiTemplateCreatorCancelButton: "ሰርዝ",
    aiTemplateCreatorApplySuccess: "አብነት በተሳካ ሁኔታ ተተግብሯል! ማዋቀርዎ ተዘምኗል።",
    aiTemplateCreatorApplySuccessAlert: "በAI የተፈጠረ አብነት ተተግብሯል!",
    aiTemplateCreatorApplyCancelledByResponse: "እሺ፣ አሁን አብነቱን አልተገበርኩትም። ሀሳብዎን ከቀየሩ ወይም ማስተካከያዎችን ማድረግ ከፈለጉ ያሳውቁኝ።",
    aiTemplateCreatorUserCancelledApply: "አይ፣ አሁን አይተገብሩት።",

    // Help Modal
    helpModalTitle: "የፎከስ ፎርጅ እገዛ",
    helpTipLabel: "ጠቃሚ ምክር",

    helpDashboardTitle: "ዳሽቦርድ",
    helpDashboardDesc: "የዕለት ተዕለት ማዘዣ ማዕከልዎ። ሁሉንም ነገር በአንድ እይታ ያሳያል፡ የዛሬው ዋና ተግባር፣ የትኩረት ሰዓት ቆጣሪ (ፖሞዶሮ)፣ የስሜትና የጉልበት ምዝገባ፣ ፈጣን ማስታወሻ መጣያ፣ ዕለታዊ ጥቅስ፣ እና የአንድ ሳምንት ተልዕኮዎ ቀሪ ጊዜ።",
    helpDashboardTip: "ቀንዎን አንድ ዋና ተግባር በመምረጥ ይጀምሩ። ለዚህ ተግባር ጥልቅ የስራ ክፍለ ጊዜዎችን ለማድረግ የፖሞዶሮ ሰዓት ቆጣሪን ይጠቀሙ። ስርዓተ ጥለቶችን ለመረዳት ስሜትዎንና ጉልበትዎን በመደበኛነት ይመዝግቡ። ጊዜያዊ ሀሳቦችን በፈጣን ማስታወሻ ይያዙ።",
    helpCalendarTitle: "የቀን መቁጠሪያ",
    helpCalendarDesc: "ጠቃሚ ተግባራትን، ቀጠሮዎችን، እና ቁልፍ ግቦችን ያቅዱ። የገቡትን ቃሎች በዓይነ ህሊናዎ ይሳሉ እና ቀናትዎን በብቃት ያቅዱ።",
    helpCalendarTip: "በጣም አስፈላጊ ለሆኑ ተግባራትዎ እና ግቦችዎ ጊዜ ይመድቡ። ዝግጁ ለመሆን የሚመጡ የመጨረሻ ቀናትን እና ክስተቶችን በመደበኛነት ይገምግሙ።",
    helpNotebookTitle: "ማስታወሻ ደብተር",
    helpNotebookDesc: "ለሀሳብ ማንሸራሸር፣ ዕለታዊ ማጠቃለያዎች፣ የአእምሮ ማጎልበት፣ እና ማንኛውም ረጅም ጽሑፍ የዲጂታል ማስታወሻ ደብተርዎ። ማስታወሻዎች በጊዜ የተመዘገቡ እና ሊፈለጉ የሚችሉ ናቸው።",
    helpNotebookTip: "ይህንን ቦታ ለዕለታዊ ሀሳብ ማንሸራሸር፣ ፈጣን ማስታወሻዎችን ለማስፋት፣ ወይም የቀኑን ስኬቶችዎንና ትምህርቶችዎን ለማጠቃለል ይጠቀሙ።",
    helpTimeTrackerTitle: "የጊዜ መከታተያ",
    helpTimeTrackerDesc: "የትኩረት የስራ ክፍለ ጊዜዎችዎን፣ እረፍቶችዎን፣ እና መዘናጊያዎችዎን ይመዝግቡ። ጊዜዎ በትክክል የት እንደሚሄድ ይረዱ። የፖሞዶሮ ክፍለ ጊዜዎች በራስ-ሰር ይመዘገባሉ።",
    helpTimeTrackerTip: "መዘናጊያዎችን ሲመዘግቡ ታማኝ ይሁኑ – ግንዛቤ እነሱን ለማሸነፍ የመጀመሪያው እርምጃ ነው። በፖሞዶሮ ያልተሸፈኑ ሌሎች ጠቃሚ እንቅስቃሴዎችን ወይም እረፍቶችን በእጅ ይጨምሩ።",
    helpReviewTitle: "ግምገማ",
    helpReviewDesc: "ድሎችን، ሽንፈቶችን/ተግዳሮቶችን በመከታተል، እና መዘናጊያዎችን በመተንተን ሳምንታዊ ግምገማዎችን ያካሂዱ። በእጅ የሚገቡ ግቤቶችን እና በሳምንታዊ መረጃዎ ላይ የተመሰረተ በAI የተፈጠረ ማጠቃለያ (የAI ግምገማ) ያቀርባል።",
    helpReviewTip: "በየሳምንቱ መጨረሻ ላይ ለማሰላሰል ጊዜ ይውሰዱ። ድሎችዎንና ሽንፈቶችዎን ይሙሉ. የሳምንቱን እንቅስቃሴዎችዎን ተጨባጭ ትንታኔ ለማግኘት እና የተስተካከሉ ምክሮችን ለማግኘት 'የAI ግምገማ ፍጠር' የሚለውን ቁልፍ ይጠቀሙ።",
    helpPlansTitle: "ዕቅዶች",
    helpPlansDesc: "ሳምንታዊ ግቦችዎን ያዘጋጁ እና ዋና ዋና ዓላማዎችን ወደ ተግባራዊ ተግባራት ይከፋፍሏቸው። ለሚቀጥለው ሳምንት ዋና ተልዕኮዎን ይግለጹ።",
    helpPlansTip: "ሳምንትዎን ግልጽ የሆነ ዋና ግብ በማውጣት ይጀምሩ። ከዚያም، ይህንን ለማሳካት የሚረዱዎትን 3-5 ዋና ተግባራት ይከፋፍሏቸው። ይህ አወቃቀር እና አቅጣጫ ይሰጣል።",
    helpDisciplineTitle: "የስነ-ስርዓት ሰሌዳ",
    helpDisciplineDesc: "ልምዶችዎን ይከታተሉ، አርኪ ተከታታይነቶችን ይገንቡ، እና ከተፈለገ እነሱን ለመዝለል የሚያስከትለውን ውጤት ያዘጋጁ። አዎንታዊ ባህሪያትን ያጠናክሩ።",
    helpDisciplineTip: "በአንድ ጊዜ በ1-3 ቁልፍ ልምዶች ላይ ያተኩሩ። ተከታታይነት ለመገንባት በየቀኑ ማጠናቀቅዎን ምልክት ያድርጉ። 'ውጤት' መግለጽ ለቃል ኪዳኖችዎ ለመቆም ተጨማሪ መነሳሳት ሊሰጥ ይችላል።",
    helpAiCoachTitle: "የAI ምርታማነት አሰልጣኝ",
    helpAiCoachDesc: "ከግል የAI ምርታማነት አሰልጣኝዎ ጋር ይወያዩ። ፈጣን ምክር፣ በውይይት ላይ የተመሰረቱ ግቤቶችዎን ማጠቃለያ ያግኙ፣ ወይም መነሳሳት ይጠይቁ። ለዝርዝር ሳምንታዊ ሪፖርቶች፣ በግምገማ ክፍል ውስጥ ያለውን የAI ግምገማ ባህሪ ይጠቀሙ።",
    helpAiCoachTip: "የAI አሰልጣኙን ለፈጣን ጥያቄዎች، ለአእምሮ ማጎልበት، ወይም የመነሳሳት ግፊት በሚፈልጉበት ጊዜ ይጠቀሙ። ሀሳቦችዎንና ድርጊቶችዎን በእውነተኛ ጊዜ ለማስኬድ ሊረዳዎ ይችላል።",
    helpAiTemplateCreatorTitle: "የAI አብነት ፈጣሪ",
    helpAiTemplateCreatorDesc: "ብጁ የሆነ ምርታማነት አብነት (ሳምንታዊ ተልዕኮ፣ ልምዶች፣ ዕቅዶች፣ ግቦች) ለመገንባት ከAI ጋር ይወያዩ። AI ፍላጎቶችዎን ለመረዳት ጥያቄዎችን ይጠይቅዎታል እና ከዚያም እርስዎ እንዲገመግሙትና እንዲተገብሩት አብነት ያዘጋጅልዎታል።",
    helpAiTemplateCreatorTip: "ስለ ግቦችዎ እና እንዴት እንደሚሰሩ ገላጭ ይሁኑ። የበለጠ መረጃ ባቀረቡ ቁጥር AI የተሻለ አብነት ሊያዘጋጅልዎት ይችላል። አብነቱ ከመተግበሩ በፊት ሁልጊዜ የማረጋገጫ ዕድል ያገኛሉ።",
    helpImportExportTitle: "አብነቶችን ማስመጣት/ማውጣት",
    helpImportExportDesc: "የአሁኑን ማዋቀርዎን (ሳምንታዊ ዕቅዶች፣ ልምዶች፣ የታቀዱ ግቦች፣ ሳምንታዊ ተልዕኮ) እንደ ሊወርድ የሚችል የJSON አብነት ፋይል እንዲያወጡ ያስችልዎታል። እንዲሁም ሌሎች ያጋሯቸውን የአብነት ፋይል ማስመጣት፣ ወይም አብሮ የተሰራውን የጀማሪ አብነት እንደ 'ሥራ ፈጣሪ ሞት ወይም ስኬት' አብነት በመተግበር ማዋቀራቸውን በፍጥነት መቀበል ይችላሉ።",
    helpImportExportTip: "የዕቅድ አወቃቀርዎን ምትኬ ለማስቀመጥ ወይም ስኬታማ ማዋቀሮችን ለማጋራት ማውጣትን ይጠቀሙ። በሚያስገቡበት ጊዜ (ከፋይል ወይም ከጀማሪ አብነት)፣ በእነዚህ ምድቦች ውስጥ ያለውን ነባር መረጃዎን ከማረጋገጫ በኋላ ስለሚተካ ጥንቃቄ ያድርጉ።",
    helpAboutTitle: "ስለ ፎከስ ፎርጅ",
    helpAboutDesc: "የተሰራው በ: ሰለሞን ትጋቡ።\n\nጊዜዬን በአግባቡ ለመጠቀም የምታገል የሙሉ ጊዜ ሥራ ፈጣሪ እንደመሆኔ፣ ፎከስ ፎርጅ ትኩረትንና ምርታማነትን በአንድ ቦታ ለማምጣት ተፈጥሯል። ይደሰቱበት!\n\nለማንኛውም ጥያቄ ወይም ለሌሎች ፕሮጀክቶች በ soltig66@gmail.com ያግኙኝ።",
    helpAboutTip: "የእርስዎ አስተያየት ፎከስ ፎርጅን ለማሻሻል ጠቃሚ ነው!",
    helpTelegramGroupTitle: "አስተያየት እና ማህበረሰብ",
    helpTelegramGroupDesc: "አስተያየትዎን ያጋሩ፣ ችግሮችን ሪፖርት ያድርጉ፣ አዲስ ባህሪያትን ይጠቁሙ፣ እና በማህበረሰብ የተፈጠሩ አብነቶችን ያግኙ። ፎከስ ፎርጅን በጋራ እንገንባ!",
    helpTelegramGroupButton: "የቴሌግራም ቡድኑን ይቀላቀሉ",

    // Theme Toggle
    themeToggleToDark: "ወደ ጨለማ ገጽታ ቀይር",
    themeToggleToLight: "ወደ ብሩህ ገጽታ ቀይር",

    // Star Rating
    starRatingLabel: "{value} ከ {count} ደረጃ ይስጡ",
    
    // Days of the week (short)
    daySun: "እሑድ",
    dayMon: "ሰኞ",
    dayTue: "ማክሰ",
    dayWed: "ረቡዕ",
    dayThu: "ሐሙስ",
    dayFri: "ዓርብ",
    daySat: "ቅዳሜ",
  }
};

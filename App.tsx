
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme, useLocalStorage } from './hooks';
import { Sidebar, MobileHeader, FloatingActionButtons, HelpModal, AiChatModal } from './uiElements';
import { DashboardPage, CalendarPage, NotebookPage, TimeTrackerPage, ReviewPage, PlansPage, DisciplineBoardPage, ImportExportPage, OnboardingPage } from './Pages';
import { STORAGE_KEYS, APP_NAME_TRANSLATION_KEY } from './constants';
import { ChatMessage, Language } from './types';
import { getAiChatResponse, loadData, saveData } from './services';
import { LanguageProvider, useLanguageContext } from './contexts'; // Import LanguageProvider

const MainApp: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language, t, setLanguage } = useLanguageContext(); // Consume language context

  // States for Modals
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAiChatModalOpen, setIsAiChatModalOpen] = useState(false);
  
  const [chatMessages, setChatMessages] = useLocalStorage<ChatMessage[]>(`${STORAGE_KEYS.NOTIFICATIONS}_aiChat`, []);
  const [isAiResponding, setIsAiResponding] = useState(false);

  const handleAiChatSend = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: Date.now(),
    };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setIsAiResponding(true);

    try {
      const aiResponseText = await getAiChatResponse(updatedMessages);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, aiMessage]);
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
  
  // Update document title with translated app name
  React.useEffect(() => {
    document.title = t(APP_NAME_TRANSLATION_KEY);
  }, [t, language]);


  return (
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
            <Route path="/" element={<DashboardPage />} />
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
          onAiCoachClick={() => setIsAiChatModalOpen(true)}
        />

        <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
        
        <AiChatModal
          isOpen={isAiChatModalOpen}
          onClose={() => setIsAiChatModalOpen(false)}
          chatMessages={chatMessages}
          onSendMessage={handleAiChatSend}
          isAiResponding={isAiResponding}
        />
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED, false);

  // This initial language load is for the OnboardingPage itself if it needs to access language before full context is ready for MainApp.
  // The LanguageProvider will manage the language for the MainApp.
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
                    saveData<Language>(STORAGE_KEYS.LANGUAGE, selectedLang); // Save chosen lang
                    setOnboardingCompleted(true);
                     // setLanguage in provider will be updated by this save & reload or context update
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


import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Theme, PomodoroMode, ChatMessage, Language, AiFeatureMode, FocusForgeTemplateData } from './types';
import { Icons, APP_NAME_TRANSLATION_KEY, STORAGE_KEYS } from './constants';
import { PomodoroSettings, usePomodoro } from './hooks';
import { useLanguageContext } from './contexts'; // Import useLanguageContext

// --- LanguageToggle Component ---
interface LanguageToggleProps {
  className?: string;
}
export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className }) => {
  const { language, setLanguage, t } = useLanguageContext();

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs sm:text-sm rounded-md transition-colors
                    ${language === 'en' ? 'bg-primary text-white font-semibold' : 'bg-transparent text-textlight-muted dark:text-textdark-muted hover:bg-bglight-muted dark:hover:bg-bgdark-muted'}`}
        aria-pressed={language === 'en'}
        aria-label={t('languageEnglish')}
      >
        {t('languageLabelEN')}
      </button>
      <button
        onClick={() => setLanguage('am')}
        className={`px-2 py-1 text-xs sm:text-sm rounded-md transition-colors
                    ${language === 'am' ? 'bg-primary text-white font-semibold' : 'bg-transparent text-textlight-muted dark:text-textdark-muted hover:bg-bglight-muted dark:hover:bg-bgdark-muted'}`}
        aria-pressed={language === 'am'}
        aria-label={t('languageAmharic')}
      >
        {t('languageLabelAM')}
      </button>
    </div>
  );
};


// --- Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; // Will be translated before passing
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; 
  contentClassName?: string;
  footerContent?: ReactNode; // Optional footer for modals
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md', contentClassName, footerContent }) => {
  const { t } = useLanguageContext();
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'w-full h-full sm:max-w-md sm:h-[90vh] md:max-w-lg md:h-[85vh] lg:max-w-xl'
  };
  
  const modalHeightClass = size === 'full' ? 'h-full sm:h-auto' : '';


  return (
    <div 
      className="fixed inset-0 bg-bgdark bg-opacity-70 dark:bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 p-0 sm:p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} 
    >
      <div 
        className={`bg-bglight dark:bg-bgdark-surface rounded-none sm:rounded-lg shadow-2xl w-full ${sizeClasses[size]} ${modalHeightClass} max-h-full sm:max-h-[95vh] transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow flex flex-col`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-semibold text-textlight dark:text-textdark">{title}</h3>
          <button
            onClick={onClose}
            className="text-textlight-muted dark:text-textdark-muted hover:text-red-500 dark:hover:text-red-400 transition-colors"
            aria-label={t('modalCloseButtonLabel')}
          >
            <Icons.XCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>
        <div className={`p-4 sm:p-6 overflow-y-auto flex-grow ${contentClassName}`}>
          {children}
        </div>
        {footerContent && (
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            {footerContent}
          </div>
        )}
      </div>
      <style>{`
        @keyframes modalShow {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalShow {
          animation: modalShow 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

// --- EditableField Component ---
interface EditableFieldProps {
  initialValue: string;
  onSave: (value: string) => void;
  placeholder?: string; // Will be translated before passing
  multiline?: boolean;
  label?: string; // Will be translated before passing
  inputClassName?: string;
  textClassName?: string;
}
export const EditableField: React.FC<EditableFieldProps> = ({ initialValue, onSave, placeholder, multiline = false, label, inputClassName, textClassName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { t } = useLanguageContext();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      } else if (inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    if (value.trim() !== initialValue.trim()) {
        onSave(value.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-textlight-muted dark:text-textdark-muted mb-1">{label}</label>}
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark focus:ring-2 focus:ring-primary focus:border-primary ${inputClassName || 'min-h-[80px]'}`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark focus:ring-2 focus:ring-primary focus:border-primary ${inputClassName}`}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full group" onClick={() => setIsEditing(true)}>
      {label && <label className="block text-sm font-medium text-textlight-muted dark:text-textdark-muted mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{label}</label>}
      <p className={`cursor-pointer hover:bg-bglight-muted dark:hover:bg-bgdark-muted p-2 rounded-md whitespace-pre-wrap break-words ${textClassName || 'text-lg'} ${value ? 'text-textlight dark:text-textdark' : 'text-textlight-muted dark:text-textdark-muted'}`}>
        {value || placeholder || t('editableFieldDefaultPlaceholder')}
      </p>
    </div>
  );
};


// --- LoadingSpinner Component ---
export const LoadingSpinner: React.FC<{size?: string; color?: string; className?: string}> = ({ size = 'w-8 h-8', color = 'border-primary', className }) => (
  <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color} ${className}`}></div>
);

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'fab';
  size?: 'sm' | 'md' | 'lg' | 'fab';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isRound?: boolean;
  translationKey?: string; // Optional key for translating button text
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', leftIcon, rightIcon, className, isRound, translationKey, ...props }) => {
  const { t } = useLanguageContext();
  const buttonText = translationKey ? t(translationKey) : children;

  const baseStyles = "font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-150 ease-in-out inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-primary hover:bg-primary-dark text-white focus:ring-primary-light",
    secondary: "bg-bglight-muted dark:bg-bgdark-muted text-textlight dark:text-textdark hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400 border border-gray-300 dark:border-gray-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
    ghost: "bg-transparent text-primary hover:bg-primary/10 focus:ring-primary/50",
    fab: "bg-primary hover:bg-primary-dark text-white focus:ring-primary-light shadow-lg",
  };

  const sizeStyles = {
    sm: `px-3 py-1.5 text-xs sm:text-sm ${isRound ? 'p-2' : ''}`,
    md: `px-4 py-2 text-sm sm:text-base ${isRound ? 'p-3' : ''}`,
    lg: `px-5 py-2.5 text-base sm:text-lg ${isRound ? 'p-4' : ''}`,
    fab: `p-3 sm:p-4 ${isRound ? '' : ''}`,
  };
  
  const roundClass = isRound ? 'rounded-full' : 'rounded-md';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundClass} ${className}`}
      {...props}
    >
      {leftIcon && !buttonText && <span className="m-auto">{leftIcon}</span>}
      {leftIcon && buttonText && <span className="mr-2">{leftIcon}</span>}
      {buttonText}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};


// --- PomodoroControls Component ---
interface PomodoroControlsProps {
  pomodoro: ReturnType<typeof usePomodoro>;
  breakInvitationMessage?: string | null;
}
export const PomodoroControls: React.FC<PomodoroControlsProps> = ({ pomodoro, breakInvitationMessage }) => {
  const { 
    timeLeft, 
    isRunning, 
    mode, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    skipBreak, 
    changeMode,
    isFocusMusicMuted,
    toggleFocusMusicMute,
    customFocusMusicFileName,
    handleFocusMusicUpload
  } = pomodoro;
  const { t } = useLanguageContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = () => {
    let totalDuration;
    if (mode === PomodoroMode.Work) totalDuration = pomodoro.settings.workDuration * 60;
    else if (mode === PomodoroMode.ShortBreak) totalDuration = pomodoro.settings.shortBreakDuration * 60;
    else totalDuration = pomodoro.settings.longBreakDuration * 60;
    if (totalDuration === 0) return 0;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };
  
  const activeModeClasses = "bg-primary text-white";
  const inactiveModeClasses = "bg-bglight-muted dark:bg-bgdark-muted text-textlight dark:text-textdark hover:bg-gray-200 dark:hover:bg-gray-600";

  const modeTranslations: Record<PomodoroMode, string> = {
    [PomodoroMode.Work]: t('pomodoroModeFocus'),
    [PomodoroMode.ShortBreak]: t('pomodoroModeShortBreak'),
    [PomodoroMode.LongBreak]: t('pomodoroModeLongBreak'),
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFocusMusicUpload(file);
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-lg shadow-lg bg-bglight-surface dark:bg-bgdark-surface text-center w-full max-w-md mx-auto">
      <div className="flex justify-center space-x-1 sm:space-x-2 mb-4 sm:mb-6">
        <Button size="sm" onClick={() => changeMode(PomodoroMode.Work)} className={`${mode === PomodoroMode.Work ? activeModeClasses : inactiveModeClasses}`}>{modeTranslations[PomodoroMode.Work]}</Button>
        <Button size="sm" onClick={() => changeMode(PomodoroMode.ShortBreak)} className={`${mode === PomodoroMode.ShortBreak ? activeModeClasses : inactiveModeClasses}`}>{modeTranslations[PomodoroMode.ShortBreak]}</Button>
        <Button size="sm" onClick={() => changeMode(PomodoroMode.LongBreak)} className={`${mode === PomodoroMode.LongBreak ? activeModeClasses : inactiveModeClasses}`}>{modeTranslations[PomodoroMode.LongBreak]}</Button>
      </div>

      <div className="relative w-36 h-36 sm:w-48 sm:h-48 mx-auto mb-4 sm:mb-6">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="2"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-primary"
            strokeWidth="2"
            strokeDasharray={`${progressPercentage()}, 100`}
            strokeLinecap="round"
            fill="none"
            transform="rotate(-90 18 18)"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl sm:text-5xl font-bold text-textlight dark:text-textdark">{formatTime(timeLeft)}</div>
            <div className="text-xs sm:text-sm text-textlight-muted dark:text-textdark-muted">{modeTranslations[mode]}</div>
        </div>
      </div>
      
      <div className="flex justify-center items-center space-x-2 sm:space-x-3">
        {!isRunning ? (
          <Button onClick={startTimer} size="md" variant="primary" leftIcon={<Icons.Play className="w-5 h-5 sm:w-6 sm:h-6" />} translationKey="pomodoroButtonStart"/>
        ) : (
          <Button onClick={pauseTimer} size="md" variant="secondary" leftIcon={<Icons.Pause className="w-5 h-5 sm:w-6 sm:h-6" />} translationKey="pomodoroButtonPause"/>
        )}
        <Button onClick={resetTimer} size="md" variant="ghost" leftIcon={<Icons.Stop className="w-5 h-5 sm:w-6 sm:h-6" />} translationKey="pomodoroButtonReset"/>
        {mode === PomodoroMode.Work && customFocusMusicFileName && isRunning && (
            <Button 
                onClick={toggleFocusMusicMute} 
                variant="ghost" 
                size="sm" 
                isRound 
                aria-label={isFocusMusicMuted ? t('pomodoroUnmuteFocusMusic') : t('pomodoroMuteFocusMusic')}
                className="p-2"
            >
                {isFocusMusicMuted ? <Icons.SpeakerXMark className="w-5 h-5" /> : <Icons.SpeakerWave className="w-5 h-5" />}
            </Button>
        )}
      </div>

      {(mode === PomodoroMode.ShortBreak || mode === PomodoroMode.LongBreak) && isRunning && (
        <Button onClick={skipBreak} variant="ghost" size="sm" className="mt-3 text-xs sm:text-sm text-primary" translationKey="pomodoroButtonSkipBreak"/>
      )}
      <p className="text-xs sm:text-sm text-textlight-muted dark:text-textdark-muted mt-3">{t('dashboardPomodorosCompleted', { count: pomodoro.pomodorosCompleted })}</p>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <input 
            type="file" 
            accept="audio/*" 
            onChange={handleFileChange} 
            className="hidden" 
            ref={fileInputRef} 
            id="focus-music-upload"
        />
        <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="secondary" 
            size="sm" 
            leftIcon={<Icons.MusicNote className="w-4 h-4" />}
            translationKey="pomodoroUploadFocusMusicLabel"
            className="w-full sm:w-auto"
        />
        {customFocusMusicFileName ? (
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-textlight-muted dark:text-textdark-muted">
                <span>{t('pomodoroFocusMusicPlaying', {fileName: customFocusMusicFileName})}</span>
                <Button 
                    onClick={() => handleFocusMusicUpload(null)} 
                    variant="ghost" 
                    size="sm" 
                    isRound
                    className="p-1 text-red-500 hover:bg-red-500/10"
                    aria-label={t('pomodoroClearFocusMusicLabel')}
                >
                    <Icons.XCircle className="w-4 h-4" />
                </Button>
            </div>
        ) : (
            <p className="text-xs sm:text-sm text-textlight-muted dark:text-textdark-muted">{t('pomodoroNoFocusMusicSelected')}</p>
        )}
         <p className="text-xs text-textlight-muted dark:text-textdark-muted italic">{t('pomodoroFocusMusicNote')}</p>
      </div>

      {breakInvitationMessage && (
        <p className="mt-2 text-sm text-accent dark:text-accent font-semibold animate-pulse">{breakInvitationMessage}</p>
      )}
    </div>
  );
};

// --- StarRating Component ---
interface StarRatingProps {
  count: number;
  value: number;
  onChange: (value: number) => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
}
export const StarRating: React.FC<StarRatingProps> = ({
  count,
  value,
  onChange,
  size = 24,
  activeColor = "text-yellow-400",
  inactiveColor = "text-gray-300 dark:text-gray-600",
}) => {
  const { t } = useLanguageContext();
  const stars = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <div className="flex items-center">
      {stars.map((starValue) => (
        <button
          key={starValue}
          onClick={() => onChange(starValue)}
          onMouseOver={(e) => { 
            const parent = e.currentTarget.parentElement;
            if(parent) {
                Array.from(parent.children).forEach((child, index) => {
                    if (index < starValue && child instanceof HTMLElement) child.classList.add(...activeColor.split(' ')); 
                    else if (child instanceof HTMLElement) child.classList.remove(...activeColor.split(' '));
                });
            }
          }}
          onMouseLeave={(e) => { 
            const parent = e.currentTarget.parentElement;
            if(parent) {
                Array.from(parent.children).forEach((child, index) => {
                    if (index < value && child instanceof HTMLElement) child.classList.add(...activeColor.split(' '));
                    else if (child instanceof HTMLElement) child.classList.remove(...activeColor.split(' '));
                });
            }
          }}
          className={`cursor-pointer transition-colors ${
            starValue <= value ? activeColor : inactiveColor
          }`}
          style={{ width: size, height: size }}
          aria-label={t('starRatingLabel', { value: starValue, count })}
        >
          <Icons.Star className="w-full h-full" />
        </button>
      ))}
    </div>
  );
};

// --- ThemeToggle Component ---
interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
  className?: string;
}
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme, className }) => {
  const { t } = useLanguageContext();
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full hover:bg-bglight-muted dark:hover:bg-bgdark-muted transition-colors ${className}`}
      aria-label={theme === 'light' ? t('themeToggleToDark') : t('themeToggleToLight')}
    >
      {theme === 'light' ? (
        <Icons.Moon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      ) : (
        <Icons.Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
      )}
    </button>
  );
};

// --- Sidebar Component ---
interface SidebarProps {
  theme: Theme;
  toggleTheme: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export const Sidebar: React.FC<SidebarProps> = ({ theme, toggleTheme, isOpen, setIsOpen }) => {
  const { t } = useLanguageContext();
  const navItems = [
    { nameKey: 'sidebarNavDashboard', path: '/', icon: <Icons.Dashboard className="w-5 h-5" /> },
    { nameKey: 'sidebarNavCalendar', path: '/calendar', icon: <Icons.Calendar className="w-5 h-5" /> },
    { nameKey: 'sidebarNavNotebook', path: '/notebook', icon: <Icons.Notebook className="w-5 h-5" /> },
    { nameKey: 'sidebarNavTimeTracker', path: '/timetracker', icon: <Icons.Clock className="w-5 h-5" /> },
    { nameKey: 'sidebarNavReview', path: '/review', icon: <Icons.ChartBar className="w-5 h-5" /> },
    { nameKey: 'sidebarNavPlans', path: '/plans', icon: <Icons.Flag className="w-5 h-5" /> },
    { nameKey: 'sidebarNavDiscipline', path: '/discipline', icon: <Icons.ShieldCheck className="w-5 h-5" /> },
    { nameKey: 'sidebarNavImportExport', path: '/import-export', icon: <Icons.ArrowUpTray className="w-5 h-5" /> },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <div 
        className={`
          fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out 
          w-64 bg-bglight-surface dark:bg-bgdark-surface h-screen p-4 flex flex-col 
          shadow-lg border-r border-gray-200 dark:border-gray-700
          overflow-y-auto flex-shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:shadow-lg md:border-r
        `}
        aria-label={t('sidebarNavDashboard')} // A general label for main navigation
      >
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="text-2xl sm:text-3xl font-bold text-primary text-center md:text-left w-full">
            {t(APP_NAME_TRANSLATION_KEY)}
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-textlight-muted dark:text-textdark-muted hover:text-primary">
            <Icons.XCircle className="w-7 h-7" />
          </button>
        </div>
        <nav className="flex-grow">
          <ul>
            {navItems.map((item) => (
              <li key={item.nameKey} className="mb-2">
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)} 
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-md transition-colors
                    ${isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-textlight-muted dark:text-textdark-muted hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary'}`
                  }
                >
                  {item.icon}
                  <span>{t(item.nameKey)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto hidden md:block space-y-2">
          <LanguageToggle />
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </>
  );
};

// --- MobileHeader Component ---
interface MobileHeaderProps {
  toggleSidebar: () => void;
  theme: Theme;
  toggleTheme: () => void;
}
export const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleSidebar, theme, toggleTheme }) => {
  const { t } = useLanguageContext();
  return (
    <header className="md:hidden sticky top-0 z-20 bg-bglight-surface dark:bg-bgdark-surface shadow-md p-3 flex items-center justify-between">
      <Button onClick={toggleSidebar} variant="ghost" size="sm" aria-label={t('sidebarNavDashboard')}>
        <Icons.Menu className="w-6 h-6" />
      </Button>
      <h1 className="text-xl font-bold text-primary">{t(APP_NAME_TRANSLATION_KEY)}</h1>
      <div className="flex items-center space-x-1">
        <LanguageToggle />
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
};


// Card Component
interface CardProps {
  title?: string; // Will be translated before passing
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>; 
}

export const Card: React.FC<CardProps> = ({ title, children, className, icon, titleClassName }) => {
  return (
    <div className={`bg-bglight-surface dark:bg-bgdark-surface rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
      {title && (
        <div className="flex items-center mb-3 sm:mb-4">
          {icon && <span className="mr-2 sm:mr-3 text-primary">{React.cloneElement(icon, { className: "w-5 h-5 sm:w-6 sm:h-6"})}</span>}
          <h3 className={`text-lg sm:text-xl font-semibold text-textlight dark:text-textdark ${titleClassName}`}>{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

// --- FloatingActionButtons Component ---
interface FloatingActionButtonsProps {
  onHelpClick: () => void;
  onAiFeatureSelectClick: () => void;
}
export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({ onHelpClick, onAiFeatureSelectClick }) => {
  const { t } = useLanguageContext();
  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-30 grid-rows-2">
      <div><Button
        onClick={onHelpClick}
        variant="fab"
        size="fab"
        isRound
        aria-label={t('helpModalTitle')}
        className="bg-secondary hover:bg-secondary-dark dark:bg-secondary-dark dark:hover:bg-secondary text-textlight dark:text-textdark"
      >
        <Icons.QuestionMarkCircle className="w-5 h-5 sm:w-5 h-5" />
      </Button></div>
      <div><Button
        onClick={onAiFeatureSelectClick} // Changed from onAiCoachClick
        variant="fab"
        size="fab"
        isRound
        aria-label={t('aiFeatureSelectionTitle')} // Changed from aiCoachModalTitle
      >
        <Icons.Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
      </Button></div>
    </div>
  );
};

// --- HelpModal Component ---
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguageContext();
  const helpContent = [
    { titleKey: "helpDashboardTitle", descriptionKey: "helpDashboardDesc", tipKey: "helpDashboardTip" },
    { titleKey: "helpCalendarTitle", descriptionKey: "helpCalendarDesc", tipKey: "helpCalendarTip" },
    { titleKey: "helpNotebookTitle", descriptionKey: "helpNotebookDesc", tipKey: "helpNotebookTip" },
    { titleKey: "helpTimeTrackerTitle", descriptionKey: "helpTimeTrackerDesc", tipKey: "helpTimeTrackerTip" },
    { titleKey: "helpReviewTitle", descriptionKey: "helpReviewDesc", tipKey: "helpReviewTip" },
    { titleKey: "helpPlansTitle", descriptionKey: "helpPlansDesc", tipKey: "helpPlansTip" },
    { titleKey: "helpDisciplineTitle", descriptionKey: "helpDisciplineDesc", tipKey: "helpDisciplineTip" },
    { titleKey: "helpAiCoachTitle", descriptionKey: "helpAiCoachDesc", tipKey: "helpAiCoachTip" },
    { titleKey: "helpAiTemplateCreatorTitle", descriptionKey: "helpAiTemplateCreatorDesc", tipKey: "helpAiTemplateCreatorTip" },
    { titleKey: "helpImportExportTitle", descriptionKey: "helpImportExportDesc", tipKey: "helpImportExportTip" },
    { titleKey: "helpAboutTitle", descriptionKey: "helpAboutDesc", tipKey: "helpAboutTip" }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('helpModalTitle')} size="lg">
      <div className="space-y-4 text-sm sm:text-base">
        {helpContent.map(item => (
          <div key={item.titleKey}>
            <h4 className="font-semibold text-md sm:text-lg text-primary mb-1">{t(item.titleKey)}</h4>
            <p className="mb-1 text-textlight dark:text-textdark whitespace-pre-line">{t(item.descriptionKey)}</p>
            <p className="text-xs sm:text-sm text-textlight-muted dark:text-textdark-muted italic"><strong>{t('helpTipLabel')}:</strong> {t(item.tipKey)}</p>
          </div>
        ))}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-md sm:text-lg text-primary mb-2">{t('helpTelegramGroupTitle')}</h4>
          <p className="mb-3 text-textlight dark:text-textdark whitespace-pre-line">{t('helpTelegramGroupDesc')}</p>
          <Button
            onClick={() => window.open('https://t.me/focus_forge', '_blank', 'noopener,noreferrer')}
            variant="secondary"
            className="w-full"
            leftIcon={<Icons.ChatBubbleLeftEllipsis className="w-5 h-5" />}
            translationKey="helpTelegramGroupButton"
          />
        </div>
      </div>
    </Modal>
  );
};


// --- AiFeatureSelectionModal Component ---
interface AiFeatureSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFeature: (feature: AiFeatureMode) => void;
}
export const AiFeatureSelectionModal: React.FC<AiFeatureSelectionModalProps> = ({ isOpen, onClose, onSelectFeature }) => {
  const { t } = useLanguageContext();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('aiFeatureSelectionTitle')} size="sm">
      <div className="space-y-3">
        <Button 
          onClick={() => onSelectFeature(AiFeatureMode.Coach)}
          variant="secondary" 
          className="w-full"
          leftIcon={<Icons.ChatBubbleLeftEllipsis className="w-5 h-5" />}
        >
          {t('aiFeatureCoachButton')}
        </Button>
        <Button 
          onClick={() => onSelectFeature(AiFeatureMode.TemplateCreator)}
          variant="secondary" 
          className="w-full"
          leftIcon={<Icons.Template className="w-5 h-5" />}
        >
          {t('aiFeatureTemplateCreatorButton')}
        </Button>
      </div>
    </Modal>
  );
};


// --- AiChatModal Component ---
interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiMode: AiFeatureMode;
  chatMessages: ChatMessage[];
  onSendMessage: (messageText: string, action?: 'confirm_generate_template' | 'confirm_apply_template') => Promise<void>;
  onApplyGeneratedTemplate?: (templateData: FocusForgeTemplateData) => void;
  isAiResponding: boolean;
  currentTemplateDataToApply?: FocusForgeTemplateData | null; // For TemplateCreator mode
}
export const AiChatModal: React.FC<AiChatModalProps> = ({ 
    isOpen, 
    onClose, 
    aiMode,
    chatMessages, 
    onSendMessage, 
    onApplyGeneratedTemplate,
    isAiResponding,
    currentTemplateDataToApply // This prop seems unused, but keeping it as it was in the original structure.
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguageContext();

  const modalTitle = aiMode === AiFeatureMode.Coach ? t('aiCoachModalTitle') : t('aiTemplateCreatorModalTitle');
  const inputPlaceholder = aiMode === AiFeatureMode.Coach ? t('aiCoachInputPlaceholder') : t('aiTemplateCreatorInputPlaceholder');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const handleSend = async (
    explicitMessageTextArg?: string | null, // If string, use it as message. If null, use newMessage from state.
    actionTypeArg?: 'confirm_generate_template' | 'confirm_apply_template'
  ) => {
    const textToUse = (typeof explicitMessageTextArg === 'string') ? explicitMessageTextArg : newMessage;
    const actionToUse = actionTypeArg;

    // Prevent sending if not an action, text is empty, and no template is pending to apply (original condition)
    if (!actionToUse && textToUse.trim() === '' && !latestMessage?.templateData) return;
    
    // Prevent sending general messages if AI is responding (action buttons have their own disabled state)
    if (isAiResponding && !actionToUse) {
      return;
    }

    if (typeof explicitMessageTextArg !== 'string') { // Only clear input if message came from state (newMessage)
      setNewMessage('');
    }
    await onSendMessage(textToUse, actionToUse);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(null); // Send message from input, no specific action
    }
  };

  const latestMessage = chatMessages[chatMessages.length -1];
  const showGenerateTemplateButton = aiMode === AiFeatureMode.TemplateCreator && latestMessage?.sender === 'ai' && latestMessage?.expectsConfirmation === 'generate_template';
  const showApplyTemplateButtons = aiMode === AiFeatureMode.TemplateCreator && latestMessage?.sender === 'ai' && latestMessage?.expectsConfirmation === 'apply_template' && latestMessage?.templateData && onApplyGeneratedTemplate;


  const chatInputFooter = (
      <div className="flex items-center space-x-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={inputPlaceholder}
          className="flex-grow p-2 sm:p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-bglight-surface dark:bg-bgdark text-textlight dark:text-textdark focus:ring-1 focus:ring-primary focus:border-primary resize-none text-sm sm:text-base"
          rows={1}
          disabled={isAiResponding || showGenerateTemplateButton || !!showApplyTemplateButtons}
          aria-label={inputPlaceholder}
        />
        <Button onClick={() => handleSend(null)} disabled={isAiResponding || !newMessage.trim() || showGenerateTemplateButton || !!showApplyTemplateButtons} size="md" isRound aria-label={t('aiCoachSendButtonLabel')}>
          <Icons.PaperAirplane className="w-5 h-5" />
        </Button>
      </div>
  );
  
  const templateActionFooter = (
    <div className="space-y-2">
        {showGenerateTemplateButton && (
            <Button onClick={() => handleSend('', 'confirm_generate_template')} variant="primary" className="w-full" translationKey="aiTemplateCreatorConfirmGenerateButton" disabled={isAiResponding} />
        )}
        {showApplyTemplateButtons && latestMessage.templateData && onApplyGeneratedTemplate && (
            <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
                <Button onClick={() => {
                    if (latestMessage.templateData) {
                       onApplyGeneratedTemplate(latestMessage.templateData);
                       onClose(); // Close modal after applying
                    }
                }} variant="primary" className="w-full sm:flex-1" translationKey="aiTemplateCreatorApplyButton" disabled={isAiResponding} />
                <Button onClick={() => handleSend(t('aiTemplateCreatorUserCancelledApply'), 'confirm_apply_template')} variant="secondary" className="w-full sm:flex-1" translationKey="aiTemplateCreatorCancelButton" disabled={isAiResponding}/>
            </div>
        )}
    </div>
  );


  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={modalTitle} 
        size="full" 
        contentClassName="flex flex-col !p-0 sm:!p-0"
        footerContent={showGenerateTemplateButton || showApplyTemplateButtons ? templateActionFooter : chatInputFooter}
    >
      <div className="flex-grow overflow-y-auto space-y-3 sm:space-y-4 p-3 sm:p-4 mb-2 sm:mb-3">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg shadow ${
              msg.sender === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-bglight-muted dark:bg-bgdark-muted text-textlight dark:text-textdark rounded-bl-none'
            }`}>
              <div className="flex items-start space-x-2">
                {msg.sender === 'ai' && (aiMode === AiFeatureMode.Coach ? <Icons.ChatBubbleLeftEllipsis className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" /> : <Icons.Template className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />)}
                <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{msg.text}</p>
                {msg.sender === 'user' && <Icons.UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 flex-shrink-0 mt-0.5" />}
              </div>
               <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-right text-blue-200' : 'text-left text-textlight-muted dark:text-textdark-muted'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isAiResponding && (
          <div className="flex justify-start">
            <div className="max-w-[75%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg shadow bg-bglight-muted dark:bg-bgdark-muted text-textlight dark:text-textdark rounded-bl-none">
              <LoadingSpinner size="w-5 h-5" className="self-center"/>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </Modal>
  );
};

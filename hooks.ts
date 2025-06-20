import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadData, saveData } from './services';
import { Theme, PomodoroMode } from './types';
import { 
    STORAGE_KEYS, 
    POMODORO_WORK_DURATION_MINUTES, 
    POMODORO_SHORT_BREAK_DURATION_MINUTES, 
    POMODORO_LONG_BREAK_DURATION_MINUTES, 
    POMODOROS_BEFORE_LONG_BREAK,
    TIMER_END_SOUND_URL
} from './constants';

// --- Theme Hook ---
export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>(() => loadData<Theme>(STORAGE_KEYS.THEME, 'light'));

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveData<Theme>(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
};

// --- LocalStorage Hook ---
export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return loadData<T>(key, initialValue);
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    saveData<T>(key, valueToStore);
  };

  return [storedValue, setValue];
}

// --- Pomodoro Hook ---
export interface PomodoroSettings {
  workDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  pomodorosBeforeLongBreak: number;
}

const defaultPomodoroSettings: PomodoroSettings = {
  workDuration: POMODORO_WORK_DURATION_MINUTES,
  shortBreakDuration: POMODORO_SHORT_BREAK_DURATION_MINUTES,
  longBreakDuration: POMODORO_LONG_BREAK_DURATION_MINUTES,
  pomodorosBeforeLongBreak: POMODOROS_BEFORE_LONG_BREAK,
};

export const usePomodoro = (onTimerEnd?: (endedMode: PomodoroMode, newMode: PomodoroMode, completedPomodoros: number) => void) => {
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>(STORAGE_KEYS.POMODORO_SETTINGS, defaultPomodoroSettings);
  
  const [mode, setMode] = useState<PomodoroMode>(PomodoroMode.Work);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  
  const [customFocusMusicObjectURL, setCustomFocusMusicObjectURL] = useState<string | null>(null);
  const [customFocusMusicFileName, setCustomFocusMusicFileName] = useState<string | null>(null);
  const [isFocusMusicMuted, setIsFocusMusicMuted] = useState(false);

  const focusMusicAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerEndSoundAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastHiddenTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    focusMusicAudioRef.current = new Audio();
    focusMusicAudioRef.current.loop = true;
    timerEndSoundAudioRef.current = new Audio();

    return () => {
      focusMusicAudioRef.current?.pause();
      focusMusicAudioRef.current = null;
      timerEndSoundAudioRef.current?.pause();
      timerEndSoundAudioRef.current = null;
      if (customFocusMusicObjectURL) {
        URL.revokeObjectURL(customFocusMusicObjectURL);
      }
    };
  }, []); 
  
  useEffect(() => {
    if (focusMusicAudioRef.current) {
        focusMusicAudioRef.current.volume = isFocusMusicMuted ? 0 : 0.3; // Default soft volume
    }
  }, [isFocusMusicMuted]);

  useEffect(() => {
    if (!isRunning) { 
        if (mode === PomodoroMode.Work) {
            setTimeLeft(settings.workDuration * 60);
        } else if (mode === PomodoroMode.ShortBreak) {
            setTimeLeft(settings.shortBreakDuration * 60);
        } else if (mode === PomodoroMode.LongBreak) {
            setTimeLeft(settings.longBreakDuration * 60);
        }
    }
  }, [settings, mode]); // Removed isRunning from dependency array to prevent reset on pause/resume. Time reset only happens on mode/settings change IF NOT RUNNING.

  useEffect(() => {
    let timerId: number | undefined;

    if (isRunning && timeLeft > 0) {
      timerId = window.setInterval(() => {
        setTimeLeft((prevTime) => Math.max(0, prevTime - 1)); // Ensure timeLeft doesn't go below 0 during interval
      }, 1000);
    } else if (isRunning && timeLeft <= 0) { // Changed to <= 0 for robustness
      setIsRunning(false);
      const endedMode = mode;

      if (endedMode === PomodoroMode.Work && focusMusicAudioRef.current) {
        focusMusicAudioRef.current.pause();
        focusMusicAudioRef.current.currentTime = 0;
      }
      
      if (timerEndSoundAudioRef.current) {
        timerEndSoundAudioRef.current.src = TIMER_END_SOUND_URL;
        timerEndSoundAudioRef.current.play().catch(e => console.warn("Timer end sound play failed:", e)); 
      }
      
      let newPomodorosCompleted = pomodorosCompleted;
      let nextMode: PomodoroMode;

      if (endedMode === PomodoroMode.Work) {
        newPomodorosCompleted = pomodorosCompleted + 1;
        setPomodorosCompleted(newPomodorosCompleted);
        if (newPomodorosCompleted % settings.pomodorosBeforeLongBreak === 0) {
          nextMode = PomodoroMode.LongBreak;
        } else {
          nextMode = PomodoroMode.ShortBreak;
        }
      } else { 
        nextMode = PomodoroMode.Work;
      }
      
      setMode(nextMode); 

      if (onTimerEnd) {
        onTimerEnd(endedMode, nextMode, newPomodorosCompleted);
      }
    }
    return () => window.clearInterval(timerId);
  }, [isRunning, timeLeft, mode, pomodorosCompleted, settings, onTimerEnd]);

  // Effect to handle page visibility changes for timer accuracy
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isRunning) return;

      if (document.hidden) {
        lastHiddenTimestampRef.current = Date.now();
      } else {
        if (lastHiddenTimestampRef.current) {
          const elapsedMilliseconds = Date.now() - lastHiddenTimestampRef.current;
          const elapsedSeconds = Math.round(elapsedMilliseconds / 1000);
          setTimeLeft(prevTimeLeft => Math.max(0, prevTimeLeft - elapsedSeconds));
          lastHiddenTimestampRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning]); // Only depends on isRunning

  const handleFocusMusicUpload = useCallback((file: File | null) => {
    if (customFocusMusicObjectURL) {
      URL.revokeObjectURL(customFocusMusicObjectURL);
      setCustomFocusMusicObjectURL(null);
      setCustomFocusMusicFileName(null);
      if(focusMusicAudioRef.current) {
        focusMusicAudioRef.current.pause();
        focusMusicAudioRef.current.src = ""; 
      }
    }
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setCustomFocusMusicObjectURL(objectURL);
      setCustomFocusMusicFileName(file.name);
      if (focusMusicAudioRef.current) {
        focusMusicAudioRef.current.src = objectURL;
        if (isRunning && mode === PomodoroMode.Work) { 
          focusMusicAudioRef.current.play().catch(e => console.warn("Custom focus music play failed:", e));
        }
      }
    }
  }, [customFocusMusicObjectURL, isRunning, mode]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    // If timer was paused and timeLeft is 0 due to background adjustment, trigger end logic immediately
    if (timeLeft <= 0) {
         setTimeLeft(0); // Ensure timeLeft is exactly 0 to trigger end logic in the main timer useEffect
    }
    if (mode === PomodoroMode.Work && customFocusMusicObjectURL && focusMusicAudioRef.current) {
        if (focusMusicAudioRef.current.src !== customFocusMusicObjectURL) { 
             focusMusicAudioRef.current.src = customFocusMusicObjectURL;
        }
        focusMusicAudioRef.current.play().catch(e => console.warn("Custom focus music play failed:", e));
    }
  }, [mode, customFocusMusicObjectURL, timeLeft]); // Added timeLeft

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    if (focusMusicAudioRef.current) {
        focusMusicAudioRef.current.pause();
    }
  }, []);
  
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    if (focusMusicAudioRef.current) {
        focusMusicAudioRef.current.pause();
        focusMusicAudioRef.current.currentTime = 0;
    }
    setMode(PomodoroMode.Work);
    setTimeLeft(settings.workDuration * 60); 
    setPomodorosCompleted(0); 
  }, [settings.workDuration]);

  const skipBreak = useCallback(() => {
    if (mode === PomodoroMode.ShortBreak || mode === PomodoroMode.LongBreak) {
      setIsRunning(false);
      setMode(PomodoroMode.Work); 
    }
  }, [mode]); 

  const changeMode = useCallback((newMode: PomodoroMode) => {
    setIsRunning(false); 
    if (focusMusicAudioRef.current) {
        focusMusicAudioRef.current.pause(); 
        if (newMode !== PomodoroMode.Work) { 
             focusMusicAudioRef.current.currentTime = 0;
        }
    }
    // Time will be reset by the useEffect that depends on [settings, mode]
    setMode(newMode); 
  }, []); 

  const toggleFocusMusicMute = useCallback(() => {
    setIsFocusMusicMuted(prev => !prev);
  }, []);

  return {
    timeLeft,
    isRunning,
    mode,
    pomodorosCompleted,
    isFocusMusicMuted,
    customFocusMusicObjectURL,
    customFocusMusicFileName,
    handleFocusMusicUpload,
    startTimer,
    pauseTimer,
    resetTimer,
    skipBreak,
    changeMode,
    toggleFocusMusicMute,
    settings,
    setSettings
  };
};
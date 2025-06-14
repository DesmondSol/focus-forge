
import React, { useState, useEffect, useCallback } from 'react';
import { loadData, saveData } from './services';
import { Theme, PomodoroMode } from './types';
import { STORAGE_KEYS, POMODORO_WORK_DURATION_MINUTES, POMODORO_SHORT_BREAK_DURATION_MINUTES, POMODORO_LONG_BREAK_DURATION_MINUTES, POMODOROS_BEFORE_LONG_BREAK } from './constants';

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

export const usePomodoro = (onTimerEnd?: (mode: PomodoroMode, completedPomodoros: number) => void) => {
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>(STORAGE_KEYS.POMODORO_SETTINGS, defaultPomodoroSettings);
  
  const [mode, setMode] = useState<PomodoroMode>(PomodoroMode.Work);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  useEffect(() => {
    // Update timeLeft if settings change and timer is not running for the current mode
    if (!isRunning) {
        if (mode === PomodoroMode.Work) setTimeLeft(settings.workDuration * 60);
        else if (mode === PomodoroMode.ShortBreak) setTimeLeft(settings.shortBreakDuration * 60);
        else if (mode === PomodoroMode.LongBreak) setTimeLeft(settings.longBreakDuration * 60);
    }
  }, [settings, mode, isRunning]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      
      // Handle audio alert
      const audio = new Audio('https://proxy.docworkspace.com/cs/s/AGEcy3f19hPZ2T1YxQYF9L/sound.mp3'); // A simple notification sound
      audio.play().catch(e => console.warn("Audio play failed:", e)); // Catch errors if autoplay is blocked
      
      if (onTimerEnd) {
        onTimerEnd(mode, pomodorosCompleted + (mode === PomodoroMode.Work ? 1 : 0));
      }

      if (mode === PomodoroMode.Work) {
        const newPomodorosCompleted = pomodorosCompleted + 1;
        setPomodorosCompleted(newPomodorosCompleted);
        if (newPomodorosCompleted % settings.pomodorosBeforeLongBreak === 0) {
          setMode(PomodoroMode.LongBreak);
          setTimeLeft(settings.longBreakDuration * 60);
        } else {
          setMode(PomodoroMode.ShortBreak);
          setTimeLeft(settings.shortBreakDuration * 60);
        }
      } else { // Break ended
        setMode(PomodoroMode.Work);
        setTimeLeft(settings.workDuration * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, pomodorosCompleted, settings, onTimerEnd]);

  const startTimer = useCallback(() => setIsRunning(true), []);
  const pauseTimer = useCallback(() => setIsRunning(false), []);
  
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setMode(PomodoroMode.Work);
    setTimeLeft(settings.workDuration * 60);
    // setPomodorosCompleted(0); // Resetting cycle count might be optional
  }, [settings.workDuration]);

  const skipBreak = useCallback(() => {
    if (mode === PomodoroMode.ShortBreak || mode === PomodoroMode.LongBreak) {
      setIsRunning(false);
      setMode(PomodoroMode.Work);
      setTimeLeft(settings.workDuration * 60);
    }
  }, [mode, settings.workDuration]);

  const changeMode = useCallback((newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === PomodoroMode.Work) setTimeLeft(settings.workDuration * 60);
    else if (newMode === PomodoroMode.ShortBreak) setTimeLeft(settings.shortBreakDuration * 60);
    else if (newMode === PomodoroMode.LongBreak) setTimeLeft(settings.longBreakDuration * 60);
  }, [settings]);

  return {
    timeLeft,
    isRunning,
    mode,
    pomodorosCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    skipBreak,
    changeMode,
    settings,
    setSettings
  };
};

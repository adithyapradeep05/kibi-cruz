
import { TimerPhase, TimerSettings } from '@/types/timer';

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getPhaseName = (currentPhase: TimerPhase): string => {
  switch (currentPhase) {
    case "work":
      return "Focus Time";
    case "shortBreak":
      return "Short Break";
    case "longBreak":
      return "Long Break";
  }
};

export const getPhaseColorClass = (currentPhase: TimerPhase): string => {
  switch (currentPhase) {
    case "work":
      return "from-primary to-primary/70";
    case "shortBreak":
      return "from-accent to-accent/70";
    case "longBreak":
      return "from-blue-500 to-blue-400";
    default:
      return "from-primary to-primary/70";
  }
};

export const getTimerDuration = (phase: TimerPhase, settings: TimerSettings): number => {
  switch (phase) {
    case "work":
      return settings.workMinutes * 60;
    case "shortBreak":
      return settings.shortBreakMinutes * 60;
    case "longBreak":
      return settings.longBreakMinutes * 60;
  }
};

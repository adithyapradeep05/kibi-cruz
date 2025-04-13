
import { TimerPhase } from './timer';

export interface TaskEntry {
  id: string;
  content: string;
  completed: boolean;
}

export interface LogEntryType {
  id: string;
  phase: TimerPhase;
  startTime: string;
  endTime: string;
  duration: number;
  content: string;
  tasks: TaskEntry[];
}

export interface LogAnalysis {
  productivityScore: number;
  insights: string;
  suggestions: string[];
}

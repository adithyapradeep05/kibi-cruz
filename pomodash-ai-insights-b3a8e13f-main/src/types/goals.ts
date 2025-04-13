
import { LogEntryType } from './logs';

export type GoalStatus = 'active' | 'completed' | 'paused';
export type GoalType = 'checklist' | 'numeric' | 'time-based' | 'habit';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface SubTask {
  id: string;
  content: string;
  completed: boolean;
}

export interface TimeEstimate {
  value: number;
  unit: 'minutes' | 'hours' | 'days' | 'weeks';
}

export interface GoalTask {
  id: string;
  content: string;
  description?: string;
  status: TaskStatus;
  completed: boolean;
  logId?: string; // Reference to the log that completed this task
  dueDate?: string;
  timeEstimate?: TimeEstimate;
  priority?: TaskPriority;
  subtasks?: SubTask[];
  tags?: string[];
  order?: number; // For drag and drop ordering
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  tasks: GoalTask[];
  progress: number; // 0-100
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType; // 'checklist', 'numeric', 'time-based', or 'habit'
  tasks: GoalTask[];
  milestones?: Milestone[];
  status: GoalStatus; // 'active', 'completed', or 'paused'
  createdAt: string;
  targetDate?: string;
  completedAt?: string;
  progress: number; // 0-100
  category?: string;
  tags?: string[];
  icon?: string; // Emoji or icon name
  targetValue?: number; // For numeric goals
  currentValue?: number; // For numeric goals
  timeLogged?: number; // Total time logged in minutes (for time-based goals)
  timeTarget?: number; // Target time in minutes (for time-based goals)
  currentStreak?: number; // Current streak (for habit goals)
  targetStreak?: number; // Target streak (for habit goals)
  lastAnalyzed?: string; // Timestamp of last AI analysis
  predictedCompletion?: string; // AI-predicted completion date
}

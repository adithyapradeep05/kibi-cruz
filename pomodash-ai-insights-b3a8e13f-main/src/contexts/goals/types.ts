
import { Goal, GoalStatus, GoalTask, GoalType, TaskStatus, SubTask, TimeEstimate } from '@/types/goals';

export interface GoalsContextType {
  goals: Goal[];
  loading: boolean;
  activeGoal: Goal | null;
  setActiveGoal: (goalId: string | null) => void;
  addGoal: (
    title: string, 
    description: string, 
    tasks: string[], 
    category?: string,
    targetDate?: string,
    options?: {
      type?: GoalType,
      status?: GoalStatus,
      icon?: string,
      tags?: string[],
      targetValue?: number,
      currentValue?: number,
    }
  ) => Goal;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  addTaskToGoal: (
    goalId: string, 
    taskName: string, 
    options?: { 
      description?: string;
      dueDate?: string;
      timeEstimate?: { value: number; unit: string };
      priority?: string;
      subtasks?: string[];
      tags?: string[];
    }
  ) => void;
  updateGoalTask: (goalId: string, taskId: string, updates: Partial<GoalTask>) => void;
  deleteGoalTask: (goalId: string, taskId: string) => void;
  updateSubtask: (goalId: string, taskId: string, subtaskId: string, updates: Partial<SubTask>) => void;
  reorderTasks: (goalId: string, newOrder: string[]) => void;
  linkTaskToLog?: (goalId: string, taskId: string, logId: string) => void;
  analyzeGoalProgressWithAI?: (goalId: string) => Promise<void>;
}


import { v4 as uuidv4 } from 'uuid';
import { Goal, GoalTask, GoalType, TaskStatus, SubTask, GoalStatus } from '@/types/goals';

/**
 * Calculates the progress of a goal based on its type and tasks
 */
export const calculateGoalProgress = (type: GoalType, tasks: GoalTask[], targetValue?: number, currentValue?: number): number => {
  switch (type) {
    case 'checklist':
      if (tasks.length === 0) return 0;
      const completedTasks = tasks.filter(task => task.completed).length;
      return Math.round((completedTasks / tasks.length) * 100);
      
    case 'numeric':
      if (!targetValue || targetValue === 0) return 0;
      const value = currentValue || 0;
      return Math.min(100, Math.round((value / targetValue) * 100));
    
    case 'time-based':
      if (!targetValue || targetValue === 0) return 0;
      const timeLogged = currentValue || 0;
      return Math.min(100, Math.round((timeLogged / targetValue) * 100));
      
    case 'habit':
      if (!targetValue || targetValue === 0) return 0;
      const streak = currentValue || 0;
      return Math.min(100, Math.round((streak / targetValue) * 100));
      
    default:
      return 0;
  }
};

/**
 * Creates a new task with the given properties
 */
export const createTask = (
  content: string, 
  options?: { 
    description?: string;
    dueDate?: string;
    timeEstimate?: { value: number; unit: string };
    priority?: string;
    subtasks?: string[];
    tags?: string[];
    order?: number;
  }
): GoalTask => {
  return {
    id: uuidv4(),
    content,
    description: options?.description,
    status: 'not-started',
    completed: false,
    dueDate: options?.dueDate,
    timeEstimate: options?.timeEstimate as any,
    priority: options?.priority as any,
    tags: options?.tags,
    subtasks: options?.subtasks?.map(subtask => ({
      id: uuidv4(),
      content: subtask,
      completed: false
    })),
    order: options?.order || Date.now(),
  };
};

/**
 * Creates a new goal with the provided properties
 */
export const createGoal = (
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
): Goal => {
  const type = options?.type || 'checklist';
  const goalTasks: GoalTask[] = tasks.map((taskContent, index) => ({
    id: uuidv4(),
    content: taskContent,
    completed: false,
    status: 'not-started' as TaskStatus,
    order: index,
  }));
  
  return {
    id: uuidv4(),
    title,
    description,
    type,
    tasks: goalTasks,
    status: options?.status || 'active',
    createdAt: new Date().toISOString(),
    progress: calculateGoalProgress(
      type, 
      goalTasks, 
      options?.targetValue, 
      options?.currentValue
    ),
    category,
    tags: options?.tags || [],
    icon: options?.icon,
    targetDate,
    targetValue: options?.targetValue,
    currentValue: options?.currentValue || 0,
  };
};

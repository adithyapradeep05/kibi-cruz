
import { Goal, GoalTask, SubTask } from '@/types/goals';
import { calculateGoalProgress, createTask } from './goalUtils';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useTaskActions = (
  goals: Goal[], 
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>,
  activeGoal: Goal | null,
  setActiveGoal: (goalId: string | null) => void
) => {
  const { toast } = useToast();

  const addTaskToGoal = (
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
  ) => {
    try {
      const newTask = createTask(taskName, options);
      
      // Skip Supabase operations for now
      
      setGoals(prev => 
        prev.map(goal => {
          if (goal.id === goalId) {
            const updatedTasks = [...goal.tasks, newTask];
            return { 
              ...goal, 
              tasks: updatedTasks,
              progress: calculateGoalProgress(goal.type, updatedTasks, goal.targetValue)
            };
          }
          return goal;
        })
      );
      
      if (activeGoal?.id === goalId) {
        // If goal was active, refresh it
        setActiveGoal(goalId);
      }
      
      toast({
        title: 'Task added',
        description: 'New task has been added to the goal',
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Error',
        description: 'Failed to add task',
        variant: 'destructive',
      });
    }
  };

  const updateGoalTask = (goalId: string, taskId: string, updates: Partial<GoalTask>) => {
    try {
      // Skip Supabase operations for now
      
      setGoals(prev => 
        prev.map(goal => {
          if (goal.id === goalId) {
            const updatedTasks = goal.tasks.map(task => 
              task.id === taskId ? { ...task, ...updates } : task
            );
            
            // Recalculate goal progress whenever a task is updated
            const updatedProgress = calculateGoalProgress(
              goal.type, 
              updatedTasks, 
              goal.targetValue, 
              goal.currentValue
            );
            
            return { 
              ...goal, 
              tasks: updatedTasks,
              progress: updatedProgress
            };
          }
          return goal;
        })
      );
      
      if (activeGoal?.id === goalId) {
        // If goal was active, refresh it
        setActiveGoal(goalId);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const deleteGoalTask = (goalId: string, taskId: string) => {
    try {
      // Skip Supabase operations for now
      
      setGoals(prev => 
        prev.map(goal => {
          if (goal.id === goalId) {
            const updatedTasks = goal.tasks.filter(task => task.id !== taskId);
            return { 
              ...goal, 
              tasks: updatedTasks,
              progress: calculateGoalProgress(goal.type, updatedTasks, goal.targetValue)
            };
          }
          return goal;
        })
      );
      
      if (activeGoal?.id === goalId) {
        // If goal was active, refresh it
        setActiveGoal(goalId);
      }
      
      toast({
        title: 'Task deleted',
        description: 'The task has been removed from the goal',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const updateSubtask = (goalId: string, taskId: string, subtaskId: string, updates: Partial<SubTask>) => {
    try {
      // Skip Supabase operations for now
      
      setGoals(prev => 
        prev.map(goal => {
          if (goal.id === goalId) {
            const updatedTasks = goal.tasks.map(task => {
              if (task.id === taskId && task.subtasks) {
                const updatedSubtasks = task.subtasks.map(subtask => 
                  subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
                );
                return { ...task, subtasks: updatedSubtasks };
              }
              return task;
            });
            return { 
              ...goal, 
              tasks: updatedTasks,
              progress: calculateGoalProgress(goal.type, updatedTasks, goal.targetValue)
            };
          }
          return goal;
        })
      );
      
      if (activeGoal?.id === goalId) {
        // If goal was active, refresh it
        setActiveGoal(goalId);
      }
    } catch (error) {
      console.error('Error updating subtask:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subtask',
        variant: 'destructive',
      });
    }
  };

  const reorderTasks = (goalId: string, newOrder: string[]) => {
    try {
      const goalIndex = goals.findIndex(g => g.id === goalId);
      if (goalIndex === -1) return;
      
      const currentGoal = goals[goalIndex];
      const updatedTasks = [...currentGoal.tasks];
      
      newOrder.forEach((taskId, index) => {
        const taskIndex = updatedTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            order: index
          };
        }
      });
      
      // Skip Supabase operations for now
      
      setGoals(prev => 
        prev.map(goal => 
          goal.id === goalId 
            ? { ...goal, tasks: updatedTasks } 
            : goal
        )
      );
      
      if (activeGoal?.id === goalId) {
        // If goal was active, refresh it
        setActiveGoal(goalId);
      }
    } catch (error) {
      console.error('Error reordering tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder tasks',
        variant: 'destructive',
      });
    }
  };

  return {
    addTaskToGoal,
    updateGoalTask,
    deleteGoalTask,
    updateSubtask,
    reorderTasks
  };
};

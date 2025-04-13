
import { useState } from 'react';
import { Goal, GoalTask, SubTask } from '@/types/goals';
import { createGoal, createTask, calculateGoalProgress } from './goalUtils';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

export const useGoalActions = (initialGoals: Goal[] = []) => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [activeGoal, setActiveGoalState] = useState<Goal | null>(null);
  const { toast } = useToast();

  const setActiveGoal = (goalId: string | null) => {
    if (!goalId) {
      setActiveGoalState(null);
      return;
    }
    
    const foundGoal = goals.find(g => g.id === goalId) || null;
    setActiveGoalState(foundGoal);
  };

  const addGoal = (
    title: string, 
    description: string, 
    tasks: string[], 
    category?: string,
    targetDate?: string,
    options?: {
      type?: any,
      status?: any,
      icon?: string,
      tags?: string[],
      targetValue?: number,
      currentValue?: number,
    }
  ): Goal => {
    const newGoal = createGoal(
      title, 
      description, 
      tasks, 
      category, 
      targetDate, 
      options
    );
    
    try {
      // Skip Supabase operations for now due to schema mismatches
      
      setGoals(prev => [newGoal, ...prev]);
      
      toast({
        title: 'Goal created',
        description: `${title} has been added to your goals`,
      });
      
      return newGoal;
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to create goal',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    try {
      // Skip Supabase operations for now
      
      setGoals(prev => 
        prev.map(goal => {
          if (goal.id === goalId) {
            const updatedGoal = { ...goal, ...updates };
            
            // Recalculate progress if not explicitly provided in updates
            if (updates.progress === undefined) {
              updatedGoal.progress = calculateGoalProgress(
                updatedGoal.type,
                updatedGoal.tasks,
                updatedGoal.targetValue,
                updatedGoal.currentValue
              );
            }
            
            return updatedGoal;
          }
          return goal;
        })
      );
      
      if (activeGoal?.id === goalId) {
        setActiveGoalState(prev => {
          if (prev) {
            const updatedGoal = { ...prev, ...updates };
            
            // Recalculate progress if not explicitly provided
            if (updates.progress === undefined) {
              updatedGoal.progress = calculateGoalProgress(
                updatedGoal.type,
                updatedGoal.tasks,
                updatedGoal.targetValue,
                updatedGoal.currentValue
              );
            }
            
            return updatedGoal;
          }
          return null;
        });
      }
      
      toast({
        title: 'Goal updated',
        description: 'Changes have been saved',
      });
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to update goal',
        variant: 'destructive',
      });
    }
  };

  const deleteGoal = (goalId: string) => {
    try {
      // Skip Supabase operations for now
      
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      
      if (activeGoal?.id === goalId) {
        setActiveGoalState(null);
      }
      
      toast({
        title: 'Goal deleted',
        description: 'The goal has been removed',
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete goal',
        variant: 'destructive',
      });
    }
  };

  return {
    goals,
    setGoals,
    activeGoal,
    setActiveGoal,
    addGoal,
    updateGoal,
    deleteGoal
  };
};

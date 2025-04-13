
import React, { createContext, useContext } from 'react';
import { GoalsContextType } from './goals/types';
import { useGoalsFetching } from './goals/useGoalsFetching';
import { useGoalActions } from './goals/useGoalActions';
import { useTaskActions } from './goals/useTaskActions';
import { useGoalAnalysis } from './goals/useGoalAnalysis';
import { useAuth } from '@/contexts/auth';

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { goals, setGoals, loading } = useGoalsFetching(user);
  const { 
    activeGoal, 
    setActiveGoal, 
    addGoal, 
    updateGoal, 
    deleteGoal 
  } = useGoalActions(goals);
  
  const { 
    addTaskToGoal, 
    updateGoalTask, 
    deleteGoalTask, 
    updateSubtask, 
    reorderTasks 
  } = useTaskActions(goals, setGoals, activeGoal, setActiveGoal);
  
  const { 
    linkTaskToLog, 
    analyzeGoalProgressWithAI 
  } = useGoalAnalysis(goals, updateGoal);

  const contextValue: GoalsContextType = {
    goals,
    loading,
    activeGoal,
    setActiveGoal,
    addGoal,
    updateGoal,
    deleteGoal,
    addTaskToGoal,
    updateGoalTask,
    deleteGoalTask,
    updateSubtask,
    reorderTasks,
    linkTaskToLog,
    analyzeGoalProgressWithAI
  };

  return (
    <GoalsContext.Provider value={contextValue}>
      {children}
    </GoalsContext.Provider>
  );
};

export default GoalsProvider;

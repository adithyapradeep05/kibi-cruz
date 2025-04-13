
import React from 'react';
import { TaskEntry } from '@/types/logs';
import GoalSelector from '@/components/goals/GoalSelector';
import TaskInput from './TaskInput';
import TaskList from './TaskList';

interface LogSideProps {
  tasks: TaskEntry[];
  currentTask: string;
  setCurrentTask: (task: string) => void;
  selectedGoalId: string | null;
  selectedTaskId: string | null;
  onGoalSelect: (goalId: string | null, taskId: string | null) => void;
  onAddTask: (e?: React.FormEvent) => void;
  onRemoveTask: (id: string) => void;
  onVoiceInput: (transcript: string) => void;
  onSaveTasks: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const LogSide: React.FC<LogSideProps> = ({
  tasks,
  currentTask,
  setCurrentTask,
  selectedGoalId,
  selectedTaskId,
  onGoalSelect,
  onAddTask,
  onRemoveTask,
  onVoiceInput,
  onSaveTasks,
  inputRef,
  handleKeyDown
}) => {
  return (
    <div className="flex flex-col h-full bg-background/95 p-6 border-l border-border/20">
      <h2 className="text-xl font-semibold mb-2">Log What You're Working On</h2>
      <p className="text-muted-foreground mb-4">Add tasks as you complete them during your focus session.</p>
      
      <div className="mb-4">
        <GoalSelector 
          onSelectGoal={(goal) => onGoalSelect(goal?.id || null, null)}
          onSelectTask={(goalId, taskId) => onGoalSelect(goalId, taskId)}
          selectedGoalId={selectedGoalId || undefined}
          selectedTaskId={selectedTaskId || undefined}
        />
        {selectedGoalId && selectedTaskId && (
          <div className="mt-2 text-xs text-muted-foreground">
            The selected task will be marked as completed when you save this log.
          </div>
        )}
      </div>
      
      <TaskInput
        currentTask={currentTask}
        setCurrentTask={setCurrentTask}
        onAddTask={onAddTask}
        onVoiceInput={onVoiceInput}
        inputRef={inputRef}
        handleKeyDown={handleKeyDown}
      />
      
      <TaskList 
        tasks={tasks} 
        onRemoveTask={onRemoveTask}
        onSaveTasks={onSaveTasks}
      />
    </div>
  );
};

export default LogSide;

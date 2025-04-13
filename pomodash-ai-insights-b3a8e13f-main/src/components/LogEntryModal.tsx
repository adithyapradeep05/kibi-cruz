
import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { TimerPhase } from '@/types/timer';
import { TaskEntry } from '@/types/logs';
import { v4 as uuidv4 } from 'uuid';
import { useGoals } from '@/contexts/GoalsContext';
import TaskList from './log-entry/TaskList';
import TaskInputForm from './log-entry/TaskInputForm';
import LogEntryModalFooter from './log-entry/LogEntryModalFooter';
import GoalSelectorSection from './log-entry/GoalSelectorSection';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string, tasks: TaskEntry[]) => void;
  phase: TimerPhase;
  startTime: Date;
  endTime: Date;
}

const LogEntryModal: React.FC<LogEntryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  phase,
  startTime,
  endTime
}) => {
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { linkTaskToLog } = useGoals();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleAddTask = (content: string) => {
    const newTask: TaskEntry = {
      id: uuidv4(),
      content,
      completed: true
    };
    
    setTasks([...tasks, newTask]);
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([10, 20, 10]);
    }
  };

  const handleSave = () => {
    // Generate summary content from tasks
    const summary = tasks.length > 0 
      ? tasks.map(task => task.content).join('\n- ')
      : 'No details provided';
    
    const formattedSummary = tasks.length > 0 ? `- ${summary}` : summary;
    
    const logId = uuidv4(); // Generate a unique ID for this log
    
    // If there's a selected goal task, link it to this log
    if (selectedGoalId && selectedTaskId) {
      linkTaskToLog(selectedGoalId, selectedTaskId, logId);
    }
    
    onSave(formattedSummary, tasks);
    
    // Reset state
    setTasks([]);
    setSelectedGoalId(null);
    setSelectedTaskId(null);
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  const handleCancelAndClose = () => {
    setTasks([]);
    setSelectedGoalId(null);
    setSelectedTaskId(null);
    onClose();
  };

  const handleVoiceInput = (transcript: string) => {
    // Process the voice input into tasks
    if (!transcript.trim()) return;
    
    // Simple parsing: split by "and", "," or new lines to separate tasks
    const taskStrings = transcript
      .split(/(?:\s*(?:and|,|\n)\s*)/i)
      .map(task => task.trim())
      .filter(task => task.length > 0);
    
    const newTasks = taskStrings.map(content => ({
      id: uuidv4(),
      content,
      completed: true
    }));
    
    setTasks([...tasks, ...newTasks]);
  };

  const handleGoalSelect = (goalId: string | null, taskId: string | null) => {
    setSelectedGoalId(goalId);
    setSelectedTaskId(taskId);
  };
  
  // Auto-save handler for dialog
  const handleOpenChange = (open: boolean) => {
    if (!open && tasks.length > 0) {
      // Auto-save when dialog closes with tasks
      const summary = tasks.map(task => task.content).join('\n- ');
      const formattedSummary = `- ${summary}`;
      
      const logId = uuidv4();
      
      if (selectedGoalId && selectedTaskId) {
        linkTaskToLog(selectedGoalId, selectedTaskId, logId);
      }
      
      onSave(formattedSummary, tasks);
      
      // Reset state
      setTasks([]);
      setSelectedGoalId(null);
      setSelectedTaskId(null);
    } else if (!open) {
      handleCancelAndClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-background border border-border/20 max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">What did you do?</DialogTitle>
          <DialogDescription className="pt-2">
            {phase === 'work' ? 'Add tasks you completed during this session!' : 'How was your break?'}
            <div className="text-sm text-muted-foreground mt-1">
              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <GoalSelectorSection 
          selectedGoalId={selectedGoalId}
          selectedTaskId={selectedTaskId}
          onGoalSelect={handleGoalSelect}
        />
        
        <TaskInputForm
          placeholder={phase === 'work' ? "I worked on..." : "I did..."}
          onAddTask={handleAddTask}
          onVoiceInput={handleVoiceInput}
          inputRef={inputRef}
        />
        
        <TaskList 
          tasks={tasks} 
          onRemoveTask={handleRemoveTask} 
        />
        
        <LogEntryModalFooter 
          onCancel={handleCancelAndClose}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LogEntryModal;

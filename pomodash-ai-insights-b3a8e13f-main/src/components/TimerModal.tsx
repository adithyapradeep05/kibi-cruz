
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TaskEntry } from '@/types/logs';
import { TimerPhase } from '@/types/timer';
import { v4 as uuidv4 } from 'uuid';
import TimerSide from './timer-modal/TimerSide';
import LogSide from './timer-modal/LogSide';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (phase: TimerPhase, duration: number, tasks?: TaskEntry[]) => void;
}

const TimerModal: React.FC<TimerModalProps> = ({ 
  isOpen, 
  onClose, 
  onSessionComplete 
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const originalTitle = useRef<string>(document.title);
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [currentTask, setCurrentTask] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      originalTitle.current = document.title;
    } else {
      document.title = originalTitle.current;
    }

    return () => {
      document.title = originalTitle.current;
    };
  }, [isOpen]);

  const handleSessionComplete = (phase: TimerPhase, duration: number) => {
    onSessionComplete(phase, duration, tasks);
    
    if (phase === 'work') {
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };
  
  const handleAddTask = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!currentTask.trim()) return;
    
    const newTask: TaskEntry = {
      id: uuidv4(),
      content: currentTask.trim(),
      completed: true
    };
    
    setTasks([...tasks, newTask]);
    setCurrentTask('');
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
    
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };
  
  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    if (navigator.vibrate) {
      navigator.vibrate([10, 20, 10]);
    }
  };
  
  const handleSaveTasks = () => {
    let finalTasks = [...tasks];
    
    if (currentTask.trim()) {
      finalTasks.push({
        id: uuidv4(),
        content: currentTask.trim(),
        completed: true
      });
      setCurrentTask('');
    }
    
    // Generate a log ID to link to the goal task if applicable
    const logId = uuidv4();
    
    // If there's a selected goal task, link it to this log
    if (selectedGoalId && selectedTaskId) {
      try {
        // We'll try to use the context but handle if it's not available
        const { linkTaskToLog } = require('@/contexts/GoalsContext').useGoals();
        if (typeof linkTaskToLog === 'function') {
          linkTaskToLog(selectedGoalId, selectedTaskId, logId);
        }
      } catch (error) {
        console.log('Could not link task to log:', error);
      }
    }
    
    onSessionComplete('work', 25 * 60, finalTasks);
    onClose();
    
    if (navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };
  
  const handleVoiceInput = (transcript: string) => {
    if (!transcript.trim()) return;
    
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
  
  // Auto-save handler for when the modal is closed
  const handleDialogChange = (open: boolean) => {
    if (!open && tasks.length > 0) {
      // Auto-save the tasks when the modal is closed
      let finalTasks = [...tasks];
      
      if (currentTask.trim()) {
        finalTasks.push({
          id: uuidv4(),
          content: currentTask.trim(),
          completed: true
        });
      }
      
      const logId = uuidv4();
      
      // If there's a selected goal task, try to link it to this log
      if (selectedGoalId && selectedTaskId) {
        try {
          // We'll try to use the context but handle if it's not available
          const { linkTaskToLog } = require('@/contexts/GoalsContext').useGoals();
          if (typeof linkTaskToLog === 'function') {
            linkTaskToLog(selectedGoalId, selectedTaskId, logId);
          }
        } catch (error) {
          console.log('Could not link task to log:', error);
        }
      }
      
      // Call onSessionComplete to save the logs
      onSessionComplete('work', 25 * 60, finalTasks);
      onClose();
    } else if (!open) {
      onClose();
    }
  };

  // Request notification permissions when the component mounts
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] h-[80vh] rounded-xl overflow-hidden border-0 bg-gradient-to-br from-card-bg to-card-dark animate-fade-in p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <TimerSide 
            showAlert={showAlert}
            onSessionComplete={handleSessionComplete}
          />
          
          <LogSide
            tasks={tasks}
            currentTask={currentTask}
            setCurrentTask={setCurrentTask}
            selectedGoalId={selectedGoalId}
            selectedTaskId={selectedTaskId}
            onGoalSelect={handleGoalSelect}
            onAddTask={handleAddTask}
            onRemoveTask={handleRemoveTask}
            onVoiceInput={handleVoiceInput}
            onSaveTasks={handleSaveTasks}
            inputRef={inputRef}
            handleKeyDown={handleKeyDown}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimerModal;

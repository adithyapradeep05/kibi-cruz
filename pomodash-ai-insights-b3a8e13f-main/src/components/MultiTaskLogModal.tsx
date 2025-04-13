
import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Send, Target } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { TaskEntry } from '@/types/logs';
import VoiceInput from './VoiceInput';
import GoalSelector from './goals/GoalSelector';
import { useGoals } from '@/contexts/GoalsContext';

interface MultiTaskLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tasks: TaskEntry[]) => void;
}

const MultiTaskLogModal: React.FC<MultiTaskLogModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave
}) => {
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [currentTask, setCurrentTask] = useState('');
  const { linkTaskToLog } = useGoals();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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
    
    // Add haptic feedback if available
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
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([10, 20, 10]);
    }
  };

  const handleSave = () => {
    // If there's text in the input field, add it to tasks before saving
    let finalTasks = [...tasks];
    
    if (currentTask.trim()) {
      finalTasks.push({
        id: uuidv4(),
        content: currentTask.trim(),
        completed: true
      });
    }
    
    const logId = uuidv4(); // Generate a unique ID for this log entry
    
    // Link the task to the selected goal if applicable
    if (selectedGoalId && selectedTaskId) {
      linkTaskToLog(selectedGoalId, selectedTaskId, logId);
    }
    
    onSave(finalTasks);
    
    // Reset state
    setTasks([]);
    setCurrentTask('');
    setSelectedGoalId(null);
    setSelectedTaskId(null);
    onClose();
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  const handleCancelAndClose = () => {
    setTasks([]);
    setCurrentTask('');
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

  return (
    <Dialog open={isOpen} onOpenChange={handleCancelAndClose}>
      <DialogContent className="bg-background border border-border/20 max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">Quick Log</DialogTitle>
          <DialogDescription className="pt-2">
            What did you work on? Add tasks you completed!
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-2">
          <GoalSelector 
            onSelectGoal={(goal) => handleGoalSelect(goal?.id || null, null)}
            onSelectTask={(goalId, taskId) => handleGoalSelect(goalId, taskId)}
            selectedGoalId={selectedGoalId || undefined}
            selectedTaskId={selectedTaskId || undefined}
          />
          {selectedGoalId && selectedTaskId && (
            <div className="mt-2 text-xs text-muted-foreground">
              The selected task will be marked as completed when you save this log.
            </div>
          )}
        </div>
        
        <form onSubmit={handleAddTask} className="flex gap-2 items-center mt-4">
          <Input
            ref={inputRef}
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="I worked on..."
            className="flex-1 rounded-full border-input bg-background"
            autoFocus
          />
          <VoiceInput onTranscriptionComplete={handleVoiceInput} />
          <Button 
            type="submit" 
            size="icon" 
            className="h-9 w-9 rounded-full"
            variant="fun"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        
        {tasks.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium">Added tasks:</div>
            <ScrollArea className="h-40 mt-2 rounded-lg border border-border/30 p-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between py-2 group">
                  <div className="text-sm">{task.content}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTask(task.id)}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {task !== tasks[tasks.length - 1] && <Separator className="my-1" />}
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleCancelAndClose} 
            className="w-full sm:w-auto rounded-full hover:bg-background"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="fun"
            className="w-full sm:w-auto rounded-full"
          >
            Save Log
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MultiTaskLogModal;

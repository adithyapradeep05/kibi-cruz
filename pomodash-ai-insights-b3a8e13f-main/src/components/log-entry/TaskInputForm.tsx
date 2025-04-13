
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from 'lucide-react';
import VoiceInput from '../VoiceInput';

interface TaskInputFormProps {
  placeholder: string;
  onAddTask: (content: string) => void;
  onVoiceInput: (transcript: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const TaskInputForm: React.FC<TaskInputFormProps> = ({ 
  placeholder, 
  onAddTask, 
  onVoiceInput,
  inputRef
}) => {
  const [currentTask, setCurrentTask] = useState('');

  const handleAddTask = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!currentTask.trim()) return;
    
    onAddTask(currentTask.trim());
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

  return (
    <form onSubmit={handleAddTask} className="flex gap-2 items-center mt-2">
      <Input
        ref={inputRef}
        value={currentTask}
        onChange={(e) => setCurrentTask(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 rounded-full border-input bg-background"
        autoFocus
      />
      <VoiceInput onTranscriptionComplete={onVoiceInput} />
      <Button 
        type="submit" 
        size="icon" 
        className="h-9 w-9 rounded-full"
        variant="fun"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default TaskInputForm;

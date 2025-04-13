
import React, { useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import VoiceInput from '@/components/VoiceInput';
import { TaskEntry } from '@/types/logs';

interface TaskInputProps {
  currentTask: string;
  setCurrentTask: (task: string) => void;
  onAddTask: (e?: React.FormEvent) => void;
  onVoiceInput: (transcript: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({
  currentTask,
  setCurrentTask,
  onAddTask,
  onVoiceInput,
  inputRef,
  handleKeyDown
}) => {
  return (
    <form onSubmit={onAddTask} className="flex gap-2 items-center mb-4">
      <Input
        ref={inputRef}
        value={currentTask}
        onChange={(e) => setCurrentTask(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="I worked on..."
        className="flex-1 rounded-full border-input bg-background"
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

export default TaskInput;

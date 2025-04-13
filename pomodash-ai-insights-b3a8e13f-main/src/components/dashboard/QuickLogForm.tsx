
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getLogsFromStorage, saveLogsToStorage } from '@/utils/storage';
import { LogEntryType, TaskEntry } from '@/types/logs';
import { v4 as uuidv4 } from 'uuid';
import MultiTaskLogModal from '../MultiTaskLogModal';

interface QuickLogFormProps {
  logs: LogEntryType[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntryType[]>>;
}

const QuickLogForm: React.FC<QuickLogFormProps> = ({ logs, setLogs }) => {
  const { toast } = useToast();
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  const handleToggleQuickLog = () => {
    setShowLogModal(true);
  };

  const handleCloseModal = () => {
    setShowLogModal(false);
  };

  const handleSaveLog = (tasks: TaskEntry[]) => {
    if (tasks.length === 0) return;

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    // Create content from tasks
    const content = tasks.length > 0 
      ? tasks.map(task => task.content).join('\n- ')
      : 'No details provided';
    
    const formattedContent = tasks.length > 0 ? `- ${content}` : content;
    
    const newLog: LogEntryType = {
      id: uuidv4(),
      phase: 'work',
      startTime: fiveMinutesAgo.toISOString(),
      endTime: now.toISOString(),
      duration: 5 * 60,
      content: formattedContent,
      tasks: tasks
    };
    
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    saveLogsToStorage(updatedLogs);
    
    toast({
      title: "Quick Log Added",
      description: `Your activity with ${tasks.length} tasks has been logged.`
    });
  };

  return (
    <div className="w-full p-4 bg-kiwi-dark text-kiwi-yellow rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Quick Log</h3>
        <Button 
          onClick={handleToggleQuickLog}
          variant="outline"
          size="sm"
          className="text-sm rounded-full bg-kiwi-yellow/20 text-kiwi-yellow hover:bg-kiwi-yellow/30 border-0 transition-colors hover:translate-y-[-1px]"
        >
          Add 
          <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <MultiTaskLogModal
        isOpen={showLogModal}
        onClose={handleCloseModal}
        onSave={handleSaveLog}
      />
    </div>
  );
};

export default QuickLogForm;

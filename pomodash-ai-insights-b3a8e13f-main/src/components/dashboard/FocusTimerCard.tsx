
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, PlusCircle, BookOpen, Moon, Hourglass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LogEntryType, TaskEntry } from '@/types/logs';
import { v4 as uuidv4 } from 'uuid';
import { saveLogsToStorage } from '@/utils/storage';
import MultiTaskLogModal from '../MultiTaskLogModal';
import Timer from '../Timer';
import { TimerPhase } from '@/types/timer';
import VoiceInput from '../VoiceInput';
import TimerModal from '../TimerModal';

interface FocusTimerCardProps {
  logs: LogEntryType[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntryType[]>>;
  onStartTimer: () => void;
}

const FocusTimerCard: React.FC<FocusTimerCardProps> = ({ logs, setLogs, onStartTimer }) => {
  const { toast } = useToast();
  const [showLogModal, setShowLogModal] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

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
  
  const handleSessionComplete = (phase: TimerPhase, duration: number) => {
    // Reset document title after session completes
    document.title = "Kiwi - Focus & Fun for Kids";
  };

  return (
    <div className="bg-card-dark border-0 shadow-md rounded-3xl overflow-hidden animate-fade-in col-span-1 lg:col-span-2 hover:shadow-lg transition-all duration-300 hover:translate-y-[-3px]">
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Hourglass className="mr-3 h-5 w-5 text-kiwi-light animate-pulse-subtle" />
              <h2 className="text-xl font-semibold text-white">Focus Timer</h2>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Timer onSessionComplete={handleSessionComplete} />
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-4 flex flex-col">
          <div className="bg-card-bg rounded-3xl p-5 flex-1 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Quick Log</h3>
              <div className="flex gap-2">
                <VoiceInput 
                  onTranscriptionComplete={(text) => {
                    const tasks = text.split('.').filter(t => t.trim()).map(t => ({
                      id: uuidv4(),
                      content: t.trim(),
                      completed: false
                    }));
                    handleSaveLog(tasks);
                  }}
                />
                <Button 
                  onClick={handleToggleQuickLog}
                  variant="outline"
                  size="sm"
                  className="text-sm rounded-full bg-kiwi-medium/20 text-kiwi-light hover:bg-kiwi-medium/30 border-0 transition-all hover:scale-105 active:scale-95"
                >
                  Add 
                  <PlusCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="p-4 bg-card-dark border border-white/5 rounded-xl hover:border-white/20 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] cursor-pointer">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-5 w-5 mr-2 text-kiwi-light" />
                  <span className="text-white font-medium">Study Session</span>
                </div>
                <p className="text-sm text-white/70">Track your reading progress and take notes</p>
              </div>
              
              <div className="p-4 bg-card-dark border border-white/5 rounded-xl hover:border-white/20 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] cursor-pointer">
                <div className="flex items-center mb-2">
                  <Moon className="h-5 w-5 mr-2 text-kiwi-light" />
                  <span className="text-white font-medium">Deep Work</span>
                </div>
                <p className="text-sm text-white/70">Focus without distractions on a single task</p>
              </div>
            </div>
          </div>
          
          <Button 
            size="lg" 
            onClick={onStartTimer}
            className="w-full rounded-2xl py-6 text-lg font-semibold bg-kiwi-medium text-white hover:bg-kiwi-light hover:shadow-xl hover:shadow-kiwi-light/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Focused Session
          </Button>
        </div>
      </div>
      
      {showLogModal && (
        <MultiTaskLogModal
          isOpen={showLogModal}
          onClose={handleCloseModal}
          onSave={handleSaveLog}
        />
      )}
    </div>
  );
};

export default FocusTimerCard;

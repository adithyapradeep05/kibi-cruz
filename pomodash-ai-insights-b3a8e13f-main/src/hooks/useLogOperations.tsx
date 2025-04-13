
import { useState } from 'react';
import { LogEntryType } from '@/types/logs';
import { useToast } from '@/hooks/use-toast';
import { saveLogsToSupabase, saveLogsToStorage } from '@/utils/storage';
import { useAuth } from '@/contexts/auth';

export interface UseLogOperationsProps {
  logs: LogEntryType[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntryType[]>>;
}

export function useLogOperations({ logs, setLogs }: UseLogOperationsProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdateLog = async (id: string, content: string) => {
    setIsProcessing(true);
    
    try {
      const updatedLogs = logs.map(log => 
        log.id === id ? { ...log, content } : log
      );
      
      setLogs(updatedLogs);
      
      // Use Supabase if authenticated, otherwise use local storage
      if (user) {
        await saveLogsToSupabase(updatedLogs);
      } else {
        saveLogsToStorage(updatedLogs);
      }
      
      toast({
        title: "Log Updated",
        description: "Your log entry has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating log:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your log. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to local storage if Supabase fails
      saveLogsToStorage(logs);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    setIsProcessing(true);
    
    try {
      const updatedLogs = logs.filter(log => log.id !== id);
      setLogs(updatedLogs);
      
      // Use Supabase if authenticated, otherwise use local storage
      if (user) {
        await saveLogsToSupabase(updatedLogs);
      } else {
        saveLogsToStorage(updatedLogs);
      }
      
      toast({
        title: "Log Deleted",
        description: "Your log entry has been deleted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting log:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting your log. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to local storage if Supabase fails
      saveLogsToStorage(logs);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleUpdateLog,
    handleDeleteLog,
    isProcessing
  };
}

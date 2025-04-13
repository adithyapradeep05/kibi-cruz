
import React, { useState, useEffect } from 'react';
import { LogEntryType } from '@/types/logs';
import { getLogsFromStorage, getLogsFromSupabase, syncLogsWithSupabase } from '@/utils/storage';
import HeaderSection from './dashboard/HeaderSection';
import FocusTimerCard from './dashboard/FocusTimerCard';
import CalendarView from './dashboard/CalendarView';
import InsightsSection from './dashboard/InsightsSection';
import LogEntryModal from './LogEntryModal';
import TimerModal from './TimerModal';
import FocusMetricCard from './charts/FocusMetricCard';
import ActivityChart from './charts/ActivityChart';
import GoalsSection from './dashboard/GoalsSection';
import StreakNotification from './StreakNotification';
import ReflectionWidget from './dashboard/ReflectionWidget';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useLogOperations } from '@/hooks/useLogOperations';
import { useAuth } from '@/contexts/auth';
import { useGoals } from '@/contexts/GoalsContext';
import { checkAndGenerateWeeklyReflection } from '@/utils/weeklyReflectionCron';
import { getStreakFromStorage } from '@/utils/storage';

interface DashboardProps {
  activeTab: 'timer' | 'logs' | 'trends';
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab }) => {
  const [logs, setLogs] = useState<LogEntryType[]>([]);
  const { user } = useAuth();
  const { goals } = useGoals();

  useEffect(() => {
    const loadLogs = async () => {
      try {
        if (user) {
          console.log("Fetching logs from Supabase...");
          // Authenticated - get data from Supabase
          const supabaseLogs = await getLogsFromSupabase();
          setLogs(supabaseLogs);
        } else {
          console.log("Fetching logs from local storage...");
          // Not authenticated - use local storage
          const storedLogs = getLogsFromStorage();
          setLogs(storedLogs);
        }
      } catch (error) {
        console.error("Error loading logs:", error);
        // Fallback to local storage if Supabase fails
        const storedLogs = getLogsFromStorage();
        setLogs(storedLogs);
      }
    };
    
    loadLogs();
  }, [user]);

  // If user signs in, sync local logs to Supabase
  useEffect(() => {
    const syncLocalDataToSupabase = async () => {
      if (user && logs.length > 0) {
        try {
          console.log("Syncing local logs to Supabase...");
          await syncLogsWithSupabase(logs);
        } catch (error) {
          console.error("Error syncing logs to Supabase:", error);
        }
      }
    };

    syncLocalDataToSupabase();
  }, [user]);

  // Check for weekly reflection generation
  useEffect(() => {
    const checkForWeeklyReflection = async () => {
      if (user && logs.length > 0) {
        const streak = getStreakFromStorage();
        try {
          await checkAndGenerateWeeklyReflection(user.id, logs, goals, streak);
        } catch (error) {
          console.error("Error checking/generating weekly reflection:", error);
        }
      }
    };
    
    // Check when component mounts
    checkForWeeklyReflection();
    
    // Also set up an interval to check every hour
    const intervalId = setInterval(checkForWeeklyReflection, 60 * 60 * 1000); // every hour
    
    return () => clearInterval(intervalId);
  }, [user, logs, goals]);

  const {
    currentSession,
    showLogModal,
    setShowLogModal,
    showTimerModal,
    setShowTimerModal,
    handleSessionComplete,
    handleSaveLog,
    handleStartTimer
  } = useSessionManager({ logs, setLogs });

  const { handleUpdateLog, handleDeleteLog } = useLogOperations({ logs, setLogs });

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4 md:px-8">
      <StreakNotification />
      <HeaderSection onStartTimer={handleStartTimer} />

      <div id="timer" className="grid grid-cols-1 gap-4 sm:gap-8 mb-8 animate-fade-in">
        <div className="focus-timer-card">
          <FocusTimerCard 
            logs={logs} 
            setLogs={setLogs} 
            onStartTimer={handleStartTimer} 
          />
        </div>
      </div>

      <div id="logs" className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="lg:col-span-2 calendar-card">
          <CalendarView 
            logs={logs} 
            onUpdateLog={handleUpdateLog} 
            onDeleteLog={handleDeleteLog} 
          />
        </div>
        <div className="lg:col-span-1" data-tutorial="goals-section">
          <GoalsSection />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <FocusMetricCard logs={logs} />
          <ActivityChart logs={logs} />
        </div>
        <div className="lg:col-span-1">
          <ReflectionWidget />
        </div>
      </div>

      <div id="trends" className="mt-4 sm:mt-8 animate-fade-in" style={{ animationDelay: "300ms" }} data-tutorial="insights-section">
        <InsightsSection logs={logs} autoAnalyze={true} />
      </div>

      {currentSession && (
        <LogEntryModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          onSave={handleSaveLog}
          phase={currentSession.phase}
          startTime={currentSession.startTime}
          endTime={currentSession.endTime}
        />
      )}

      <TimerModal
        isOpen={showTimerModal}
        onClose={() => setShowTimerModal(false)}
        onSessionComplete={handleSessionComplete}
      />
    </div>
  );
};

export default Dashboard;

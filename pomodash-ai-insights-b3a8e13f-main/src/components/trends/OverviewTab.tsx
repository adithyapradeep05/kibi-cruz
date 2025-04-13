
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, LineChart, PieChart, BarChart4, Brain } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { LogEntryType } from '@/types/logs';
import FocusMetrics from './FocusMetrics';
import LogInsights from './LogInsights';
import ActivityLineChart from './ActivityLineChart';
import TimeOfDayChart from './TimeOfDayChart';
import SessionLengthChart from './SessionLengthChart';
import { isToday, parseISO } from 'date-fns';

interface OverviewTabProps {
  logs: LogEntryType[];
  onSetActiveTab: (tab: string) => void;
  analysis: string;
  analysisSections: Record<string, string>;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  logs, 
  onSetActiveTab, 
  analysis, 
  analysisSections 
}) => {
  const getTodayLogsCount = () => {
    return logs.filter(log => isToday(parseISO(log.startTime))).length;
  };

  const getWeekLogsCount = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    return logs.filter(log => {
      const logDate = new Date(log.startTime);
      return logDate >= weekStart && logDate <= today;
    }).length;
  };

  const getTotalFocusMinutes = () => {
    return Math.round(logs.reduce((total, log) => total + log.duration, 0) / 60);
  };

  return (
    <div className="p-4 pt-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FocusMetrics 
          title="Today's Sessions" 
          value={getTodayLogsCount().toString()} 
          icon={<Calendar className="h-5 w-5 text-primary" />} 
        />
        <FocusMetrics 
          title="This Week" 
          value={getWeekLogsCount().toString()} 
          icon={<Calendar className="h-5 w-5 text-accent" />} 
        />
        <FocusMetrics 
          title="Total Focus Time" 
          value={`${getTotalFocusMinutes()} min`} 
          icon={<Clock className="h-5 w-5 text-primary" />} 
        />
        <FocusMetrics 
          title="Avg. Session" 
          value={`${Math.round(getTotalFocusMinutes() / logs.length)} min`} 
          icon={<Target className="h-5 w-5 text-accent" />} 
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <LineChart className="mr-2 h-5 w-5 text-primary" />
          Last 7 Days Activity
        </h3>
        <ActivityLineChart logs={logs} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-secondary/50 border border-border/40">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <PieChart className="mr-2 h-5 w-5 text-primary" />
            Time of Day Distribution
          </h3>
          <TimeOfDayChart logs={logs} />
        </Card>
        
        <Card className="p-4 bg-secondary/50 border border-border/40">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <BarChart4 className="mr-2 h-5 w-5 text-accent" />
            Average Session Length
          </h3>
          <SessionLengthChart logs={logs} />
        </Card>
      </div>
      
      {analysis && (
        <Card className="p-4 bg-secondary/50 border border-border/40 overflow-hidden relative">
          <div className="absolute top-0 right-0">
            <Badge variant="secondary" className="m-2 bg-primary/20 text-primary rounded-full">
              AI Insight
            </Badge>
          </div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            Productivity Summary
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-full">
            <LogInsights content={analysisSections.overview || analysis.split('\n\n')[0]} />
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onSetActiveTab("insights")}
              className="text-sm"
            >
              View Full Analysis →
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OverviewTab;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogEntryType } from '@/types/logs';
import { isToday, parseISO, format, subDays } from 'date-fns';
import { Target, ArrowUp, Clock } from 'lucide-react';

interface FocusMetricCardProps {
  logs: LogEntryType[];
}

const FocusMetricCard: React.FC<FocusMetricCardProps> = ({ logs }) => {
  // Get today's logs
  const todayLogs = logs.filter(log => isToday(parseISO(log.startTime)));
  
  // Get yesterday's logs
  const yesterdayLogs = logs.filter(log => {
    const yesterday = subDays(new Date(), 1);
    const logDate = parseISO(log.startTime);
    return format(yesterday, 'yyyy-MM-dd') === format(logDate, 'yyyy-MM-dd');
  });
  
  // Calculate focus time today
  const todayFocusMinutes = Math.round(todayLogs.reduce((total, log) => total + log.duration, 0) / 60);
  
  // Calculate focus time yesterday
  const yesterdayFocusMinutes = Math.round(yesterdayLogs.reduce((total, log) => total + log.duration, 0) / 60);
  
  // Get most recent log
  const recentLogs = [...logs].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
  
  const currentFocus = recentLogs.length > 0 ? recentLogs[0].content : 'Nothing yet';
  
  // Calculate productivity trend (positive if today is more productive than yesterday)
  const productivityTrend = yesterdayFocusMinutes > 0 
    ? Math.round(((todayFocusMinutes - yesterdayFocusMinutes) / yesterdayFocusMinutes) * 100) 
    : 100;
  
  return (
    <Card className="rounded-lg overflow-hidden border-[4px] border-[#0f172a] shadow-[0_8px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] hover:translate-y-[-3px] transition-all duration-300 bg-[#151e2d]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center font-extrabold">
          <Target className="h-6 w-6 mr-2 text-[#33C3F0]" />
          <span className="text-[#33C3F0] drop-shadow-md">Current Focus</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-white font-bold">Currently working on:</div>
          <div className="font-extrabold text-white line-clamp-2 bg-[#1e293b]/30 p-3 rounded-lg border-[3px] border-[#0f172a]/30">
            {currentFocus}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1e293b]/30 rounded-lg p-3 border-[3px] border-[#0f172a]/30">
            <div className="text-sm text-white font-bold mb-1">Today's Focus</div>
            <div className="text-xl font-extrabold flex items-center text-white">
              {todayFocusMinutes} min
              {productivityTrend !== 0 && (
                <span className={`text-xs ml-2 ${productivityTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  <ArrowUp className={`h-3 w-3 inline ${productivityTrend < 0 ? 'rotate-180' : ''}`} />
                  {Math.abs(productivityTrend)}%
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-[#1e293b]/30 rounded-lg p-3 border-[3px] border-[#0f172a]/30">
            <div className="text-sm text-white font-bold mb-1">Sessions Today</div>
            <div className="text-xl font-extrabold text-white">
              {todayLogs.length}
            </div>
          </div>
        </div>
        
        <div className="bg-[#1e293b]/30 rounded-lg p-3 border-[3px] border-[#0f172a]/30">
          <div className="text-sm text-white font-bold mb-1">Recent activity</div>
          <div className="text-sm text-white">
            {recentLogs.length > 0 ? (
              <div className="flex items-center">
                <div className="rounded-full bg-[#1e293b] p-1 border-[2px] border-[#0f172a]/30 mr-1">
                  <Clock className="h-3 w-3 text-[#33C3F0]" />
                </div>
                <span className="font-bold">
                  {format(parseISO(recentLogs[0].startTime), 'h:mm a')} - {recentLogs[0].content.substring(0, 30)}{recentLogs[0].content.length > 30 ? '...' : ''}
                </span>
              </div>
            ) : (
              <span className="font-bold">No recent activity</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusMetricCard;

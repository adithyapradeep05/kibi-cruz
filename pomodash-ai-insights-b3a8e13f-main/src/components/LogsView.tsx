
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LogEntry from './LogEntry';
import { LogEntryType } from '@/types/logs';
import { format } from 'date-fns';

interface LogsViewProps {
  logs: LogEntryType[];
  onUpdateLog: (id: string, content: string) => void;
  onDeleteLog: (id: string) => void;
}

const LogsView: React.FC<LogsViewProps> = ({ logs, onUpdateLog, onDeleteLog }) => {
  // Group logs by date
  const groupedLogs = logs.reduce((acc, log) => {
    const date = format(new Date(log.startTime), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, LogEntryType[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedLogs).sort().reverse();

  const formatDate = (dateStr: string): string => {
    return format(new Date(dateStr), 'EEEE, MMMM d');
  };

  return (
    <Card className="bg-card-bg border-white/5 shadow-lg h-full rounded-3xl">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-white flex items-center justify-between">
          <span>Session Logs</span>
          <div className="flex gap-1 items-center">
            <div className="bg-violet h-4 w-8 rounded-full"></div>
            <span className="text-xs font-normal text-white/60">Today</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[500px] pr-4">
          {sortedDates.map(date => (
            <div key={date} className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-white/60">
                {formatDate(date)}
              </h3>
              {groupedLogs[date]
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .map(log => (
                  <LogEntry
                    key={log.id}
                    entry={log}
                    onUpdate={onUpdateLog}
                    onDelete={onDeleteLog}
                  />
                ))
              }
            </div>
          ))}
          
          {sortedDates.length === 0 && (
            <div className="text-center text-white/50 py-8">
              No logs yet. Complete a work session to see logs here.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LogsView;

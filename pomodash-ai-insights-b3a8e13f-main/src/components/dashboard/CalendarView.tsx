
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, History, Clock } from 'lucide-react';
import { LogEntryType } from '@/types/logs';
import { format, isToday, parseISO, isSameDay } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import LogEntry from './LogEntry';

interface CalendarViewProps {
  logs: LogEntryType[];
  onUpdateLog: (id: string, content: string) => void;
  onDeleteLog: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ logs, onUpdateLog, onDeleteLog }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  const getLogsForDate = (date: Date) => {
    return logs.filter(log => {
      const logDate = parseISO(log.startTime);
      return isSameDay(logDate, date);
    }).sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  };

  const todayLogs = getLogsForDate(new Date());

  const hasLogs = (date: Date) => {
    return logs.some(log => {
      const logDate = parseISO(log.startTime);
      return isSameDay(logDate, date);
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const startEditing = (log: LogEntryType) => {
    setEditingLogId(log.id);
    setEditContent(log.content);
  };

  const cancelEditing = () => {
    setEditingLogId(null);
    setEditContent('');
  };

  const saveEdit = (id: string) => {
    onUpdateLog(id, editContent);
    setEditingLogId(null);
  };

  return (
    <>
      <Card className="border-[4px] border-[#0f172a] shadow-[0_8px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] hover:translate-y-[-3px] transition-all duration-300 rounded-lg overflow-hidden bg-[#151e2d]">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-xl font-extrabold">
              <CalendarIcon className="mr-3 h-6 w-6 text-[#33C3F0]" />
              <span className="text-[#33C3F0] drop-shadow-md">Today's Activity</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCalendarModal(true)}
              className="text-sm font-extrabold rounded-lg border-[3px] border-[#0f172a] shadow-[0_5px_0_rgba(15,23,42,0.4)] hover:shadow-[0_7px_0_rgba(15,23,42,0.4)] active:shadow-[0_2px_0_rgba(15,23,42,0.4)] active:translate-y-2 transition-all text-white"
            >
              View Past Days
              <History className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-fade-in">
            <h3 className="text-lg font-extrabold mb-4 flex items-center text-white">
              Today's Activity <span className="ml-2 text-xs bg-[#33C3F0]/20 text-[#33C3F0] rounded-lg px-2 py-0.5 font-bold border-[2px] border-[#33C3F0]/20">
                {todayLogs.length} {todayLogs.length === 1 ? 'session' : 'sessions'}
              </span>
            </h3>
            
            <div className="text-center">
              {todayLogs.length > 0 ? (
                <Button
                  variant="outline"
                  className="w-full mt-4 rounded-lg border-[3px] border-[#0f172a] shadow-[0_6px_0_rgba(15,23,42,0.4)] hover:shadow-[0_8px_0_rgba(15,23,42,0.4)] active:shadow-[0_2px_0_rgba(15,23,42,0.4)] active:translate-y-2 transition-all font-extrabold text-white text-lg"
                  onClick={() => {
                    setSelectedDate(new Date());
                    setShowCalendarModal(true);
                  }}
                >
                  View Today's {todayLogs.length} {todayLogs.length === 1 ? 'Session' : 'Sessions'}
                </Button>
              ) : (
                <div className="text-center text-white py-8 bg-[#1e293b]/30 rounded-lg border-[3px] border-[#0f172a]/30 font-extrabold">
                  No activity logged today
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Modal with Side-by-Side Layout */}
      <Dialog open={showCalendarModal} onOpenChange={setShowCalendarModal}>
        <DialogContent className="sm:max-w-[900px] bg-[#151e2d] border-[4px] border-[#0f172a] rounded-lg shadow-[0_8px_0_rgba(15,23,42,0.7)] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center text-xl font-extrabold text-[#33C3F0]">
              <CalendarIcon className="mr-3 h-6 w-6 text-[#33C3F0]" />
              Activity Calendar
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col md:flex-row h-[600px] animate-fade-in">
            {/* Left side - Calendar */}
            <div className="md:w-1/2 p-6 border-r border-[#0f172a]/20">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="w-full border-[3px] rounded-lg p-3 bg-[#1e293b]/50 shadow-[0_6px_0_rgba(15,23,42,0.4)]"
                modifiers={{
                  hasLogs: (date) => hasLogs(date)
                }}
                modifiersStyles={{
                  hasLogs: { 
                    backgroundColor: '#33C3F0', 
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    border: '2px solid #0f172a',
                  }
                }}
              />
              
              <div className="mt-6 bg-[#1e293b]/20 p-4 rounded-lg border-[3px] border-[#0f172a]/30">
                <p className="text-center text-sm text-white font-extrabold">
                  Click on any day to view its activity logs
                </p>
                <div className="mt-2 text-center">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-[#33C3F0] border-[2px] border-[#0f172a]"></div>
                    <span className="text-xs text-white font-bold">Days with activity</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Logs for selected date */}
            <div className="md:w-1/2 flex flex-col border-t md:border-t-0 md:border-l border-[#0f172a]/20">
              <div className="p-6 border-b border-[#0f172a]/20">
                <h3 className="text-lg font-extrabold flex items-center text-white">
                  {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  {selectedDate && isToday(selectedDate) && (
                    <span className="ml-2 text-xs bg-[#33C3F0]/20 text-[#33C3F0] rounded-lg px-2 py-0.5 font-bold border-[2px] border-[#33C3F0]/20">Today</span>
                  )}
                </h3>
              </div>
              
              <ScrollArea className="flex-1 p-6">
                {selectedDate && getLogsForDate(selectedDate).length > 0 ? (
                  getLogsForDate(selectedDate).map(log => (
                    <LogEntry
                      key={log.id}
                      log={log}
                      isEditing={editingLogId === log.id}
                      editContent={editContent}
                      setEditContent={setEditContent}
                      onSave={() => saveEdit(log.id)}
                      onCancel={cancelEditing}
                      onEdit={() => startEditing(log)}
                      onDelete={() => onDeleteLog(log.id)}
                    />
                  ))
                ) : (
                  <div className="text-center text-white py-8 bg-[#1e293b]/30 rounded-lg border-[3px] border-[#0f172a]/30 font-extrabold">
                    No logs for this day
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarView;

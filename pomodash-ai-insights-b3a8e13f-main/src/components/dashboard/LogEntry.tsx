
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Edit, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { LogEntryType, TaskEntry } from '@/types/logs';
import { format, parseISO } from 'date-fns';

interface LogEntryProps {
  log: LogEntryType;
  isEditing: boolean;
  editContent: string;
  setEditContent: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const LogEntry: React.FC<LogEntryProps> = ({
  log,
  isEditing,
  editContent,
  setEditContent,
  onSave,
  onCancel,
  onEdit,
  onDelete
}) => {
  return (
    <div key={log.id} className="mb-3 bg-[#151e2d] text-white rounded-lg shadow-[0_6px_0_rgba(15,23,42,0.5)] hover:shadow-[0_8px_0_rgba(15,23,42,0.5)] transition-all duration-300 animate-fade-in hover:translate-y-[-3px] border-[3px] border-[#0f172a]">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center text-sm font-extrabold">
            <Clock className="h-4 w-4 mr-1.5 opacity-70 text-[#33C3F0]" />
            {format(parseISO(log.startTime), 'h:mm a')} - {format(parseISO(log.endTime), 'h:mm a')}
            <span className="ml-2 text-xs font-bold text-white opacity-80">
              ({Math.round(log.duration / 60)} min)
            </span>
          </div>
          <div className="flex gap-1">
            {isEditing ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onSave}
                  className="h-8 w-8 p-0 rounded-lg bg-[#33C3F0]/20 hover:bg-[#33C3F0]/30 text-[#33C3F0] transition-colors border-[3px] border-[#0f172a]/30 shadow-[0_4px_0_rgba(15,23,42,0.3)] hover:shadow-[0_6px_0_rgba(15,23,42,0.3)] active:shadow-[0_1px_0_rgba(15,23,42,0.3)] active:translate-y-2"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onCancel}
                  className="h-8 w-8 p-0 rounded-lg bg-[#33C3F0]/20 hover:bg-[#33C3F0]/30 text-[#33C3F0] transition-colors border-[3px] border-[#0f172a]/30 shadow-[0_4px_0_rgba(15,23,42,0.3)] hover:shadow-[0_6px_0_rgba(15,23,42,0.3)] active:shadow-[0_1px_0_rgba(15,23,42,0.3)] active:translate-y-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onEdit}
                  className="h-8 w-8 p-0 rounded-lg bg-[#33C3F0]/20 hover:bg-[#33C3F0]/30 text-[#33C3F0] transition-colors border-[3px] border-[#0f172a]/30 shadow-[0_4px_0_rgba(15,23,42,0.3)] hover:shadow-[0_6px_0_rgba(15,23,42,0.3)] active:shadow-[0_1px_0_rgba(15,23,42,0.3)] active:translate-y-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDelete}
                  className="h-8 w-8 p-0 rounded-lg bg-[#33C3F0]/20 hover:bg-[#33C3F0]/30 text-[#33C3F0] transition-colors border-[3px] border-[#0f172a]/30 shadow-[0_4px_0_rgba(15,23,42,0.3)] hover:shadow-[0_6px_0_rgba(15,23,42,0.3)] active:shadow-[0_1px_0_rgba(15,23,42,0.3)] active:translate-y-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full mt-2 text-sm bg-[#1e293b] border-[3px] border-[#0f172a] text-white placeholder-white/70 focus:ring-[#33C3F0]/30 rounded-lg shadow-[inset_0_3px_5px_rgba(0,0,0,0.4)]"
            rows={3}
            autoFocus
          />
        ) : (
          <div className="text-sm mt-2">
            {log.tasks && log.tasks.length > 0 ? (
              <div className="space-y-1">
                {log.tasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-2 bg-[#1e293b] p-3 rounded-lg hover:bg-[#232f43] transition-colors border-[3px] border-[#0f172a]/30">
                    <div className="rounded-full bg-[#1e293b] p-1 mt-0.5 border-[2px] border-[#0f172a]/30">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#33C3F0]" />
                    </div>
                    <div className="flex-1 font-extrabold">{task.content}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="whitespace-pre-wrap bg-[#1e293b] rounded-lg p-3 hover:bg-[#232f43] transition-colors border-[3px] border-[#0f172a]/30 font-extrabold">
                {log.content}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogEntry;

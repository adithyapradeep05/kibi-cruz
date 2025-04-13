
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EditIcon, SaveIcon, Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogEntryType } from '@/types/logs';
import { format } from 'date-fns';

interface LogEntryProps {
  entry: LogEntryType;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

const LogEntry: React.FC<LogEntryProps> = ({ entry, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(entry.content);

  const handleSave = () => {
    onUpdate(entry.id, content);
    setIsEditing(false);
  };

  const formatTime = (date: Date): string => {
    return format(date, 'h:mm a');
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <Card className="bg-card-dark border-white/5 mb-4 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 hover:border-white/10">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <div className="font-mono text-sm text-white/60">
            {formatTime(new Date(entry.startTime))} - {formatTime(new Date(entry.endTime))} 
            <span className="ml-2">({formatDuration(entry.duration)})</span>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setIsEditing(!isEditing)}
            >
              <EditIcon size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70 hover:text-red-400 hover:bg-white/10"
              onClick={() => onDelete(entry.id)}
            >
              <Trash2Icon size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you work on?"
              className="min-h-[100px] bg-card-bg border-white/10 text-white"
            />
            <Button 
              onClick={handleSave}
              size="sm"
              variant="purple"
              className="mt-2 bg-purple"
            >
              <SaveIcon size={16} className="mr-2" />
              Save
            </Button>
          </div>
        ) : (
          <div className="whitespace-pre-line text-sm text-white/80">
            {content.split('\n').map((line, i) => (
              line.trim() ? (
                <p key={i} className={cn(
                  "py-0.5",
                  !line.startsWith('•') && !line.startsWith('-') && "pl-4"
                )}>
                  {line}
                </p>
              ) : <br key={i} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogEntry;

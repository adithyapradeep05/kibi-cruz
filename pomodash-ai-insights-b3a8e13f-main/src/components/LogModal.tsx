
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { TimerPhase } from '@/types/timer';

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  phase: TimerPhase;
  startTime: Date;
  endTime: Date;
}

const LogModal: React.FC<LogModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  phase,
  startTime,
  endTime
}) => {
  const [content, setContent] = useState('');

  const handleSave = () => {
    onSave(content || 'No details provided');
    setContent('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border border-border/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">What did you do?</DialogTitle>
          <DialogDescription className="pt-2">
            {phase === 'work' ? 'Tell us what you worked on during this session!' : 'How was your break?'}
            <div className="text-sm text-muted-foreground mt-1">
              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="I worked on..."
          className="min-h-[100px] bg-background border border-input"
          autoFocus
        />
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="w-full sm:w-auto"
          >
            Skip
          </Button>
          <Button 
            onClick={handleSave}
            variant="fun"
            className="w-full sm:w-auto"
          >
            Save Log
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogModal;

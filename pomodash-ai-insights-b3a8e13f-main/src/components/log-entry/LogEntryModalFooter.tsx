
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface LogEntryModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
}

const LogEntryModalFooter: React.FC<LogEntryModalFooterProps> = ({ onCancel, onSave }) => {
  return (
    <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
      <Button 
        variant="outline" 
        onClick={onCancel} 
        className="w-full sm:w-auto rounded-full hover:bg-background"
      >
        Cancel
      </Button>
      <Button 
        onClick={onSave}
        variant="fun"
        className="w-full sm:w-auto rounded-full"
      >
        Save Log
      </Button>
    </DialogFooter>
  );
};

export default LogEntryModalFooter;


import React from 'react';
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Timer from '@/components/Timer';
import TimerCompletionAlert from '@/components/TimerCompletionAlert';
import { TimerPhase } from '@/types/timer';
import { Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TimerSideProps {
  showAlert: boolean;
  onSessionComplete: (phase: TimerPhase, duration: number) => void;
}

const TimerSide: React.FC<TimerSideProps> = ({
  showAlert,
  onSessionComplete
}) => {
  return (
    <div className="flex flex-col justify-center items-center p-6 bg-[#0f172a] rounded-l-3xl border-r-[3px] border-[#10b981]/30">
      {showAlert && <TimerCompletionAlert />}
      
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-[#151e2d] text-[#10b981] hover:bg-[#151e2d]/70 transition-colors border-[3px] border-[#0f172a] w-12 h-12"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center w-full max-w-2xl">
        <Timer onSessionComplete={onSessionComplete} />
      </div>
    </div>
  );
};

export default TimerSide;

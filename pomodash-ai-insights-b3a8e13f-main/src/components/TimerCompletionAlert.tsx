
import React from 'react';
import { Check } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const TimerCompletionAlert: React.FC = () => {
  return (
    <Alert className="mb-4 bg-[#10b981]/20 border-[4px] border-[#0f172a] rounded-xl max-w-md animate-scale-in shadow-[0_6px_0_rgba(15,23,42,0.7)] hover:shadow-[0_8px_0_rgba(15,23,42,0.7)] transition-all duration-300 hover:translate-y-[-3px]">
      <div className="rounded-full bg-[#151e2d] p-2 border-[3px] border-[#0f172a]">
        <Check className="h-5 w-5 text-[#10b981] drop-shadow-md" />
      </div>
      <AlertDescription className="text-white font-bubblegum text-base text-shadow-lg">
        Great job! Time for a break.
      </AlertDescription>
    </Alert>
  );
};

export default TimerCompletionAlert;


import React from 'react';
import { Button } from "@/components/ui/button";
import { BrainCircuit } from 'lucide-react';

interface GenerateInsightsButtonProps {
  onAnalyze: () => void;
  hasApiKey: boolean;
}

const GenerateInsightsButton: React.FC<GenerateInsightsButtonProps> = ({ onAnalyze, hasApiKey }) => {
  return (
    <div className="flex justify-center py-4">
      <Button
        className="flex items-center gap-2 border-[4px] border-[#0f172a] bg-gradient-to-r from-[#33C3F0] to-[#10b981] text-white rounded-xl shadow-[0_8px_0_rgba(15,23,42,0.7)] hover:shadow-[0_10px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)] active:translate-y-3 transition-all duration-300 hover:from-[#33C3F0]/90 hover:to-[#10b981]/90 font-extrabold px-8 py-4 text-lg"
        onClick={onAnalyze}
      >
        <BrainCircuit className="h-6 w-6" />
        Generate AI Insights
      </Button>
    </div>
  );
};

export default GenerateInsightsButton;


import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

interface FocusMetricsProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const FocusMetrics: React.FC<FocusMetricsProps> = ({ 
  title, 
  value, 
  icon 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="p-3 sm:p-4 bg-[#151e2d] rounded-lg shadow-[0_5px_0_rgba(15,23,42,0.6)] hover:shadow-[0_7px_0_rgba(15,23,42,0.6)] transition-all duration-300 border-[3px] border-[#0f172a] animate-fade-in hover:translate-y-[-3px]">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold tracking-wider text-[#33C3F0]">{title}</div>
        <div className="rounded-lg bg-[#33C3F0]/20 p-1.5 sm:p-2 text-[#33C3F0] border-[2px] border-[#0f172a]/30">
          {icon}
        </div>
      </div>
      <div className="mt-2 text-xl font-bubblegum text-white drop-shadow-md">{value}</div>
    </div>
  );
};

export default FocusMetrics;

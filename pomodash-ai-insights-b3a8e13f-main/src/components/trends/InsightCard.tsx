
import React from 'react';
import { Badge } from "@/components/ui/badge";
import LogInsights from './LogInsights';
import { Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface InsightCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  variant?: 'default' | 'accent' | 'highlight' | 'subtle';
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  title, 
  icon, 
  content,
  variant = 'default'
}) => {
  const isMobile = useIsMobile();
  
  // Define variant-specific styles with improved colors and gradients
  const getCardStyles = () => {
    switch(variant) {
      case 'accent':
        return 'bg-gradient-to-br from-[#33C3F0]/20 to-[#33C3F0]/10 border-[#33C3F0]/30 shadow-[#33C3F0]/5';
      case 'highlight':
        return 'bg-gradient-to-br from-orange-500/20 to-amber-500/10 border-orange-500/30 shadow-orange-500/5';
      case 'subtle':
        return 'bg-[#1e293b]/50 border-[#0f172a]/40 shadow-black/5';
      default:
        return 'bg-gradient-to-br from-[#151e2d]/95 to-[#1e293b]/40 border-white/10 shadow-black/10';
    }
  };
  
  return (
    <div className={`p-5 sm:p-6 rounded-xl shadow-[0_4px_0_rgba(15,23,42,0.4)] hover:shadow-[0_5px_0_rgba(15,23,42,0.4)] transition-all duration-300 relative border-[2px] ${getCardStyles()} animate-fade-in hover:translate-y-[-2px]`}>
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
        <Badge variant="outline" className="rounded-lg font-bold text-xs border-[#33C3F0]/40 bg-[#33C3F0]/15 text-[#33C3F0] px-3 py-1 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          AI Insight
        </Badge>
      </div>
      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center mt-8 sm:mt-6 text-white">
        <span className="mr-2 text-[#33C3F0]">{icon}</span>
        <span>{title}</span>
      </h3>
      <div className="prose prose-sm max-w-full prose-p:text-white/90 prose-headings:text-white prose-strong:text-white/95 prose-headings:font-bold">
        <LogInsights content={content} />
      </div>
    </div>
  );
};

export default InsightCard;

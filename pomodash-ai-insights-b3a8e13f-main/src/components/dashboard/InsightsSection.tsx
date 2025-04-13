
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, BrainCircuit, Sparkles } from 'lucide-react';
import { LogEntryType } from '@/types/logs';
import { hasApiKey } from '@/utils/aiAnalytics';
import InsightCard from '../trends/InsightCard';
import MetricsGrid from '../insights/MetricsGrid';
import AnalyzingIndicator from '../insights/AnalyzingIndicator';
import GenerateInsightsButton from '../insights/GenerateInsightsButton';
import AIInsightDialog from '../insights/AIInsightDialog';
import { useInsightsAnalysis } from '@/hooks/useInsightsAnalysis';
import { Badge } from '@/components/ui/badge';

interface InsightsSectionProps {
  logs: LogEntryType[];
  autoAnalyze?: boolean;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ logs, autoAnalyze = true }) => {
  const { 
    aiAnalysis,
    isAnalyzing,
    showAIDialog,
    setShowAIDialog,
    analyzeLogs
  } = useInsightsAnalysis({ logs, autoAnalyze });

  const handleShowDialog = () => {
    setShowAIDialog(true);
  };

  // Extract the first insight for preview
  const getFirstInsight = () => {
    if (!aiAnalysis) return '';
    
    // Try to get the first paragraph or section
    const firstParagraph = aiAnalysis.split('\n\n')[0];
    
    // If it's too long, truncate it
    if (firstParagraph.length > 200) {
      return firstParagraph.substring(0, 200) + '...';
    }
    
    return firstParagraph;
  };

  return (
    <>
      <Card data-tutorial="insights-section" className="mt-4 sm:mt-8 border-[4px] border-[#0f172a] shadow-[0_8px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] hover:translate-y-[-3px] transition-all duration-300 rounded-xl overflow-hidden bg-[#151e2d]">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-lg sm:text-xl font-extrabold">
              <BarChart className="mr-2 sm:mr-3 h-6 w-6 text-[#33C3F0]" />
              <span className="text-white drop-shadow-md">Insights & Trends</span>
            </CardTitle>
            {aiAnalysis && !isAnalyzing && (
              <Badge variant="outline" className="bg-[#33C3F0]/10 text-[#33C3F0] border-[3px] border-[#33C3F0]/30 px-2 py-1 rounded-lg text-xs flex items-center gap-1 font-bold">
                <Sparkles className="h-3 w-3" />
                AI-Powered
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center text-white py-8 sm:py-10 bg-[#1e293b]/30 rounded-lg border-[3px] border-[#0f172a]/30 font-extrabold">
              <p className="font-extrabold">Complete focus sessions to see trends and insights here.</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <MetricsGrid logs={logs} />
              
              {isAnalyzing && <AnalyzingIndicator />}
              
              {!isAnalyzing && logs.length > 0 && !aiAnalysis && hasApiKey() && (
                <GenerateInsightsButton onAnalyze={analyzeLogs} hasApiKey={hasApiKey()} />
              )}
              
              {aiAnalysis && !isAnalyzing && (
                <>
                  <InsightCard 
                    title="AI Productivity Insights" 
                    icon={<BrainCircuit className="h-5 w-5" />} 
                    content={getFirstInsight()}
                    variant="accent"
                  />
                  {aiAnalysis.split('\n\n').length > 1 && (
                    <div className="flex justify-center mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-sm rounded-lg border-[3px] border-[#33C3F0]/30 hover:bg-[#33C3F0]/10 shadow-[0_5px_0_rgba(15,23,42,0.4)] hover:shadow-[0_7px_0_rgba(15,23,42,0.4)] active:shadow-[0_2px_0_rgba(15,23,42,0.4)] active:translate-y-2 transition-all font-extrabold"
                        onClick={handleShowDialog}
                      >
                        <Sparkles className="mr-1.5 h-3 w-3 text-[#33C3F0]" />
                        View Full Analysis
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AIInsightDialog 
        showAIDialog={showAIDialog}
        setShowAIDialog={setShowAIDialog}
        aiAnalysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
      />
    </>
  );
};

export default InsightsSection;

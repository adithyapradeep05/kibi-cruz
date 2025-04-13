
import { useState, useEffect } from 'react';
import { LogEntryType } from '@/types/logs';
import { useToast } from '@/hooks/use-toast';
import { analyzeLogTrends } from '@/utils/aiAnalytics';
import { useAuth } from '@/contexts/auth';

interface UseInsightsAnalysisProps {
  logs: LogEntryType[];
  autoAnalyze?: boolean;
}

export function useInsightsAnalysis({ logs, autoAnalyze = true }: UseInsightsAnalysisProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number | null>(null);

  const analyzeLogs = async () => {
    if (logs.length === 0) {
      toast({
        title: "No Data",
        description: "Complete focus sessions to generate insights.",
        variant: "destructive"
      });
      return;
    }

    // Make sure user is authenticated to use AI features
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the AI analysis feature and save your data to the cloud.",
        variant: "destructive"
      });
      return;
    }

    // Don't re-analyze if it's been less than 10 minutes since the last analysis
    // unless this is a manual analysis (not auto)
    const now = Date.now();
    if (lastAnalysisTime && now - lastAnalysisTime < 10 * 60 * 1000 && autoAnalyze) {
      if (aiAnalysis) {
        setShowAIDialog(true);
        return;
      }
    }

    setIsAnalyzing(true);
    
    try {
      console.log("Starting AI analysis with logs:", logs.length);
      const analysis = await analyzeLogTrends(logs);
      console.log("AI analysis completed:", analysis ? analysis.substring(0, 100) + "..." : "No analysis returned");
      
      if (!analysis || analysis.includes("error") || analysis.includes("API key")) {
        throw new Error(analysis || "Failed to generate analysis");
      }
      
      setAiAnalysis(analysis);
      setLastAnalysisTime(now);
      
      if (!showAIDialog) {
        toast({
          title: "Analysis Complete",
          description: "Your productivity insights are ready to view.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("AI analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not analyze your logs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  useEffect(() => {
    if (autoAnalyze && logs.length > 0 && user && !aiAnalysis && !isAnalyzing) {
      const timer = setTimeout(() => {
        analyzeLogs();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [logs, autoAnalyze, aiAnalysis, user]);

  return {
    aiAnalysis,
    isAnalyzing,
    showAIDialog,
    setShowAIDialog,
    analyzeLogs
  };
}

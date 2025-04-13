
import React, { useState, useEffect } from 'react';
import { Goal } from '@/types/goals';
import { useToast } from '@/hooks/use-toast';
import { hasApiKey } from '@/utils/apiKeyStorage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BrainCircuit, Target } from 'lucide-react';
import { analyzeGoalProgress } from '@/utils/goalAnalytics';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import MarkdownRenderer from '../trends/LogInsights';

interface GoalAnalysisProps {
  goal: Goal;
  onClose: () => void;
}

const GoalAnalysis: React.FC<GoalAnalysisProps> = ({ goal, onClose }) => {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!hasApiKey()) {
        toast({
          title: "API Key Missing",
          description: "Please add your OpenAI API key in settings to use this feature.",
          variant: "destructive"
        });
        return;
      }

      setIsLoading(true);
      try {
        const result = await analyzeGoalProgress(goal);
        setAnalysis(result);
      } catch (error) {
        console.error('Error analyzing goal:', error);
        toast({
          title: "Analysis Failed",
          description: error instanceof Error ? error.message : "Failed to analyze goal progress.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [goal, toast]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-card-dark rounded-lg border-[4px] border-[#0f172a] max-w-lg shadow-[0_10px_0_rgba(15,23,42,0.7)]">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#33C3F0] flex items-center gap-2 font-extrabold drop-shadow-md">
            <Target className="h-6 w-6" />
            Goal Analysis: {goal.title}
          </DialogTitle>
          <DialogDescription className="text-white font-bold">
            AI-powered insights and recommendations for your goal progress.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px] pr-2 mt-2">
          {isLoading ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-[200px] rounded-full" />
              </div>
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-4 w-[90%] rounded-full" />
              <Skeleton className="h-4 w-[80%] rounded-full" />
              <Skeleton className="h-4 w-[95%] rounded-full" />
              <div className="pt-2">
                <Skeleton className="h-6 w-[180px] rounded-full" />
                <div className="pl-4 pt-2 space-y-2">
                  <Skeleton className="h-4 w-[85%] rounded-full" />
                  <Skeleton className="h-4 w-[75%] rounded-full" />
                  <Skeleton className="h-4 w-[90%] rounded-full" />
                </div>
              </div>
            </div>
          ) : analysis ? (
            <div className="py-4 px-2 bg-secondary/50 rounded-lg border-[3px] border-[#0f172a]/30">
              <MarkdownRenderer content={analysis} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-white bg-secondary/50 rounded-lg border-[3px] border-[#0f172a]/30">
              <BrainCircuit className="h-10 w-10 mb-4 text-primary/40" />
              <p className="font-extrabold">Unable to generate analysis for this goal.</p>
              <p className="text-sm mt-1 font-bold">Try adding more tasks or details to your goal.</p>
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter className="mt-4">
          <Button
            onClick={onClose}
            className="rounded-lg border-[4px] font-extrabold text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoalAnalysis;

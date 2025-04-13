
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoals } from '@/contexts/GoalsContext';
import GoalsManager from '../goals/GoalsManager';
import { Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { hasApiKey } from '@/utils/apiKeyStorage';
import { toast } from '@/hooks/use-toast';
import { analyzeTaskProgress } from '@/utils/goalProgressAnalysis';
import { ScrollArea } from '@/components/ui/scroll-area';

const GoalsSection: React.FC = () => {
  const { goals, updateGoal } = useGoals();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Set up automatic progress analysis when component mounts or goals change
  useEffect(() => {
    const analyzeAllGoals = async () => {
      if (!hasApiKey()) return;
      
      setIsAnalyzing(true);
      
      try {
        // Process each goal with tasks
        for (const goal of goals) {
          if (goal.tasks.length === 0) continue;
          
          // Analyze progress using AI
          const aiProgress = await analyzeTaskProgress(goal.tasks, goal.title);
          
          // Only update if the progress is different
          if (Math.abs(goal.progress - aiProgress) > 5) {
            updateGoal(goal.id, { progress: aiProgress });
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Error analyzing goals:", error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    if (goals.length > 0 && hasApiKey() && !isInitialized) {
      toast({
        title: "Analyzing Goal Progress",
        description: "Using AI to analyze your task progress..."
      });
      
      analyzeAllGoals();
    }
  }, [goals, isInitialized, updateGoal]);

  return (
    <Card data-tutorial="goals-section" className="bg-[#151e2d] border-[4px] border-[#0f172a] shadow-[0_8px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] hover:translate-y-[-3px] transition-all duration-300 rounded-xl overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-[#33C3F0] flex items-center font-extrabold text-lg drop-shadow-md">
          <Target className="h-6 w-6 mr-2" />
          Goals Tracker
          {isAnalyzing && (
            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full flex items-center">
              <span className="mr-1 h-2 w-2 bg-primary rounded-full animate-pulse"></span>
              Analyzing...
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <GoalsManager />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GoalsSection;

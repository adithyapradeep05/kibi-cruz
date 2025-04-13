
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AITaskGeneratorProps {
  goalTitle: string;
  goalDescription?: string;
  goalCategory?: string;
  onTasksGenerated: (tasks: string[]) => void;
  disabled?: boolean;
}

const AITaskGenerator: React.FC<AITaskGeneratorProps> = ({
  goalTitle,
  goalDescription = "",
  goalCategory = "",
  onTasksGenerated,
  disabled = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const generateTasks = async () => {
    if (!goalTitle.trim()) {
      toast({
        title: "Goal title required",
        description: "Please provide a goal title before generating tasks.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // API key is now stored in Supabase Edge Function secrets
      const { data, error } = await supabase.functions.invoke('generate-tasks', {
        body: {
          goalTitle: goalTitle.trim(),
          goalDescription: goalDescription.trim(),
          goalCategory: goalCategory.trim()
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) {
        toast({
          title: "Tasks Generated",
          description: `Successfully created ${data.tasks.length} tasks for your goal!`
        });
        
        onTasksGenerated(data.tasks);
      } else {
        throw new Error("No tasks were generated. Please try again.");
      }
    } catch (error) {
      console.error("Error generating tasks:", error);
      toast({
        title: "Task Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate tasks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={generateTasks}
      disabled={disabled || isGenerating || !goalTitle.trim()}
      className={`flex items-center gap-1 ${isGenerating ? 'bg-primary/10' : 'bg-card border-primary/20 text-primary hover:bg-primary/10'}`}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4 mr-1" />
      )}
      {isGenerating ? "Generating..." : "Generate Tasks with AI"}
    </Button>
  );
};

export default AITaskGenerator;

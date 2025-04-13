
import React from 'react';
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Brain, Key, Clock, BarChart4 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LogInsights from './LogInsights';
import InsightCard from './InsightCard';
import { useAuth } from '@/contexts/auth';

interface InsightsTabProps {
  onAnalyze: () => void;
  analysis: string;
  isAnalyzing: boolean;
  analysisSections: Record<string, string>;
}

const InsightsTab: React.FC<InsightsTabProps> = ({ 
  onAnalyze, 
  analysis, 
  isAnalyzing,
  analysisSections
}) => {
  const { user } = useAuth();

  return (
    <div className="p-4 pt-6">
      {!user ? (
        <Card className="p-8 bg-secondary/50 border border-border/30 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <Key className="h-12 w-12 text-primary/70 mb-4" />
            <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sign in to use the AI analysis feature.
            </p>
          </div>
        </Card>
      ) : !analysis ? (
        <Card className="p-8 bg-secondary/50 border border-border/30 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <Brain className="h-12 w-12 text-primary/70 mb-4" />
            <h3 className="text-lg font-medium mb-2">No AI Analysis Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click the "Analyze with AI" button to get personalized insights about your productivity patterns.
            </p>
            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              <BrainCircuit className="mr-2 h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="p-6 bg-secondary/50 border border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
                AI Productivity Analysis
              </h3>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Powered by GPT-4o
              </Badge>
            </div>
            <Separator className="mb-4" />
            <div className="prose prose-sm dark:prose-invert max-w-full">
              <LogInsights content={analysisSections.overview || analysis} />
            </div>
          </Card>
          
          {analysisSections.timing && (
            <InsightCard 
              title="Timing Analysis" 
              icon={<Clock className="mr-2 h-5 w-5 text-primary" />} 
              content={analysisSections.timing} 
            />
          )}
          
          {analysisSections.content && (
            <InsightCard 
              title="Content Insights" 
              icon={<BarChart4 className="mr-2 h-5 w-5 text-primary" />} 
              content={analysisSections.content} 
            />
          )}
          
          <div className="text-right mt-4">
            <Button
              onClick={onAnalyze}
              variant="outline"
              size="sm"
              disabled={isAnalyzing}
              className="text-sm"
            >
              <BrainCircuit className="mr-2 h-3 w-3" />
              Refresh Analysis
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InsightsTab;

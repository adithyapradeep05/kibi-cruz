
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Zap, Target, Calendar, Clock, BarChart4, LineChart, Calendar as CalendarIcon } from 'lucide-react';
import InsightCard from './InsightCard';
import { hasApiKey } from '@/utils/apiKeyStorage';
import { Separator } from '@/components/ui/separator';

interface SuggestionsTabProps {
  onAnalyze: () => void;
  analysis: string;
  isAnalyzing: boolean;
  analysisSections: Record<string, string>;
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ 
  onAnalyze, 
  analysis, 
  isAnalyzing,
  analysisSections
}) => {
  // Sample insights to demonstrate the formatting
  const sampleInsights = {
    consistency: `### Daily Logging Rate
> You've logged something 26 out of the last 30 days — that's 87% consistency!

This level of consistency is building a strong foundation for your productivity habits.

### Best Logging Day
You log the most on **Wednesdays** — consider scheduling your more challenging tasks for this day when you're already in a productive mindset.`,

    goalTracking: `### Goal Completion Forecast
> At your current pace, you'll complete "Get Internship" by May 2.

This gives you a clear timeline to work with and helps create positive urgency.

### Milestone Alert
You're **75% done** with 'Build Portfolio' — you're in the final stretch! Consider setting aside focused time this week to make meaningful progress.`,

    workPatterns: `### Most Logged Task Types
70% of your logs this week were study-related. This shows a strong academic focus.

### Effort Distribution
You added 8 entries this week — 3 major tasks, 5 light ones. This is a healthy balance of intensive and lighter work.`
  };

  return (
    <div className="p-4 pt-6">
      {!analysis ? (
        <Card className="p-8 bg-card border border-border/30 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <Zap className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-lg font-medium mb-2">No Suggestions Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate an AI analysis to get personalized productivity suggestions.
            </p>
            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing || !hasApiKey()}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              <BrainCircuit className="mr-2 h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-3xl shadow-md border border-border/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-foreground">
              <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
              AI Productivity Insights
            </h2>
            <p className="text-muted-foreground mb-4">
              Personalized analysis based on your work patterns and goals
            </p>
            <Separator className="mb-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-primary/10 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Consistency Score</p>
                  <p className="text-xl font-bold">87%</p>
                </div>
              </div>
              
              <div className="bg-accent/10 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-accent/20 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Peak Productivity</p>
                  <p className="text-xl font-bold">10AM-1PM</p>
                </div>
              </div>
            </div>
          </div>
          
          {analysisSections.suggestions ? (
            <InsightCard 
              title="Actionable Suggestions" 
              icon={<Zap className="h-5 w-5" />} 
              content={analysisSections.suggestions}
              variant="accent" 
            />
          ) : (
            <InsightCard 
              title="Consistency Insights" 
              icon={<Calendar className="h-5 w-5" />} 
              content={sampleInsights.consistency}
              variant="accent"
            />
          )}
          
          {analysisSections.strategy ? (
            <InsightCard 
              title="Personalized Focus Strategy" 
              icon={<Target className="h-5 w-5" />} 
              content={analysisSections.strategy}
              variant="highlight" 
            />
          ) : (
            <InsightCard 
              title="Progress & Goal Tracking" 
              icon={<BarChart4 className="h-5 w-5" />} 
              content={sampleInsights.goalTracking}
              variant="highlight"
            />
          )}
          
          <InsightCard 
            title="Work Patterns" 
            icon={<LineChart className="h-5 w-5" />} 
            content={sampleInsights.workPatterns}
            variant="subtle" 
          />
          
          <div className="text-right mt-4">
            <Button
              onClick={onAnalyze}
              variant="outline"
              size="sm"
              disabled={isAnalyzing}
              className="text-sm rounded-full border-primary/30 hover:bg-primary/10"
            >
              <BrainCircuit className="mr-2 h-3 w-3" />
              Refresh Insights
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionsTab;

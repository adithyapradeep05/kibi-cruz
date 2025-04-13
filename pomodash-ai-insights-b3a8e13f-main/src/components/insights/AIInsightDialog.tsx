
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import LogInsights from '../trends/LogInsights';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AIInsightDialogProps {
  showAIDialog: boolean;
  setShowAIDialog: React.Dispatch<React.SetStateAction<boolean>>;
  aiAnalysis: string;
  isAnalyzing: boolean;
}

const AIInsightDialog: React.FC<AIInsightDialogProps> = ({
  showAIDialog,
  setShowAIDialog,
  aiAnalysis,
  isAnalyzing
}) => {
  return (
    <AlertDialog open={showAIDialog} onOpenChange={setShowAIDialog}>
      <AlertDialogContent className="max-w-3xl rounded-xl max-h-[90vh] bg-gradient-to-br from-card-bg to-card-dark border-white/10 shadow-xl animate-scale-in">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-kiwi-light animate-pulse-subtle" />
            AI Productivity Analysis
          </AlertDialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-kiwi-light animate-pulse-subtle" />
            <span>Generated using advanced AI to analyze your productivity patterns</span>
          </div>
          <Separator className="my-2 opacity-20" />
        </AlertDialogHeader>
        
        <AlertDialogDescription>
          {isAnalyzing ? (
            <div className="flex flex-col items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kiwi-light mb-4"></div>
              <p className="text-kiwi-light animate-pulse">Analyzing your work patterns...</p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto my-4 pr-2 space-y-4">
              <div className="bg-kiwi-medium/5 backdrop-blur-sm rounded-lg p-4 border border-kiwi-medium/20 hover:border-kiwi-medium/30 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                <h3 className="font-medium text-lg mb-2 text-kiwi-light">Productivity Overview</h3>
                <LogInsights content={aiAnalysis.split('📊')[0] || aiAnalysis} />
              </div>
              
              {aiAnalysis.includes('📊') && (
                <div className="bg-accent/5 backdrop-blur-sm rounded-lg p-4 border border-accent/20 hover:border-accent/30 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                  <h3 className="font-medium text-lg mb-2 text-accent">Detailed Analysis</h3>
                  <LogInsights content={aiAnalysis.split('📊')[1] || ''} />
                </div>
              )}
              
              {aiAnalysis.includes('💡') && (
                <div className="bg-orange/5 backdrop-blur-sm rounded-lg p-4 border border-orange/20 hover:border-orange/30 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                  <h3 className="font-medium text-lg mb-2 text-orange">Suggestions & Next Steps</h3>
                  <LogInsights content={aiAnalysis.split('💡')[1] || ''} />
                </div>
              )}
            </div>
          )}
        </AlertDialogDescription>
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isAnalyzing} 
            className="rounded-full border-white/10 hover:bg-kiwi-medium/15 text-foreground transition-all hover:scale-105 active:scale-95"
          >
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AIInsightDialog;

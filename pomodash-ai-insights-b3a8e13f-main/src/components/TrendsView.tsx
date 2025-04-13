
import React, { useState } from 'react';
import { LogEntryType } from '@/types/logs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart4, 
  PieChart as PieChartIcon, 
  Key, 
  TrendingUp, 
  Lightbulb,
  Zap,
  LineChart as LineChartIcon,
  BrainCircuit
} from 'lucide-react';
import ApiKeySettings from './ApiKeySettings';
import { hasApiKey } from '@/utils/apiKeyStorage';
import AnalyzingIndicator from './insights/AnalyzingIndicator';
import EmptyTrendsState from './trends/EmptyTrendsState';
import OverviewTab from './trends/OverviewTab';
import ChartsTab from './trends/ChartsTab';
import InsightsTab from './trends/InsightsTab';
import TrendsTab from './trends/TrendsTab';
import SuggestionsTab from './trends/SuggestionsTab';
import { useAnalysisSections } from '@/hooks/useAnalysisSections';

interface TrendsViewProps {
  logs: LogEntryType[];
  onAnalyze: () => void;
  analysis: string;
  isAnalyzing: boolean;
}

const TrendsView: React.FC<TrendsViewProps> = ({ logs, onAnalyze, analysis, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const analysisSections = useAnalysisSections(analysis);
  
  return (
    <Card className="bg-gradient-to-br from-card-bg to-card-dark backdrop-blur border border-white/10 shadow-2xl h-full overflow-auto animate-fade-in rounded-3xl">
      <CardHeader className="pb-3 pt-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center text-xl">
              <TrendingUp className="mr-2 h-5 w-5 text-kiwi-light animate-pulse-subtle" />
              Productivity Insights
            </CardTitle>
            <CardDescription className="text-white/70">
              Analyze your work patterns and get personalized productivity insights
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => setIsApiKeyDialogOpen(true)}
              variant="outline"
              className="flex items-center bg-secondary/50 text-primary border-primary/20"
              size="sm"
            >
              <Key className="mr-2 h-4 w-4" />
              API Key
            </Button>
            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing || logs.length === 0 || !hasApiKey()}
              className="flex items-center bg-kiwi-medium text-white hover:bg-kiwi-light transition-all transform hover:scale-105 active:scale-95 rounded-full"
              title={!hasApiKey() ? "Add OpenAI API key in settings first" : ""}
            >
              <BrainCircuit className="mr-2 h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {logs.length === 0 ? (
          <EmptyTrendsState />
        ) : (
          <div>
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <div className="px-4 pt-3 sticky top-0 bg-card-dark/80 backdrop-blur z-10 border-b border-white/10">
                <TabsList className="grid grid-cols-3 sm:grid-cols-5 w-full bg-card-dark rounded-xl">
                  <TabsTrigger value="overview" className="flex items-center data-[state=active]:bg-kiwi-medium/20 data-[state=active]:text-kiwi-light rounded-lg">
                    <BarChart4 className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="charts" className="flex items-center data-[state=active]:bg-kiwi-medium/20 data-[state=active]:text-kiwi-light rounded-lg">
                    <PieChartIcon className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Charts</span>
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center data-[state=active]:bg-kiwi-medium/20 data-[state=active]:text-kiwi-light rounded-lg">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">AI Insights</span>
                  </TabsTrigger>
                  <TabsTrigger value="trends" className="flex items-center data-[state=active]:bg-kiwi-medium/20 data-[state=active]:text-kiwi-light rounded-lg">
                    <LineChartIcon className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Trends</span>
                  </TabsTrigger>
                  <TabsTrigger value="suggestions" className="flex items-center data-[state=active]:bg-kiwi-medium/20 data-[state=active]:text-kiwi-light rounded-lg">
                    <Zap className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Suggestions</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {isAnalyzing && (
                <div className="p-6">
                  <AnalyzingIndicator />
                </div>
              )}
              
              {!isAnalyzing && (
                <>
                  <TabsContent value="overview" className="animate-fade-in">
                    <OverviewTab 
                      logs={logs} 
                      onSetActiveTab={setActiveTab} 
                      analysis={analysis}
                      analysisSections={analysisSections}
                    />
                  </TabsContent>
                  
                  <TabsContent value="charts" className="animate-fade-in">
                    <ChartsTab logs={logs} />
                  </TabsContent>
                  
                  <TabsContent value="insights" className="animate-fade-in">
                    <InsightsTab 
                      onAnalyze={onAnalyze} 
                      analysis={analysis} 
                      isAnalyzing={isAnalyzing}
                      analysisSections={analysisSections}
                    />
                  </TabsContent>
                  
                  <TabsContent value="trends" className="animate-fade-in">
                    <TrendsTab logs={logs} />
                  </TabsContent>
                  
                  <TabsContent value="suggestions" className="animate-fade-in">
                    <SuggestionsTab 
                      onAnalyze={onAnalyze} 
                      analysis={analysis} 
                      isAnalyzing={isAnalyzing}
                      analysisSections={analysisSections}
                    />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        )}
      </CardContent>
      
      <ApiKeySettings 
        isOpen={isApiKeyDialogOpen} 
        onClose={() => setIsApiKeyDialogOpen(false)} 
      />
    </Card>
  );
};

export default TrendsView;

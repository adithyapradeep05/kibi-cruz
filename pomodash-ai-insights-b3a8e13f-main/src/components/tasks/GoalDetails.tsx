import React, { useState } from 'react';
import { Goal, GoalStatus, Milestone, GoalTask, TaskStatus } from '@/types/goals';
import { useGoals } from '@/contexts/GoalsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit, 
  ListChecks, 
  Plus, 
  Target, 
  Trash2,
  CirclePause,
  CirclePlay,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import TaskList from '../tasks/TaskList';
import MilestonesList from '../tasks/MilestonesList';
import NumericGoalInput from '../tasks/NumericGoalInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { analyzeGoalProgress, predictCompletionDate } from '@/utils/goalAnalytics';
import { hasApiKey } from '@/utils/apiKeyStorage';
import { toast } from '@/hooks/use-toast';

interface GoalDetailsProps {
  goal: Goal;
  onClose: () => void;
}

const GoalDetails: React.FC<GoalDetailsProps> = ({ goal, onClose }) => {
  const { updateGoal, deleteGoal } = useGoals();
  const [activeTab, setActiveTab] = useState<'tasks' | 'milestones' | 'details'>('tasks');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleToggleStatus = () => {
    const newStatus: GoalStatus = goal.status === 'active' 
      ? 'paused' 
      : goal.status === 'paused' 
        ? 'active' 
        : goal.status;
        
    updateGoal(goal.id, { status: newStatus });
  };

  const handleCompleteGoal = () => {
    updateGoal(goal.id, { 
      status: 'completed',
      progress: 100,
      completedAt: new Date().toISOString()
    });
  };

  const handleDeleteGoal = () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goal.id);
      onClose();
    }
  };

  const handleUpdateNumericValues = (currentValue: number) => {
    if (goal.type !== 'numeric') return;
    
    const progress = goal.targetValue 
      ? Math.min(100, Math.round((currentValue / goal.targetValue) * 100))
      : 0;
      
    updateGoal(goal.id, { 
      currentValue,
      progress,
      status: progress >= 100 ? 'completed' : goal.status
    });
  };

  const getStatusBadgeColor = (status: GoalStatus) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'paused':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'completed':
        return 'bg-emerald-500 hover:bg-emerald-600';
    }
  };

  const getIconForStatus = (status: GoalStatus) => {
    switch(status) {
      case 'active':
        return <CirclePause className="h-4 w-4 mr-1" />;
      case 'paused':
        return <CirclePlay className="h-4 w-4 mr-1" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 mr-1" />;
    }
  };

  const getProgressDisplay = () => {
    switch (goal.type) {
      case 'checklist':
        const completedTasks = goal.tasks.filter(t => t.completed).length;
        return `${completedTasks} of ${goal.tasks.length} tasks completed`;
        
      case 'numeric':
        return `${goal.currentValue || 0} of ${goal.targetValue || 0}`;
        
      case 'time-based':
        const hoursLogged = goal.timeLogged 
          ? Math.round((goal.timeLogged / 60) * 10) / 10
          : 0;
        const targetHours = goal.timeTarget 
          ? Math.round((goal.timeTarget / 60) * 10) / 10
          : 0;
        return `${hoursLogged} of ${targetHours} hours`;
        
      case 'habit':
        return `Streak: ${goal.currentStreak || 0} of ${goal.targetStreak || 0} days`;
        
      default:
        return `${goal.progress}% complete`;
    }
  };

  const handleAnalyzeGoal = async () => {
    if (!hasApiKey()) {
      toast({
        title: "API Key Required",
        description: "Please set up your OpenAI API key to use AI features.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysis(null);
    
    try {
      const analysisText = await analyzeGoalProgress(goal);
      setAnalysis(analysisText);
      
      const predictedDate = predictCompletionDate(goal);
      if (predictedDate && predictedDate !== goal.predictedCompletion) {
        updateGoal(goal.id, {
          predictedCompletion: predictedDate,
          lastAnalyzed: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error analyzing goal:", error);
      toast({
        title: "Analysis Error",
        description: "There was a problem analyzing this goal.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onClose} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Goals
        </Button>
        
        <div className="flex items-center gap-2">
          {goal.status !== 'completed' && (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={handleToggleStatus}
              >
                {getIconForStatus(goal.status)}
                {goal.status === 'active' ? 'Pause' : 'Resume'}
              </Button>
              
              <Button
                variant="outline" 
                className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500"
                onClick={handleCompleteGoal}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Mark Complete
              </Button>
            </>
          )}
          
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDeleteGoal}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        <Card className="flex-1 border-border/30 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    {goal.icon ? (
                      <span className="text-lg">{goal.icon}</span>
                    ) : (
                      <Target className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">{goal.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={cn("px-2 py-0.5", getStatusBadgeColor(goal.status))}>
                        {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                      </Badge>
                      
                      <Badge variant="outline" className="px-2 py-0.5 flex items-center gap-1">
                        {goal.type === 'checklist' ? (
                          <ListChecks className="h-3 w-3" />
                        ) : (
                          <Target className="h-3 w-3" />
                        )}
                        {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                      </Badge>
                      
                      {goal.category && (
                        <Badge variant="secondary" className="px-2 py-0.5">
                          {goal.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-4 pb-4">
            {goal.description && (
              <p className="text-muted-foreground text-sm mb-4">
                {goal.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 mb-4">
              {goal.createdAt && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Created: {format(new Date(goal.createdAt), 'MMM d, yyyy')}</span>
                </div>
              )}
              
              {goal.targetDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Due: {format(new Date(goal.targetDate), 'MMM d, yyyy')}</span>
                </div>
              )}
              
              {goal.completedAt && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Completed: {format(new Date(goal.completedAt), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1 mb-5">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{getProgressDisplay()}</span>
                <span className="font-medium">{goal.progress}%</span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={goal.progress} 
                  className="h-3 bg-primary/10 rounded-md" 
                  indicatorClassName={goal.status === 'completed' ? "bg-emerald-500" : "bg-primary"}
                />
                
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {[25, 50, 75, 100].map((milestone) => (
                    <div 
                      key={milestone}
                      className={cn(
                        "absolute top-0 h-full w-0.5",
                        milestone === 100 ? "w-1 rounded-r-full" : "",
                        {
                          "bg-emerald-500/70": goal.progress >= milestone,
                          "bg-foreground/30": goal.progress < milestone
                        }
                      )}
                      style={{ left: `${milestone}%` }}
                    />
                  ))}
                </div>
              </div>
              
              {goal.predictedCompletion && (
                <div className="text-xs text-muted-foreground mt-1">
                  Expected completion: {goal.predictedCompletion}
                </div>
              )}
            </div>
            
            {goal.type === 'numeric' && (
              <NumericGoalInput 
                currentValue={goal.currentValue || 0}
                targetValue={goal.targetValue || 0}
                onUpdate={handleUpdateNumericValues}
              />
            )}
            
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleAnalyzeGoal}
                disabled={isAnalyzing}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Progress'}
              </Button>
              
              {analysis && (
                <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-md text-sm">
                  {analysis}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-[2] flex flex-col overflow-hidden">
          <Tabs defaultValue="tasks" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
            <TabsList className="mb-4 grid grid-cols-3 h-10">
              <TabsTrigger value="tasks" className="rounded-l-md">Tasks</TabsTrigger>
              {goal.milestones && goal.milestones.length > 0 && (
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              )}
              <TabsTrigger value="details" className="rounded-r-md">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="flex-1 data-[state=active]:flex data-[state=active]:flex-col">
              <Card className="flex-1 border-border/30 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-hidden h-[calc(100%-64px)]">
                  <ScrollArea className="h-full pr-4">
                    <TaskList goalId={goal.id} tasks={goal.tasks} />
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            {goal.milestones && goal.milestones.length > 0 && (
              <TabsContent value="milestones" className="flex-1 data-[state=active]:flex data-[state=active]:flex-col">
                <Card className="flex-1 border-border/30 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Milestones</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-hidden h-[calc(100%-64px)]">
                    <ScrollArea className="h-full pr-4">
                      <MilestonesList 
                        milestones={goal.milestones || []} 
                      />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            <TabsContent value="details" className="data-[state=active]:flex data-[state=active]:flex-col flex-1">
              <Card className="flex-1 border-border/30 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Additional Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {goal.tags && goal.tags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {goal.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="px-2 py-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Additional goal details can be added here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default GoalDetails;

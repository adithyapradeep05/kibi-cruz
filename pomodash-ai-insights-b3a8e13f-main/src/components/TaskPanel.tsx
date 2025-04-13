
import React, { useState } from 'react';
import { useGoals } from '@/contexts/GoalsContext';
import { Goal, GoalStatus, GoalType } from '@/types/goals';
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flag, 
  ListChecks, 
  Plus, 
  Tag, 
  Target,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import GoalCreationForm from './tasks/GoalCreationForm';
import GoalDetails from './tasks/GoalDetails';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ApiKeySetupPrompt from './tasks/ApiKeySetupPrompt';
import ApiKeySettings from './ApiKeySettings';

const TaskPanel: React.FC = () => {
  const { goals } = useGoals();
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showApiSettings, setShowApiSettings] = useState(false);

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = 
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || goal.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Group goals by status for Kanban layout
  const goalsByStatus = filteredGoals.reduce((acc, goal) => {
    // Default statuses for Kanban columns
    const status = goal.status === 'active' && goal.progress === 100 
      ? 'completed' 
      : goal.status;
      
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(goal);
    return acc;
  }, {} as Record<string, Goal[]>);

  // Define the order of columns
  const kanbanColumns = [
    {id: 'active', title: 'In Progress', color: 'bg-blue-500/20 border-blue-500/30', icon: Clock}, 
    {id: 'paused', title: 'Paused', color: 'bg-amber-500/20 border-amber-500/30', icon: Circle},
    {id: 'completed', title: 'Completed', color: 'bg-emerald-500/20 border-emerald-500/30', icon: CheckCircle2}
  ];

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const closeGoalDetails = () => {
    setSelectedGoal(null);
  };

  const statusIcon = (status: GoalStatus) => {
    switch (status) {
      case 'active':
        return <Circle className="h-3 w-3 text-emerald-500" />;
      case 'completed':
        return <CheckCircle2 className="h-3 w-3 text-emerald-500" />;
      case 'paused':
        return <Clock className="h-3 w-3 text-amber-500" />;
      default:
        return null;
    }
  };

  const getGoalTypeIcon = (type: GoalType) => {
    return type === 'checklist' 
      ? <ListChecks className="h-3 w-3 text-primary" />
      : <Target className="h-3 w-3 text-primary" />;
  };

  const getProgressSummary = (goal: Goal) => {
    switch (goal.type) {
      case 'checklist':
        return `${goal.tasks.filter(t => t.completed).length}/${goal.tasks.length} tasks`;
      case 'numeric':
        return `${goal.currentValue || 0}/${goal.targetValue || 0}`;
      default:
        return `${goal.progress}%`;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {selectedGoal ? (
        <GoalDetails goal={selectedGoal} onClose={closeGoalDetails} />
      ) : showGoalForm ? (
        <GoalCreationForm onClose={() => setShowGoalForm(false)} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Your Goals & Projects</h2>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowApiSettings(true)}
                variant="outline"
                className="rounded-full bg-secondary/50 text-primary border-primary/20"
                size="sm"
              >
                <Key className="h-4 w-4 mr-1" />
                API Key
              </Button>
              <Button 
                onClick={() => setShowGoalForm(true)}
                variant="default"
                className="rounded-full bg-kiwi-medium text-white hover:bg-kiwi-light"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Goal
              </Button>
            </div>
          </div>

          <ApiKeySetupPrompt onSetupClick={() => setShowApiSettings(true)} />
          
          <div className="mb-4">
            <Input
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card/50 border-border/30 rounded-lg"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'all')} className="flex-1 flex flex-col">
            <TabsList className="mb-4 bg-card/50 rounded-lg">
              <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Active
              </TabsTrigger>
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="flex-1 data-[state=active]:flex data-[state=active]:flex-col mt-0">
              {filteredGoals.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-52 text-center p-6 bg-card/30 rounded-xl">
                  <Target className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No goals found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Try a different search term' : 'Create your first goal to get started'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                  {kanbanColumns.map(column => (
                    <div 
                      key={column.id} 
                      className={cn(
                        "flex flex-col h-full rounded-xl border-2 p-3",
                        column.color
                      )}
                    >
                      <div className="flex items-center gap-2 mb-3 px-2">
                        <column.icon className="h-5 w-5 text-foreground" />
                        <h3 className="font-semibold">{column.title}</h3>
                        <Badge variant="outline" className="ml-auto">
                          {goalsByStatus[column.id]?.length || 0}
                        </Badge>
                      </div>
                      
                      <ScrollArea className="flex-1 pr-2">
                        <div className="space-y-3">
                          {goalsByStatus[column.id]?.map(goal => (
                            <Card 
                              key={goal.id} 
                              className={cn(
                                "hover:bg-card/80 cursor-pointer transition-all border-border/30 overflow-hidden",
                                goal.status === 'completed' && "opacity-75"
                              )}
                              onClick={() => handleSelectGoal(goal)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 flex items-center justify-center bg-card h-12 w-12 rounded-lg">
                                    {goal.icon ? (
                                      <span className="text-xl">{goal.icon}</span>
                                    ) : (
                                      <Target className="h-7 w-7 text-primary" />
                                    )}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-lg">{goal.title}</span>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {goal.description}
                                    </p>
                                    
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                      <div className="flex items-center gap-1">
                                        {statusIcon(goal.status)}
                                        <span>{getProgressSummary(goal)}</span>
                                      </div>
                                      
                                      {goal.targetDate && (
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          <span>Due {format(new Date(goal.targetDate), 'MMM d')}</span>
                                        </div>
                                      )}
                                      
                                      <div className="flex items-center gap-1">
                                        {getGoalTypeIcon(goal.type)}
                                        <span>{goal.type}</span>
                                      </div>
                                    </div>
                                    
                                    {goal.tags && goal.tags.length > 0 && (
                                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                                        {goal.tags.slice(0, 3).map((tag, index) => (
                                          <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0 h-5">
                                            {tag}
                                          </Badge>
                                        ))}
                                        {goal.tags.length > 3 && (
                                          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                                            +{goal.tags.length - 3}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="relative mt-3">
                                  <Progress 
                                    value={goal.progress} 
                                    className="h-2 bg-primary/10" 
                                    indicatorClassName={cn(
                                      goal.status === 'completed' ? "bg-emerald-500" : "bg-primary"
                                    )}
                                  />
                                  
                                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                    {[25, 50, 75, 100].map((milestone) => (
                                      <div 
                                        key={milestone}
                                        className={cn(
                                          "absolute top-0 h-full w-0.5",
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
                                  <div className="mt-2 text-xs text-muted-foreground flex items-center">
                                    <Flag className="h-3 w-3 mr-1" />
                                    Expected completion: {goal.predictedCompletion}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                          
                          {(!goalsByStatus[column.id] || goalsByStatus[column.id].length === 0) && (
                            <div className="flex flex-col items-center justify-center h-24 text-center p-4 bg-card/30 rounded-xl">
                              <p className="text-muted-foreground text-sm">
                                No goals in this column
                              </p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                      
                      {column.id === 'active' && (
                        <Button 
                          onClick={() => setShowGoalForm(true)}
                          variant="ghost" 
                          className="w-full mt-3 border border-dashed border-border/50 hover:bg-card/80"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Goal
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {showApiSettings && (
        <ApiKeySettings 
          isOpen={showApiSettings} 
          onClose={() => setShowApiSettings(false)} 
        />
      )}
    </div>
  );
};

export default TaskPanel;

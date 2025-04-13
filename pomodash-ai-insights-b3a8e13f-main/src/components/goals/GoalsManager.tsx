import React, { useState } from 'react';
import { useGoals } from '@/contexts/GoalsContext';
import { Goal, GoalTask } from '@/types/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Target, CheckCircle, Edit, Trash2, Calendar, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import GoalAnalysis from './GoalAnalysis';
import { hasApiKey } from '@/utils/apiKeyStorage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const GoalsManager: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, addTaskToGoal, updateGoalTask, deleteGoalTask, analyzeGoalProgressWithAI } = useGoals();
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('');
  const [newGoalTasks, setNewGoalTasks] = useState<string[]>(['']);
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});
  const [selectedGoalForAnalysis, setSelectedGoalForAnalysis] = useState<Goal | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<Record<string, boolean>>({});
  const [isGeneratingTasks, setIsGeneratingTasks] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const toggleGoalExpanded = (goalId: string) => {
    setExpandedGoals(prev => ({
      ...prev,
      [goalId]: !prev[goalId]
    }));
  };

  const isGoalExpanded = (goalId: string) => {
    return expandedGoals[goalId] ?? false;
  };

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) return;
    
    const filteredTasks = newGoalTasks.filter(task => task.trim().length > 0);
    
    const newGoal = await addGoal(
      newGoalTitle.trim(),
      newGoalDescription.trim(),
      filteredTasks,
      newGoalCategory.trim() || undefined,
      newGoalTargetDate || undefined
    );
    
    setNewGoalTitle('');
    setNewGoalDescription('');
    setNewGoalTargetDate('');
    setNewGoalCategory('');
    setNewGoalTasks(['']);
    setShowAddGoalDialog(false);
    
    if (filteredTasks.length > 0 && hasApiKey() && newGoal) {
      setTimeout(() => {
        analyzeGoalProgressWithAI(newGoal.id);
      }, 500);
    }
  };

  const handleAddTaskInput = () => {
    setNewGoalTasks([...newGoalTasks, '']);
  };

  const handleTaskInputChange = (index: number, value: string) => {
    const updatedTasks = [...newGoalTasks];
    updatedTasks[index] = value;
    setNewGoalTasks(updatedTasks);
  };

  const handleRemoveTaskInput = (index: number) => {
    if (newGoalTasks.length === 1) {
      setNewGoalTasks(['']);
      return;
    }
    
    const updatedTasks = newGoalTasks.filter((_, i) => i !== index);
    setNewGoalTasks(updatedTasks);
  };

  const handleToggleTaskCompleted = (goalId: string, taskId: string, completed: boolean) => {
    setIsAnalyzing(prev => ({ ...prev, [goalId]: true }));
    
    updateGoalTask(goalId, taskId, { completed });
    
    setTimeout(() => {
      setIsAnalyzing(prev => ({ ...prev, [goalId]: false }));
    }, 2000);
  };

  const handleAddTaskToGoal = (goalId: string, taskContent: string) => {
    if (!taskContent.trim()) return;
    
    setIsAnalyzing(prev => ({ ...prev, [goalId]: true }));
    
    addTaskToGoal(goalId, taskContent.trim());
    
    setTimeout(() => {
      setIsAnalyzing(prev => ({ ...prev, [goalId]: false }));
    }, 2000);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goalId);
    }
  };

  const handleShowAnalysis = (goal: Goal) => {
    setSelectedGoalForAnalysis(goal);
  };

  const handleGenerateTasksForGoal = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    setIsGeneratingTasks(prev => ({ ...prev, [goalId]: true }));
    
    try {
      if (!hasApiKey()) {
        toast({
          title: "API Key Required",
          description: "Please set up your OpenAI API key in settings to use AI features.",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('generate-tasks', {
        body: {
          goalTitle: goal.title,
          goalDescription: goal.description,
          goalCategory: goal.category || ""
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) {
        for (const taskContent of data.tasks) {
          if (taskContent.trim()) {
            addTaskToGoal(goalId, taskContent.trim());
          }
        }
        
        toast({
          title: "Tasks Generated",
          description: `Successfully added ${data.tasks.length} tasks to "${goal.title}"!`
        });
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
      setIsGeneratingTasks(prev => ({ ...prev, [goalId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Target className="h-5 w-5" />
          Your Goals
        </h2>
        <Button
          onClick={() => setShowAddGoalDialog(true)}
          variant="default"
          className="rounded-full px-3 py-1 h-9 text-sm"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          New Goal
        </Button>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 bg-secondary/30 rounded-xl p-6 border border-border/30">
            <Target className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">
              You don't have any goals yet. Add your first goal to start tracking your progress!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map(goal => (
              <div 
                key={goal.id} 
                className="bg-card/80 backdrop-blur-sm rounded-xl shadow-sm border border-border/30 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <div 
                  className="px-4 py-3 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleGoalExpanded(goal.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="font-medium">{goal.title}</span>
                      {goal.category && (
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                          {goal.category}
                        </span>
                      )}
                      {isAnalyzing[goal.id] && (
                        <span className="bg-secondary/80 text-muted-foreground px-2 py-0.5 rounded-full text-xs flex items-center">
                          <span className="mr-1 h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                          Analyzing...
                        </span>
                      )}
                    </div>
                    
                    {!isGoalExpanded(goal.id) && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        {goal.tasks.length} tasks • {goal.tasks.filter(t => t.completed).length} completed
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-primary">
                      {goal.progress}%
                    </div>
                    {isGoalExpanded(goal.id) ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                <Progress value={goal.progress} className="h-1 bg-primary/10" indicatorClassName="bg-primary" />
                
                {isGoalExpanded(goal.id) && (
                  <div className="px-4 py-3 border-t border-border/20">
                    {goal.description && (
                      <p className="text-sm mb-3 text-muted-foreground">{goal.description}</p>
                    )}
                    
                    {goal.targetDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                        <Calendar className="h-3 w-3" />
                        Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                      </div>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Tasks</h4>
                        {goal.type === 'checklist' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-primary hover:bg-primary/10 flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateTasksForGoal(goal.id);
                            }}
                            disabled={isGeneratingTasks[goal.id]}
                          >
                            {isGeneratingTasks[goal.id] ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3.5 w-3.5 mr-1" />
                                Generate Tasks
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      
                      {goal.tasks.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No tasks added to this goal yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {goal.tasks.map(task => (
                            <div 
                              key={task.id} 
                              className={cn(
                                "flex items-start gap-2 px-2 py-1.5 rounded-lg",
                                task.completed ? "bg-primary/10" : "hover:bg-primary/5"
                              )}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleTaskCompleted(goal.id, task.id, !task.completed);
                                }}
                                className="mt-0.5 flex-shrink-0"
                              >
                                {task.completed ? (
                                  <CheckCircle className="h-4 w-4 text-primary" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-primary/40" />
                                )}
                              </button>
                              <span className={cn(
                                "text-sm flex-1",
                                task.completed && "line-through text-muted-foreground"
                              )}>
                                {task.content}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteGoalTask(goal.id, task.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Input 
                          placeholder="Add a new task..."
                          className="text-sm h-8 rounded-lg"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.currentTarget;
                              handleAddTaskToGoal(goal.id, input.value);
                              input.value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            handleAddTaskToGoal(goal.id, input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 text-primary hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowAnalysis(goal);
                        }}
                      >
                        Analyze Progress
                      </Button>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg h-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGoal(goal.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Dialog open={showAddGoalDialog} onOpenChange={setShowAddGoalDialog}>
        <DialogContent className="bg-card rounded-3xl border-border max-w-md shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground flex items-center gap-2">
              <Target className="h-5 w-5" />
              Create New Goal
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Set clear, achievable goals and track your progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Goal Title</label>
              <Input
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="e.g., Learn Spanish"
                className="rounded-2xl bg-card border-border focus:border-primary focus-visible:ring-primary/30"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description (optional)</label>
              <Textarea
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                placeholder="Describe your goal in more detail..."
                className="rounded-2xl bg-card border-border focus:border-primary focus-visible:ring-primary/30 resize-none"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category (optional)</label>
                <Input
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  placeholder="e.g., Learning"
                  className="rounded-2xl bg-card border-border focus:border-primary focus-visible:ring-primary/30"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Target Date (optional)</label>
                <Input
                  type="date"
                  value={newGoalTargetDate}
                  onChange={(e) => setNewGoalTargetDate(e.target.value)}
                  className="rounded-2xl bg-card border-border focus:border-primary focus-visible:ring-primary/30"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tasks (optional)</label>
              {newGoalTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={task}
                    onChange={(e) => handleTaskInputChange(index, e.target.value)}
                    placeholder={`Task ${index + 1}`}
                    className="rounded-2xl bg-card border-border focus:border-primary focus-visible:ring-primary/30"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTaskInput(index)}
                    className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTaskInput}
                className="mt-2 rounded-full bg-card border-primary/20 text-primary hover:bg-primary/10"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddGoalDialog(false)}
              className="rounded-full border-border text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAddGoal}
              disabled={!newGoalTitle.trim()}
              className="rounded-full"
            >
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedGoalForAnalysis && (
        <GoalAnalysis 
          goal={selectedGoalForAnalysis} 
          onClose={() => setSelectedGoalForAnalysis(null)} 
        />
      )}
    </div>
  );
};

export default GoalsManager;

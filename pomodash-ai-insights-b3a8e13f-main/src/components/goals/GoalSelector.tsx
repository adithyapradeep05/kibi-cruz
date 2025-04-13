
import React, { useState, useMemo } from 'react';
import { useGoals } from '@/contexts/GoalsContext';
import { Goal } from '@/types/goals';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronDown, Plus, Target } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface GoalSelectorProps {
  onSelectGoal: (goal: Goal | null) => void;
  onSelectTask?: (goalId: string, taskId: string) => void;
  selectedGoalId?: string;
  selectedTaskId?: string;
  className?: string;
  variant?: 'default' | 'compact';
}

const GoalSelector: React.FC<GoalSelectorProps> = ({ 
  onSelectGoal, 
  onSelectTask, 
  selectedGoalId, 
  selectedTaskId,
  className,
  variant = 'default'
}) => {
  const { goals } = useGoals();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedGoal = useMemo(() => {
    return goals.find(g => g.id === selectedGoalId);
  }, [goals, selectedGoalId]);

  const selectedTaskText = useMemo(() => {
    if (!selectedGoalId || !selectedTaskId) return null;
    const goal = goals.find(g => g.id === selectedGoalId);
    if (!goal) return null;
    const task = goal.tasks.find(t => t.id === selectedTaskId);
    return task?.content;
  }, [goals, selectedGoalId, selectedTaskId]);

  const handleGoalSelect = (goal: Goal) => {
    onSelectGoal(goal);
    setDropdownOpen(false);
  };

  const handleTaskSelect = (goalId: string, taskId: string) => {
    if (onSelectTask) {
      onSelectTask(goalId, taskId);
      setDropdownOpen(false);
    }
  };

  const handleClearSelection = () => {
    onSelectGoal(null);
    setDropdownOpen(false);
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "flex justify-between items-center w-full bg-kiwi-medium/10 border-kiwi-medium/20 text-kiwi-light hover:bg-kiwi-medium/20 rounded-xl gap-2",
            variant === 'compact' ? "py-1 px-3 h-8 text-xs" : "py-2 px-4",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <Target className={cn("text-kiwi-light", variant === 'compact' ? "h-3.5 w-3.5" : "h-4 w-4")} />
            <span className="truncate">
              {selectedGoal ? selectedGoal.title : "Select a goal"}
            </span>
          </div>
          <ChevronDown className={cn("text-kiwi-light/70", variant === 'compact' ? "h-3.5 w-3.5" : "h-4 w-4")} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-1 shadow-lg">
        <DropdownMenuLabel className="text-kiwi-light font-medium px-2 py-1.5">
          Your Goals
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {goals.length === 0 ? (
            <div className="px-3 py-4 text-center text-muted-foreground">
              <p className="text-sm">No goals yet!</p>
              <p className="text-xs mt-1">Create a goal to track your progress</p>
            </div>
          ) : (
            goals.map(goal => (
              <React.Fragment key={goal.id}>
                <DropdownMenuItem 
                  className={cn(
                    "px-2 py-1.5 flex items-center gap-2 cursor-pointer rounded-lg my-0.5 hover:bg-kiwi-medium/10",
                    goal.id === selectedGoalId && "bg-kiwi-medium/10 font-medium"
                  )}
                  onClick={() => handleGoalSelect(goal)}
                >
                  <Target className="h-3.5 w-3.5 text-kiwi-light" />
                  <span className="truncate">{goal.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{goal.progress}%</span>
                </DropdownMenuItem>
                
                {goal.id === selectedGoalId && onSelectTask && goal.tasks.length > 0 && (
                  <div className="ml-4 pl-2 border-l border-kiwi-medium/20 space-y-0.5 mb-1">
                    {goal.tasks
                      .filter(task => !task.completed)
                      .map(task => (
                        <DropdownMenuItem
                          key={task.id}
                          className={cn(
                            "px-2 py-1 text-xs flex items-center gap-2 cursor-pointer rounded-lg hover:bg-kiwi-medium/10",
                            task.id === selectedTaskId && "bg-kiwi-medium/10 font-medium"
                          )}
                          onClick={() => handleTaskSelect(goal.id, task.id)}
                        >
                          {task.id === selectedTaskId ? (
                            <CheckCircle className="h-3 w-3 text-kiwi-light" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-kiwi-medium/40" />
                          )}
                          <span className="truncate">{task.content}</span>
                        </DropdownMenuItem>
                      ))}
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem 
          className="px-2 py-1.5 flex items-center gap-2 cursor-pointer rounded-lg hover:bg-kiwi-medium/10"
          onClick={handleClearSelection}
        >
          <Plus className="h-3.5 w-3.5 text-kiwi-light" />
          <span>Clear selection</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GoalSelector;

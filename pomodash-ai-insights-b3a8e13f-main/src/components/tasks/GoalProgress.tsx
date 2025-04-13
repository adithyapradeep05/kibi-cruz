
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, Flag, CheckCircle, Target, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import { Goal, GoalType } from '@/types/goals';
import { cn } from '@/lib/utils';

interface GoalProgressProps {
  goal: Goal;
  predictedCompletion?: string;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal, predictedCompletion }) => {
  const { progress, status, type, tasks, targetValue, currentValue } = goal;
  
  // Generate milestone markers
  const milestones = [25, 50, 75, 100];
  
  // Calculate progress summary based on goal type
  const getProgressSummary = () => {
    switch (type) {
      case 'checklist':
        const completedTasks = tasks.filter(t => t.completed).length;
        return `${completedTasks} of ${tasks.length} tasks complete`;
      case 'numeric':
        return `${currentValue || 0} of ${targetValue || 0} complete`;
      default:
        return `${progress}% complete`;
    }
  };

  return (
    <div className="mb-4 relative">
      <div className="flex items-center gap-2 mb-1">
        {type === 'checklist' && <CheckCircle className="h-4 w-4 text-primary" />}
        {type === 'numeric' && <Target className="h-4 w-4 text-primary" />}
        <span className="text-sm font-medium text-foreground">{getProgressSummary()}</span>
      </div>
      
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-3 bg-primary/10" 
          indicatorClassName={status === 'completed' ? "bg-emerald-500" : "bg-primary"}
        />
        
        {/* Milestone markers */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {milestones.map((milestone) => (
            <div 
              key={milestone}
              className={cn(
                "absolute top-0 h-full w-0.5 bg-foreground/30",
                {
                  "bg-emerald-500": progress >= milestone,
                  "bg-foreground/60": progress < milestone && milestone === 100
                }
              )}
              style={{ left: `${milestone}%` }}
            >
              {milestone === 100 && (
                <Flag 
                  className={cn(
                    "h-3 w-3 absolute -right-1.5 -top-3",
                    progress >= 100 ? "text-emerald-500" : "text-foreground/60"
                  )} 
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{progress}% complete</span>
        {goal.targetDate && (
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Due {format(new Date(goal.targetDate), 'PPP')}
          </span>
        )}
        {predictedCompletion && (
          <span className="flex items-center ml-auto">
            <BarChart2 className="h-3 w-3 mr-1" />
            Predicted completion: {predictedCompletion}
          </span>
        )}
      </div>
    </div>
  );
};

export default GoalProgress;


import React from 'react';
import { Goal, GoalStatus } from '@/types/goals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, CheckCircle, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalHeaderProps {
  goal: Goal;
  onClose: () => void;
  onToggleStatus: () => void;
  onMarkComplete: () => void;
}

const GoalHeader: React.FC<GoalHeaderProps> = ({ 
  goal, 
  onClose, 
  onToggleStatus, 
  onMarkComplete 
}) => {
  const getStatusIcon = () => {
    switch (goal.status) {
      case 'active':
        return <Pause className="h-4 w-4 mr-1" />;
      case 'paused':
        return <Play className="h-4 w-4 mr-1" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };
  
  const getStatusText = () => {
    switch (goal.status) {
      case 'active':
        return 'Pause';
      case 'paused':
        return 'Resume';
      case 'completed':
        return 'Reactivate';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onClose} className="p-0 mr-2 h-8 w-8">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          {goal.icon && <span className="mr-2">{goal.icon}</span>}
          {goal.title}
          {goal.status === 'completed' && (
            <Badge variant="success" className="ml-2">Completed</Badge>
          )}
          {goal.status === 'paused' && (
            <Badge variant="outline" className="ml-2">Paused</Badge>
          )}
        </h2>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleStatus}
          className={cn(
            "text-xs",
            goal.status === 'paused' && "text-amber-500 border-amber-500/30",
            goal.status === 'completed' && "text-emerald-500 border-emerald-500/30"
          )}
        >
          {getStatusIcon()}
          {getStatusText()}
        </Button>
        
        {goal.status !== 'completed' && (
          <Button
            variant="default"
            size="sm"
            onClick={onMarkComplete}
            className="text-xs bg-emerald-500 hover:bg-emerald-600"
          >
            <Check className="h-4 w-4 mr-1" />
            Mark Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default GoalHeader;

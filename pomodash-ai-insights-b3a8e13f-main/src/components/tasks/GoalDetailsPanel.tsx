
import React from 'react';
import { Goal } from '@/types/goals';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import MilestonesList from './MilestonesList';

interface GoalDetailsPanelProps {
  goal: Goal;
  onDelete: () => void;
}

const GoalDetailsPanel: React.FC<GoalDetailsPanelProps> = ({ goal, onDelete }) => {
  return (
    <div className="space-y-4">
      {goal.description && (
        <div className="bg-card/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <p className="text-muted-foreground">{goal.description}</p>
        </div>
      )}
      
      <div className="bg-card/50 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Goal Info</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Type:</span>
            <span className="ml-2 capitalize">{goal.type}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>
            <span className="ml-2 capitalize">{goal.status}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Created:</span>
            <span className="ml-2">{format(new Date(goal.createdAt), 'MMM d, yyyy')}</span>
          </div>
          {goal.completedAt && (
            <div>
              <span className="text-muted-foreground">Completed:</span>
              <span className="ml-2">{format(new Date(goal.completedAt), 'MMM d, yyyy')}</span>
            </div>
          )}
          {goal.category && (
            <div>
              <span className="text-muted-foreground">Category:</span>
              <span className="ml-2">{goal.category}</span>
            </div>
          )}
        </div>
      </div>
      
      {goal.tags && goal.tags.length > 0 && (
        <div className="bg-card/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {goal.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {goal.milestones && goal.milestones.length > 0 && (
        <div className="bg-card/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Milestones</h3>
          <MilestonesList milestones={goal.milestones} />
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete Goal
        </Button>
        
        <Button variant="outline">
          <Edit2 className="h-4 w-4 mr-1" />
          Edit Goal
        </Button>
      </div>
    </div>
  );
};

export default GoalDetailsPanel;

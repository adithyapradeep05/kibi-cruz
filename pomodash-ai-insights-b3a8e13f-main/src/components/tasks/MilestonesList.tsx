
import React from 'react';
import { Milestone } from '@/types/goals';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MilestonesListProps {
  milestones: Milestone[];
}

const MilestonesList: React.FC<MilestonesListProps> = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center bg-card/30 border border-dashed border-border/60 rounded-lg p-4">
        <p className="text-muted-foreground mb-2">No milestones created yet</p>
        <Button variant="outline" size="sm" className="text-primary">
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Milestone
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <Card key={milestone.id} className="border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center justify-between">
              <span>{milestone.title}</span>
              <span className="text-sm text-muted-foreground">
                {milestone.progress}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {milestone.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {milestone.description}
              </p>
            )}
            
            <Progress
              value={milestone.progress}
              className="h-2 my-2"
              indicatorClassName={cn(
                milestone.completed ? "bg-emerald-500" : "bg-primary"
              )}
            />
            
            <div className="mt-3 space-y-1">
              <h4 className="text-xs font-medium mb-1">Tasks</h4>
              {milestone.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 text-xs py-1"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-primary/40" />
                  )}
                  <span
                    className={cn(
                      task.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {task.content}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MilestonesList;

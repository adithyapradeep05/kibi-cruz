
import React, { useState } from 'react';
import { GoalTask, SubTask, TaskStatus } from '@/types/goals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CalendarIcon, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  GripVertical, 
  Trash2,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface TaskItemProps {
  task: GoalTask;
  goalId: string;
  onUpdateTask: (goalId: string, taskId: string, updates: Partial<GoalTask>) => void;
  onDeleteTask: (goalId: string, taskId: string) => void;
  onToggleSubtask: (goalId: string, taskId: string, subtaskId: string, completed: boolean) => void;
  onDragStart?: (event: React.DragEvent, taskId: string) => void;
  onDragEnd?: (event: React.DragEvent) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  goalId, 
  onUpdateTask, 
  onDeleteTask,
  onToggleSubtask,
  onDragStart,
  onDragEnd
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (status: TaskStatus) => {
    onUpdateTask(goalId, task.id, { 
      status, 
      completed: status === 'completed'
    });
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatTimeEstimate = (estimate?: { value: number; unit: string }) => {
    if (!estimate) return null;
    return `${estimate.value} ${estimate.unit}`;
  };

  return (
    <Card 
      className={cn(
        "mb-2 hover:shadow-md transition-all overflow-hidden cursor-move p-1 shadow-lg",
        task.status === 'completed' && "opacity-60",
        task.status === 'in-progress' && "border-blue-400/30",
        task.status === 'completed' && "border-green-400/30"
      )}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <div 
            className="pt-1 text-muted-foreground touch-none"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-start gap-2">
              <Checkbox 
                checked={task.status === 'completed'}
                onCheckedChange={(checked) => {
                  onUpdateTask(goalId, task.id, { 
                    status: checked ? 'completed' : 'not-started',
                    completed: !!checked
                  });
                }}
                className="mt-1"
              />
              
              <div className="flex-1">
                <div className="font-medium text-foreground text-base mb-2">{task.content}</div>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                )}
                
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getStatusColor(task.status))}
                  >
                    {task.status === 'not-started' ? 'Not Started' : 
                      task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                  </Badge>
                  
                  {task.priority && (
                    <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  )}
                  
                  {task.dueDate && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {format(new Date(task.dueDate), "MMM d")}
                    </Badge>
                  )}
                  
                  {task.timeEstimate && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeEstimate(task.timeEstimate)}
                    </Badge>
                  )}
                  
                  {task.subtasks && task.subtasks.length > 0 && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <ListChecks className="h-3 w-3" />
                      {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <Select 
                value={task.status} 
                onValueChange={(value) => handleStatusChange(value as TaskStatus)}
              >
                <SelectTrigger className="w-32 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive"
                  onClick={() => onDeleteTask(goalId, task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <CollapsibleTrigger
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-1"
                >
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
              </div>
            </div>
          </div>
        </div>

        <Collapsible open={isOpen}>
          <CollapsibleContent className="pt-3 border-t border-border/50 mt-3 space-y-3">
            {task.subtasks && task.subtasks.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Subtasks</h4>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <Checkbox 
                        checked={subtask.completed}
                        onCheckedChange={(checked) => {
                          onToggleSubtask(goalId, task.id, subtask.id, !!checked);
                        }}
                      />
                      <span className={cn(
                        "text-sm",
                        subtask.completed && "line-through text-muted-foreground"
                      )}>
                        {subtask.content}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default TaskItem;

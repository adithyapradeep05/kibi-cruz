
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, Save } from 'lucide-react';
import { TaskEntry } from '@/types/logs';

interface TaskListProps {
  tasks: TaskEntry[];
  onRemoveTask: (id: string) => void;
  onSaveTasks: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onRemoveTask,
  onSaveTasks
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col text-center text-muted-foreground p-8">
        <div className="mb-2 text-4xl">📝</div>
        <p>As you work, add tasks you complete here.</p>
        <p>They'll be saved when your session ends!</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-sm font-medium mb-2">Added tasks:</div>
      <ScrollArea className="flex-1 rounded-lg border border-border/30 p-2 mb-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between py-2 group">
            <div className="text-sm">{task.content}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveTask(task.id)}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
            {task !== tasks[tasks.length - 1] && <Separator className="my-1" />}
          </div>
        ))}
      </ScrollArea>
      
      <Button 
        onClick={onSaveTasks}
        variant="fun"
        className="mt-auto"
      >
        <Save className="mr-2 h-4 w-4" />
        Save Log & Complete Session
      </Button>
    </>
  );
};

export default TaskList;

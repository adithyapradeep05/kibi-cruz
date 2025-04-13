
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X } from 'lucide-react';
import { TaskEntry } from '@/types/logs';

interface TaskListProps {
  tasks: TaskEntry[];
  onRemoveTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onRemoveTask }) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="text-sm font-medium">Added tasks:</div>
      <ScrollArea className="h-40 mt-2 rounded-lg border border-border/30 p-2">
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
    </div>
  );
};

export default TaskList;

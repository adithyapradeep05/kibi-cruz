
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TaskPriority, TimeEstimate } from '@/types/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Plus, Tag, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface TaskFormProps {
  goalId: string;
  onAddTask: (
    goalId: string, 
    name: string, 
    options: {
      description?: string;
      dueDate?: string;
      timeEstimate?: TimeEstimate;
      priority?: TaskPriority;
      subtasks?: string[];
      tags?: string[];
    }
  ) => void;
  onCancel: () => void;
}

interface FormValues {
  taskName: string;
  description: string;
  priority: TaskPriority | '';
  timeValue: string;
  timeUnit: 'minutes' | 'hours' | 'days' | 'weeks';
}

const TaskForm: React.FC<TaskFormProps> = ({ goalId, onAddTask, onCancel }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      taskName: '',
      description: '',
      priority: '',
      timeValue: '',
      timeUnit: 'hours',
    }
  });

  const onSubmit = (data: FormValues) => {
    const timeEstimate = data.timeValue 
      ? { 
          value: Number(data.timeValue), 
          unit: data.timeUnit 
        } as TimeEstimate
      : undefined;
    
    onAddTask(
      goalId,
      data.taskName,
      {
        description: data.description || undefined,
        dueDate: date ? date.toISOString() : undefined,
        timeEstimate,
        priority: data.priority as TaskPriority || undefined,
        subtasks: subtasks.length > 0 ? subtasks : undefined,
        tags: tags.length > 0 ? tags : undefined
      }
    );
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddSubtask = (subtask: string) => {
    if (subtask.trim()) {
      setSubtasks([...subtasks, subtask.trim()]);
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="taskName"
          rules={{ required: "Task name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter task name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter task description" 
                  {...field} 
                  className="resize-none" 
                  rows={3}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormItem className="flex flex-col">
            <FormLabel>Due Date (optional)</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </FormItem>

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority (optional)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="timeValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Estimate (optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    placeholder="Amount" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeUnit"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>&nbsp;</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Tags (optional)</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <button 
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 h-3 w-3 rounded-full bg-secondary-foreground/20 text-secondary-foreground flex items-center justify-center hover:bg-secondary-foreground/30"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Add a tag" 
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddTag}
            >
              <Tag className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <FormLabel>Subtasks (optional)</FormLabel>
          <div className="space-y-2 mb-2">
            {subtasks.map((subtask, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1 bg-secondary/50 p-2 rounded-md">
                  {subtask}
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveSubtask(index)}
                  className="h-8 w-8 p-0 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Add a subtask" 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                handleAddSubtask(input.value);
                input.value = '';
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            Add Task
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;

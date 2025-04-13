import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGoals } from '@/contexts/GoalsContext';
import { GoalStatus, GoalType } from '@/types/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  ListChecks,
  Plus,
  Target,
  Trash2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import AITaskGenerator from './AITaskGenerator';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(['checklist', 'numeric']),
  category: z.string().optional(),
  targetDate: z.date().optional(),
  tags: z.array(z.string()).optional(),
  icon: z.string().optional(),
  targetValue: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface GoalCreationFormProps {
  onClose: () => void;
}

const GoalCreationForm: React.FC<GoalCreationFormProps> = ({ onClose }) => {
  const { addGoal } = useGoals();
  const [tasks, setTasks] = useState<string[]>(['']);
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'checklist',
      category: '',
      tags: [],
    },
  });
  
  const goalType = form.watch('type');
  const goalTitle = form.watch('title');
  const goalDescription = form.watch('description');
  const goalCategory = form.watch('category');
  
  const handleAddTask = () => {
    setTasks([...tasks, '']);
  };
  
  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = value;
    setTasks(updatedTasks);
  };
  
  const handleRemoveTask = (index: number) => {
    if (tasks.length === 1) {
      setTasks(['']); // Keep at least one empty task
      return;
    }
    
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };
  
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleGeneratedTasks = (generatedTasks: string[]) => {
    // Replace empty tasks with generated ones, keeping any non-empty user tasks
    const userTasks = tasks.filter(task => task.trim().length > 0);
    setTasks([...userTasks, ...generatedTasks]);
  };
  
  const onSubmit = (values: FormValues) => {
    // Filter out empty tasks
    const filteredTasks = tasks.filter(task => task.trim().length > 0);
    
    // Add the goal
    addGoal(
      values.title,
      values.description || '',
      filteredTasks,
      values.category,
      values.targetDate ? values.targetDate.toISOString() : undefined,
      {
        type: values.type,
        status: 'active' as GoalStatus,
        tags: tags,
        icon: values.icon,
        targetValue: values.targetValue,
        currentValue: 0,
      }
    );
    
    onClose();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <Button variant="ghost" onClick={onClose} className="p-0 mr-2 h-8 w-8">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold text-foreground">Create New Goal</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Goal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What do you want to achieve?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your goal in more detail..." 
                      {...field} 
                      className="resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a goal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="checklist">
                        <div className="flex items-center">
                          <ListChecks className="h-4 w-4 mr-2" />
                          Checklist
                        </div>
                      </SelectItem>
                      <SelectItem value="numeric">
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          Numeric
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., School, Health, Career" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Target Date (optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon/Emoji (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 🎓 or 💪" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {goalType === 'numeric' && (
              <FormField
                control={form.control}
                name="targetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 100 pages to read" 
                        {...field}
                        onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          <div className="space-y-2">
            <FormLabel>Tags (optional)</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                >
                  {tag}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveTag(tag)} 
                    className="h-5 w-5 p-0 ml-1 text-primary hover:text-destructive hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
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
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
          </div>
          
          {goalType === 'checklist' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <FormLabel>Tasks</FormLabel>
                <AITaskGenerator 
                  goalTitle={goalTitle}
                  goalDescription={goalDescription}
                  goalCategory={goalCategory}
                  onTasksGenerated={handleGeneratedTasks}
                  disabled={!goalTitle}
                />
              </div>
              {tasks.map((task, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Task ${index + 1}`}
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTask(index)}
                    className="h-10 w-10 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTask}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Goal
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GoalCreationForm;


import React, { useState, useRef } from 'react';
import { GoalTask } from '@/types/goals';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpDown } from 'lucide-react';
import TaskForm from './TaskForm';
import { useGoals } from '@/contexts/GoalsContext';
import { Card, CardContent } from '@/components/ui/card';

interface TaskListProps {
  goalId: string;
  tasks: GoalTask[];
}

const TaskList: React.FC<TaskListProps> = ({ goalId, tasks }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const { 
    addTaskToGoal, 
    updateGoalTask, 
    deleteGoalTask, 
    updateSubtask,
    reorderTasks 
  } = useGoals();

  // Sort tasks by order
  const sortedTasks = [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Group tasks by status
  const tasksByStatus = {
    notStarted: sortedTasks.filter(t => t.status === 'not-started'),
    inProgress: sortedTasks.filter(t => t.status === 'in-progress'),
    completed: sortedTasks.filter(t => t.status === 'completed')
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    
    // This is required for Firefox
    e.dataTransfer.setData('text/plain', taskId);
    
    // Add some styling to the dragged element
    if (e.currentTarget instanceof HTMLElement) {
      setTimeout(() => {
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.style.opacity = '0.4';
        }
      }, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    
    if (!draggedTaskId || draggedTaskId === targetTaskId) {
      return;
    }
    
    // Get current indices
    const taskIds = sortedTasks.map(t => t.id);
    const draggedIndex = taskIds.indexOf(draggedTaskId);
    const targetIndex = taskIds.indexOf(targetTaskId);
    
    if (draggedIndex < 0 || targetIndex < 0) {
      return;
    }
    
    // Swap the tasks in the array
    const newTaskIds = [...taskIds];
    newTaskIds.splice(draggedIndex, 1);
    newTaskIds.splice(targetIndex, 0, draggedTaskId);
    
    // Update the order in the database
    reorderTasks(goalId, newTaskIds);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTaskId(null);
    
    // Reset opacity
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleAddTask = (goalId: string, name: string, options: any) => {
    addTaskToGoal(goalId, name, options);
    setShowAddForm(false);
  };

  const handleToggleSubtask = (goalId: string, taskId: string, subtaskId: string, completed: boolean) => {
    updateSubtask(goalId, taskId, subtaskId, { completed });
  };

  // Column labels with task counts
  const columns = [
    { id: 'notStarted', label: 'To Do', tasks: tasksByStatus.notStarted, color: 'bg-gray-200 dark:bg-gray-800' },
    { id: 'inProgress', label: 'In Progress', tasks: tasksByStatus.inProgress, color: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 'completed', label: 'Completed', tasks: tasksByStatus.completed, color: 'bg-green-100 dark:bg-green-900/30' }
  ];

  return (
    <div className="space-y-6">
      {!showAddForm ? (
        <Button
          onClick={() => setShowAddForm(true)}
          variant="outline"
          className="w-full justify-center py-6 text-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </Button>
      ) : (
        <TaskForm
          goalId={goalId}
          onAddTask={handleAddTask}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[500px]">
        {columns.map(column => (
          <div key={column.id} className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3 p-3 bg-card rounded-t-lg border-b border-border/30">
              <h3 className="text-base font-semibold flex items-center gap-1">
                {column.label}
                <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                  {column.tasks.length}
                </span>
              </h3>
              
              {column.tasks.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  title="Reorder tasks"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className={`p-3 rounded-b-lg flex-1 min-h-[450px] ${column.id === 'notStarted' ? 'bg-gray-100/10' : column.id === 'inProgress' ? 'bg-blue-100/10' : 'bg-green-100/10'}`}>
              <div className="space-y-3 h-full">
                {column.tasks.map((task) => (
                  <div 
                    key={task.id}
                    onDragOver={(e) => handleDragOver(e, task.id)}
                    className="transition-all duration-200"
                  >
                    <TaskItem
                      task={task}
                      goalId={goalId}
                      onUpdateTask={updateGoalTask}
                      onDeleteTask={deleteGoalTask}
                      onToggleSubtask={handleToggleSubtask}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  </div>
                ))}
                
                {column.tasks.length === 0 && (
                  <div className="flex items-center justify-center h-full border-2 border-dashed border-border/30 rounded-lg bg-transparent p-6">
                    <p className="text-center text-sm text-muted-foreground">
                      No tasks in this column. Drag and drop tasks here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

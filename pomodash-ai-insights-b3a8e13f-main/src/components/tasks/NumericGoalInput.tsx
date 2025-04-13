
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface NumericGoalInputProps {
  currentValue: number;
  targetValue?: number;
  onUpdate: (value: number) => void;
}

const NumericGoalInput: React.FC<NumericGoalInputProps> = ({ 
  currentValue, 
  targetValue,
  onUpdate 
}) => {
  const [inputValue, setInputValue] = useState(currentValue);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(Number(e.target.value) || 0);
  };

  const handleUpdate = () => {
    onUpdate(inputValue);
  };

  // Calculate progress percentage
  const progressPercentage = targetValue 
    ? Math.min(100, Math.max(0, (currentValue / targetValue) * 100)) 
    : 0;

  return (
    <div className="space-y-4">
      <div className="bg-card/50 p-5 rounded-lg">
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Current: {currentValue}</span>
            <span className="text-muted-foreground">Target: {targetValue}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-5 bg-primary/10" 
          />
        </div>
        
        <div className="flex gap-3">
          <Input
            type="number"
            value={inputValue}
            onChange={handleValueChange}
            className="flex-1"
          />
          <Button onClick={handleUpdate} className="min-w-24">
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NumericGoalInput;

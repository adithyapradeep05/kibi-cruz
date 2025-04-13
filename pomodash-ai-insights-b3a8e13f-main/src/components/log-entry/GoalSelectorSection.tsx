
import React from 'react';
import GoalSelector from '../goals/GoalSelector';

interface GoalSelectorSectionProps {
  selectedGoalId: string | null;
  selectedTaskId: string | null;
  onGoalSelect: (goalId: string | null, taskId: string | null) => void;
}

const GoalSelectorSection: React.FC<GoalSelectorSectionProps> = ({ 
  selectedGoalId, 
  selectedTaskId, 
  onGoalSelect 
}) => {
  return (
    <div className="my-2">
      <GoalSelector 
        onSelectGoal={(goal) => onGoalSelect(goal?.id || null, null)}
        onSelectTask={(goalId, taskId) => onGoalSelect(goalId, taskId)}
        selectedGoalId={selectedGoalId || undefined}
        selectedTaskId={selectedTaskId || undefined}
      />
      {selectedGoalId && selectedTaskId && (
        <div className="mt-2 text-xs text-muted-foreground">
          The selected task will be marked as completed when you save this log.
        </div>
      )}
    </div>
  );
};

export default GoalSelectorSection;

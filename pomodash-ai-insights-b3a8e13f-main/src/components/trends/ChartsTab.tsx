
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart4, PieChart } from 'lucide-react';
import { LogEntryType } from '@/types/logs';
import ActivityBarChart from './ActivityBarChart';
import TimeOfDayChart from './TimeOfDayChart';
import SessionLengthChart from './SessionLengthChart';

interface ChartsTabProps {
  logs: LogEntryType[];
}

const ChartsTab: React.FC<ChartsTabProps> = ({ logs }) => {
  return (
    <div className="p-4 pt-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 bg-secondary/50 border border-border/40">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <BarChart4 className="mr-2 h-5 w-5 text-accent" />
            Average Session Length (minutes)
          </h3>
          <div className="h-64">
            <SessionLengthChart logs={logs} />
          </div>
        </Card>
        
        <Card className="p-4 bg-secondary/50 border border-border/40">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <PieChart className="mr-2 h-5 w-5 text-primary" />
            Time of Day Distribution
          </h3>
          <div className="h-64">
            <TimeOfDayChart logs={logs} />
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-secondary/50 border border-border/40">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <BarChart4 className="mr-2 h-5 w-5 text-primary" />
          Activity by Day of Week
        </h3>
        <div className="h-64">
          <ActivityBarChart logs={logs} />
        </div>
      </Card>
    </div>
  );
};

export default ChartsTab;


import React from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, PieChart, ArrowUpRight } from 'lucide-react';
import { LogEntryType } from '@/types/logs';
import ActivityLineChart from './ActivityLineChart';
import DayDistributionChart from './DayDistributionChart';
import ProductivityStats from './ProductivityStats';

interface TrendsTabProps {
  logs: LogEntryType[];
}

const TrendsTab: React.FC<TrendsTabProps> = ({ logs }) => {
  return (
    <div className="p-4 pt-6 space-y-6">
      <Card className="p-4 bg-secondary/50 border border-border/40">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <LineChart className="mr-2 h-5 w-5 text-primary" />
          Last 7 Days Activity Trend
        </h3>
        <div className="h-72">
          <ActivityLineChart logs={logs} />
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>This chart shows your daily focus activity over the last 7 days. Track your consistency day by day.</p>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-secondary/50 border border-border/40">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <PieChart className="mr-2 h-5 w-5 text-primary" />
            Session Day Distribution
          </h3>
          <DayDistributionChart logs={logs} />
        </Card>
        
        <Card className="p-4 bg-secondary/50 border border-border/40">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <ArrowUpRight className="mr-2 h-5 w-5 text-accent" />
            Productivity Stats
          </h3>
          <ProductivityStats logs={logs} />
        </Card>
      </div>
    </div>
  );
};

export default TrendsTab;

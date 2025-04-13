
import React from 'react';
import { Button } from "@/components/ui/button";
import { BarChart3 } from 'lucide-react';

const EmptyTrendsState: React.FC = () => {
  return (
    <div className="text-center text-muted-foreground py-16 px-4">
      <div className="flex flex-col items-center max-w-md mx-auto">
        <BarChart3 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No activity data yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Complete focus sessions to see productivity trends and AI-powered insights here.
        </p>
        <Button variant="outline" asChild>
          <a href="#">Start a focus session</a>
        </Button>
      </div>
    </div>
  );
};

export default EmptyTrendsState;

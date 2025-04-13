
import React from 'react';
import { LogEntryType } from '@/types/logs';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon,
  Clock 
} from 'lucide-react';

interface ActivityChartProps {
  logs: LogEntryType[];
}

const COLORS = ['#9b87f5', '#F472B6', '#4ECDC4', '#FF9E40', '#FF6B6B', '#A78BFA'];

const ActivityChart: React.FC<ActivityChartProps> = ({ logs }) => {
  // Category data - extract keywords and group activities
  const getCategoryData = () => {
    const categories = new Map<string, number>();
    const keywords = [
      { key: 'meeting', label: 'Meetings' },
      { key: 'code', label: 'Coding' },
      { key: 'research', label: 'Research' },
      { key: 'design', label: 'Design' },
      { key: 'planning', label: 'Planning' },
      { key: 'email', label: 'Emails' },
      { key: 'call', label: 'Calls' },
      { key: 'break', label: 'Breaks' },
      { key: 'read', label: 'Reading' },
      { key: 'write', label: 'Writing' },
    ];

    logs.forEach(log => {
      const content = log.content.toLowerCase();
      let categorized = false;
      
      for (const { key, label } of keywords) {
        if (content.includes(key)) {
          categories.set(label, (categories.get(label) || 0) + log.duration);
          categorized = true;
          break;
        }
      }
      
      if (!categorized) {
        categories.set('Other', (categories.get('Other') || 0) + log.duration);
      }
    });
    
    return Array.from(categories.entries()).map(([name, duration]) => ({
      name,
      minutes: Math.round(duration / 60)
    })).sort((a, b) => b.minutes - a.minutes);
  };

  // Time of day data
  const getTimeOfDayData = () => {
    const timeGroups = [
      { name: 'Morning (5-12)', minutes: 0 },
      { name: 'Afternoon (12-17)', minutes: 0 },
      { name: 'Evening (17-21)', minutes: 0 },
      { name: 'Night (21-5)', minutes: 0 }
    ];

    logs.forEach(log => {
      const date = new Date(log.startTime);
      const hour = date.getHours();
      const duration = log.duration / 60; // Convert to minutes

      if (hour >= 5 && hour < 12) {
        timeGroups[0].minutes += duration;
      } else if (hour >= 12 && hour < 17) {
        timeGroups[1].minutes += duration;
      } else if (hour >= 17 && hour < 21) {
        timeGroups[2].minutes += duration;
      } else {
        timeGroups[3].minutes += duration;
      }
    });

    return timeGroups.map(group => ({
      ...group,
      minutes: Math.round(group.minutes)
    }));
  };

  const categoryData = getCategoryData();
  const timeOfDayData = getTimeOfDayData();

  return (
    <Card className="rounded-lg overflow-hidden border-[4px] border-[#0f172a] shadow-[0_8px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] hover:translate-y-[-3px] transition-all duration-300 bg-[#151e2d]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center font-extrabold">
            <Clock className="h-6 w-6 mr-2 text-[#33C3F0]" />
            <span className="text-[#33C3F0] drop-shadow-md">Where Your Time Goes</span>
          </CardTitle>
          <Badge variant="outline" className="rounded-lg bg-[#1e293b]/50 border-[3px] border-[#33C3F0]/30 text-[#33C3F0] font-extrabold">
            Time Analysis
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 rounded-lg border-[3px] border-[#0f172a] bg-[#1e293b]/30 p-1">
            <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white data-[state=active]:font-extrabold data-[state=active]:border-[3px] data-[state=active]:border-[#0f172a] data-[state=active]:shadow-[0_3px_0_rgba(15,23,42,0.7)]">
              <PieChartIcon className="h-5 w-5 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="timeOfDay" className="rounded-lg data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white data-[state=active]:font-extrabold data-[state=active]:border-[3px] data-[state=active]:border-[#0f172a] data-[state=active]:shadow-[0_3px_0_rgba(15,23,42,0.7)]">
              <BarChartIcon className="h-5 w-5 mr-2" />
              Time of Day
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <div className="h-64 w-full">
              {categoryData.length > 0 ? (
                <ChartContainer config={{}} className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="minutes"
                        nameKey="name"
                        label={({ name, percent }) => 
                          percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                        }
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0f172a" strokeWidth={3} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white font-extrabold">
                  No activity data available
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="timeOfDay">
            <div className="h-64 w-full">
              {timeOfDayData.some(item => item.minutes > 0) ? (
                <ChartContainer config={{}} className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeOfDayData}>
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="minutes" name="Minutes Spent" radius={[2, 2, 0, 0]} stroke="#0f172a" strokeWidth={3}>
                        {timeOfDayData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white font-extrabold">
                  No activity data available
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;

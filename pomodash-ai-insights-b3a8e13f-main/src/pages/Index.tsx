
import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import Sidebar, { TabType } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Sparkles, Check } from 'lucide-react';
import TimerModal from '@/components/TimerModal';
import TaskPanel from '@/components/TaskPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const Index = () => {
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  
  const renderActivePanel = () => {
    switch (activeTab) {
      case 'tasks':
        return <TaskPanel />;
      case 'timer':
      case 'logs':
      case 'trends':
        return <Dashboard activeTab={activeTab} />;
      default:
        return <TaskPanel />;
    }
  };
  
  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        onChange={(tab) => setActiveTab(tab)} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 overflow-auto py-4 px-4">
          {renderActivePanel()}
        </main>
      </div>
      
      <TimerModal
        isOpen={showTimerModal}
        onClose={() => setShowTimerModal(false)}
        onSessionComplete={() => {}}
      />
    </div>
  );
};

export default Index;

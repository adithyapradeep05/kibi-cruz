
import React from 'react';
import LatestReflection from '../reflections/LatestReflection';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReflectionsList from '../reflections/ReflectionsList';

const ReflectionWidget: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <LatestReflection />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Weekly Reflections</DialogTitle>
        </DialogHeader>
        <ReflectionsList />
      </DialogContent>
    </Dialog>
  );
};

export default ReflectionWidget;

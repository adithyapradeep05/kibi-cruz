
import React from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { Button } from '@/components/ui/button';
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle 
} from '@/components/ui/drawer';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

const TutorialDrawer: React.FC = () => {
  const { 
    isTutorialOpen, 
    toggleTutorial, 
    currentStep, 
    totalSteps, 
    nextStep, 
    prevStep,
    tutorialStep 
  } = useTutorial();

  if (!tutorialStep) return null;

  return (
    <Drawer open={isTutorialOpen} onOpenChange={toggleTutorial}>
      <DrawerContent className="max-h-[40vh] border-t-4 border-kiwi-medium">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="text-center pt-4 pb-2">
            <DrawerTitle className="text-xl font-bold text-kiwi-medium flex items-center justify-center font-bubblegum">
              <Sparkles className="mr-2 h-5 w-5 text-kiwi-medium animate-pulse-subtle" />
              {tutorialStep.title}
            </DrawerTitle>
            <DrawerDescription className="text-base font-normal">
              step {currentStep} of {totalSteps}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-6 pb-0">
            <div className="prose prose-sm dark:prose-invert">
              <p className="text-lg text-white/90">{tutorialStep.content}</p>
            </div>
          </div>
          
          {/* Progress dots */}
          <div className="flex justify-center items-center space-x-2 py-3">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentStep === index + 1
                    ? 'bg-kiwi-medium animate-pulse-subtle'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <DrawerFooter className="flex items-center justify-between pt-0 pb-4">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex-1 text-white border-kiwi-medium/50 hover:bg-kiwi-medium/10"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              previous
            </Button>
            
            <Button 
              variant="default" 
              onClick={nextStep}
              className="flex-1 ml-4 bg-kiwi-medium hover:bg-kiwi-light text-white"
            >
              {currentStep === totalSteps ? (
                <>
                  finish
                  <X className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TutorialDrawer;

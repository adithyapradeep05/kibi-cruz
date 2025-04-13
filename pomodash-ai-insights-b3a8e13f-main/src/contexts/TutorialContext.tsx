
import React, { createContext, useContext, useState, useEffect } from 'react';

type TutorialStep = {
  id: number;
  title: string;
  content: string;
  target?: string; // CSS selector for the element to highlight
};

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "welcome to kibi",
    content: "kibi helps you build focus muscle and track your productivity. this quick tour will show you how to use the app."
  },
  {
    id: 2,
    title: "start a focus session",
    content: "click this button to start a new focus session. you can set your desired focus time and take breaks as needed.",
    target: "[data-tutorial='new-session']"
  },
  {
    id: 3,
    title: "focus timer dashboard",
    content: "this is your focus timer dashboard. it shows your current progress and lets you manage active sessions.",
    target: ".focus-timer-card"
  },
  {
    id: 4,
    title: "track your progress",
    content: "view your past focus sessions in the calendar. click on any day to see details about your completed work.",
    target: ".calendar-card"
  },
  {
    id: 5,
    title: "set goals & tasks",
    content: "manage your goals and tasks here. create new goals and mark tasks as complete as you achieve them.",
    target: "[data-tutorial='goals-section']"
  },
  {
    id: 6,
    title: "productivity insights",
    content: "kibi analyzes your focus patterns and provides helpful insights to boost your productivity.",
    target: "[data-tutorial='insights-section']"
  },
  {
    id: 7,
    title: "ready to go!",
    content: "you're all set to start building your focus muscle with kibi. click 'finish' to begin your productivity journey!"
  }
];

type TutorialContextType = {
  isTutorialOpen: boolean;
  toggleTutorial: () => void;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  tutorialStep: TutorialStep | null;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const toggleTutorial = () => {
    setIsTutorialOpen(!isTutorialOpen);
    // Reset to first step when opening
    if (!isTutorialOpen) {
      setCurrentStep(1);
    } else {
      // Remove all highlights when closing
      document.querySelectorAll('.tutorial-highlight').forEach(el => 
        el.classList.remove('tutorial-highlight')
      );
    }
  };
  
  const nextStep = () => {
    if (currentStep < tutorialSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Close tutorial when reaching the end
      setIsTutorialOpen(false);
      // Remove all highlights
      document.querySelectorAll('.tutorial-highlight').forEach(el => 
        el.classList.remove('tutorial-highlight')
      );
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= tutorialSteps.length) {
      setCurrentStep(step);
    }
  };
  
  const tutorialStep = tutorialSteps.find(step => step.id === currentStep) || null;
  
  // Effect to handle highlighting target elements
  useEffect(() => {
    // First, remove any existing highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => 
      el.classList.remove('tutorial-highlight')
    );
    
    if (isTutorialOpen && tutorialStep?.target) {
      const targetElement = document.querySelector(tutorialStep.target);
      
      if (targetElement) {
        // Add highlight class to target element
        targetElement.classList.add('tutorial-highlight');
        
        // Scroll element into view if needed, with a slight delay to ensure proper positioning
        setTimeout(() => {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }, 300);
      }
    }
  }, [isTutorialOpen, tutorialStep]);
  
  const value = {
    isTutorialOpen,
    toggleTutorial,
    currentStep,
    totalSteps: tutorialSteps.length,
    nextStep,
    prevStep,
    goToStep,
    tutorialStep,
  };
  
  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = (): TutorialContextType => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

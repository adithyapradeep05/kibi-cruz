
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-app-bg" />
      
      {/* Subtle glow elements */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-green/10 -top-96 -right-96 blur-3xl" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-teal/10 bottom-0 left-1/4 blur-3xl" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-lime/10 bottom-20 right-20 blur-3xl" />
      
      {/* Animated subtle dots */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute h-1 w-1 rounded-full bg-white/20 top-[10%] left-[15%] animate-pulse" />
        <div className="absolute h-1 w-1 rounded-full bg-white/20 top-[35%] left-[80%] animate-pulse animation-delay-2000" />
        <div className="absolute h-1 w-1 rounded-full bg-white/20 top-[65%] left-[30%] animate-pulse animation-delay-4000" />
        <div className="absolute h-1 w-1 rounded-full bg-white/20 top-[85%] left-[70%] animate-pulse animation-delay-6000" />
        <div className="absolute h-1 w-1 rounded-full bg-white/20 top-[20%] left-[40%] animate-pulse animation-delay-3000" />
        <div className="absolute h-1 w-1 rounded-full bg-white/20 top-[75%] left-[20%] animate-pulse animation-delay-5000" />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-app-bg/80" />
    </div>
  );
};

export default AnimatedBackground;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, ArrowRight, Clock, BarChart2, Calendar, Zap, Award, Users, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Landing = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/auth');
  };
  
  return (
    <div className="min-h-screen bg-[#0b1223] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-[#0f4a49] p-2 rounded-md">
            <Check className="w-6 h-6 text-[#10b981]" />
          </div>
          <span className="text-4xl font-bubblegum text-[#10b981]">Kibi</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-10">
          <a href="#features" className="text-[#10b981] hover:text-[#34d399] transition-colors">Features</a>
          <a href="#how-it-works" className="text-[#10b981] hover:text-[#34d399] transition-colors">How It Works</a>
          <a href="#pricing" className="text-[#10b981] hover:text-[#34d399] transition-colors">Pricing</a>
          <a href="#faq" className="text-[#10b981] hover:text-[#34d399] transition-colors">FAQ</a>
        </div>
        
        <Button 
          onClick={handleGetStarted}
          className="bg-[#10b981] hover:bg-[#0d9668] text-white rounded-xl px-6 py-3 font-bold"
        >
          Get Started
        </Button>
      </nav>
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            The Gym for <br />
            <span className="text-[#10b981] font-bubblegum">Productivity</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-lg">
            Train your focus, build productivity muscle, and achieve more with our gamified focus timer.
          </p>
          
          <div className="flex flex-wrap gap-6 mb-10">
            <div className="flex items-center gap-2">
              <div className="text-[#10b981]">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-white">Build focus strength</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[#10b981]">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-white">Mental endurance</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-[#151e2d] border-[#0f172a] focus-visible:ring-[#10b981] text-white" 
            />
            <Button 
              onClick={handleGetStarted}
              className="bg-[#10b981] hover:bg-[#0d9668] text-white px-8 py-6 flex items-center justify-center"
            >
              Start Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="relative bg-[#10b981]/10 rounded-3xl p-8 border-4 border-[#10b981]/20">
            <div className="absolute top-[-20px] right-[-20px] bg-[#10b981]/20 rounded-xl p-2">
              <Zap className="w-6 h-6 text-[#10b981]" />
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex justify-center mb-2">
                <img src="/lovable-uploads/fa5814d2-a0fb-4ecd-8025-86734911d5b9.png" alt="Timer" className="w-full max-w-md" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-[#151e2d] rounded-xl p-3">
                <p className="text-[#10b981] text-xs">Focus Time</p>
                <p className="text-white font-bold text-xl">25:00</p>
              </div>
              <div className="bg-[#151e2d] rounded-xl p-3">
                <p className="text-[#10b981] text-xs">Sessions</p>
                <p className="text-white font-bold text-xl">3/4</p>
              </div>
              <div className="bg-[#151e2d] rounded-xl p-3">
                <p className="text-[#10b981] text-xs">Streak</p>
                <p className="text-white font-bold text-xl">5 days</p>
              </div>
            </div>
            
            <div className="absolute bottom-[-20px] left-[calc(50%-20px)] bg-[#10b981]/20 rounded-xl p-2">
              <Zap className="w-6 h-6 text-[#10b981]" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-[#0a1120] py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-[#10b981] text-4xl font-bold mb-1">10k+</p>
            <p className="text-gray-400">Users</p>
          </div>
          <div>
            <p className="text-[#10b981] text-4xl font-bold mb-1">1.2M+</p>
            <p className="text-gray-400">Sessions</p>
          </div>
          <div>
            <p className="text-[#10b981] text-4xl font-bold mb-1">98%</p>
            <p className="text-gray-400">Productivity</p>
          </div>
          <div>
            <p className="text-[#10b981] text-4xl font-bold mb-1">4.9/5</p>
            <p className="text-gray-400">Rating</p>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#0a1120] rounded-2xl p-8 border-2 border-[#10b981]/20 transform transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#10b981]/10">
              <div className="bg-[#10b981]/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Focus Timer</h3>
              <p className="text-gray-400">Customizable Pomodoro-style timer for maximum efficiency.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-[#0a1120] rounded-2xl p-8 border-2 border-[#10b981]/20 transform transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#10b981]/10">
              <div className="bg-[#10b981]/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <BarChart2 className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
              <p className="text-gray-400">Monitor your productivity stats and see improvement over time.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-[#0a1120] rounded-2xl p-8 border-2 border-[#10b981]/20 transform transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#10b981]/10">
              <div className="bg-[#10b981]/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Streak Calendar</h3>
              <p className="text-gray-400">Build consistent productivity with visual streak tracking.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-[#0a1120] rounded-2xl p-8 border-2 border-[#10b981]/20 transform transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#10b981]/10">
              <div className="bg-[#10b981]/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Energy Management</h3>
              <p className="text-gray-400">Balance intense focus with proper rest periods.</p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-[#0a1120] rounded-2xl p-8 border-2 border-[#10b981]/20 transform transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#10b981]/10">
              <div className="bg-[#10b981]/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Achievements</h3>
              <p className="text-gray-400">Earn badges as you hit productivity milestones.</p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-[#0a1120] rounded-2xl p-8 border-2 border-[#10b981]/20 transform transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#10b981]/10">
              <div className="bg-[#10b981]/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-gray-400">Join challenges with others to stay motivated.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#0a1120]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#10b981]/30 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="bg-[#0b1223] rounded-full p-2 z-10">
                  <div className="bg-[#10b981] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">1</div>
                </div>
                <div className="bg-[#c8ffdc]/10 w-32 h-32 rounded-full flex items-center justify-center mb-6">
                  <img src="/lovable-uploads/32aab698-49e2-4043-9e1a-e393aa73c9fa.png" alt="Set Goals" className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold mb-2">Set Goals</h3>
                <p className="text-gray-400">Define your daily focus targets.</p>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="bg-[#0b1223] rounded-full p-2 z-10">
                  <div className="bg-[#10b981] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">2</div>
                </div>
                <div className="bg-[#ffefd6]/10 w-32 h-32 rounded-full flex items-center justify-center mb-6">
                  <img src="/lovable-uploads/5a503a34-f86d-4337-a0be-a2661e64a838.png" alt="Train Focus" className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold mb-2">Train Focus</h3>
                <p className="text-gray-400">Complete focused work sessions.</p>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="bg-[#0b1223] rounded-full p-2 z-10">
                  <div className="bg-[#10b981] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">3</div>
                </div>
                <div className="bg-[#ffd6d6]/10 w-32 h-32 rounded-full flex items-center justify-center mb-6">
                  <img src="/lovable-uploads/4888ca05-b6e8-4617-9c75-0cc2908bf53d.png" alt="Track Progress" className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                <p className="text-gray-400">Monitor your productivity growth.</p>
              </div>
              
              {/* Step 4 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="bg-[#0b1223] rounded-full p-2 z-10">
                  <div className="bg-[#10b981] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">4</div>
                </div>
                <div className="bg-[#d6eaff]/10 w-32 h-32 rounded-full flex items-center justify-center mb-6">
                  <img src="/lovable-uploads/3216325b-faed-4e1d-bb10-a97c24852f5f.png" alt="Level Up" className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold mb-2">Level Up</h3>
                <p className="text-gray-400">Earn achievements as you improve.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-[#0a1120] rounded-2xl p-8 border-2 border-[#10b981]/20">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="mb-8">
                <span className="text-4xl font-bold text-[#10b981]">Free</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Basic focus timer</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Daily goals</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Limited tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>3 templates</span>
                </li>
              </ul>
              
              <Button 
                onClick={handleGetStarted}
                className="w-full bg-[#151e2d] hover:bg-[#1c2739] text-white py-3"
              >
                Get Started
              </Button>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-[#0a1120] rounded-2xl p-8 border-2 border-[#10b981] relative transform transition-all scale-105 shadow-xl shadow-[#10b981]/20">
              <div className="absolute top-0 right-0 bg-[#10b981] text-white text-xs font-bold px-4 py-1 rounded-tr-xl rounded-bl-xl">
                Popular
              </div>
              
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="mb-8">
                <span className="text-4xl font-bold text-[#10b981]">$9.99</span>
                <span className="text-gray-400 ml-1">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Advanced timer</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Unlimited tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>All templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Button 
                onClick={handleGetStarted}
                className="w-full bg-[#10b981] hover:bg-[#0d9668] text-white py-3"
              >
                Start 7-Day Trial
              </Button>
            </div>
            
            {/* Team Plan */}
            <div className="bg-[#0a1120] rounded-2xl p-8 border-2 border-[#10b981]/20">
              <h3 className="text-xl font-bold mb-2">Team</h3>
              <div className="mb-8">
                <span className="text-4xl font-bold text-[#10b981]">$19.99</span>
                <span className="text-gray-400 ml-1">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Team dashboards</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Group challenges</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Admin controls</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#10b981] mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>API access</span>
                </li>
              </ul>
              
              <Button 
                onClick={handleGetStarted}
                className="w-full bg-[#151e2d] hover:bg-[#1c2739] text-white py-3"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#0a1120]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">FAQ</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border-[#10b981]/20 bg-[#0b1223] rounded-2xl overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="text-left font-semibold">What is the science behind Kibi's productivity method?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-400">
                Kibi combines proven focus techniques like Pomodoro with gamification elements to build mental endurance, similar to how physical training builds muscle. Our method creates a consistent rhythm of focused work and strategic breaks to optimize your brain's natural attention cycles.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-[#10b981]/20 bg-[#0b1223] rounded-2xl overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="text-left font-semibold">How is Kibi different from other focus timers?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-400">
                Unlike basic timers, Kibi provides a complete productivity ecosystem with goal setting, progress tracking, and achievement systems. We've created a motivating experience that builds long-term focus habits through visualization, accountability, and instant feedback.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border-[#10b981]/20 bg-[#0b1223] rounded-2xl overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="text-left font-semibold">Can I use Kibi for my team?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-400">
                Absolutely! Our Team plan includes collaborative features like shared dashboards, group challenges, and admin controls to help your entire team boost productivity together. Many teams report improved focus and better work-life balance after implementing Kibi.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border-[#10b981]/20 bg-[#0b1223] rounded-2xl overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="text-left font-semibold">How do I get started?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-400">
                Getting started is easy! Just sign up for our free plan, set up your first focus goal, and begin your first timed session. Our onboarding tutorial will guide you through the features, and you can upgrade to Pro or Team plans anytime as your needs grow.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#080f1b] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="bg-[#0f4a49] p-1.5 rounded-md">
                <Check className="w-5 h-5 text-[#10b981]" />
              </div>
              <span className="text-2xl font-bubblegum text-[#10b981]">Kibi</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <a href="#features" className="hover:text-[#10b981] transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-[#10b981] transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-[#10b981] transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-[#10b981] transition-colors">FAQ</a>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Kibi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

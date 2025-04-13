
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import StreakDisplay from '@/components/StreakDisplay';
import { Check, LogIn, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type FormData = z.infer<typeof formSchema>;

const Auth = () => {
  const { user, isLoading, signInWithEmail, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Redirect to dashboard if user is already logged in
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsSigningIn(true);
      await signInWithEmail(data.email, data.password);
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to authenticate",
        variant: "destructive"
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b1223]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-[#10b981]/10 rounded-xl filter blur-3xl animate-blob"></div>
        <div className="absolute top-2/3 right-1/4 w-1/4 h-1/4 bg-blue-500/10 rounded-xl filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1/3 h-1/3 bg-purple-500/10 rounded-xl filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="absolute top-6 left-6">
        <Link to="/landing" className="flex items-center text-[#10b981] hover:text-[#34d399] transition-colors">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
      
      <Card className="w-full max-w-md mx-4 bg-[#151e2d] border-[4px] border-[#0f172a] rounded-xl shadow-[0_10px_0_rgba(15,23,42,0.7)] overflow-hidden transform hover:translate-y-[-5px] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] transition-all duration-300">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-[#0f4a49] rounded-xl flex items-center justify-center border-[4px] border-[#0f172a] shadow-[0_8px_0_rgba(15,23,42,0.7)] overflow-hidden">
              <img 
                src="/lovable-uploads/7453fc0a-8b85-49b0-a816-ac4f60cf10a1.png"
                alt="Kibi Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bubblegum text-[#10b981] mb-2 font-extrabold drop-shadow-md">
            Welcome to Kibi
          </CardTitle>
          <p className="text-white/70 text-sm font-bold">
            The Gym for Your Productivity
          </p>
          <div className="mt-3 flex justify-center">
            <StreakDisplay compact showLabel={false} className="justify-center" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 font-extrabold">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        {...field}
                        autoComplete="email"
                        className="bg-[#151e2d] border-[4px] border-[#0f172a] focus:border-[#10b981] transition-all text-white rounded-lg py-6 px-4 shadow-[inset_0_3px_5px_rgba(0,0,0,0.4)] font-bold"
                      />
                    </FormControl>
                    <FormMessage className="text-status-red font-bold" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 font-extrabold">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field}
                        autoComplete="current-password"
                        className="bg-[#151e2d] border-[4px] border-[#0f172a] focus:border-[#10b981] transition-all text-white rounded-lg py-6 px-4 shadow-[inset_0_3px_5px_rgba(0,0,0,0.4)] font-bold"
                      />
                    </FormControl>
                    <FormMessage className="text-status-red font-bold" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full mt-6 bg-[#10b981] text-white hover:bg-[#10b981]/90 rounded-lg border-[4px] border-[#0f172a] shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)] active:translate-y-3 transition-all font-extrabold text-lg py-7"
                disabled={isSigningIn || isLoading}
              >
                {isSigningIn ? "Signing in..." : "Start Your Productivity Journey"}
              </Button>
            </form>
          </Form>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-4 border-[#0f172a]"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#151e2d] px-2 text-white/60 font-bold">Or continue with</span>
            </div>
          </div>
          
          <Button 
            type="button"
            onClick={signInWithGoogle}
            className="w-full bg-white text-gray-800 hover:bg-gray-100 rounded-lg border-[4px] border-[#0f172a] shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)] active:translate-y-3 transition-all font-extrabold py-7"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 mr-2" />
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-white/50 pb-6 font-bold">
          Secure authentication powered by Supabase
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;

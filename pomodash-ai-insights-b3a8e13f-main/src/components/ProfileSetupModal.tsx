
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

const profileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onClose }) => {
  const { user, profile, updateProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(profile?.avatar_url);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      
      // Here you would typically upload the file to Supabase storage
      // For now, we'll use a fake URL to simulate the avatar
      const fakeAvatarUrl = URL.createObjectURL(file);
      setAvatarUrl(fakeAvatarUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description: error.message || "There was an error uploading your avatar",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      await updateProfile({
        ...data,
        avatar_url: avatarUrl,
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "There was an error updating your profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Complete Your Profile</DialogTitle>
          <DialogDescription>
            Tell us a bit about yourself and personalize your experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-24 w-24 cursor-pointer hover:opacity-90 transition-opacity" onClick={triggerFileInput}>
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Profile" />
            ) : (
              <AvatarFallback className="text-xl">
                {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            )}
          </Avatar>
          
          <Button 
            variant="outline" 
            type="button" 
            onClick={triggerFileInput}
            disabled={isUploading}
            className="flex gap-2"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {isUploading ? "Uploading..." : "Upload Photo"}
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full">Save Profile</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetupModal;

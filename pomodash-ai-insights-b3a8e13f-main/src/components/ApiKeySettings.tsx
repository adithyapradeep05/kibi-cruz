
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Key, CheckCircle2 } from 'lucide-react';
import { hasApiKey } from '@/utils/apiKeyStorage';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            OpenAI API Key Settings
          </DialogTitle>
          <DialogDescription>
            AI features are powered by OpenAI and ready to use.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-primary/10 p-3 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="text-primary h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">API Key Configured</p>
              <p className="text-xs text-muted-foreground">
                The OpenAI API key is stored securely in Supabase Edge Function secrets.
                All AI features are ready to use without requiring your personal API key.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySettings;

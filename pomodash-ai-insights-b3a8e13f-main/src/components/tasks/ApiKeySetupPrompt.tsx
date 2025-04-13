
import React from 'react';

// This component is now a no-op since API keys are managed server-side
const ApiKeySetupPrompt: React.FC<{ onSetupClick: () => void }> = () => {
  // API keys are now stored in Supabase Edge Function secrets
  // No need to prompt users to set up API keys
  return null;
};

export default ApiKeySetupPrompt;

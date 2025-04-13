
// API Key Management for OpenAI
// All API keys are now stored in Supabase Edge Function secrets

export const getStoredApiKey = (): string => {
  // This function is maintained for backward compatibility
  // In the new implementation, API key is stored in Supabase secrets
  return 'API_KEY_STORED_IN_SUPABASE_SECRETS';
};

export const setApiKey = (key: string): void => {
  // This function is maintained for backward compatibility
  // API keys are now managed server-side in Supabase secrets
  console.warn('API keys are now stored in Supabase Edge Function secrets. This function is deprecated.');
};

// Alias for setApiKey for backward compatibility
export const storeApiKey = setApiKey;

export const clearApiKey = (): void => {
  // This function is maintained for backward compatibility
  // API keys are now managed server-side in Supabase secrets
  console.warn('API keys are now stored in Supabase Edge Function secrets. This function is deprecated.');
};

export const hasApiKey = (): boolean => {
  // Always return true since we're using the server-side stored key
  return true;
};

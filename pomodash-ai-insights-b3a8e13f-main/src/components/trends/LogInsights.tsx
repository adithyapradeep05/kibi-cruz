
import React from 'react';

interface LogInsightsProps {
  content: string;
}

const LogInsights: React.FC<LogInsightsProps> = ({ content }) => {
  // Enhanced markdown parser for better content formatting
  const formatText = (text: string) => {
    return text
      // Convert headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mt-4 mb-2 text-foreground">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-5 mb-2 text-foreground">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3 text-foreground">$1</h1>')
      
      // Convert bold and italic with improved styling
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="text-foreground/90 italic">$1</em>')
      
      // Convert lists with better spacing and styled bullets
      .replace(/^\s*\n\-\s(.*)/gim, '<ul class="pl-1 my-2"><li class="flex items-start mb-1.5"><span class="inline-block w-1.5 h-1.5 rounded-full bg-primary/80 mt-1.5 mr-2"></span><span>$1</span></li></ul>')
      .replace(/^\s*\n\d\.\s(.*)/gim, '<ol class="pl-5 list-decimal my-2"><li class="mb-1.5">$1</li></ol>')
      
      // Convert links with proper styling
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">$1</a>')
      
      // Convert paragraphs with proper spacing
      .replace(/^\s*(\n)?(.+)/gim, function(m) {
        return /\<(\/)?(h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote|pre|img|a|strong|em)/.test(m) ? m : '<p class="my-2 text-foreground/90">$2</p>';
      })
      
      // Fix for multiple ul/ol tags
      .replace(/<\/ul>\s?<ul>/gim, '')
      .replace(/<\/ol>\s?<ol>/gim, '')
      
      // Convert blockquotes with styled format
      .replace(/^\>\s(.*$)/gim, '<blockquote class="border-l-4 border-primary/50 pl-4 py-1 my-4 bg-primary/10 rounded-r-md italic text-foreground/90">$1</blockquote>')
      
      // Convert tables (simple version)
      .replace(/\|(.+)\|(.+)\|/g, '<div class="grid grid-cols-2 gap-2 my-2 p-2 bg-secondary/30 rounded-md"><div class="font-medium">$1</div><div>$2</div></div>')
      
      // Convert emojis to larger size
      .replace(/(\p{Emoji})/gu, '<span class="text-lg inline-block transform -translate-y-0.5">$1</span>');
  };

  return (
    <div
      className="markdown-content text-foreground/95"
      dangerouslySetInnerHTML={{ __html: formatText(content) }}
    />
  );
};

export default LogInsights;

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useSaintBroker } from '@/context/SaintBrokerContext';
import { cn } from '@/lib/utils';

interface SaintBrokerButtonProps {
  className?: string;
  variant?: 'floating' | 'inline' | 'compact';
  label?: string;
}

export default function SaintBrokerButton({
  className,
  variant = 'floating',
  label = "Chat with SaintBroker AI"
}: SaintBrokerButtonProps) {
  const { openChat } = useSaintBroker();

  if (variant === 'floating') {
    return (
      <button
        onClick={openChat}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-110 z-30',
          className
        )}
        title={label}
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <Button
        onClick={openChat}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {label}
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        onClick={openChat}
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <MessageCircle className="w-4 h-4 mr-1" />
        Chat
      </Button>
    );
  }

  return null;
}

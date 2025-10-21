import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SaintBrokerContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  initialMessage?: string;
  setInitialMessage: (message: string) => void;
}

const SaintBrokerContext = createContext<SaintBrokerContextType | undefined>(undefined);

export function SaintBrokerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string>();

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen(!isOpen);

  const handleSetInitialMessage = (message: string) => {
    setInitialMessage(message);
    setIsOpen(true);
  };

  return (
    <SaintBrokerContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        initialMessage,
        setInitialMessage: handleSetInitialMessage,
      }}
    >
      {children}
    </SaintBrokerContext.Provider>
  );
}

export function useSaintBroker() {
  const context = useContext(SaintBrokerContext);
  if (!context) {
    throw new Error('useSaintBroker must be used within SaintBrokerProvider');
  }
  return context;
}

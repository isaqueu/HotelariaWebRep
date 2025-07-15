import { createContext, useContext, ReactNode } from 'react';

interface MockContextType {
  useMock: boolean;
}

const MockContext = createContext<MockContextType | undefined>(undefined);

interface MockProviderProps {
  children: ReactNode;
}

export function MockProvider({ children }: MockProviderProps) {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true' || false;

  return (
    <MockContext.Provider value={{ useMock }}>
      {children}
    </MockContext.Provider>
  );
}

export function useMock() {
  const context = useContext(MockContext);
  if (context === undefined) {
    throw new Error('useMock must be used within a MockProvider');
  }
  return context;
}

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isNavigationOpen: boolean;
  toggleNavigation: () => void;
  setNavigationOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(true);

  const toggleNavigation = () => {
    setIsNavigationOpen(!isNavigationOpen);
  };

  const setNavigationOpen = (open: boolean) => {
    setIsNavigationOpen(open);
  };

  return (
    <NavigationContext.Provider value={{ isNavigationOpen, toggleNavigation, setNavigationOpen }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

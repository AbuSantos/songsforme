import { useEffect, useState } from "react";

export const usePersistentState = (key: string, initialValue: any) => {
  const [state, setState] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsHydrated(true);
    const storedValue = window.localStorage.getItem(key);
    if (storedValue !== null) {
      try {
        setState(JSON.parse(storedValue));
      } catch (error) {
        console.warn(`Could not parse localStorage value for key "${key}":`, error);
      }
    }
  }, [key]);

  // Set up storage event listener after hydration
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setState(JSON.parse(event.newValue));
        } catch (error) {
          console.warn(`Could not parse storage event value for key "${key}":`, error);
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, isHydrated]);

  // Save to localStorage when state changes (only after hydration)
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state, isHydrated]);

  return [state, setState];
};

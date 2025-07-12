import { useEffect, useState } from "react";

export const usePersistentState = (key: string, initialValue: any) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [state, setState] = useState(() => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsHydrated(true);
    const storedValue = window.localStorage.getItem(key);

    if (storedValue !== null) {
      try {
        setState(JSON.parse(storedValue));
      } catch (error) {
        console.warn(
          `Could not parse localStorage value for key "${key}":`,
          error
        );
      }
    }
  }, [key]);

  useEffect(() => {
    // @ts-ignore
    const handleStorageChange = (event) => {
      if (!isHydrated || typeof window === "undefined") return;
      if (event.key === key && event.newValue !== null) {
        setState(JSON.parse(event.newValue));
        try {
          setState(JSON.parse(event.newValue));
        } catch (error) {
          console.warn(
            `Could not parse storage event value for key "${key}":`,
            error
          );
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState, isHydrated];
};

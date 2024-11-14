import { useEffect, useState } from "react";

// @ts-ignore
export const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    // @ts-ignore
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        setState(JSON.parse(event.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

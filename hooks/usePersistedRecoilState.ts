import { useEffect, useState } from "react";
import { RecoilState, useRecoilState } from "recoil";

export const usePersistedRecoilState = <T>(
  atom: RecoilState<T>,
  key: string
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useRecoilState(atom);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsHydrated(true);
    const storedValue = localStorage.getItem(key);

    if (storedValue !== null) {
      try {
        // Parse the stored value and set it if it's valid JSON
        setValue(JSON.parse(storedValue) as T);
      } catch (error) {
        console.warn(
          `Could not parse localStorage value for key "${key}":`,
          error
        );
      }
    }
  }, [key, setValue]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;

    if (value !== null && value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }, [key, value, isHydrated]);

  return [value, setValue];
};

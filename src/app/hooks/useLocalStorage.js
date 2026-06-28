"use client";

import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  // 1. Initialize state with a fallback function to prevent breaking Next.js hydration
  const [storedValue, setStoredValue] = useState(() => {
    // Return initial value if running on the server
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Use useEffect to update localStorage whenever the state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

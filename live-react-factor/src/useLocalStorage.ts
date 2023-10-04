import { Dispatch, SetStateAction, useCallback } from "react";
import { useEffect, useState } from "react";

/**
 * A custom hook that has a similar interface to useState but
 * instead of storing the state in memory, it stores it in localStorage,
 * so it can be persisted across browser refreshes
 *
 * @param key the local storage key
 * @param initialValue initial value to load to localStorage
 * @returns localStorage value
 */

// This declares a custom hook named useLocalStorage. It takes two parameters
// 'key': A string representing the key for storing the value in local storage.
// 'initialValue': The initial value to use if there's no value stored in local storage.
export function useLocalStorage<T>(
  key: string,
  initialValue: T

  // The function returns an array containing two elements:
  // 1. The first element is of type T, representing the current value retrieved from local storage
  // 2. The second element is a function of type 'Dispatch<SetStateAction<T>>', which can be used to update the local storage value.
): [T, Dispatch<SetStateAction<T>>] {
  
  // This code initializes a state variable internalValue using the useState hook. It attempts to retrieve a value from local storage using the provided key. If a value exists, it's parsed from JSON; otherwise, it falls back to the initialValue. Any errors during this process are caught and logged to the console.
  const [internalValue, setInternalValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // This code defines a setValue function using the useCallback hook. This function can be used to update the value in local storage. It takes a value parameter, which can be a new value or a function that computes the new value based on the previous value 'internalValue'
  // Inside the function, it first calculates valueToStore, which is either the new value or the result of invoking a function with the previous value (internalValue). Then, it updates the internalValue state and stores the updated value in local storage using the provided key.
  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(internalValue) : value;
        setInternalValue(valueToStore ?? initialValue);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.log(error);
      }
    },
    [key, setInternalValue, internalValue, initialValue]
  );

  // Any time storage changes in another tab, update state
  // This useEffect hook is responsible for handling changes in local storage made by other tabs or windows. It sets up an event listener to listen for changes in the localStorage object.
  // When a storage change event occurs, it attempts to retrieve the latest value associated with the given key from local storage and updates the state using the setValue function if a new value is found.
  // Finally, the effect is cleaned up by removing the event listener when the component unmounts.
  useEffect(() => {
    function handleStorageChange() {
      try {
        const latestValue = localStorage.getItem(key);
        if (latestValue) {
          setValue(JSON.parse(latestValue));
        }
      } catch (err) {
        console.error(err);
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Finally, the useLocalStorage function returns an array containing the current value from local storage 'internalValue' and the setValue function, which can be used to update the local storage value.
  // This custom hook allows you to store and retrieve state in local storage, making it persistent across browser sessions and tabs. It also provides a way to react to changes made in other tabs or windows.
  return [internalValue, setValue];
}

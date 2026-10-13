import { useState, useEffect } from "react";
import { readStorage, writeStorage } from "../utils/storage.js";

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}

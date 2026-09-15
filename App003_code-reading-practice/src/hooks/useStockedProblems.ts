import { useCallback, useEffect, useState } from "react";
import type { Problem } from "../data/problems";

const KEY = "code-reading:stocked-problems";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useStockedProblems() {
  const [stocked, setStocked] = useState<Problem[]>(() => readJson(KEY, []));

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(stocked));
  }, [stocked]);

  const addProblem = useCallback((problem: Problem) => {
    setStocked((prev) => [...prev, problem]);
  }, []);

  return { stocked, addProblem };
}

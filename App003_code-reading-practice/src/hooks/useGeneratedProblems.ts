import { useCallback, useEffect, useState } from "react";
import type { Problem } from "../data/problems";

const KEY = "code-reading:generated-problems";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useGeneratedProblems() {
  const [generated, setGenerated] = useState<Problem[]>(() => readJson(KEY, []));

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(generated));
  }, [generated]);

  const addProblem = useCallback((problem: Problem) => {
    setGenerated((prev) => [...prev, problem]);
  }, []);

  return { generated, addProblem };
}

import { useCallback, useEffect, useState } from "react";

type SolvedAtState = Record<string, number>;

const SOLVED_AT_KEY = "code-reading:solved-at";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useSolvedAt() {
  const [solvedAt, setSolvedAtState] = useState<SolvedAtState>(() =>
    readJson(SOLVED_AT_KEY, {}),
  );

  useEffect(() => {
    localStorage.setItem(SOLVED_AT_KEY, JSON.stringify(solvedAt));
  }, [solvedAt]);

  const markSolved = useCallback((problemId: string) => {
    setSolvedAtState((prev) => ({ ...prev, [problemId]: Date.now() }));
  }, []);

  return { solvedAt, markSolved };
}

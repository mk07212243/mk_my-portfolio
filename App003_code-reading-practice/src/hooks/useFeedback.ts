import { useCallback, useEffect, useState } from "react";
import type { GradeVerdict } from "../lib/aiResponse";

export type SavedFeedback = { verdict: GradeVerdict; feedback: string };

type FeedbackState = Record<string, SavedFeedback>;

const FEEDBACK_KEY = "code-reading:feedback";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useFeedback() {
  const [feedback, setFeedbackState] = useState<FeedbackState>(() =>
    readJson(FEEDBACK_KEY, {}),
  );

  useEffect(() => {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
  }, [feedback]);

  const setFeedback = useCallback((problemId: string, result: SavedFeedback) => {
    setFeedbackState((prev) => ({ ...prev, [problemId]: result }));
  }, []);

  return { feedback, setFeedback };
}

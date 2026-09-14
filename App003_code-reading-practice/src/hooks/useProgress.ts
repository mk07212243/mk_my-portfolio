import { useCallback, useEffect, useState } from "react";

export type Mastery = "understood" | "unsure";

type ProgressState = Record<string, Mastery>;
type Notes = Record<string, string>;

const PROGRESS_KEY = "code-reading:progress";
const NOTES_KEY = "code-reading:notes";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() =>
    readJson(PROGRESS_KEY, {}),
  );
  const [notes, setNotes] = useState<Notes>(() => readJson(NOTES_KEY, {}));

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  const setMastery = useCallback((problemId: string, mastery: Mastery) => {
    setProgress((prev) => ({ ...prev, [problemId]: mastery }));
  }, []);

  const setNote = useCallback((problemId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [problemId]: note }));
  }, []);

  return { progress, notes, setMastery, setNote };
}

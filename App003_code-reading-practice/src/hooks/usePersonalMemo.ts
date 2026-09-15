import { useCallback, useEffect, useState } from "react";

type MemoState = Record<string, string>;

const MEMO_KEY = "code-reading:personal-memo";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function usePersonalMemo() {
  const [memos, setMemos] = useState<MemoState>(() => readJson(MEMO_KEY, {}));

  useEffect(() => {
    localStorage.setItem(MEMO_KEY, JSON.stringify(memos));
  }, [memos]);

  const setMemo = useCallback((problemId: string, text: string) => {
    setMemos((prev) => ({ ...prev, [problemId]: text }));
  }, []);

  return { memos, setMemo };
}

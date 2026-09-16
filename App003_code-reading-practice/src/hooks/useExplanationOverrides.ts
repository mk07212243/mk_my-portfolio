import { useCallback, useEffect, useState } from "react";

type OverrideState = Record<string, string>;

const KEY = "code-reading:explanation-overrides";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// 静的な問題(problems.ts)は解説をソースコードに直書きしているため更新できない。
// AI添削のついでに解説を強化した場合、問題の種類を問わずここに保存し、
// 表示時は「上書きがあればそちらを優先」して読む。
export function useExplanationOverrides() {
  const [overrides, setOverrides] = useState<OverrideState>(() => readJson(KEY, {}));

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(overrides));
  }, [overrides]);

  const setOverride = useCallback((problemId: string, explanation: string) => {
    setOverrides((prev) => ({ ...prev, [problemId]: explanation }));
  }, []);

  return { overrides, setOverride };
}

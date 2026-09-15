import type { Language } from "../data/problems";

export function detectLanguage(code: string): Language {
  let pythonScore = 0;
  let cScore = 0;
  let jsScore = 0;

  if (/^\s*def\s+\w+\s*\(.*\)\s*:/m.test(code)) pythonScore += 3;
  if (/^\s*(import\s+\w+|from\s+\w+\s+import)/m.test(code)) pythonScore += 3;
  if (/^\s*(elif|else)\s*:/m.test(code)) pythonScore += 2;
  if (/\bprint\(/.test(code)) pythonScore += 1;
  if (/^\s*#include\s*<[\w.]+>/m.test(code)) cScore += 4;
  if (/\bint\s+main\s*\(\s*(void)?\s*\)/.test(code)) cScore += 4;
  if (/\bprintf\s*\(/.test(code)) cScore += 2;
  if (/^\s*(struct|typedef)\b/m.test(code)) cScore += 2;
  if (/\bconsole\.log\(/.test(code)) jsScore += 3;
  if (/\b(function|const|let)\s+\w+/.test(code)) jsScore += 2;
  if (/=>\s*{?/.test(code)) jsScore += 2;
  if (/\b(document|window)\./.test(code)) jsScore += 2;

  const scores: [Language, number][] = [
    ["python", pythonScore],
    ["c", cScore],
    ["javascript", jsScore],
  ];
  scores.sort((a, b) => b[1] - a[1]);

  return scores[0][1] > 0 ? scores[0][0] : "python";
}

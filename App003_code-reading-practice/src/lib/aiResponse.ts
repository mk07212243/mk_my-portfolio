import type { Quiz } from "../data/problems";

type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

const PARSE_ERROR =
  "JSONとして読み取れませんでした。文字列の中で二重引用符(\")がそのまま使われている可能性があります。AIに「JSON文字列の値の中では二重引用符を使わず、有効なJSONのみを出力して」と伝えて、もう一度試してみてください。";

// AIの回答が整形されて文字列値の中に生の改行が入っていることがあるため、
// 文字列リテラルの内側にある生の改行・タブなどの制御文字だけをエスケープしてから読み込む。
function escapeRawControlCharsInStrings(text: string): string {
  let result = "";
  let inString = false;
  let escapedNext = false;

  for (const ch of text) {
    if (inString) {
      if (escapedNext) {
        result += ch;
        escapedNext = false;
      } else if (ch === "\\") {
        result += ch;
        escapedNext = true;
      } else if (ch === '"') {
        result += ch;
        inString = false;
      } else if (ch === "\n") {
        result += "\\n";
      } else if (ch === "\r") {
        result += "\\r";
      } else if (ch === "\t") {
        result += "\\t";
      } else {
        result += ch;
      }
    } else {
      if (ch === '"') inString = true;
      result += ch;
    }
  }

  return result;
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fenced ? fenced[1] : text).trim();
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(escapeRawControlCharsInStrings(raw));
  }
}

function isQuiz(value: unknown): value is Quiz {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.question === "string" &&
    Array.isArray(v.choices) &&
    v.choices.length >= 2 &&
    v.choices.every((c) => typeof c === "string") &&
    typeof v.correctIndex === "number" &&
    v.correctIndex >= 0 &&
    v.correctIndex < v.choices.length
  );
}

export function parseGeneratedProblem(
  text: string,
): ParseResult<{ title: string; code: string; explanation: string; quiz?: Quiz }> {
  let data: unknown;
  try {
    data = extractJson(text);
  } catch {
    return { ok: false, error: PARSE_ERROR };
  }

  if (typeof data !== "object" || data === null) {
    return { ok: false, error: PARSE_ERROR };
  }
  const d = data as Record<string, unknown>;
  if (typeof d.title !== "string" || typeof d.code !== "string" || typeof d.explanation !== "string") {
    return { ok: false, error: "title, code, explanation が正しい形式で含まれていません。" };
  }
  if (d.quiz !== undefined && !isQuiz(d.quiz)) {
    return { ok: false, error: "quiz の形式が正しくありません。" };
  }

  return {
    ok: true,
    value: {
      title: d.title,
      code: d.code,
      explanation: d.explanation,
      quiz: d.quiz as Quiz | undefined,
    },
  };
}

export type GradeVerdict = "correct" | "partial" | "incorrect";

export const verdictLabel: Record<GradeVerdict, string> = {
  correct: "正解",
  partial: "おおむね正解",
  incorrect: "要復習",
};

// バッジ・カード共通のスタイル。ボーダー・背景・文字色をまとめて持つ。
export const verdictStyle: Record<GradeVerdict, string> = {
  correct:
    "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  partial:
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  incorrect:
    "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export function parseGradeResult(text: string): ParseResult<{ verdict: GradeVerdict; feedback: string }> {
  let data: unknown;
  try {
    data = extractJson(text);
  } catch {
    return { ok: false, error: PARSE_ERROR };
  }

  if (typeof data !== "object" || data === null) {
    return { ok: false, error: PARSE_ERROR };
  }
  const d = data as Record<string, unknown>;
  if (
    (d.verdict !== "correct" && d.verdict !== "partial" && d.verdict !== "incorrect") ||
    typeof d.feedback !== "string"
  ) {
    return { ok: false, error: "verdict, feedback が正しい形式で含まれていません。" };
  }

  return { ok: true, value: { verdict: d.verdict, feedback: d.feedback } };
}

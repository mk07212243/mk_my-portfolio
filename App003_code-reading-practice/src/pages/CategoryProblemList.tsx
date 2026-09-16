import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { AiCopyPastePanel } from "../components/AiCopyPastePanel";
import type { Category, Language, Problem } from "../data/problems";
import { levelInfo, topicLabels } from "../data/problems";
import { useAllProblems } from "../hooks/useAllProblems";
import type { GradeVerdict } from "../lib/aiResponse";
import { useFeedback } from "../hooks/useFeedback";
import type { Mastery } from "../hooks/useProgress";
import { useProgress } from "../hooks/useProgress";
import { useSolvedAt } from "../hooks/useSolvedAt";
import { buildGenerateProblemPrompt } from "../lib/aiPrompts";
import { parseGeneratedProblem, verdictLabel, verdictStyle } from "../lib/aiResponse";
import { getProblemNumber } from "../lib/problemNumbering";

const languageLabel: Record<Language, string> = {
  python: "Python",
  c: "C言語",
  javascript: "JavaScript",
};

function formatSolvedAt(ts: number): string {
  return new Date(ts).toLocaleString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 状態の優先度。数字が小さいほど「要復習」で、一覧の上に来る。
function severity(mastery: Mastery | undefined, verdict: GradeVerdict | undefined): number {
  if (mastery === "unsure" || verdict === "incorrect") return 0;
  if (verdict === "partial") return 1;
  return 2;
}

export function CategoryProblemList() {
  const { language, level, topicId } = useParams<{
    language: Language;
    level?: string;
    topicId?: string;
  }>();
  const { progress } = useProgress();
  const { feedback } = useFeedback();
  const { solvedAt } = useSolvedAt();
  const { allProblems, addGeneratedProblem } = useAllProblems();

  const isStock = level === undefined && topicId === undefined;

  const filtered = useMemo(() => {
    return allProblems.filter((p) => {
      if (p.language !== language) return false;
      if (level !== undefined) {
        return p.category.kind === "level" && p.category.level === Number(level);
      }
      if (topicId !== undefined) {
        return p.category.kind === "topic" && p.category.topicId === topicId;
      }
      return p.category.kind === "stock";
    });
  }, [allProblems, language, level, topicId]);

  // 表示順(状態優先)とは別に、生成順に基づく問題番号を先に確定させておく。
  // 詳細画面(ProblemDetail)でも同じ番号になるよう、getProblemNumberを共通利用する。
  const numbered = useMemo(
    () => filtered.map((problem) => ({ problem, num: getProblemNumber(allProblems, problem) })),
    [filtered, allProblems],
  );

  const sorted = useMemo(() => {
    return [...numbered].sort((a, b) => {
      const aMastery = progress[a.problem.id];
      const bMastery = progress[b.problem.id];
      const aVerdict = feedback[a.problem.id]?.verdict;
      const bVerdict = feedback[b.problem.id]?.verdict;
      const aAttempted = aMastery !== undefined || aVerdict !== undefined;
      const bAttempted = bMastery !== undefined || bVerdict !== undefined;

      // 第0キー: 未挑戦を最優先で上に
      if (aAttempted !== bAttempted) return aAttempted ? 1 : -1;

      // 第1キー: 状態(要復習系が上)
      if (aAttempted && bAttempted) {
        const diff = severity(aMastery, aVerdict) - severity(bMastery, bVerdict);
        if (diff !== 0) return diff;
      }

      // 第2キー: 問題番号(生成順)
      return a.num - b.num;
    });
  }, [numbered, progress, feedback]);

  const heading =
    level !== undefined
      ? `Lv${level} ${levelInfo[Number(level)]?.label ?? ""}`
      : topicId !== undefined
        ? (topicLabels[topicId] ?? topicId)
        : "自分のコード";

  if (!language) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-300">言語が見つかりませんでした。</p>
        <Link to="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          ← 言語選択に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to={`/languages/${language}`} className="text-sm text-blue-600 hover:underline">
        ← {languageLabel[language]}のカテゴリ選択に戻る
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {languageLabel[language]} ・ {heading}
      </h1>

      <div className="mt-4">
        {isStock ? (
          <Link
            to="/import"
            className="inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500"
          >
            ＋ 新しいコードを登録する
          </Link>
        ) : (
          <AiCopyPastePanel
            toggleLabel="AIで新しい問題を生成する"
            successMessage="問題を追加しました"
            prompt={buildGenerateProblemPrompt(language, heading ?? "")}
            onSubmit={(text) => {
              const result = parseGeneratedProblem(text);
              if (!result.ok) return { ok: false, error: result.error };
              const category: Category =
                level !== undefined
                  ? { kind: "level", level: Number(level) }
                  : { kind: "topic", topicId: topicId ?? "" };
              addGeneratedProblem({
                id: `generated-${crypto.randomUUID()}`,
                language,
                category,
                isGenerated: true,
                explanation: "",
                ...result.value,
              });
              return { ok: true };
            }}
          />
        )}
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {sorted.map(({ problem, num }: { problem: Problem; num: number }) => {
          const mastery = progress[problem.id];
          const savedFeedback = feedback[problem.id];
          const solvedTs = solvedAt[problem.id];
          return (
            <li key={problem.id}>
              <Link
                to={`/problems/${problem.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3 transition hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500"
              >
                <div>
                  <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                    問題 #{num}
                    {problem.isGenerated && (
                      <span className="whitespace-nowrap rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                        AI生成
                      </span>
                    )}
                    {problem.isImported && (
                      <span className="whitespace-nowrap rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                        マイコード
                      </span>
                    )}
                  </div>
                  {solvedTs && (
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                      最終解答: {formatSolvedAt(solvedTs)}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {mastery && (
                    <span
                      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                        mastery === "understood"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      }`}
                    >
                      {mastery === "understood" ? "理解済み" : "要復習"}
                    </span>
                  )}
                  {savedFeedback && (
                    <span
                      className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${verdictStyle[savedFeedback.verdict]}`}
                    >
                      前回: {verdictLabel[savedFeedback.verdict]}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
        {sorted.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            該当する問題がありません。
          </p>
        )}
      </ul>
    </div>
  );
}

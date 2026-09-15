import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { AiCopyPastePanel } from "../components/AiCopyPastePanel";
import type { Category, Language } from "../data/problems";
import { levelInfo, topicLabels } from "../data/problems";
import { useAllProblems } from "../hooks/useAllProblems";
import { useGeneratedProblems } from "../hooks/useGeneratedProblems";
import { useProgress } from "../hooks/useProgress";
import { buildGenerateProblemPrompt } from "../lib/aiPrompts";
import { parseGeneratedProblem } from "../lib/aiResponse";

const languageLabel: Record<Language, string> = {
  python: "Python",
  c: "C言語",
  javascript: "JavaScript",
};

export function CategoryProblemList() {
  const { language, level, topicId } = useParams<{
    language: Language;
    level?: string;
    topicId?: string;
  }>();
  const { progress } = useProgress();
  const { addProblem } = useGeneratedProblems();
  const allProblems = useAllProblems();

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
              addProblem({
                id: `generated-${crypto.randomUUID()}`,
                language,
                category,
                isGenerated: true,
                ...result.value,
              });
              return { ok: true };
            }}
          />
        )}
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {filtered.map((problem) => {
          const mastery = progress[problem.id];
          return (
            <li key={problem.id}>
              <Link
                to={`/problems/${problem.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3 transition hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500"
              >
                <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                  {problem.title}
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
              </Link>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            該当する問題がありません。
          </p>
        )}
      </ul>
    </div>
  );
}

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import type { Language } from "../data/problems";
import { levelInfo, topicLabels } from "../data/problems";
import { useAllProblems } from "../hooks/useAllProblems";

const languageLabel: Record<Language, string> = {
  python: "Python",
  c: "C言語",
  javascript: "JavaScript",
};

export function LanguageHub() {
  const { language } = useParams<{ language: Language }>();
  const { allProblems } = useAllProblems();

  const languageProblems = useMemo(
    () => allProblems.filter((p) => p.language === language),
    [allProblems, language],
  );

  const levels = useMemo(() => {
    const set = new Set<number>();
    for (const p of languageProblems) {
      if (p.category.kind === "level") set.add(p.category.level);
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [languageProblems]);

  const topicIds = useMemo(() => {
    const set = new Set<string>();
    for (const p of languageProblems) {
      if (p.category.kind === "topic") set.add(p.category.topicId);
    }
    return Array.from(set);
  }, [languageProblems]);

  const stockCount = useMemo(
    () => languageProblems.filter((p) => p.category.kind === "stock").length,
    [languageProblems],
  );

  if (!language || !(language in languageLabel)) {
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
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← 言語選択に戻る
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {languageLabel[language]}
      </h1>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">レベル別</h2>
        {levels.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            まだ問題がありません。
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {levels.map((level) => (
              <Link
                key={level}
                to={`/languages/${language}/level/${level}`}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-500"
              >
                Lv{level} {levelInfo[level]?.label ?? ""}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">文法テーマ別</h2>
        {topicIds.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            まだ問題がありません。
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {topicIds.map((topicId) => (
              <Link
                key={topicId}
                to={`/languages/${language}/topic/${topicId}`}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-500"
              >
                {topicLabels[topicId] ?? topicId}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">自分のコード</h2>
        {stockCount === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            まだ登録されていません。
            <Link to="/import" className="ml-1 text-blue-600 hover:underline">
              コードを登録する
            </Link>
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              to={`/languages/${language}/stock`}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-500"
            >
              登録したコードを見る（{stockCount}件）
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

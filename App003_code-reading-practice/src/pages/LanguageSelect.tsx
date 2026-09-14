import { Link } from "react-router-dom";
import { CopyBox } from "../components/CopyBox";
import type { Language } from "../data/problems";
import { setupPrompt } from "../lib/aiPrompts";

const languages: { id: Language; label: string }[] = [
  { id: "python", label: "Python" },
  { id: "c", label: "C言語" },
  { id: "javascript", label: "JavaScript" },
];

export function LanguageSelect() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        コードリーディング練習
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        練習したい言語を選んでください。
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {languages.map((lang) => (
          <li key={lang.id}>
            <Link
              to={`/languages/${lang.id}`}
              className="flex items-center justify-center rounded-lg border border-slate-200 px-4 py-8 text-center font-medium text-slate-900 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-500"
            >
              {lang.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-700">
        <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          AIを使う準備（最初に1回だけ）
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          ChatGPT・Gemini・Claudeなどで新しいチャットを開いたら、まず下の文章を貼ってください。各ページの「AIで問題を生成する」「AIに添削してもらう」は、そのチャットの続きに貼っていくとスムーズです。
        </p>
        <div className="mt-2">
          <CopyBox text={setupPrompt} rows={4} />
        </div>
      </div>
    </div>
  );
}

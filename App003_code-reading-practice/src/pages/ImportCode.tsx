import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Language } from "../data/problems";
import { useStockedProblems } from "../hooks/useStockedProblems";
import { detectLanguage } from "../lib/detectLanguage";

const languageLabel: Record<Language, string> = {
  python: "Python",
  c: "C言語",
  javascript: "JavaScript",
};

export function ImportCode() {
  const navigate = useNavigate();
  const { stocked, addProblem } = useStockedProblems();

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [manualLanguage, setManualLanguage] = useState<Language | null>(null);
  const language = manualLanguage ?? detectLanguage(code);

  const handleSubmit = () => {
    if (code.trim().length === 0) return;

    const stockCount = stocked.length;
    addProblem({
      id: `stock-${crypto.randomUUID()}`,
      title: title.trim() || `自分のコード #${stockCount + 1}`,
      language,
      category: { kind: "stock" },
      code,
      explanation: explanation.trim(),
      isImported: true,
    });

    navigate(`/languages/${language}/stock`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← 言語選択に戻る
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        自分のコードを登録する
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        持っているソースコードを貼り付けると、そのコードだけを集めた自分専用の問題集に追加されます。
      </p>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          タイトル（任意）
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例: 自分の学習用スクリプト"
          className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          ソースコード
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={12}
          placeholder="ここにソースコードを貼り付けてください"
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          検出した言語:
        </span>
        <select
          value={language}
          onChange={(e) => setManualLanguage(e.target.value as Language)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          {(Object.keys(languageLabel) as Language[]).map((lang) => (
            <option key={lang} value={lang}>
              {languageLabel[lang]}
            </option>
          ))}
        </select>
        {manualLanguage && (
          <button
            onClick={() => setManualLanguage(null)}
            className="text-xs text-blue-600 hover:underline"
          >
            自動判定に戻す
          </button>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          解説（任意・あとから追加してもOK）
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={4}
          placeholder="このコードが何をしているかの解説があれば書いてください"
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={code.trim().length === 0}
        className="mt-6 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-40 dark:bg-slate-200 dark:text-slate-900"
      >
        登録する
      </button>
    </div>
  );
}

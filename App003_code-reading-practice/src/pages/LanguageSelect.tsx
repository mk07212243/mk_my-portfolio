import { Link } from "react-router-dom";
import type { Language } from "../data/problems";

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
    </div>
  );
}

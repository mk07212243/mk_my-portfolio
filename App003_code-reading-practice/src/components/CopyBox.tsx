import { useState } from "react";

export function CopyBox({ text, rows = 6 }: { text: string; rows?: number }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("コピーに失敗しました。欄を手動で選択してコピーしてください。");
    }
  };

  return (
    <div>
      <div className="flex items-start gap-2">
        <textarea
          readOnly
          value={text}
          rows={rows}
          className="flex-1 rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        />
        <button
          onClick={handleCopy}
          className="whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          {copied ? "コピーしました" : "コピー"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}

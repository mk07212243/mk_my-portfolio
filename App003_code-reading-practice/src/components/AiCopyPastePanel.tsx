import { useState } from "react";

type SubmitResult = { ok: true } | { ok: false; error: string };

export function AiCopyPastePanel({
  toggleLabel,
  prompt,
  onSubmit,
  successMessage = "反映しました",
}: {
  toggleLabel: string;
  prompt: string;
  onSubmit: (responseText: string) => SubmitResult;
  successMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pasted, setPasted] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("コピーに失敗しました。プロンプトの欄を手動で選択してコピーしてください。");
    }
  };

  const handleSubmit = () => {
    const result = onSubmit(pasted);
    if (result.ok) {
      setError(null);
      setSuccess(true);
      setPasted("");
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 1200);
    } else {
      setError(result.error);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500"
      >
        {toggleLabel}
      </button>
    );
  }

  return (
    <div className="mt-3 w-full basis-full rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        下のプロンプトをコピーして、ChatGPT・Gemini・Claudeなど好きなAIチャット（無料版でOK）に貼ってください。返ってきた回答を下の欄に貼って「反映する」を押すと結果が反映されます。
      </p>

      <div className="mt-2 flex items-start gap-2">
        <textarea
          readOnly
          value={prompt}
          rows={6}
          className="flex-1 rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        />
        <button
          onClick={handleCopy}
          className="whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          {copied ? "コピーしました" : "コピー"}
        </button>
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
        AIからの回答を貼り付け
      </label>
      <textarea
        value={pasted}
        onChange={(e) => setPasted(e.target.value)}
        rows={6}
        placeholder="AIの回答(JSON)をここに貼り付けてください"
        className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />

      {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      {success && (
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{successMessage}</p>
      )}

      <div className="mt-2 flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={pasted.trim().length === 0}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-40 dark:bg-slate-200 dark:text-slate-900"
        >
          反映する
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}

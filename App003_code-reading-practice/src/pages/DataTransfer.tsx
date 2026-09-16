import { useState } from "react";
import { Link } from "react-router-dom";
import { CopyBox } from "../components/CopyBox";

const KEY_PREFIX = "code-reading:";

function collectAppData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(KEY_PREFIX)) continue;
    try {
      data[key] = JSON.parse(localStorage.getItem(key) ?? "null");
    } catch {
      // 壊れた値はスキップ
    }
  }
  return data;
}

export function DataTransfer() {
  const [pasted, setPasted] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const exportJson = JSON.stringify(collectAppData(), null, 2);

  const handleImport = () => {
    let data: unknown;
    try {
      data = JSON.parse(pasted);
    } catch {
      setError("JSONとして読み取れませんでした。エクスポートした内容をそのまま貼り付けているか確認してください。");
      return;
    }

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      setError("正しいデータ形式ではありません。");
      return;
    }

    let count = 0;
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (!key.startsWith(KEY_PREFIX)) continue;
      localStorage.setItem(key, JSON.stringify(value));
      count += 1;
    }

    if (count === 0) {
      setError("取り込めるデータが見つかりませんでした。");
      return;
    }

    setError(null);
    setSuccess(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← 言語選択に戻る
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        データのバックアップ・引き継ぎ
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        進捗・AIフィードバック・自分用メモ・生成/登録した問題などは、このページを開いているURL（ブラウザ）ごとに保存されています。別のURLに移った際は、ここでエクスポートしたデータを新しいURLの同じページに貼り付けてインポートしてください。
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          エクスポート（今のデータをコピー）
        </h2>
        <div className="mt-2">
          <CopyBox text={exportJson} rows={8} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          インポート（貼り付けて取り込む）
        </h2>
        <textarea
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          rows={8}
          placeholder="エクスポートしたJSONをここに貼り付けてください"
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
        {success && (
          <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
            取り込みました。反映するにはページを再読み込みしてください。
          </p>
        )}
        <button
          onClick={handleImport}
          disabled={pasted.trim().length === 0}
          className="mt-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-40 dark:bg-slate-200 dark:text-slate-900"
        >
          取り込む
        </button>
      </section>
    </div>
  );
}

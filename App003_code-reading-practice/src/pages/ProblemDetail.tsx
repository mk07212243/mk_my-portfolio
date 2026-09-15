import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiCopyPastePanel } from "../components/AiCopyPastePanel";
import { AutoGrowTextarea } from "../components/AutoGrowTextarea";
import { CodeBlock } from "../components/CodeBlock";
import { useAllProblems } from "../hooks/useAllProblems";
import { useFeedback } from "../hooks/useFeedback";
import { usePersonalMemo } from "../hooks/usePersonalMemo";
import { useProgress } from "../hooks/useProgress";
import { useSolvedAt } from "../hooks/useSolvedAt";
import { buildGradeNotePrompt } from "../lib/aiPrompts";
import { parseGradeResult, verdictLabel, verdictStyle } from "../lib/aiResponse";

export function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const allProblems = useAllProblems();
  const problem = allProblems.find((p) => p.id === id);
  const { progress, setMastery } = useProgress();
  const { feedback, setFeedback } = useFeedback();
  const { memos, setMemo } = usePersonalMemo();
  const { markSolved } = useSolvedAt();

  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote("");
    setShowFeedback(false);
  }, [id]);

  if (!problem) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-300">問題が見つかりませんでした。</p>
        <Link to="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          ← 一覧に戻る
        </Link>
      </div>
    );
  }

  const mastery = progress[problem.id];
  const savedFeedback = feedback[problem.id];
  const personalMemo = memos[problem.id] ?? "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline"
      >
        ← 一覧に戻る
      </button>

      <h1 className="mt-3 flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
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
      </h1>

      <div className="mt-4">
        <CodeBlock code={problem.code} language={problem.language} />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          このコードは何をしていると思いますか?（このメモは保存されません。ページを離れると消えます）
        </label>
        <AutoGrowTextarea
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          rows={4}
          placeholder="自分の言葉で説明してみましょう..."
          value={note}
          onChange={setNote}
        />

        <div className="mt-2">
          <AiCopyPastePanel
            toggleLabel="AIに添削してもらう"
            successMessage="フィードバックを反映しました"
            prompt={buildGradeNotePrompt(problem.code, problem.explanation, note)}
            onSubmit={(text) => {
              const result = parseGradeResult(text);
              if (!result.ok) return { ok: false, error: result.error };
              setFeedback(problem.id, result.value);
              setShowFeedback(true);
              markSolved(problem.id);
              return { ok: true };
            }}
          />
        </div>
      </div>

      {problem.explanation.trim().length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowAnswer((v) => !v)}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            {showAnswer ? "答えを隠す" : "答えを見る"}
          </button>

          {showAnswer && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
              {problem.explanation}
            </div>
          )}
        </div>
      )}

      {problem.quiz && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            クイズ: {problem.quiz.question}
          </h2>
          <div className="mt-2 flex flex-col gap-2">
            {problem.quiz.choices.map((choice, i) => {
              const isSelected = selectedChoice === i;
              const isCorrect = i === problem.quiz!.correctIndex;
              const showResult = selectedChoice !== null;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedChoice(i)}
                  className={`rounded-lg border px-4 py-2 text-left text-sm transition ${
                    showResult && isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : showResult && isSelected
                        ? "border-rose-400 bg-rose-50 text-rose-800 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-300"
                        : "border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500"
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
          {selectedChoice !== null && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {selectedChoice === problem.quiz.correctIndex
                ? "正解です！"
                : "不正解です。もう一度コードを読んでみましょう。"}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            自己評価
          </p>
          {savedFeedback && (
            <span
              className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${verdictStyle[savedFeedback.verdict]}`}
            >
              前回: {verdictLabel[savedFeedback.verdict]}
            </span>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => {
              setMastery(problem.id, "understood");
              markSolved(problem.id);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              mastery === "understood"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300"
            }`}
          >
            理解できた
          </button>
          <button
            onClick={() => {
              setMastery(problem.id, "unsure");
              markSolved(problem.id);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              mastery === "unsure"
                ? "bg-amber-600 text-white"
                : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300"
            }`}
          >
            まだ不安
          </button>
        </div>

        {savedFeedback && (
          <div className="mt-4">
            <button
              onClick={() => setShowFeedback((v) => !v)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500"
            >
              {showFeedback ? "フィードバックを隠す" : "保存したフィードバックを見る"}
            </button>

            {showFeedback && (
              <div
                className={`mt-3 rounded-lg border p-4 text-sm ${verdictStyle[savedFeedback.verdict]}`}
              >
                <span className="font-medium">{verdictLabel[savedFeedback.verdict]}</span>
                <p className="mt-1">{savedFeedback.feedback}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            自分用メモ（保存されます）
          </label>
          <AutoGrowTextarea
            className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            rows={3}
            placeholder="フィードバックを踏まえて、自分用に気づいたことを書いておきましょう..."
            value={personalMemo}
            onChange={(text) => setMemo(problem.id, text)}
          />
        </div>
      </div>
    </div>
  );
}

import type { Language } from "../data/problems";

const languageName: Record<Language, string> = {
  python: "Python",
  c: "C言語",
  javascript: "JavaScript",
};

export function buildGenerateProblemPrompt(language: Language, categoryLabel: string): string {
  return `あなたはプログラミング学習教材の作成者です。以下の条件に合う、コードリーディング練習用の問題を1つ作成してください。

言語: ${languageName[language]}
カテゴリ: ${categoryLabel}

出力は次のJSON形式のみにしてください。前後に説明文やコードブロックのマークダウン(\`\`\`)を付けないでください。

{
  "title": "問題の短いタイトル(日本語)",
  "code": "実際のコード(文字列。改行は\\nを使う)",
  "explanation": "このコードが何をしているかの日本語解説(2〜4文程度)",
  "quiz": {
    "question": "このコードの理解を問う4択クイズの質問文",
    "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
    "correctIndex": 0
  }
}

条件:
- コードは学習者が「読んで理解する」練習に適した、簡潔で実行可能なコードにしてください。
- カテゴリがレベルの場合はそのレベル相当の難易度にし、カテゴリが文法テーマの場合はそのテーマを主題とするコードにしてください。
- quizのcorrectIndexは0始まりのインデックスで、choicesの中で唯一正しい説明にしてください。`;
}

export function buildGradeNotePrompt(code: string, explanation: string, userNote: string): string {
  return `あなたはプログラミング学習の指導者です。以下のコードと模範解説、そして学習者が書いた「このコードが何をしていると思うか」のメモを比較し、学習者の理解が正しいかを判定してください。

コード:
${code}

模範解説:
${explanation}

学習者のメモ:
${userNote || "(メモが空です)"}

出力は次のJSON形式のみにしてください。前後に説明文やコードブロックのマークダウン(\`\`\`)を付けないでください。

{
  "verdict": "correct または partial または incorrect のいずれか",
  "feedback": "学習者への日本語フィードバック(2〜4文程度)。良い点と、不足していたり誤っている点があれば具体的に指摘してください。"
}`;
}

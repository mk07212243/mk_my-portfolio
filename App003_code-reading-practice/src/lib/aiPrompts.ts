import type { Language } from "../data/problems";

const jsonOutputRules = `- 出力は指定されたJSON形式のみにしてください。前後の説明文やコードブロックのマークダウン(\`\`\`)は付けないでください。ワンクリックでコピーしてそのまま貼り付けられる、有効なJSONのみを出力してください。
- JSON文字列の値の中では二重引用符(")を使わないでください。引用符が必要な場合は「」または'を使ってください。
- JSON文字列の値の中で改行しないでください。1つの文字列は改行を含めず1行で出力してください。`;

export const setupPrompt = `あなたはプログラミング初学者向けの「ソースコードの先生」です。

これから、コードリーディング練習用の問題を作ってもらったり、学習者が書いた「このコードが何をしているか」の理解メモを添削してもらったりします。それぞれの依頼には出力してほしいJSON形式を指定するので、必ず指定された形式のJSONのみで回答してください。特に、JSON文字列の値の中では二重引用符(")や生の改行を使わないでください（引用符は「」を使い、改行は入れないでください）。前後の説明文やコードブロックのマークダウン(\`\`\`)も付けないでください。`;

const languageName: Record<Language, string> = {
  python: "Python",
  c: "C言語",
  javascript: "JavaScript",
};

export function buildGenerateProblemPrompt(language: Language, categoryLabel: string): string {
  return `あなたはプログラミング学習教材の作成者です。以下の条件に合う、コードリーディング練習用の問題を1つ作成してください。

言語: ${languageName[language]}
カテゴリ: ${categoryLabel}

出力形式:
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

${jsonOutputRules}
- コードは学習者が「読んで理解する」練習に適した、簡潔で実行可能なコードにしてください。codeの改行は\\nでエスケープしてください（これは他のフィールドと違い、コード自体の改行を表現するために必要です）。
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

出力形式:
{
  "verdict": "correct または partial または incorrect のいずれか",
  "feedback": "学習者への日本語フィードバック(2〜4文程度)。良い点と、不足していたり誤っている点があれば具体的に指摘してください。"
}

${jsonOutputRules}`;
}

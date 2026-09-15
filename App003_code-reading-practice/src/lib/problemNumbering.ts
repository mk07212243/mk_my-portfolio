import type { Problem } from "../data/problems";

// 同じ言語・カテゴリ(レベル/トピック/自分のコード)内での生成順の番号を返す。
// 一覧(CategoryProblemList)と詳細(ProblemDetail)で同じ番号になるよう、
// 判定条件は必ず両方で揃えること。
export function getProblemNumber(allProblems: Problem[], problem: Problem): number {
  const sameCategory = allProblems.filter((p) => {
    if (p.language !== problem.language) return false;
    if (p.category.kind !== problem.category.kind) return false;
    if (p.category.kind === "level" && problem.category.kind === "level") {
      return p.category.level === problem.category.level;
    }
    if (p.category.kind === "topic" && problem.category.kind === "topic") {
      return p.category.topicId === problem.category.topicId;
    }
    return true;
  });

  return sameCategory.findIndex((p) => p.id === problem.id) + 1;
}

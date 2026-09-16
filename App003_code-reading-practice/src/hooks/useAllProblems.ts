import { useMemo } from "react";
import type { Problem } from "../data/problems";
import { problems } from "../data/problems";
import { useGeneratedProblems } from "./useGeneratedProblems";
import { useStockedProblems } from "./useStockedProblems";

// generated/stocked問題の読み書きは必ずこのフック経由で行うこと。
// useGeneratedProblems()/useStockedProblems()を呼び出し側で別途呼ぶと、
// 独立したuseStateインスタンスになり、片方で追加・更新しても
// もう片方(表示側)には反映されない(リロードするまで見えない)バグになる。
export function useAllProblems() {
  const { generated, addProblem: addGeneratedProblem, updateProblem: updateGeneratedProblem } =
    useGeneratedProblems();
  const { stocked, addProblem: addStockedProblem } = useStockedProblems();

  const allProblems = useMemo<Problem[]>(
    () => [...problems, ...generated, ...stocked],
    [generated, stocked],
  );

  return { allProblems, addGeneratedProblem, updateGeneratedProblem, addStockedProblem };
}

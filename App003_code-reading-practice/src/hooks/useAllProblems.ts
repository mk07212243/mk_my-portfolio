import { useMemo } from "react";
import type { Problem } from "../data/problems";
import { problems } from "../data/problems";
import { useGeneratedProblems } from "./useGeneratedProblems";
import { useStockedProblems } from "./useStockedProblems";

export function useAllProblems(): Problem[] {
  const { generated } = useGeneratedProblems();
  const { stocked } = useStockedProblems();

  return useMemo(() => [...problems, ...generated, ...stocked], [generated, stocked]);
}

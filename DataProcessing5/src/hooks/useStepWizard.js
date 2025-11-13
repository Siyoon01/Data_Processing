import { useEffect, useMemo, useRef, useState } from "react";
import useLocalStorage from "./useLocalStorage";

/**
 * steps: [{ key, type: "multi"|"binary", options, label }]
 * storageKey: 로컬스토리지 키
 * initialChoices: { [key]: "" } 형태
 */
export default function useStepWizard({ steps, storageKey, initialChoices, resetOnMount = false }) {
  const total = steps.length;

  const [step, setStep] = useState(0);
  const [choices, setChoices] = useLocalStorage(storageKey, initialChoices);
  const [showResults, setShowResults] = useState(false);

  const cur = steps[step];
  const isLast = step === total - 1;

  const currentValue =
    cur.key === "theme" ? choices.theme : (choices[cur.key] || "");

  // 마지막 스텝에서 값을 선택했을 때만 선택지 숨김/완료 가능
  const canFinish = isLast && Boolean(currentValue);
  const hideChoices = isLast && Boolean(currentValue);

  const next = () => setStep((s) => Math.min(total - 1, s + 1));
  const back = () => {
    const target = Math.max(0, step - 1);

    setChoices((c) => {
      const next = { ...c };
      for (let i = target; i < total; i++) {
        next[steps[i].key] = "";
      }
      return next;
    });

    setShowResults(false);
    setStep(target);
  };

  const bootRef = useRef(false);
  useEffect(() => {
    if (resetOnMount && !bootRef.current) {
      setChoices({ ...initialChoices });
      setShowResults(false);
      setStep(0);
      bootRef.current = true;
    }
  }, [resetOnMount]);

  const reset = () => {
    setChoices({ ...initialChoices });
    setShowResults(false);
    setStep(0);
  };

  // 공통 선택 처리
  const select = (label) => {
    if (cur.type === "multi") {
      // 단일 문자열 저장
      setChoices((c) => ({ ...c, [cur.key]: label }));
      setShowResults(false);
      next();
      return;
    }

    // binary: "이상/미만" 파싱
    const isGte = /이상/.test(label);
    const isLt = /미만/.test(label);
    setChoices((c) => ({ ...c, [cur.key]: isGte ? "gte" : isLt ? "lt" : "" }));
    setShowResults(false);
    if (!isLast) next();
  };

  const filteredChips = useMemo(() => {
    // 보기용 칩 문자열 생성 (페이지에서 그대로 사용 가능)
    const chips = [];
    if (choices.theme) chips.push(`테마: ${choices.theme}`);
    if (choices.marketCap) chips.push(`시총: ${choices.marketCap === "gte" ? "1000억 이상" : "1000억 미만"}`);
    if (choices.volume) chips.push(`거래량: ${choices.volume === "gte" ? "50만주 이상" : "50만주 미만"}`);
    if (choices.dividend) chips.push(`배당: ${choices.dividend === "gte" ? "0.5% 이상" : "0.5% 미만"}`);
    if (choices.fee) chips.push(`수수료: ${choices.fee === "lt" ? "0.45% 미만" : "0.45% 이상"}`);
    return chips;
  }, [choices]);

  return {
    // state
    step, total, cur, choices, showResults,
    isLast, currentValue, canFinish, hideChoices,

    // actions
    select, back, reset, setShowResults,

    // view helpers
    chips: filteredChips,
  };
}

// src/pages/RecommendPage.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { StepWizard, ChoiceGroup, Chips, Button, Card, ETFResultTable } from "../components";
import useDataJson from "../hooks/useDataJson";
import useStepWizard from "../hooks/useStepWizard";
import { RECOMMEND_STEPS } from "../config/recommendSteps";
import { applyEtfFilters } from "../utils/filters";

export default function RecommendPage() {
  const navigate = useNavigate();

  const { data, loading, error } = useDataJson("/api/v1/etfs");
  const list = Array.isArray(data) ? data : [];

  const { step, total, cur, choices, showResults, isLast, currentValue, canFinish, hideChoices, select, back, reset, setShowResults, chips } = useStepWizard({
    steps: RECOMMEND_STEPS,
    storageKey: "recommend_choices",
    initialChoices: { theme: "", marketCap: "", volume: "", dividend: "", fee: "" },
    resetOnMount: true,
  });

  const filtered = useMemo(() => applyEtfFilters(list, choices), [list, choices]);
  const goDetail = (itemcode) => navigate(`/detailedview/${itemcode}`);

  const isThemeStep = cur?.key === "theme";

  return (
    <div className="page container">
      <h1 className="page-title">ETF 추천</h1>

      <Card style={{ padding: 16 }}>
        <StepWizard
          step={step}
          total={total}
          onBack={back}
          onReset={reset}
          title="조건을 순서대로 선택하세요"
          subtitle="테마부터 수수료까지"
          footer={
            isLast && canFinish ? (
              <Button onClick={() => setShowResults(true)}>추천 보기</Button>
            ) : null
          }
        >
          {!hideChoices && (
            <>
              <ChoiceGroup
                type={cur.type}
                options={Array.isArray(cur.options) ? cur.options : [cur.options.a, cur.options.b]}
                active={cur.type === "multi" ? (choices[cur.key] || "") : currentValue}
                onSelect={select}
                block
              />

              {isThemeStep && (
                <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                  <Button
                    variant="outline"
                    onClick={() => select("")}
                    style={{ minWidth: 120, justifyContent: "center" }}
                    title="테마를 건너뛰고 다음 단계로 이동"
                  >
                    선택 안함
                  </Button>
                </div>
              )}
            </>
          )}

          <div style={{ marginTop: 12 }}>
            <Chips items={chips} />
          </div>
        </StepWizard>
      </Card>

      <div style={{ marginTop: 24 }}>
        {loading && <div>데이터 불러오는 중…</div>}
        {error && <div style={{ color: "crimson" }}>데이터 로드 실패: {String(error.message || error)}</div>}

        {showResults && !loading && !error && (
          <Card style={{ padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>추천 결과</h2>
            <ETFResultTable rows={filtered} onDetail={goDetail} />
          </Card>
        )}
      </div>
    </div>
  );
}

import React from "react";
import Button from "../common/Button";
import ProgressBar from "../common/ProgressBar";

/**
 * step: 0부터 시작하는 현재 스텝 인덱스
 * total: 전체 스텝 수
 * onBack(): 이전으로
 * onReset(): 처음부터
 * footer: 우측 하단 영역(예: "추천 보기" 버튼)
 */
export default function StepWizard({
  step = 0,
  total = 1,
  onBack,
  onReset,
  children,
  footer,
  title,          // 선택: 상단 타이틀
  subtitle,       // 선택: 보조 설명
}) {
  const percent = total > 0 ? Math.round(((step + 1) / total) * 100) : 0;

  return (
    <div className="stepwizard" style={{ display: "grid", gap: 16 }}>
      {/* 헤더: 진행상태만 남김 (상단 컨트롤 제거) */}
      <div className="stepwizard__head" style={{ display: "grid", gap: 12 }}>
        {(title || subtitle) && (
          <div>
            {title && <h2 style={{ margin: 0 }}>{title}</h2>}
            {subtitle && (
              <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ProgressBar value={percent} />
          <span style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>
            {step + 1} / {total}
          </span>
        </div>
      </div>

      {/* 본문 */}
      <div className="stepwizard__body">{children}</div>

      {/* 푸터: 좌측에 뒤로/처음부터, 우측에 footer(추천 보기 등) */}
      <div
        className="stepwizard__footer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 8,
        }}
      >
        <div className="stepwizard__ctrl" style={{ display: "flex", gap: 8 }}>
          <Button onClick={onBack} variant="ghost" disabled={step === 0}>
            ← 뒤로
          </Button>
          <Button onClick={onReset} variant="ghost">
            처음부터
          </Button>
        </div>

        <div className="stepwizard__footerRight">
          {footer /* 예: <Button>추천 보기</Button> */ }
        </div>
      </div>
    </div>
  );
}

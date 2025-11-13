import React, { useMemo } from "react";
import { formatMetric as fmt } from "../../utils/metricFormat.js";

/**
 * 0~100% 정규화 + 최소 1% 보장
 * 모든 라벨을 동일한 우측 위치에 정렬 (막대 길이에 영향받지 않음)
 */
export default function BarChartPanel({
  data = [],
  unit = "",
  div = 1,
  palette = [],
  barHeight = 24,
  barRadius = 8,
  innerPad = 12,
}) {
  const rows = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const vals = data.map((d) => Number(d.value) || 0);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;

    return data.map((d, i) => {
      const v = Number(d.value || 0);
      let pct = ((v - min) / range) * 100;
      if (pct <= 0) pct = 1; // ✅ 최소 1%
      return {
        key: i,
        name: d.name,
        pct: Math.max(1, Math.min(100, pct)),
        color: palette[i % palette.length] || "#2563eb",
        text: fmt(v / (div || 1), { unit: "" }), // 단위 제거
      };
    });
  }, [data, unit, div, palette]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12 }}>
      {rows.map((r) => (
        <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* ETF 이름 */}
          <div style={{ width: 220, textAlign: "left", fontWeight: 700, lineHeight: 1.2, fontSize: 14 }}>
            {r.name}
          </div>

          {/* 그래프 + 라벨 */}
          <div style={{ flex: 1, position: "relative", height: barHeight }}>
            {/* 막대 */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${r.pct}%`,
                backgroundColor: r.color,
                borderRadius: barRadius,
                transition: "width .25s ease",
              }}
            />

            {/* ✅ 라벨: 그래프 폭에 상관없이 동일한 우측 정렬 */}
            <span
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#000000",
                fontSize: 12,
                fontWeight: 700,
                textShadow: "0 1px 2px rgba(0,0,0,.35)",
                background: "transparent",
                paddingRight: innerPad,
              }}
            >
              {r.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

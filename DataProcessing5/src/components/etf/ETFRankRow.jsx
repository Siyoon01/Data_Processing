import React from "react";
import Button from "../common/Button.jsx";
import { formatMetric } from "../../utils/metricFormat.js";
import ETFRowDetail from "./ETFRowDetail.jsx";

/**
 * props:
 *  - rank, row, metricKey, isOpen, onToggle, formatMetric: (선택) 상위 포맷터
 */
export default function ETFRankRow({
  rank,
  row,
  metricKey,
  isOpen,
  onToggle,
  formatMetric: fmt, // 있을 경우 우선 사용
}) {
  const metricValue = row?.[metricKey];
  const fm = fmt || formatMetric;

  return (
    <>
      {/* 요약 행 */}
      <tr className="etf-row-summary" onClick={onToggle} style={{ cursor: "pointer" }}>
        <td style={{ textAlign: "center" }}>{rank}</td>
        <td style={{ textAlign: "left" }}>{row.itemname}</td>
        <td style={{ textAlign: "center" }}>{fm(metricValue)}</td>
        <td style={{ textAlign: "center" }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            aria-label={isOpen ? "접기" : "펼치기"}
          >
            {isOpen ? "▾" : "▸"}
          </Button>
        </td>
      </tr>

      {/* 상세 행 (열렸을 때만 DOM에 추가) */}
      {isOpen && (
        <tr className="etf-row-detail">
          <td colSpan={4} style={{ padding: 0 }}>
            <div style={{ padding: 12 }}>
              <ETFRowDetail row={row} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

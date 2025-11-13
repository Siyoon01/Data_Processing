import React from "react";
import ETFRankRow from "./ETFRankRow.jsx";

export default function ETFRankTable({
  rows,
  metricKey,
  formatMetric,
  openSet,
  onToggle,
}) {
  return (
    <div className="etf-table-wrap">
      <table className="etf-table" style={{ tableLayout: "fixed", width: "100%" }}>
        <colgroup>
          <col style={{ width: 64 }} />
          <col />
          <col style={{ width: 120 }} />
          <col style={{ width: 68 }} />
        </colgroup>
        <thead>
          <tr>
            <th>순위</th>
            <th style={{ textAlign: "left" }}>ETF 이름</th>
            <th>지표</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <ETFRankRow
              key={row.itemcode}
              rank={i + 1}
              row={row}
              metricKey={metricKey}
              isOpen={openSet.has(row.itemcode)}
              onToggle={() => onToggle(row.itemcode)}
              formatMetric={formatMetric}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

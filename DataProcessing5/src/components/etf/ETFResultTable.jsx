import React from "react";
import Button from "../common/Button";
import { formatInt, formatPercent, formatFloat } from "../../utils/metricFormat";

const th = { textAlign: "center", padding: "10px 8px", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap", fontWeight: 700 };
const tdC= { textAlign: "center", padding: "10px 8px", whiteSpace: "nowrap" };
const tdR= { textAlign: "right",  padding: "10px 8px", whiteSpace: "nowrap" };
const tdL= { textAlign: "left",   padding: "10px 8px", whiteSpace: "nowrap" };

export default function ETFResultTable({ rows = [], onDetail }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>종목명</th>
            <th style={th}>테마</th>
            <th style={th}>운용사</th>
            <th style={th}>현재가</th>
            <th style={th}>배당수익률</th>
            <th style={th}>수수료</th>
            <th style={th}>시가총액</th>
            <th style={th}>거래량</th>
            <th style={th}>자세히</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.itemcode} style={{ borderTop: "1px solid #e5e7eb" }}>
              <td style={tdL}>{r.itemname}</td>
              <td style={tdC}>{r.theme}</td>
              <td style={tdC}>{r.manager}</td>
              <td style={tdR}>{formatInt(r.nowVal)}</td>
              <td style={tdR}>{formatPercent(r.dividendYield)}</td>
              <td style={tdR}>{formatPercent(r.expenseRatio)}</td>
              <td style={tdR}>{formatInt(r.marketSum)}</td>
              <td style={tdR}>{formatInt(r.quant)}</td>
              <td style={tdC}>
                <Button size="sm" onClick={() => onDetail?.(r.itemcode)}>자세히</Button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", padding: 16, color: "#6b7280" }}>
                조건에 맞는 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

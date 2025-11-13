import React from "react";
import KeyValueGrid from "../common/KeyValueGrid.jsx";
import Button from "../common/Button.jsx";
import { useNavigate } from "react-router-dom";
import { formatInt, formatFloat, formatPercent } from "../../utils/metricFormat.js";

export default function ETFRowDetail({ row, onView }) {
  const navigate = useNavigate();
  const goDetail = () =>
    onView ? onView(row.itemcode) : navigate(`/detailedview/${row.itemcode}`);

  const items = [
    { label: "종목코드", value: row.itemcode },
    { label: "테마", value: row.theme || "-" },
    { label: "운용사", value: row.manager || "-" },
    { label: "현재가", value: formatInt(row.nowVal) },
    { label: "NAV", value: formatFloat(row.nav) },
    { label: "등락률", value: formatPercent(row.changeRate) },
    { label: "3M 수익률", value: `${formatFloat(row.threeMonthEarnRate)}%` },
    { label: "배당수익률", value: formatPercent(row.dividendYield) },
    { label: "총보수", value: `${row.expenseRatio ?? 0}%` },
    { label: "거래량", value: formatInt(row.quant) },
  ];

  return (
    <div style={{ padding: 12 }}>
      <KeyValueGrid items={items} dense />
      <div style={{ marginTop: 12, textAlign: "right" }}>
        <Button size="sm" onClick={goDetail}>
          자세히 보기
        </Button>
      </div>
    </div>
  );
}

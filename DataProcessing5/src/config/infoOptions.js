const INFO_OPTIONS = [
  { key: "nowVal", label: "주가", percent: false, hundred: false, div: 1, unit: "원" },
  { key: "marketSum", label: "시가총액", percent: false, hundred: false, div: 1, unit: "억" },
  { key: "quant", label: "거래량", percent: false, hundred: false, div: 1, unit: "" },
  { key: "dividendYield", label: "배당수익률", percent: true, hundred: true, div: 1, unit: "%" },
  { key: "expenseRatio", label: "수수료", percent: true, hundred: false, div: 1, unit: "%" },
  { key: "threeMonthEarnRate", label: "3개월 수익률", percent: true, hundred: false, div: 1, unit: "%" },
  { key: "changeRate", label: "괴리율", percent: true, hundred: true, div: 1, unit: "%" },
];

export default INFO_OPTIONS;

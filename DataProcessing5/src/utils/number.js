export function safeNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function formatNumber(v) {
  const n = safeNum(v, 0);
  return n.toLocaleString();
}

/** percent: 0.53 -> "0.53%" (이미 % 스케일이면 그대로) */
export function formatPercent(v) {
  const n = safeNum(v, 0);
  return `${n}%`;
}

/** 소수 고정 및 단위 결합: fmtWithUnit(12345/10000, {unit:"만원", digits:1}) */
export function fmtWithUnit(v, { unit = "", digits = 0 } = {}) {
  const n = safeNum(v, 0);
  return `${n.toFixed(digits)}${unit}`;
}

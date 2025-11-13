export function formatInt(n) {
  if (n == null || Number.isNaN(Number(n))) return "-";
  return Math.round(Number(n)).toLocaleString("ko-KR");
}

export function formatFloat(n, digits = 2) {
  if (n == null || Number.isNaN(Number(n))) return "-";
  const v = Number(n);
  const s = v.toFixed(digits);
  return s.replace(/\.?0+$/, "");
}

export function formatPercent(n, digits = 2) {
  if (n == null || Number.isNaN(Number(n))) return "-";
  return `${formatFloat(n, digits)}%`;
}

/**
 * value: number
 * opts: { percent?:boolean, hundred?:boolean, unit?:string, div?:number }
 */
export function formatMetric(value, opts = {}) {
  const { percent = false, hundred = false, unit = "", div = 1 } = opts;
  if (value == null || Number.isNaN(Number(value))) return "-";

  let v = Number(value);
  if (hundred) v *= 100;
  if (div && div !== 1) v = v / div;

  if (percent || unit === "%") {
    return `${formatFloat(v) }%`;
  }
  if (Math.abs(v) >= 1000) return `${formatInt(v)}${unit || ""}`;
  return `${formatFloat(v)}${unit || ""}`;
}

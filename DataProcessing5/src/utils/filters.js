import { THRESHOLDS } from "../config/recommendSteps";

export function applyEtfFilters(list, choices) {
  if (!Array.isArray(list) || !list.length) return [];

  return list.filter((it) => {
    // theme
    if (choices.theme && it.theme !== choices.theme) return false;

    // 시총
    if (choices.marketCap) {
      const v = Number(it.marketSum ?? 0);
      if (choices.marketCap === "gte" && !(v >= THRESHOLDS.marketCap)) return false;
      if (choices.marketCap === "lt"  && !(v <  THRESHOLDS.marketCap)) return false;
    }
    // 거래량
    if (choices.volume) {
      const v = Number(it.quant ?? 0);
      if (choices.volume === "gte" && !(v >= THRESHOLDS.volume)) return false;
      if (choices.volume === "lt"  && !(v <  THRESHOLDS.volume)) return false;
    }
    // 배당
    if (choices.dividend) {
      const v = Number(it.dividendYield ?? 0);
      if (choices.dividend === "gte" && !(v >= THRESHOLDS.dividend)) return false;
      if (choices.dividend === "lt"  && !(v <  THRESHOLDS.dividend)) return false;
    }
    // 수수료
    if (choices.fee) {
      const v = Number(it.expenseRatio ?? 0);
      if (choices.fee === "lt"  && !(v <  THRESHOLDS.fee)) return false;
      if (choices.fee === "gte" && !(v >= THRESHOLDS.fee)) return false;
    }
    return true;
  });
}

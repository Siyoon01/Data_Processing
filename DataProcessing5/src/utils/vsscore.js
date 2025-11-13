export const AXES = ["시가총액", "거래량", "배당수익률", "수수료", "괴리율"];

export const getPremium = (nowVal, nav) => {
  const p = Number(nowVal), n = Number(nav);
  if (!Number.isFinite(p) || !Number.isFinite(n) || n === 0) return null;
  return ((p - n) / n) * 100;
};

export const scoreCap = (v) => {
  const x = Number(v);
  if (!Number.isFinite(x)) return 0;
  if (x >= 3000) return 5;
  if (x >= 1000) return 4;
  if (x >= 400)  return 3;
  if (x >= 100)  return 2;
  return 1;
};

export const scoreVol = (v) => {
  const x = Number(v);
  if (!Number.isFinite(x)) return 0;
  if (x >= 1_000_000) return 5;
  if (x >= 200_000)  return 4;
  if (x >= 50_000)   return 3;
  if (x >= 5_000)    return 2;
  return 1;
};

export const scoreDiv = (v) => {
  const x = Number(v);
  if (!Number.isFinite(x)) return 0;
  if (x >= 1.0) return 5;
  if (x >= 0.7) return 4;
  if (x >= 0.5) return 3;
  if (x > 0)    return 2;
  return 1;
};

export const scoreFee = (v) => {
  const x = Number(v);
  if (!Number.isFinite(x)) return 0;
  if (x <= 0.30) return 5;
  if (x <= 0.40) return 4;
  if (x <= 0.45) return 3;
  if (x <= 0.50) return 2;
  return 1;
};

export const scorePrem = (v) => {
  const x = Number(v);
  if (!Number.isFinite(x)) return 0;
  if (x <= -0.5)           return 5;
  if (x > -0.5 && x <= 0)  return 4;
  if (x > 0 && x <= 0.15)  return 3;
  if (x > 0.15 && x <= 0.35) return 2;
  return 1;
};

// 원시 레코드를 비교/표시에 공통으로 쓰기 쉽게 변환
export const adapt = (r = {}) => ({
  cap: r.marketSum,
  vol: r.quant,
  div: r.dividendYield ?? null,
  fee: r.expenseRatio ?? null,
  prem: getPremium(r.nowVal, r.nav),
});

export function makeDetailRows(a, b) {
  const A = adapt(a);
  const B = adapt(b);
  return [
    { k: "시가총액", a: A.cap, b: B.cap, unit: "억" },
    { k: "거래량", a: A.vol, b: B.vol, unit: "주" },
    { k: "배당수익률", a: A.div, b: B.div, unit: "%" },
    { k: "수수료", a: A.fee, b: B.fee, unit: "%" },
    { k: "괴리율", a: A.prem, b: B.prem, unit: "%" },
  ];
}

// 레이더 점수 계산(0~5)
export function toRadarScores(a, b) {
  const A = adapt(a);
  const B = adapt(b);

  const aScores = [
    scoreCap(A.cap),
    scoreVol(A.vol),
    scoreDiv(A.div),
    scoreFee(A.fee),
    scorePrem(A.prem),
  ];
  const bScores = [
    scoreCap(B.cap),
    scoreVol(B.vol),
    scoreDiv(B.div),
    scoreFee(B.fee),
    scorePrem(B.prem),
  ];

  // 축별 원시값 (동일 버킷일 때 비교용)
  const rawA = [A.cap, A.vol, A.div, A.fee, A.prem];
  const rawB = [B.cap, B.vol, B.div, B.fee, B.prem];

  // 어떤 축이 낮을수록 좋은가? (fee, prem만 true)
  const lowerIsBetter = [false, false, false, true, true];

  for (let i = 0; i < aScores.length; i++) {
    const sA = aScores[i], sB = bScores[i];
    const vA = Number(rawA[i]), vB = Number(rawB[i]);
    // 둘 다 점수가 있고, 같은 버킷이고, 원시값이 유효하며 서로 다를 때만 처리
    if (
      Number.isFinite(sA) && Number.isFinite(sB) &&
      Math.abs(sA - sB) < 1e-12 &&
      Number.isFinite(vA) && Number.isFinite(vB) &&
      Math.abs(vA - vB) > 1e-12
    ) {
      const isLowerBetter = lowerIsBetter[i];
      // "불리한 쪽"만 -0.5 (0 미만으로 내려가지 않게 클램프)
      const aIsWorse = isLowerBetter ? vA > vB : vA < vB;
      if (aIsWorse) aScores[i] = Math.max(0, sA - 0.5);
      else          bScores[i] = Math.max(0, sB - 0.5);
    }
  }

  return { a: aScores, b: bScores };
}
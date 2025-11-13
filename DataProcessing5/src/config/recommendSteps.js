export const THEMES = ["반도체", "자동차", "에너지", "방산", "바이오"];

export const RECOMMEND_STEPS = [
  { key: "theme",    type: "multi",  options: THEMES,                     label: "테마" },
  { key: "marketCap",type: "binary", options: ["시가총액 1000억 이상","시가총액 1000억 미만"], label: "시총" },
  { key: "volume",   type: "binary", options: ["거래량 50만주 이상","거래량 50만주 미만"],   label: "거래량" },
  { key: "dividend", type: "binary", options: ["배당수익률 0.5% 이상","배당수익률 0.5% 미만"],   label: "배당" },
  { key: "fee",      type: "binary", options: ["수수료 0.45% 미만","수수료 0.45% 이상"],     label: "수수료" },
];

export const THRESHOLDS = {
  marketCap: 1000,   // 억
  volume: 500_000,   // 주
  dividend: 0.5,     // %
  fee: 0.45,         // %
};

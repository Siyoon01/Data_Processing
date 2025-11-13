import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownBox, Card, BarChartPanel } from "../components";
import INFO_OPTIONS from "../config/infoOptions.js";
import { formatMetric } from "../utils/metricFormat.js";
import Button from "../components/common/Button.jsx";

const cleanHtml = (s = "") =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

export default function ChartPage() {
  const [data, setData] = useState([]);
  const [theme, setTheme] = useState("");
  const [infoKey, setInfoKey] = useState(INFO_OPTIONS[0].key);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/v1/etfs")
      .then((res) => res.json())
      .then((json) => (Array.isArray(json) ? setData(json) : setData([])))
      .catch(() => setData([]));
  }, []);

  const themes = useMemo(() => {
    const s = new Set(data.map((d) => d.theme).filter(Boolean));
    return Array.from(s);
  }, [data]);

  useEffect(() => {
    if (!theme && themes.length > 0) setTheme(themes[0]);
  }, [themes, theme]);

  const infoDef = useMemo(
    () => INFO_OPTIONS.find((o) => o.key === infoKey) || INFO_OPTIONS[0],
    [infoKey]
  );

  const filtered = useMemo(
    () => (theme ? data.filter((d) => d.theme === theme) : data),
    [data, theme]
  );

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort(
      (a, b) => (Number(b?.[infoKey]) || 0) - (Number(a?.[infoKey]) || 0)
    );
    return arr;
  }, [filtered, infoKey]);

  const chartData = useMemo(
    () => sorted.map((d) => ({ name: d.itemname, value: d?.[infoKey] ?? 0 })),
    [sorted, infoKey]
  );

  const palette = ["#2563eb","#16a34a","#f97316","#a855f7","#dc2626","#0ea5e9","#22c55e","#f59e0b","#8b5cf6","#ef4444"];

  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState("");

  useEffect(() => {
    if (!theme) {
      setNewsItems([]);
      setNewsLoading(false);
      return;
    }

    setNewsLoading(true);
    fetch(`/api/v1/news?theme=${encodeURIComponent(theme)}`)
      .then((r) => r.json())
      .then((json) => {
        const items = Array.isArray(json) ? json : Array.isArray(json?.items) ? json.items : [];
        items.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
        setNewsItems(items.slice(0, 5));
        setNewsError("");
      })
      .catch((e) => setNewsError(e?.message || "뉴스 로딩 실패"))
      .finally(() => setNewsLoading(false));
  }, [theme]);

  // 카드 행에서 사용할 메트릭(디자인 고정 순서)
  const metricRows = (d) => [
    { k: "주가", v: formatMetric(d?.nowVal) },
    { k: "시가총액", v: formatMetric(d?.marketSum) },
    { k: "수수료", v: formatMetric(d?.expenseRatio) },
    { k: "NAV", v: formatMetric(d?.nav) },
    { k: "배당수익률", v: formatMetric(d?.dividendYield) },
    { k: "거래량", v: formatMetric(d?.quant) },
    { k: "괴리율", v: formatMetric(d?.changeRate) }, // 데이터에 별도 괴리율 없으므로 changeRate 사용
  ];

  // 비교 버튼 로직
  const [pick, setPick] = useState([]);
  const togglePick = (code) => {
    setPick((prev) => {
      const has = prev.includes(code);
      let next = has ? prev.filter((c) => c !== code) : [...prev, code];
      if (next.length > 2) next = next.slice(-2);
      if (next.length === 2) {
        const [A, B] = next;
        navigate(`/vs?A=${encodeURIComponent(A)}&B=${encodeURIComponent(B)}`);
      }
      return next;
    });
  };
  const labelFor = (code) => {
    if (pick.includes(code)) return "선택됨";
    if (pick.length === 1) return "선택된 ETF와 비교";
    return "비교하기";
  };

  return (
    <div className="page">
      {/* 컨트롤 */}
      <div className="controls" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <DropdownBox label="ETF Theme" options={themes} value={theme} onChange={setTheme} />
        <DropdownBox
          label="지표 선택"
          options={INFO_OPTIONS.map((o) => o.label)}
          value={infoDef.label}
          onChange={(label) => {
            const f = INFO_OPTIONS.find((o) => o.label === label);
            if (f) setInfoKey(f.key);
          }}
        />
      </div>

      {/* 차트 + 뉴스 */}
      <div className="grid-2">
        <Card title={`ETF 차트 (${infoDef.label}${infoDef.unit ? ` · 단위:${infoDef.unit}` : ""})`}>
          <BarChartPanel
            data={chartData}
            unit={infoDef.unit}
            div={infoDef.div}
            barSize={18}
            minWidth={Math.max(960, chartData.length * 60)}
            valueKey="value"
            palette={palette}
          />
        </Card>

        <Card title="ETF News">
          {newsLoading && <div className="muted">불러오는 중…</div>}
          {newsError && <div className="error">{newsError}</div>}
          {!newsLoading && !newsError && (
            <ul className="news-list" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
              {newsItems.map((n, i) => {
                const title = cleanHtml(n.title);
                const desc = cleanHtml(n.description);
                const href = n.originallink || n.link || "#";
                const date = n.pubDate ? new Date(n.pubDate).toLocaleString("ko-KR") : "";
                return (
                  <li key={i} className="news-item" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="news-title" style={{ fontWeight: 700, textDecoration: "none", color: "inherit" }}>
                      {title || "제목 없음"}
                    </a>
                    <div className="news-meta" style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{date}</div>
                    <p className="news-snippet" style={{ margin: "6px 0 0 0" }}>{desc}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* ===== Rank: 카드 리스트 ===== */}
      <Card title="ETF Rank">
  <ol className="rank-list">
    {sorted.map((d, idx) => {
      const selected = pick.includes(d.itemcode);
      return (
        <li
          key={d.itemcode || idx}
          className={`rank-card${selected ? " is-selected" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/detailedview/${d.itemcode}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate(`/detailedview/${d.itemcode}`);
          }}
          aria-label={`${idx + 1}위 ${d.itemname} 상세보기`}
        >
          <div className="rank-left">
            <div className="rank-no">{idx + 1}</div>
          </div>

          <div className="rank-body">
            <div className="rank-header">
              <div className="rank-title">
                <div className="etf-name">{d.itemname || "-"}</div>
                <div className="etf-manager">{d.manager || "-"}</div>
              </div>
              <div className="rank-rt">
                <Button
                  className="compare-btn"
                  variant={selected ? "primary" : "ghost"}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePick(d.itemcode);
                  }}
                >
                  {labelFor(d.itemcode)}
                </Button>
                <div className="theme-badge" title={d.theme}>
                  {d.theme || "-"}
                </div>
              </div>
            </div>

            <div className="metric-grid">
              {[
                { k: "주가", v: formatMetric(d?.nowVal) },
                { k: "시가총액", v: formatMetric(d?.marketSum) },
                { k: "수수료", v: formatMetric(d?.expenseRatio) },
                { k: "NAV", v: formatMetric(d?.nav) },
                { k: "배당수익률", v: formatMetric(d?.dividendYield) },
                { k: "거래량", v: formatMetric(d?.quant) },
                { k: "괴리율", v: formatMetric(d?.changeRate) },
              ].map((m) => (
                <div key={m.k} className="metric">
                  <div className="k">{m.k}</div>
                  <div className="v">{m.v ?? "-"}</div>
                </div>
              ))}
            </div>
          </div>
        </li>
      );
    })}
  </ol>
</Card>
    </div>
  );
}

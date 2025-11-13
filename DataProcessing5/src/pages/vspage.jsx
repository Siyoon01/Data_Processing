import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import { formatMetric } from "../utils/metricFormat.js";

import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { AXES, toRadarScores, makeDetailRows } from "../utils/vsscore.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function VsPage() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/v1/etfs")
      .then((r) => r.json())
      .then((json) => setData(Array.isArray(json) ? json : []))
      .catch((e) => setErr(e?.message || "데이터 로드 실패"))
      .finally(() => setLoading(false));
  }, []);

  const options = useMemo(
    () => data.map((e) => ({ label: `${e.itemname} (${e.itemcode})`, value: e.itemcode })),
    [data]
  );

  const [codeA, setCodeA] = useState("");
  const [codeB, setCodeB] = useState("");

  useEffect(() => {
    if (!options.length) return;
    const qa = sp.get("A");
    const qb = sp.get("B");
    const has = (v) => options.some((o) => o.value === v);

    if (qa && has(qa)) setCodeA(qa);
    if (qb && has(qb)) setCodeB(qb);

    if (!qa && !qb) {
      if (options.length >= 2) {
        setCodeA(options[0].value);
        setCodeB(options[1].value);
      } else if (options.length === 1) {
        setCodeA(options[0].value);
        setCodeB(options[0].value);
      }
    }
  }, [options, sp]);

  const etfA = useMemo(() => data.find((x) => x.itemcode === codeA) ?? {}, [data, codeA]);
  const etfB = useMemo(() => data.find((x) => x.itemcode === codeB) ?? {}, [data, codeB]);

  useEffect(() => {
    if (codeA && codeA === codeB && options.length > 1) {
      const next = options.find((o) => o.value !== codeA)?.value;
      if (next) setCodeB(next);
    }
  }, [codeA, codeB, options]);

  const { a: scoresA, b: scoresB } = useMemo(() => toRadarScores(etfA, etfB), [etfA, etfB]);

  const nameA = useMemo(() => etfA.itemname || "ETF A", [etfA.itemname]);
  const nameB = useMemo(() => etfB.itemname || "ETF B", [etfB.itemname]);

  const radarData = useMemo(
    () => ({
      labels: AXES,
      datasets: [
        {
          id: "A",
          label: nameA,
          data: scoresA,
          fill: true,
          backgroundColor: "rgba(59,130,246,0.20)",
          borderColor: "rgb(59,130,246)",
          pointBackgroundColor: "rgb(59,130,246)",
        },
        {
          id: "B",
          label: nameB,
          data: scoresB,
          fill: true,
          backgroundColor: "rgba(239,68,68,0.18)",
          borderColor: "rgb(239,68,68)",
          pointBackgroundColor: "rgb(239,68,68)",
        },
      ],
    }),
    [scoresA, scoresB, nameA, nameB]
  );

  const radarOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "top" } },
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 5,
          ticks: { stepSize: 1, showLabelBackdrop: false },
          grid: { color: "rgba(0,0,0,0.12)" },
          angleLines: { color: "rgba(0,0,0,0.12)" },
          pointLabels: { font: { size: 13 } },
        },
      },
    }),
    []
  );

  const detailRows = useMemo(() => makeDetailRows(etfA, etfB), [etfA, etfB]);

  const summary = useMemo(
    () =>
      detailRows.map(({ k, a, b }) => {
        const av = Number(a);
        const bv = Number(b);
        if (!Number.isFinite(av) || !Number.isFinite(bv)) return { k, better: "비교불가" };
        const isLowerBetter = k === "수수료" || k === "괴리율";
        let better;
        if (isLowerBetter) {
          better = av < bv ? nameA : av > bv ? nameB : "동일";
        } else {
          better = av > bv ? nameA : av < bv ? nameB : "동일";
        }
        return { k, better };
      }),
    [detailRows, nameA, nameB]
  );

  const goBack = () => {
    if (window.history.length > 2) nav(-2);
    else if (window.history.length > 1) nav(-1);
    else nav("/chart");
  };

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: 1200, marginTop: 24 }}>
        <div className="vs-toolbar">
          <Button variant="ghost" onClick={goBack}>← 뒤로</Button>
        </div>
        <Card title="ETF Radar 비교">불러오는 중…</Card>
      </div>
    );
  }

  if (err || !data.length) {
    return (
      <div className="container" style={{ maxWidth: 1200, marginTop: 24 }}>
        <div className="vs-toolbar">
          <Button variant="ghost" onClick={goBack}>← 뒤로</Button>
        </div>
        <Card title="ETF Radar 비교">{err || "표시할 데이터가 없습니다."}</Card>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 1200, marginTop: 24 }}>
      <div className="vs-toolbar">
        <Button variant="ghost" onClick={goBack}>← 뒤로</Button>
      </div>

      <div className="vs-banner">
        <div>
          <strong>{nameA}</strong>
          <span style={{ color: "#6b7280" }}> ({etfA.itemcode})</span>
        </div>
        <div>
          <strong>{nameB}</strong>
          <span style={{ color: "#6b7280" }}> ({etfB.itemcode})</span>
        </div>
      </div>

      <div className="vs-grid vs-grid--stack">
        <Card title="ETF Radar 비교">
          <div className="radar-wrap">
            <Radar datasetIdKey="id" data={radarData} options={radarOptions} />
          </div>
        </Card>

        <Card title="결과보기" style={{ marginTop: 16 }}>
          <ul className="vs-summary">
            {summary.map(({ k, better }) => {
              let color = "#000";
              if (better === nameA) color = "#3b82f6";
              else if (better === nameB) color = "#ef4444";
              return (
                <li key={k}>
                  {k}: <strong style={{ color }}>{better}</strong> 우위
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card title="지표 상세 비교">
        <div style={{ overflowX: "auto" }}>
          <table className="vs-table">
            <thead>
              <tr>
                <th>지표</th>
                <th>{nameA}</th>
                <th>{nameB}</th>
              </tr>
            </thead>
            <tbody>
              {detailRows.map((r) => (
                <tr key={r.k}>
                  <td>{r.k}</td>
                  <td>{r.a == null ? "-" : `${formatMetric(r.a)}${r.unit ? ` ${r.unit}` : ""}`}</td>
                  <td>{r.b == null ? "-" : `${formatMetric(r.b)}${r.unit ? ` ${r.unit}` : ""}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
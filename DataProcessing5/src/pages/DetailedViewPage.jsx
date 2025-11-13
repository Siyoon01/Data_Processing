
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components";

export default function DetailedViewPage() {
    const { viewId } = useParams(); // itemcode
    const nav = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("/api/v1/etfs")
        .then((res) => res.json())
        .then((json) => {
            const found = Array.isArray(json) ? json.find((x) => x.itemcode === viewId) : null;
            setData(found ?? null);
        })
        .catch((err) => {
            console.error("데이터 로드 실패:", err);
            setData(null);
        })
        .finally(() => setLoading(false));
    }, [viewId]);

    const fmtNum = (v) => (v == null || Number.isNaN(Number(v)) ? "–" : Number(v).toLocaleString());
    const fmtPct = (v, opts = { hundred: false }) => {
        if (v == null || Number.isNaN(Number(v))) return "–";
        const num = Number(v);
        const shown = opts.hundred ? num * 100 : num; // changeRate는 0.015 -> 1.5%
        return `${shown.toFixed(2)}%`;
    };

    return (
        <div className="page">
            <div className="toolbar">
                <Button variant="ghost" onClick={() => nav(-1)}>← 뒤로</Button>
            </div>

            <h2 className="sub-title">ETF 상세 정보</h2>

            {loading ? (
                <p className="muted">불러오는 중…</p>
            ) : !data ? (
                <p className="muted">데이터를 가져오지 못했습니다.</p>
            ) : (
                <div className="detail-wide">
                    {/* 상단 : ETF 이름 */}
                    <section className="section-top">
                        <h1 className="etf-name">{data.itemname ?? "이름 없음"}</h1>
                    </section>

                    {/* 중단 : ETF 분류 + 자산운용사 */}
                    <section className="section-mid">
                        <div className="kv2">
                            <div className="kv-label">테마</div>
                            <div className="kv-value">{data.theme || "정보 없음"}</div>

                            <div className="kv-label">자산운용사</div>
                            <div className="kv-value">{data.manager || "정보 없음"}</div>
                        </div>
                    </section>

                    {/* 하단 : 수치 정보 (null 안전 처리) */}
                    <section className="section-bottom">
                        <div className="kv2">
                            <div className="kv-label">주가</div>
                            <div className="kv-value">{fmtNum(data.nowVal)}</div>

                            <div className="kv-label">시가총액</div>
                            <div className="kv-value">{fmtNum(data.marketSum)}</div>

                            <div className="kv-label">거래량</div>
                            <div className="kv-value">{fmtNum(data.quant)}</div>

                            <div className="kv-label">NAV</div>
                            <div className="kv-value">{fmtNum(data.nav)}</div>

                            <div className="kv-label">괴리율</div>
                            <div className="kv-value">{fmtPct(data.changeRate, { hundred: true })}</div>

                            <div className="kv-label">3개월 수익률</div>
                            <div className="kv-value">{fmtPct(data.threeMonthEarnRate)}</div>

                            <div className="kv-label">배당수익률</div>
                            <div className="kv-value">{fmtPct(data.dividendYield)}</div>

                            <div className="kv-label">수수료</div>
                            <div className="kv-value">{fmtPct(data.expenseRatio)}</div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

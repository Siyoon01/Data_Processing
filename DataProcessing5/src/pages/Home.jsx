import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from '../components';


export default function Home() {
  const nav = useNavigate();

  return (
    <div className="page">
      <h1 className="page-title">ETF 비교 & 추천</h1>

      <div className="container grid-2 grid-equal">
        <Card title="ETF 비교" className="home">
          <p className="muted">ETF의 분류, 세부 정보 별로 비교해보세요!</p>
          <div className="card-actions">
            <Button onClick={() => nav("/chart")}>ETF 순위 비교하기</Button>
          </div>
        </Card>

        <Card title="ETF 추천" className="home">
          <p className="muted">자신의 투자 성향에 잘 맞는 ETF를 찾아보세요!</p>
          <div className="card-actions">
            <Button onClick={() => nav("/recommend")}>ETF 추천 받기</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
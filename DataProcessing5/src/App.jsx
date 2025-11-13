import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ChartPage from "./pages/ChartPage.jsx";
import RecommendPage from "./pages/RecommendPage.jsx";
import DetailedViewPage from "./pages/DetailedViewPage.jsx";
import VsPage from "./pages/vspage.jsx";

export default function App() {
    useEffect(() => {
        document.title = "ETF 인사이트";
    }, []);
    return (
        <div className="app-root">
            <header className="app-header">
                <div className="container header-inner">
                    <Link to="/" className="brand">ETF 인사이트</Link>
                    <nav className="nav">
                        <Link to="/chart" className="nav-link">Chart</Link>
                        <Link to="/recommend" className="nav-link">Recommend</Link>
                    </nav>
                </div>
            </header>
            <main className="container main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chart" element={<ChartPage />} />
                    <Route path="/recommend" element={<RecommendPage />} />
                    <Route path="/detailedview/:viewId" element={<DetailedViewPage />} />
                    <Route path="/vs" element={<VsPage />} />
                </Routes>
            </main>
            <footer className="app-footer">
                <div className="container">© 2025 데이터 처리 프로그래밍 5조</div>
            </footer>
        </div>
    );

}

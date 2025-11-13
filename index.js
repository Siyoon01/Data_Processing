// 필요한 모듈: express, axios
// 설치: npm install express axios
const express = require('express');
const axios = require('axios');
const fs = require('fs').promises; // 'etfMaster.json' 파일을 읽기 위함
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// JSON 파일 경로
const masterFilePath = path.join(__dirname, 'etfMaster.json');

// Naver API 자격 증명 (사전 준비에서 받은 값)
const NAVER_CLIENT_ID = ''; // <--- 여기에 발급받은 ID 입력
const NAVER_CLIENT_SECRET = ''; // <--- 여기에 발급받은 Secret 입력

/**
 * Naver API에서 실시간 ETF 데이터를 가져오는 함수
 */
async function getLiveData() {
    const url = 'https://finance.naver.com/api/sise/etfItemList.nhn';
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    });
    return response.data.result.etfItemList;
}

/**
 * 마스터 데이터와 실시간 데이터를 조합하는 공통 함수
 */
async function getCombinedEtfData() {
    // 두 작업을 동시에 병렬로 실행
    const [liveDataList, masterFile] = await Promise.all([
        getLiveData(),
        fs.readFile(masterFilePath, 'utf-8')
    ]);

    const masterDataList = JSON.parse(masterFile);
    
    // 실시간 데이터를 { itemcode: data } 형태의 Map으로 변환 (검색 속도 향상)
    const liveDataMap = new Map();
    for (const item of liveDataList) {
        liveDataMap.set(item.itemcode, item);
    }

    // 마스터 리스트를 기준으로 데이터 조합
    return masterDataList.map(masterItem => {
        const liveItem = liveDataMap.get(masterItem.itemcode);

        if (!liveItem) {
            return {
                ...masterItem,
                nowVal: null,
                marketSum: null,
                threeMonthEarnRate: null,
                quant: null,
                nav: null,
                changeRate: null
            };
        }

        // 프론트엔드에 보낼 최종 JSON 객체
        return {
            itemcode: masterItem.itemcode,
            itemname: masterItem.itemname,
            theme: masterItem.theme,
            manager: masterItem.manager,
            dividendYield: masterItem.dividendYield,  // (마스터)
            expenseRatio: masterItem.expenseRatio,  // (마스터)
            nowVal: liveItem.nowVal,                  // (실시간)
            marketSum: liveItem.marketSum,            // (실시간)
            threeMonthEarnRate: liveItem.threeMonthEarnRate, // (실시간)
            quant: liveItem.quant,                    // (실시간)
            nav: liveItem.nav,                        // (실시간, 순자산가치)
            changeRate: liveItem.changeRate           // (실시간, 등락률)
        };
    });
}

// ---------------------------------------------------
// API 엔드포인트 1: 메인 페이지 (전체 ETF 리스트)
// [GET] /api/v1/etfs
// ---------------------------------------------------
app.get('/api/v1/etfs', async (req, res) => {
    try {
        const combinedData = await getCombinedEtfData();
        res.json(combinedData); // React에게 최종 데이터 전송

    } catch (error) {
        console.error("Error in /api/v1/etfs:", error.message);
        res.status(500).json({ error: "ETF 데이터 처리 중 오류 발생" });
    }
});

// ---------------------------------------------------
// API 엔드포인트 2: '추천 기준' 적용 (수정됨)
// [GET] /api/v1/etfs/recommend?theme=반도체
// ---------------------------------------------------
app.get('/api/v1/etfs/recommend', async (req, res) => {
    // 1. 쿼리 파라미터에서 'theme'만 가져옴
    const { theme } = req.query;

    // Step 1: 테마 선택 (필수)
    if (!theme) {
        return res.status(400).json({ error: "테마(theme) 쿼리 파라미터가 필요합니다." });
    }

    try {
        // 2. 기본 데이터 가져오기
        const allData = await getCombinedEtfData();

        // 3. 새로운 추천 기준 5단계 필터링
        const recommendedEtfs = allData.filter(etf => {
            
            // Step 1: 테마 필터 (사용자 선택)
            const step1 = etf.theme === theme;

            // Step 2: 시가총액 >= 1000억
            // (null이 아닌지 확인하고 비교)
            const step2 = etf.marketSum !== null && etf.marketSum >= 1000;

            // Step 3: 거래량 >= 50만주
            const step3 = etf.quant !== null && etf.quant >= 500000;

            // Step 4: 배당수익률 >= 0.5%
            const step4 = etf.dividendYield !== null && etf.dividendYield >= 0.5;

            // Step 5: 수수료 < 0.45%
            const step5 = etf.expenseRatio !== null && etf.expenseRatio < 0.45;

            // 모든 조건을 만족해야 함
            return step1 && step2 && step3 && step4 && step5;
        });

        // 4. 필터링된 최종 결과 전송 (결과가 0개일 수도 있음)
        res.json(recommendedEtfs);

    } catch (error) {
        console.error("Error in /api/v1/recommend:", error.message);
        res.status(500).json({ error: "ETF 필터링 중 오류 발생" });
    }
});


// ---------------------------------------------------
// API 엔드포인트 3: '테마' 관련 실시간 뉴스
// [GET] /api/v1/news?theme=반도체
// ---------------------------------------------------
app.get('/api/v1/news', async (req, res) => {
    const { theme } = req.query; 

    if (!theme) {
        return res.status(400).json({ error: "테마(theme) 쿼리 파라미터가 필요합니다." });
    }

    const searchQuery = `${theme} ETF`;
    const url = 'https://openapi.naver.com/v1/search/news.json';

    try {
        const response = await axios.get(url, {
            params: {
                query: searchQuery,
                display: 5,       
                sort: 'sim'        
            },
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
            }
        });

        const cleanedNews = response.data.items.map(item => ({
            title: item.title.replace(/<[^>]*>?/g, ""), 
            link: item.link,
            description: item.description.replace(/<[^>]*>?/g, ""), 
            pubDate: item.pubDate
        }));

        res.json(cleanedNews);

    } catch (error) {
        console.error("Naver News API 호출 중 오류:", error.message);
        res.status(500).json({ error: "뉴스 데이터를 가져오는 데 실패했습니다." });
    }
});


// ---------------------------------------------------
// 서버 실행
// ---------------------------------------------------
app.listen(PORT, () => {
    console.log(`ETF 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log("마스터 JSON 파일 로드 경로:", masterFilePath);
});

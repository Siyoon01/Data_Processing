import { useEffect, useState, useCallback } from "react";
import { getJson } from "../services/api";

/**
 * ETF API(`/api/v1/etfs`) 등 JSON을 불러오고 배열/객체를 그대로 반환.
 * 실패하면 data는 null, error에 이유가 담김.
 */
export default function useDataJson(url = "/api/v1/etfs") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await getJson(url);
      setData(json ?? null);
    } catch (e) {
      setError(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

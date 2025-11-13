import { useEffect, useState } from "react";

/** 로컬스토리지와 상태를 동기화 */
export default function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // 저장 실패는 무시
    }
  }, [key, state]);

  return [state, setState];
}

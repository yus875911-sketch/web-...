import { useCallback, useEffect, useState } from "react";

/** 订阅 localStorage 模拟数据的变化 */
export function useStoreValue<T>(getter: () => T): [T, () => void] {
  const [value, setValue] = useState<T>(getter);
  const refresh = useCallback(() => setValue(getter()), [getter]);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("lg-store", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("lg-store", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  return [value, refresh];
}

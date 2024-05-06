import { useEffect } from "react";

const useEvent = (type: string, cb: (...args: any) => void) => {
  useEffect(() => {
    if (import.meta.env.DEV) return;

    window.alt.on(type, cb);

    return () => window.alt.off(type, cb);
  }, []);
};

export default useEvent;

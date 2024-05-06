/// <reference types="vite/client" />

interface Window {
  alt: {
    on: (type: string, cb: (...args: any) => void) => void;
    off: (type: string, cb: (...args: any) => void) => void;
    emit: (type: string, ...args: any) => void;
  };
}

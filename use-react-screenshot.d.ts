declare module 'use-react-screenshot' {
  
    export function useScreenshot<T extends HTMLElement>(): [
      string | null,
      (node: T | null) => Promise<string>
    ];
  }
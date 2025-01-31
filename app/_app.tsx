import { AppProps } from 'next/app';
import { useEffect, createContext } from 'react';
import { useLiff } from '@/hooks/useLiff';

// LIFFコンテキストの作成
export const LiffContext = createContext<ReturnType<typeof useLiff> | null>(null);

export default function App({ Component, pageProps }: AppProps) {
  const liffHook = useLiff();

  // エラーハンドリング
  useEffect(() => {
    if (liffHook.error) {
      console.error('LIFF Error:', liffHook.error);
    }
  }, [liffHook.error]);

  return (
    <LiffContext.Provider value={liffHook}>
      <Component {...pageProps} />
    </LiffContext.Provider>
  );
}

import { useEffect, useState } from 'react';
import liff from '@line/liff';

export const useLiff = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID!, debug: true });
        
        // ログイン状態を確認
        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          // ユーザープロフィールを取得
          const profile = await liff.getProfile();
          setUserProfile(profile);
        }
      } catch (err) {
        console.error('LIFF initialization failed', err);
        setError(err as Error);
      }
    };

    initLiff();
  }, []);

  const login = async () => {
    if (!liff.isLoggedIn()) {
      try {
        await liff.login();
      } catch (err) {
        console.error('LIFF login failed', err);
        setError(err as Error);
      }
    }
  };

  const logout = async () => {
    if (liff.isLoggedIn()) {
      try {
        await liff.logout();
        setIsLoggedIn(false);
        setUserProfile(null);
      } catch (err) {
        console.error('LIFF logout failed', err);
        setError(err as Error);
      }
    }
  };

  return {
    isLoggedIn,
    userProfile,
    error,
    login,
    logout,
    liff
  };
};

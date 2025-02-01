import liff from '@line/liff';
import { useAuthStore } from '../store/auth';

export const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

// 開発環境用のモックユーザー
const mockUser = {
  id: 'mock-user-id',
  displayName: '開発ユーザー',
  pictureUrl: 'https://via.placeholder.com/150',
  statusMessage: 'This is a mock user for development',
};

export const initializeLiff = async (): Promise<void> => {
  const auth = useAuthStore.getState();
  
  try {
    auth.setLoading(true);

    // 開発環境でLIFF IDが設定されていない場合はモックユーザーを使用
    if (!liffId || process.env.NODE_ENV === 'development') {
      console.log('Using mock user for development');
      auth.setUser(mockUser); // 即座にユーザーを設定
      return;
    }

    await liff.init({ liffId });
    
    if (!liff.isInClient() && !liff.isLoggedIn()) {
      await liff.login();
    }

    const user = await liff.getProfile();
    
    // ユーザー情報をSupabaseに保存
    try {
      const response = await fetch('/api/auth/line', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line_user_id: user.userId,
          display_name: user.displayName,
          picture_url: user.pictureUrl,
          status_message: user.statusMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }
    } catch (error) {
      console.error('Failed to save user data:', error);
    }

    auth.setUser({
      id: user.userId,
      displayName: user.displayName,
      pictureUrl: user.pictureUrl,
      statusMessage: user.statusMessage,
    });
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    auth.setError(error instanceof Error ? error.message : 'LIFF initialization failed');
  }
};

export const logout = async (): Promise<void> => {
  if (!liffId || process.env.NODE_ENV === 'development') {
    useAuthStore.getState().logout();
    return;
  }

  if (!liff.isInClient()) {
    await liff.logout();
  }
  useAuthStore.getState().logout();
};

export const isLoggedIn = (): boolean => {
  if (!liffId || process.env.NODE_ENV === 'development') {
    return useAuthStore.getState().user !== null;
  }
  return liff.isLoggedIn();
};

export const getAccessToken = (): string | null => {
  if (!liffId || process.env.NODE_ENV === 'development') {
    return 'mock-access-token';
  }
  try {
    return liff.getAccessToken();
  } catch {
    return null;
  }
};

export const getIdToken = (): string | null => {
  if (!liffId || process.env.NODE_ENV === 'development') {
    return 'mock-id-token';
  }
  try {
    return liff.getIDToken();
  } catch {
    return null;
  }
};

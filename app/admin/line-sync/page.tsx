'use client';

import { useEffect, useState } from 'react';
import { initializeLiff } from '@/lib/liff';

export default function LineSyncPage() {
  const [status, setStatus] = useState<string>('準備中...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUsers = async () => {
      try {
        setStatus('LIFFを初期化中...');
        const liff = await initializeLiff();
        
        setStatus('ログイン状態を確認中...');
        if (!liff.isLoggedIn()) {
          setStatus('LINEログインが必要です');
          liff.login();
          return;
        }

        setStatus('プロフィール情報を取得中...');
        const profile = await liff.getProfile();

        setStatus('データベースに保存中...');
        const response = await fetch('/api/auth/line', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage,
          }),
        });

        if (!response.ok) {
          throw new Error('ユーザー情報の保存に失敗しました');
        }

        setStatus('完了！ユーザー情報を保存しました');
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        setStatus('エラーが発生しました');
      }
    };

    syncUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            LINEユーザー同期
          </h1>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <p className="text-xl font-semibold text-gray-700">
                {status}
              </p>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

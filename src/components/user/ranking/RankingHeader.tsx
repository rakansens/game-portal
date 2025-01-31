'use client';

export function RankingHeader() {
  return (
    <div className="mb-8">
      <h1 className="mb-4 text-center text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        クエストランキング
      </h1>
      <div className="text-center text-gray-400 text-sm">
        <p>ポイントを集めて上位を目指そう！</p>
        <p className="mt-1">毎週月曜日 0:00に更新されます</p>
      </div>
    </div>
  );
}

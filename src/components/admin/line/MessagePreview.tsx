import { MessageSquare, Image } from 'lucide-react';

interface Message {
  type: 'text' | 'image';
  text?: string;
  imageUrl?: string;
}

interface MessagePreviewProps {
  messages: Message[];
  userName?: string;
}

export const MessagePreview = ({ messages, userName = 'ユーザー' }: MessagePreviewProps) => {
  return (
    <div className="w-[320px] h-[600px] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
      {/* ヘッダー */}
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center">
        <button className="p-1" onClick={() => {}}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="ml-4">
          <div className="font-medium">{userName}</div>
          <div className="text-xs text-gray-400">プレビュー</div>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="h-[calc(100%-120px)] bg-white px-4 py-6 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex justify-end">
            <div className="max-w-[70%]">
              {message.type === 'text' && message.text && (
                <div className="bg-green-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 break-words">
                  {message.text}
                </div>
              )}
              {message.type === 'image' && message.imageUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={message.imageUrl}
                    alt="送信画像"
                    className="max-w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNhYWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                    }}
                  />
                </div>
              )}
              <div className="text-xs text-gray-500 text-right mt-1">
                {new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* フッター */}
      <div className="h-[60px] bg-gray-100 border-t flex items-center px-4">
        <div className="flex-1 bg-white rounded-full h-10 flex items-center px-4 text-gray-400">
          プレビューモード
        </div>
      </div>
    </div>
  );
};
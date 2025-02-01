import { NextResponse } from 'next/server';

interface MessageRequest {
  type: string;
  text?: string;
  imageUrl?: string;
  targetUserIds?: string[];
}

export async function POST(request: Request) {
  try {
    const data: MessageRequest = await request.json();
    
    // LINE Messaging APIのエンドポイント
    const url = 'https://api.line.me/v2/bot/message/push';
    
    // メッセージの内容を構築
    let messages = [];
    
    switch (data.type) {
      case 'text':
        messages.push({
          type: 'text',
          text: data.text
        });
        break;
        
      case 'image':
        messages.push({
          type: 'image',
          originalContentUrl: data.imageUrl,
          previewImageUrl: data.imageUrl
        });
        break;
        
      case 'template':
        messages.push({
          type: 'template',
          altText: 'テンプレートメッセージ',
          template: {
            type: 'buttons',
            text: data.text,
            actions: [
              {
                type: 'message',
                label: 'アクション1',
                text: 'アクション1が選択されました'
              }
            ]
          }
        });
        break;
        
      case 'flex':
        messages.push({
          type: 'flex',
          altText: 'Flexメッセージ',
          contents: {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: data.text || 'Flexメッセージ',
                  wrap: true
                }
              ]
            }
          }
        });
        break;
    }

    // 送信処理
    let response;
    if (data.type === 'broadcast') {
      // 全員に送信
      response = await fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({ messages })
      });
    } else if (data.type === 'multicast' && data.targetUserIds?.length) {
      // 複数ユーザーに送信
      response = await fetch('https://api.line.me/v2/bot/message/multicast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          to: data.targetUserIds,
          messages
        })
      });
    } else {
      // 個別に送信
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          to: data.targetUserIds?.[0],
          messages
        })
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    // 送信ログをデータベースに保存（後で実装）
    // await saveMessageLog(data, messages);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'メッセージの送信に失敗しました' },
      { status: 500 }
    );
  }
}

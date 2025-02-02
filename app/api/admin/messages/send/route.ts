import { NextResponse } from 'next/server';

interface MessageRequest {
  type: string;
  text?: string;
  imageUrl?: string;
  targetUserIds?: string[];
}

export async function POST(request: Request) {
  try {
    // LINE Channel Access Tokenの確認
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'LINE Channel Access Tokenが設定されていません' },
        { status: 500 }
      );
    }

    const data: MessageRequest = await request.json();
    console.log('Received request data:', data);
    
    // メッセージのバリデーション
    if (data.type !== 'image' && (!data.text || data.text.trim() === '')) {
      return NextResponse.json(
        { error: 'メッセージの内容を入力してください' },
        { status: 400 }
      );
    }

    if (data.type === 'image' && (!data.imageUrl || !data.imageUrl.startsWith('https://'))) {
      return NextResponse.json(
        { error: '有効な画像URLを入力してください' },
        { status: 400 }
      );
    }
    
    // LINE Messaging APIのエンドポイント
    const url = 'https://api.line.me/v2/bot/message/push';
    
    // メッセージの内容を構築
    let messages = [];
    
    // メッセージが空でないことを確認
    if (!data.text && data.type !== 'image') {
      return NextResponse.json(
        { error: 'メッセージの内容を入力してください' },
        { status: 400 }
      );
    }
    
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

    console.log('Constructed messages:', messages);

    // 送信処理
    let response;
    if (data.type === 'broadcast') {
      // 全員に送信
      const requestBody = { messages };
      console.log('Sending broadcast request:', requestBody);
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
      const requestBody = { to: data.targetUserIds, messages };
      console.log('Sending multicast request:', requestBody);
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
      if (!data.targetUserIds?.[0]) {
        return NextResponse.json(
          { error: '送信先ユーザーを選択してください' },
          { status: 400 }
        );
      }

      const requestBody = { to: data.targetUserIds[0], messages };
      console.log('Sending push request:', requestBody);
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify(requestBody)
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('LINE API Error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'LINEメッセージの送信に失敗しました' },
        { status: response.status }
      );
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

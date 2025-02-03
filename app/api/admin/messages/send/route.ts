import { NextResponse } from 'next/server';

interface Message {
  type: 'text' | 'image';
  text?: string;
  imageUrl?: string;
}

interface MessageRequest {
  messages: Message[];
  targetUserIds: string[];
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
    if (!data.messages || data.messages.length === 0) {
      return NextResponse.json(
        { error: 'メッセージを入力してください' },
        { status: 400 }
      );
    }

    // 各メッセージのバリデーション
    for (const message of data.messages) {
      if (message.type === 'text' && (!message.text || message.text.trim() === '')) {
        return NextResponse.json(
          { error: 'テキストメッセージの内容を入力してください' },
          { status: 400 }
        );
      }

      if (message.type === 'image' && (!message.imageUrl || !message.imageUrl.startsWith('https://'))) {
        return NextResponse.json(
          { error: '有効な画像URLを入力してください' },
          { status: 400 }
        );
      }
    }

    // 送信先ユーザーのバリデーション
    if (!data.targetUserIds || data.targetUserIds.length === 0) {
      return NextResponse.json(
        { error: '送信先ユーザーを選択してください' },
        { status: 400 }
      );
    }

    // LINE Messaging APIのエンドポイント
    const url = 'https://api.line.me/v2/bot/message/multicast';

    // メッセージの変換
    const lineMessages = data.messages.map(message => {
      if (message.type === 'text') {
        return {
          type: 'text',
          text: message.text
        };
      } else {
        return {
          type: 'image',
          originalContentUrl: message.imageUrl,
          previewImageUrl: message.imageUrl
        };
      }
    });

    // LINE Messaging APIへのリクエスト
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        to: data.targetUserIds,
        messages: lineMessages
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('LINE API error:', error);
      throw new Error(error.message || 'Failed to send message');
    }

    // 送信ログの保存
    const { supabaseAdmin } = await import('@/lib/supabase-admin');
    
    // メッセージグループを作成
    const { data: group, error: groupError } = await supabaseAdmin
      .from('message_groups')
      .insert({
        target_users: data.targetUserIds.map(id => ({ id })),
        status: 'success',
        is_broadcast: false
      })
      .select()
      .single();

    if (groupError) {
      console.error('Error creating message group:', groupError);
      throw new Error('Failed to save message logs');
    }

    // 各メッセージを保存
    const messagePromises = data.messages.map(message =>
      supabaseAdmin
        .from('message_logs')
        .insert({
          message_type: message.type,
          message_content: message.type === 'text' ? { text: message.text } : { imageUrl: message.imageUrl },
          group_id: group.id,
          status: 'success'
        })
    );

    await Promise.all(messagePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'メッセージの送信に失敗しました' },
      { status: 500 }
    );
  }
}

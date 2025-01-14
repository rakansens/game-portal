-- テーブルのクリーンアップ
TRUNCATE TABLE public.quests CASCADE;

-- サンプルデータの挿入
INSERT INTO public.quests (
    title,
    description,
    points,
    required_points,
    participants_limit,
    start_date,
    end_date
) VALUES
(
    'Twitterでフォロー',
    '公式Twitterアカウントをフォローしよう',
    100,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '7 days'
),
(
    'Discordに参加',
    'コミュニティDiscordサーバーに参加しよう',
    150,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '14 days'
),
(
    'デイリーチェックイン',
    '毎日ログインして報酬をゲット',
    50,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '30 days'
),
(
    'コミュニティチャレンジ',
    'コミュニティメンバーと協力してタスクを達成しよう',
    300,
    100,
    100,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '10 days'
),
(
    'リミテッドイベント',
    '期間限定の特別なイベントに参加しよう',
    500,
    200,
    50,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '3 days'
);

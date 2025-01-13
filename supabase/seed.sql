-- テーブルのクリーンアップ
TRUNCATE TABLE public.quests CASCADE;

-- サンプルデータの挿入
INSERT INTO public.quests (
    title,
    description,
    type,
    platform,
    difficulty,
    points,
    required_points,
    participants_limit,
    start_date,
    end_date,
    status,
    order_position
) VALUES
(
    'Twitterでフォロー',
    '公式Twitterアカウントをフォローしよう',
    'normal',
    'twitter',
    1,  -- easy
    100,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    'active',
    1
),
(
    'Discordに参加',
    'コミュニティDiscordサーバーに参加しよう',
    'normal',
    'discord',
    1,  -- easy
    150,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '14 days',
    'active',
    2
),
(
    'デイリーチェックイン',
    '毎日ログインして報酬をゲット',
    'normal',
    'other',
    1,  -- easy
    50,
    0,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    'active',
    3
),
(
    'コミュニティチャレンジ',
    'コミュニティメンバーと協力してタスクを達成しよう',
    'special',
    'discord',
    2,  -- medium
    300,
    100,
    100,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '10 days',
    'active',
    4
),
(
    'リミテッドイベント',
    '期間限定の特別なイベントに参加しよう',
    'limited_time',
    'other',
    3,  -- hard
    500,
    200,
    50,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '3 days',
    'active',
    5
);

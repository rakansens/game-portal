-- テストデータの挿入
INSERT INTO public.quests (
  id,
  title,
  description,
  type,
  platform,
  points,
  status,
  difficulty,
  is_important,
  is_limited,
  category,
  tags,
  exp_reward,
  is_active,
  estimated_time,
  required_points,
  auto_progress,
  verification_required,
  participant_count,
  completion_rate
) VALUES
(
  gen_random_uuid(),
  '初心者向けチュートリアル',
  'ゲームポータルの基本的な機能を学ぶクエストです。詳細な説明や達成条件などがここに表示されます。',
  'TUTORIAL',
  'WEB',
  100,
  'ACTIVE',
  1,
  true,
  false,
  'チュートリアル',
  ARRAY['初心者向け', '基本'],
  100,
  true,
  30,
  0,
  true,
  false,
  0,
  0.0
),
(
  gen_random_uuid(),
  '中級者チャレンジ',
  'より高度な課題に挑戦するクエストです。様々なスキルを組み合わせて解決する必要があります。',
  'CHALLENGE',
  'WEB',
  300,
  'ACTIVE',
  3,
  false,
  false,
  'チャレンジ',
  ARRAY['中級者向け', '技術'],
  300,
  true,
  60,
  100,
  false,
  true,
  0,
  0.0
),
(
  gen_random_uuid(),
  '上級者ミッション',
  '最も難しい課題に挑戦する上級者向けクエストです。高度な知識とスキルが要求されます。',
  'MISSION',
  'WEB',
  500,
  'ACTIVE',
  5,
  false,
  true,
  'ミッション',
  ARRAY['上級者向け', '挑戦'],
  500,
  true,
  120,
  300,
  false,
  true,
  0,
  0.0
);

-- 既存のクエストの進捗状況をリセット
UPDATE public.quests
SET participant_count = 0,
    completion_rate = 0.0
WHERE status = 'ACTIVE';

-- クエストの順序を設定
UPDATE public.quests
SET order_position = CASE
  WHEN type = 'TUTORIAL' THEN 1
  WHEN type = 'CHALLENGE' THEN 2
  WHEN type = 'MISSION' THEN 3
  ELSE 999
END
WHERE status = 'ACTIVE';
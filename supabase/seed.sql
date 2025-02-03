-- ユーザーのモックデータを追加
INSERT INTO users (line_user_id, display_name, picture_url, total_points) VALUES
('U1234567890abcdef1', 'たろう', 'https://example.com/avatar1.jpg', 1500),
('U1234567890abcdef2', 'はなこ', 'https://example.com/avatar2.jpg', 1200),
('U1234567890abcdef3', 'けんじ', 'https://example.com/avatar3.jpg', 1000),
('U1234567890abcdef4', 'さくら', 'https://example.com/avatar4.jpg', 800),
('U1234567890abcdef5', 'ゆうた', 'https://example.com/avatar5.jpg', 700),
('U1234567890abcdef6', 'あやか', 'https://example.com/avatar6.jpg', 600),
('U1234567890abcdef7', 'りょう', 'https://example.com/avatar7.jpg', 500),
('U1234567890abcdef8', 'みさき', 'https://example.com/avatar8.jpg', 400),
('U1234567890abcdef9', 'かずき', 'https://example.com/avatar9.jpg', 300),
('U1234567890abcdef0', 'まなみ', 'https://example.com/avatar10.jpg', 200);

-- クエスト完了のモックデータを追加
INSERT INTO quests (id, title, description, points) VALUES
('Q1', 'はじめてのクエスト', 'チュートリアルを完了しよう', 100),
('Q2', '探検家', '3つのエリアを探索しよう', 200),
('Q3', 'コレクター', '5つのアイテムを集めよう', 300);

-- クエスト進捗のモックデータを追加
INSERT INTO user_quests (user_id, quest_id, completed_at) VALUES
((SELECT id FROM users WHERE line_user_id = 'U1234567890abcdef1'), 'Q1', NOW()),
((SELECT id FROM users WHERE line_user_id = 'U1234567890abcdef1'), 'Q2', NOW()),
((SELECT id FROM users WHERE line_user_id = 'U1234567890abcdef1'), 'Q3', NOW()),
((SELECT id FROM users WHERE line_user_id = 'U1234567890abcdef2'), 'Q1', NOW()),
((SELECT id FROM users WHERE line_user_id = 'U1234567890abcdef2'), 'Q2', NOW()),
((SELECT id FROM users WHERE line_user_id = 'U1234567890abcdef3'), 'Q1', NOW());

# ディレクトリ構造の改善提案

## 現状の問題点

1. コンポーネントの重複
   - 同じ機能のコンポーネントが異なるディレクトリに存在
   - メンテナンスが困難で一貫性が保てない

2. 不適切なディレクトリ構造
   - ルーティングの重複
   - コンポーネントの分散

3. 役割の不明確さ
   - 共通コンポーネントと機能コンポーネントの境界が曖昧
   - 管理者/ユーザー機能の分離が不完全

## 改善案

```
app/
├── (admin)/                # 管理者用ルート
│   ├── layout.tsx         # 管理者用レイアウト
│   ├── page.tsx          # 管理者ダッシュボード
│   └── quests/           # クエスト管理
│       ├── page.tsx      # クエスト一覧
│       ├── new/          # 新規作成
│       └── [id]/         # 詳細・編集
├── (user)/                # ユーザー用ルート
│   ├── layout.tsx        # ユーザー用レイアウト
│   ├── page.tsx         # ホーム
│   └── quests/          # クエスト表示
│       ├── page.tsx     # クエスト一覧
│       └── [id]/        # 詳細表示
└── api/                   # API エンドポイント
    ├── admin/           # 管理者用API
    └── user/            # ユーザー用API

src/
├── components/
│   ├── shared/           # 共通コンポーネント
│   │   ├── ui/          # 基本UIコンポーネント
│   │   └── layout/      # 共通レイアウト
│   ├── admin/           # 管理者用コンポーネント
│   │   └── quests/      # クエスト管理UI
│   └── user/            # ユーザー用コンポーネント
│       └── quests/      # クエスト表示UI
├── features/            # 機能単位のロジック
│   ├── shared/         # 共通ロジック
│   ├── admin/          # 管理者用ロジック
│   └── user/           # ユーザー用ロジック
├── lib/                # ユーティリティ
│   ├── api/           # API関連
│   ├── supabase/      # Supabase関連
│   └── validations/   # バリデーション
└── types/             # 型定義

## 具体的な移行手順

1. ルーティングの整理
   - `app/quest` を `app/(user)/quests` に統合
   - 管理者/ユーザー用のルートを明確に分離

2. コンポーネントの整理
   - UIコンポーネントを `src/components/shared/ui` に集約
   - 機能コンポーネントを適切なディレクトリに移動
   ```
   # 移動例
   src/components/ui/admin/QuestTable → src/components/admin/quests/QuestTable
   src/components/ui/quest/QuestCard → src/components/user/quests/QuestCard
   ```

3. ロジックの整理
   - 共通ロジックを `features/shared` に集約
   - 管理者/ユーザー固有のロジックを分離

## 期待される効果

1. メンテナンス性の向上
   - コードの重複を削減
   - 責任範囲の明確化
   - 変更の影響範囲を最小化

2. 開発効率の向上
   - コンポーネントの再利用性向上
   - 機能の追加・変更が容易
   - チーム開発での理解促進

3. パフォーマンスの改善
   - 適切なコード分割
   - 効率的なバンドリング
   - 不要なコードの削減
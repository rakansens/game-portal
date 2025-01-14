# UIコンポーネントの構造改善提案

## 現状の問題点

1. 共通コンポーネントの重複
   - 基本的なUIコンポーネントが複数の場所に散在
   - メンテナンスが困難で一貫性が保てない

2. 責任範囲の不明確さ
   - 管理者用とユーザー用のコンポーネントの境界が曖昧
   - 共通ロジックの再利用が難しい

3. コンポーネントの分散
   - 同じ機能のコンポーネントが異なるディレクトリに存在
   - コードの重複が発生

## 改善案

```
src/
├── components/
│   ├── shared/              # 共通コンポーネント
│   │   ├── ui/             # 基本UIコンポーネント
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   └── Badge/
│   │   └── layout/         # 共通レイアウト
│   │       └── Footer/
│   ├── admin/              # 管理者用コンポーネント
│   │   ├── quests/        # クエスト管理
│   │   │   ├── QuestTable/
│   │   │   ├── QuestForm/
│   │   │   └── QuestFilters/
│   │   └── layout/        # 管理者用レイアウト
│   └── user/              # ユーザー用コンポーネント
│       ├── quests/        # クエスト表示
│       │   └── QuestCard/
│       └── layout/        # ユーザー用レイアウト
└── features/             # 機能単位のロジック
    ├── shared/           # 共通ロジック
    │   └── auth/
    ├── admin/           # 管理者用ロジック
    │   └── quests/
    └── user/            # ユーザー用ロジック
        └── quests/
```

## コンポーネントの責任分担

1. shared/ui/
   - 純粋なUIコンポーネント
   - ビジネスロジックを含まない
   - スタイリングとインタラクションのみ

2. shared/layout/
   - 共通レイアウト要素
   - ナビゲーションやフッター
   - 両サイドで使用される構造的要素

3. admin/quests/
   - クエスト管理機能
   - 管理者特有のインターフェース
   - 高度な操作機能（並び替え、一括編集など）

4. user/quests/
   - クエスト表示機能
   - ユーザー向けインターフェース
   - シンプルな操作機能

## 実装ガイドライン

1. コンポーネントの分離
```typescript
// 共通UIコンポーネント
// src/components/shared/ui/Button/index.tsx
export const Button = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

// 管理者用コンポーネント
// src/components/admin/quests/QuestTable/index.tsx
import { Button } from '@/components/shared/ui/Button';

export const QuestTable = () => {
  return (
    <div>
      <Button>編集</Button>
    </div>
  );
};

// ユーザー用コンポーネント
// src/components/user/quests/QuestCard/index.tsx
import { Button } from '@/components/shared/ui/Button';

export const QuestCard = () => {
  return (
    <div>
      <Button>参加する</Button>
    </div>
  );
};
```

2. ロジックの分離
```typescript
// 共通ロジック
// src/features/shared/quests/hooks/useQuest.ts
export const useQuest = (id: string) => {
  // 共通のクエスト取得ロジック
};

// 管理者用ロジック
// src/features/admin/quests/hooks/useQuestManagement.ts
import { useQuest } from '@/features/shared/quests/hooks/useQuest';

export const useQuestManagement = (id: string) => {
  const quest = useQuest(id);
  // 管理者特有のロジック
};

// ユーザー用ロジック
// src/features/user/quests/hooks/useQuestParticipation.ts
import { useQuest } from '@/features/shared/quests/hooks/useQuest';

export const useQuestParticipation = (id: string) => {
  const quest = useQuest(id);
  // ユーザー特有のロジック
};
```

## 期待される効果

1. コードの保守性向上
   - 明確な責任分担
   - 重複の削減
   - テストの容易さ

2. 開発効率の向上
   - コンポーネントの再利用性向上
   - 一貫したコーディング規約
   - チーム間の連携改善

3. パフォーマンスの改善
   - 適切なコード分割
   - 効率的なバンドリング
   - 不要なコードの削減
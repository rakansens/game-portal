# Next.js App Router推奨ディレクトリ構造

```
/app
  /admin
    /quests
      /[id]
        /edit
          /components
            EditQuestForm.tsx
          page.tsx
      /new
        page.tsx
    layout.tsx
    page.tsx
  /api
    /admin
      /quests
        /order
          route.ts
          schema.ts
        route.ts
        schema.ts
    /quest-progress
      route.ts
      schema.ts
    /quests
      route.ts
      schema.ts
    /ranking
      route.ts
      schema.ts
  layout.tsx
  page.tsx

/src
  /components
    /ui
      /admin
        DeleteConfirmModal.tsx
        QuestFilterBar.tsx
        QuestFilters.tsx
        QuestTable/
          index.tsx
          DraggableRow.tsx
          types.ts
      /common
        Button.tsx
        Input.tsx
        Select.tsx
      /forms
        QuestForm/
          index.tsx
          validation.ts
          types.ts
      /layout
        Footer.tsx
        Header.tsx
      /quest
        QuestCard/
          index.tsx
          types.ts
    /providers
      ClientLayout.tsx
      LiffProvider.tsx

  /features
    /admin
      /quests
        actions.ts
        types.ts
    /quests
      actions.ts
      types.ts
    /ranking
      actions.ts
      types.ts

  /lib
    /api
      admin.ts
      client.ts
    /supabase
      admin.ts
      client.ts
    /validation
      quest.ts
      common.ts

  /store
    auth.ts
    quest.ts

  /types
    database.ts
    shared.ts

  /utils
    date.ts
    format.ts
    validation.ts
```

## ディレクトリ構造の説明

### /app
- Next.js App Routerのルーティング構造
- 各ページコンポーネントとAPIルート
- ページ固有のコンポーネントは`/components`サブディレクトリに配置

### /src/components
- `/ui`: 再利用可能なUIコンポーネント
  - 機能ごとにサブディレクトリを作成
  - 複雑なコンポーネントは独自のディレクトリに分割
- `/providers`: アプリケーション全体のプロバイダーコンポーネント

### /src/features
- 機能ごとのビジネスロジック
- アクション、型定義、ユーティリティを含む

### /src/lib
- 外部サービスとの統合
- APIクライアント
- バリデーションスキーマ

### /src/store
- グローバルステート管理
- ストア設定とスライス

### /src/types
- プロジェクト全体で共有される型定義
- データベース型定義

### /src/utils
- 汎用ユーティリティ関数
- 日付操作、フォーマット処理など

## 命名規則

- コンポーネント: PascalCase (例: QuestCard.tsx)
- ユーティリティ/アクション: camelCase (例: formatDate.ts)
- 型定義: PascalCase (例: QuestType.ts)
- APIルート: kebab-case (例: create-quest.ts)

## ベストプラクティス

1. コンポーネントの分割
- 単一責任の原則に従う
- 再利用可能なコンポーネントは/ui以下に配置
- ページ固有のコンポーネントはそのページのディレクトリに配置

2. 型の管理
- データベース型は/types/database.tsに集中
- 共有型は/types/shared.tsに配置
- コンポーネント固有の型は各コンポーネントと同じディレクトリに配置

3. APIとバリデーション
- APIルートごとにスキーマファイルを作成
- 共通のバリデーションロジックは/lib/validationに配置

4. ステート管理
- グローバルステートは/storeに集中
- コンポーネント固有のステートは各コンポーネント内に保持
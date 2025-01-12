# Game Portal

LINE LIFFを活用したゲームポータルサイトです。ユーザーがモバイル端末上で手軽にゲーム系コンテンツ（クエスト）を楽しめるプラットフォームを提供します。

## 機能

- LINE LIFFによるユーザー認証
- クエスト一覧表示
- クエスト詳細表示
- クエスト参加機能
- ユーザープロフィール管理
- 管理者機能（クエスト管理、ユーザー管理）

## 技術スタック

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: PostgreSQL (Prisma ORM)
- Authentication: LINE LIFF SDK
- State Management: Zustand

## 開発環境のセットアップ

1. リポジトリのクローン:
```bash
git clone https://github.com/rakansens/game-portal.git
cd game-portal
```

2. 依存パッケージのインストール:
```bash
npm install
```

3. 環境変数の設定:
- `.env.example`をコピーして`.env`を作成
- 必要な環境変数を設定
```bash
cp .env.example .env
```

4. データベースのセットアップ:
```bash
npx prisma generate
npx prisma db push
```

5. 開発サーバーの起動:
```bash
npm run dev
```

## LINE LIFF設定

1. [LINE Developers Console](https://developers.line.biz/console/)で新しいLIFFアプリを作成
2. 作成したLIFFアプリのIDを`.env`ファイルの`NEXT_PUBLIC_LIFF_ID`に設定

## デプロイ

1. データベースのセットアップ
2. 環境変数の設定
3. ビルドとデプロイ
```bash
npm run build
npm start
```

## ライセンス

MIT

## 作者

rakansens

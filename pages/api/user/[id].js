import { getUserById } from '@/lib/db'; // データベースからユーザー情報を取得する関数

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const user = await getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
}

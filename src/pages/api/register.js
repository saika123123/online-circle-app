import bcrypt from 'bcryptjs';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { displayName, userId, password } = req.body;

  try {
    // ユーザーIDの重複チェック
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'ユーザーIDは既に使用されています' });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザーの作成
    const [result] = await pool.query(
      'INSERT INTO users (display_name, user_id, password) VALUES (?, ?, ?)',
      [displayName, userId, hashedPassword]
    );

    res.status(201).json({ message: 'ユーザーが正常に登録されました', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
}
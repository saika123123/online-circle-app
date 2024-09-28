import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, password } = req.body;

  try {
    // ユーザーの検索
    const [users] = await pool.query(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'ユーザーIDまたはパスワードが正しくありません' });
    }

    const user = users[0];

    // パスワードの照合
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'ユーザーIDまたはパスワードが正しくありません' });
    }

    // JWTトークンの生成
    const token = jwt.sign(
      {
        userId: user.id,
        user_id: user.user_id,
        displayName: user.display_name // Base64エンコーディングを削除
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Generated token:', token);

    res.status(200).json({
      token,
      userId: user.id,
      user_id: user.user_id,
      displayName: user.display_name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
}
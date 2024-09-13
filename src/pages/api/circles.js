import pool from '../../lib/db';
import verifyToken from '../../utils/auth';

export default async function handler(req, res) {
    console.log('Circles API called, method:', req.method);
    try {
        const user = verifyToken(req);
        console.log('Verified user:', user);
        if (!user) {
            return res.status(401).json({ message: '認証が必要です' });
        }

        if (req.method === 'GET') {
            const { type } = req.query; // 'join' or 'check'
            let circles;

            if (type === 'join') {
                // 参加可能なサークルを取得
                [circles] = await pool.query(
                    `SELECT DISTINCT c.* 
                     FROM circles c
                     LEFT JOIN circle_members cm ON c.id = cm.circle_id
                     WHERE c.creator_id != ? 
                     AND c.id NOT IN (
                         SELECT circle_id 
                         FROM circle_members 
                         WHERE user_id = ?
                     )`,
                    [user.userId, user.userId]
                );
            } else if (type === 'check') {
                // 参加しているサークルを取得
                [circles] = await pool.query(
                    `SELECT c.* 
                     FROM circles c
                     JOIN circle_members cm ON c.id = cm.circle_id
                     WHERE cm.user_id = ?
                     UNION
                     SELECT * 
                     FROM circles
                     WHERE creator_id = ?`,
                    [user.userId, user.userId]
                );
            } else {
                return res.status(400).json({ message: '無効なリクエストタイプです' });
            }

            console.log('Fetched circles:', circles);
            return res.status(200).json({ circles });
        } else if (req.method === 'POST') {
            // サークル作成のコード（変更なし）
            // サークルの作成
            const { name, theme, genre, gender, details } = req.body;

            // 入力値のバリデーション
            if (!name || !theme || !genre || !gender) {
                return res.status(400).json({ message: '必須フィールドが入力されていません' });
            }

            // サークルの作成
            const [result] = await pool.query(
                'INSERT INTO circles (name, theme, genre, gender, details, creator_id) VALUES (?, ?, ?, ?, ?, ?)',
                [name, theme, genre, gender, details, user.userId]
            );

            // 作成者をサークルメンバーとして追加
            await pool.query(
                'INSERT INTO circle_members (circle_id, user_id) VALUES (?, ?)',
                [result.insertId, user.userId]
            );

            res.status(201).json({
                message: 'サークルが正常に作成されました',
                circleId: result.insertId
            });

        } else {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error in circles API:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}
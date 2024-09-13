import pool from '../../lib/db';
import verifyToken from '../../utils/auth';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const user = verifyToken(req);
        if (!user) {
            return res.status(401).json({ message: '認証が必要です' });
        }

        const [circles] = await pool.query(
            `SELECT c.* 
       FROM circles c
       JOIN circle_members cm ON c.id = cm.circle_id
       WHERE cm.user_id = ?`,
            [user.userId]
        );

        res.status(200).json({ circles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}
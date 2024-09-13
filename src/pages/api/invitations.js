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

        const [invitations] = await pool.query(
            `SELECT gp.id, g.theme, g.datetime, c.name as circle_name
       FROM gathering_participants gp
       JOIN gatherings g ON gp.gathering_id = g.id
       JOIN circles c ON g.circle_id = c.id
       WHERE gp.user_id = ? AND gp.status = 'invited'`,
            [user.userId]
        );

        console.log('Fetched invitations:', invitations); // デバッグ用

        res.status(200).json({ invitations });
    } catch (error) {
        console.error('Error in invitations API:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}
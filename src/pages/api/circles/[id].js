import pool from '../../../lib/db';
import verifyToken from '../../../utils/auth';

export default async function handler(req, res) {
    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: '認証が必要です' });
    }

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const [circles] = await pool.query(
                `SELECT c.*, 
                CASE WHEN cm.user_id IS NOT NULL OR c.creator_id = ? THEN true ELSE false END as is_member
         FROM circles c
         LEFT JOIN circle_members cm ON c.id = cm.circle_id AND cm.user_id = ?
         WHERE c.id = ?`,
                [user.userId, user.userId, id]
            );

            if (circles.length === 0) {
                return res.status(404).json({ message: 'サークルが見つかりません' });
            }

            res.status(200).json({ circle: circles[0] });
        } catch (error) {
            console.error('Error in circle detail API:', error);
            res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

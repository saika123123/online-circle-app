import pool from '../../../../lib/db';
import verifyToken from '../../../../utils/auth';

export default async function handler(req, res) {
    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: '認証が必要です' });
    }

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const [participants] = await pool.query(
                `SELECT DISTINCT u.id, u.username, gp.status
         FROM gathering_participants gp
         JOIN users u ON gp.user_id = u.id
         WHERE gp.gathering_id = ?
         GROUP BY u.id
         ORDER BY gp.updated_at DESC`,
                [id]
            );

            res.status(200).json({ participants });
        } catch (error) {
            console.error('Error in gathering participants API:', error);
            res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
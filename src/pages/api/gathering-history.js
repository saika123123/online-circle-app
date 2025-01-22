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

        // 過去の寄合を取得（現在時刻より前のもの）
        const [gatherings] = await pool.query(
            `SELECT 
                g.id,
                g.theme,
                g.datetime,
                c.name as circle_name,
                CASE 
                    WHEN g.creator_id = ? THEN '作成者'
                    ELSE gp.status 
                END as status
            FROM gatherings g
            JOIN circles c ON g.circle_id = c.id
            LEFT JOIN gathering_participants gp ON g.id = gp.gathering_id AND gp.user_id = ?
            WHERE (g.creator_id = ? OR gp.user_id = ?)
                AND g.datetime < NOW()
            ORDER BY g.datetime DESC`,
            [user.userId, user.userId, user.userId, user.userId]
        );

        res.status(200).json({ gatherings });
    } catch (error) {
        console.error('Error in gathering history API:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}
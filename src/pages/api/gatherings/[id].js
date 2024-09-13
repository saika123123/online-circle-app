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
            const [gatherings] = await pool.query(
                `SELECT g.*, c.name as circle_name, gp.status as user_status
         FROM gatherings g
         JOIN circles c ON g.circle_id = c.id
         LEFT JOIN gathering_participants gp ON g.id = gp.gathering_id AND gp.user_id = ?
         WHERE g.id = ?`,
                [user.userId, id]
            );

            if (gatherings.length === 0) {
                return res.status(404).json({ message: '寄合が見つかりません' });
            }

            const gathering = gatherings[0];
            const userStatus = gathering.user_status;
            delete gathering.user_status;

            // URL を生成
            gathering.url = `https://wsapp.cs.kobe-u.ac.jp/meetcs27/${gathering.meeting_id}?user=${user.userId}`;


            res.status(200).json({ gathering, userStatus });
        } catch (error) {
            console.error('Error in gathering detail API:', error);
            res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
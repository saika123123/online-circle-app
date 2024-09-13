import pool from '../../lib/db';
import verifyToken from '../../utils/auth';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: '認証が必要です' });
    }

    try {
        const [gatherings] = await pool.query(
            `SELECT g.id, g.theme, g.datetime
            FROM gatherings g
            JOIN gathering_participants gp ON g.id = gp.gathering_id
            WHERE gp.user_id = ? 
            AND g.datetime > DATE_SUB(NOW(), INTERVAL 2 MINUTE)
            AND g.datetime < DATE_ADD(NOW(), INTERVAL 1 DAY)
            ORDER BY g.datetime ASC`,
            [user.userId]
        );

        const formattedGatherings = gatherings.map(g => ({
            ...g,
            datetime: new Date(g.datetime).toISOString()
        }));

        const serverTime = new Date().toISOString();
        res.status(200).json({
            upcomingGatherings: formattedGatherings,
            serverTime: serverTime
        });
    } catch (error) {
        console.error('Error in upcoming gatherings API:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}
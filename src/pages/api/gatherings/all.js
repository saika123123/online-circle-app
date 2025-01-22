import pool from '../../../lib/db';
import verifyToken from '../../../utils/auth';

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
            `SELECT g.*, c.name as circle_name, 
            CASE 
              WHEN g.creator_id = ? THEN '作成者'
              ELSE gp.status 
            END as status
           FROM gatherings g
           JOIN circles c ON g.circle_id = c.id
           JOIN circle_members cm ON c.id = cm.circle_id
           LEFT JOIN gathering_participants gp ON g.id = gp.gathering_id AND gp.user_id = ?
           WHERE cm.user_id = ?
           ORDER BY g.datetime DESC`,
            [user.userId, user.userId, user.userId]
        );

        const participatingGatherings = gatherings.filter(g => g.status === 'accepted' || g.status === '作成者');
        const declinedGatherings = gatherings.filter(g => g.status === 'declined');
        const invitedGatherings = gatherings.filter(g => g.status === 'invited');

        res.status(200).json({
            participatingGatherings,
            declinedGatherings,
            invitedGatherings
        });
    } catch (error) {
        console.error('Error in all gatherings API:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}
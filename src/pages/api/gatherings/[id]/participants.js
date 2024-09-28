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
                `SELECT DISTINCT u.id, u.display_name, u.user_id, gp.status, gp.updated_at
                FROM gathering_participants gp
                JOIN users u ON gp.user_id = u.id
                WHERE gp.gathering_id = ?
                ORDER BY gp.updated_at DESC`,
                [id]
            );

            // updated_at フィールドを除去してからクライアントに送信
            const formattedParticipants = participants.map(({ updated_at, ...rest }) => rest);

            res.status(200).json({ participants: formattedParticipants });
        } catch (error) {
            console.error('Error in gathering participants API:', error);
            res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
import pool from '../../../../lib/db';
import verifyToken from '../../../../utils/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const user = verifyToken(req);
        if (!user) {
            return res.status(401).json({ message: '認証が必要です' });
        }

        const { id } = req.query;
        const { status } = req.body;

        if (status !== 'accepted' && status !== 'declined') {
            return res.status(400).json({ message: '無効なステータスです' });
        }

        const [result] = await pool.query(
            'UPDATE gathering_participants SET status = ? WHERE id = ? AND user_id = ?',
            [status, id, user.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '招待が見つかりません' });
        }

        res.status(200).json({ message: '招待への返答が完了しました' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}
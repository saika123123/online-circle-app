import pool from '../../../../lib/db';
import verifyToken from '../../../../utils/auth';

export default async function handler(req, res) {
    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: '認証が必要です' });
    }

    const { id } = req.query;
    const { status } = req.body;

    if (req.method === 'POST') {
        try {
            if (status !== 'accepted' && status !== 'declined') {
                return res.status(400).json({ message: '無効なステータスです' });
            }

            // 既存のエントリーを更新するか、新しいエントリーを挿入する
            const [result] = await pool.query(
                `INSERT INTO gathering_participants (gathering_id, user_id, status, updated_at)
                 VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                 ON DUPLICATE KEY UPDATE status = ?, updated_at = CURRENT_TIMESTAMP`,
                [id, user.userId, status, status]
            );

            res.status(200).json({ message: '参加状況が更新されました' });
        } catch (error) {
            console.error('Error in gathering participate API:', error);
            res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
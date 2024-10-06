import pool from '../../../../lib/db';
import verifyToken from '../../../../utils/auth';

export default async function handler(req, res) {
    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: '認証が必要です' });
    }

    const { id } = req.query;

    if (req.method === 'PUT') {
        const { theme, datetime, details } = req.body;

        try {
            // 寄合の所有者確認
            const [gathering] = await pool.query(
                'SELECT * FROM gatherings WHERE id = ? AND creator_id = ?',
                [id, user.userId]
            );

            if (gathering.length === 0) {
                return res.status(403).json({ message: 'この寄合を編集する権限がありません' });
            }

            // 寄合情報の更新
            await pool.query(
                'UPDATE gatherings SET theme = ?, datetime = ?, details = ? WHERE id = ?',
                [theme, datetime, details, id]
            );

            res.status(200).json({ message: '寄合が正常に更新されました' });
        } catch (error) {
            console.error('Error in edit gathering API:', error);
            res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
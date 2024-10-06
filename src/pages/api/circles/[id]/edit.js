import pool from '../../../../lib/db';
import verifyToken from '../../../../utils/auth';

export default async function handler(req, res) {
    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: '認証が必要です' });
    }

    const { id } = req.query;

    if (req.method === 'PUT') {
        const { name, theme, genre, gender, details } = req.body;

        try {
            // サークルの所有者確認
            const [circle] = await pool.query(
                'SELECT * FROM circles WHERE id = ? AND creator_id = ?',
                [id, user.userId]
            );

            if (circle.length === 0) {
                return res.status(403).json({ message: 'このサークルを編集する権限がありません' });
            }

            // サークル情報の更新
            await pool.query(
                'UPDATE circles SET name = ?, theme = ?, genre = ?, gender = ?, details = ? WHERE id = ?',
                [name, theme, genre, gender, details, id]
            );

            res.status(200).json({ message: 'サークルが正常に更新されました' });
        } catch (error) {
            console.error('Error in edit circle API:', error);
            res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
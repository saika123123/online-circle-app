import pool from '../../../../lib/db';
import verifyToken from '../../../../utils/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: '認証が必要です' });
    }

    const { id } = req.query;

    try {
        // ユーザーがサークルのメンバーであることを確認
        const [member] = await pool.query(
            'SELECT * FROM circle_members WHERE circle_id = ? AND user_id = ?',
            [id, user.userId]
        );

        if (member.length === 0) {
            return res.status(400).json({ message: 'このサークルのメンバーではありません' });
        }

        // サークルの作成者でないことを確認
        const [circle] = await pool.query(
            'SELECT * FROM circles WHERE id = ? AND creator_id != ?',
            [id, user.userId]
        );

        if (circle.length === 0) {
            return res.status(400).json({ message: 'サークルの作成者は脱退できません' });
        }

        // サークルから脱退
        await pool.query(
            'DELETE FROM circle_members WHERE circle_id = ? AND user_id = ?',
            [id, user.userId]
        );

        res.status(200).json({ message: 'サークルから脱退しました' });
    } catch (error) {
        console.error('Error in leave circle API:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}
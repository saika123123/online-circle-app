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

        // ユーザーがすでに参加していないか確認
        const [existingMember] = await pool.query(
            'SELECT * FROM circle_members WHERE circle_id = ? AND user_id = ?',
            [id, user.userId]
        );

        if (existingMember.length > 0) {
            return res.status(400).json({ message: 'すでにこのサークルに参加しています' });
        }

        // トランザクション開始
        await pool.query('START TRANSACTION');

        try {

            // 参加者として追加
            await pool.query(
                'INSERT INTO circle_members (circle_id, user_id) VALUES (?, ?)',
                [id, user.userId]
            );

            // サークルの既存の寄合を取得
            const [gatherings] = await pool.query(
                'SELECT id FROM gatherings WHERE circle_id = ? AND datetime > NOW()',
                [id]
            );

            // 各寄合に新しいメンバーを招待状態で追加
            for (const gathering of gatherings) {
                await pool.query(
                    'INSERT INTO gathering_participants (gathering_id, user_id, status) VALUES (?, ?, ?)',
                    [gathering.id, user.userId, 'invited']
                );
            }

            // トランザクションをコミット
            await pool.query('COMMIT');

            res.status(200).json({ message: 'サークルに参加し、既存の寄合にも招待されました' });
        } catch (error) {
            // エラーが発生した場合、トランザクションをロールバック
            await pool.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error in join circle API:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}

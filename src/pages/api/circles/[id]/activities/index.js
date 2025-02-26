import pool from '../../../../../lib/db';
import verifyToken from '../../../../../utils/auth';

export default async function handler(req, res) {
    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: '認証が必要です' });
    }

    const { id: circleId } = req.query;

    // メンバーシップの確認
    const [membership] = await pool.query(
        'SELECT * FROM circle_members WHERE circle_id = ? AND user_id = ?',
        [circleId, user.userId]
    );

    if (membership.length === 0) {
        return res.status(403).json({ message: 'このサークルのメンバーではありません' });
    }

    if (req.method === 'GET') {
        try {
            const [activities] = await pool.query(
                `SELECT ca.*, u.display_name 
                FROM circle_activities ca
                JOIN users u ON ca.user_id = u.id
                WHERE ca.circle_id = ?
                ORDER BY ca.activity_date DESC`,
                [circleId]
            );

            res.status(200).json({ activities });
        } catch (error) {
            console.error('Error fetching activities:', error);
            res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    } else if (req.method === 'POST') {
        const { title, content, activity_date } = req.body;

        try {
            const [result] = await pool.query(
                'INSERT INTO circle_activities (circle_id, user_id, title, content, activity_date) VALUES (?, ?, ?, ?, ?)',
                [circleId, user.userId, title, content, activity_date]
            );

            res.status(201).json({ 
                message: '活動記録が作成されました',
                activityId: result.insertId 
            });
        } catch (error) {
            console.error('Error creating activity:', error);
            res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

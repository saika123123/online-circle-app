import crypto from 'crypto';
import pool from '../../lib/db';
import verifyToken from '../../utils/auth';
export default async function handler(req, res) {
    const user = verifyToken(req);
    if (!user) {
        return res.status(401).json({ message: '認証が必要です' });
    }

    if (req.method === 'GET') {
        try {
            const [gatherings] = await pool.query(
                `SELECT g.id, g.theme, g.datetime, c.name as circle_name, 
                CASE 
                  WHEN g.creator_id = ? THEN '作成者'
                  ELSE gp.status 
                END as status
               FROM gatherings g
               JOIN circles c ON g.circle_id = c.id
               LEFT JOIN gathering_participants gp ON g.id = gp.gathering_id AND gp.user_id = ?
               WHERE g.creator_id = ? OR gp.user_id = ?
               ORDER BY g.datetime DESC`,
                [user.userId, user.userId, user.userId, user.userId]
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
            console.error('Error in gatherings API:', error);
            res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    } else if (req.method === 'POST') {
        try {
            const user = verifyToken(req);
            if (!user) {
                return res.status(401).json({ message: '認証が必要です' });
            }

            const { circleId, theme, datetime, details } = req.body;

            // 入力値のバリデーション
            if (!circleId || !theme || !datetime) {
                return res.status(400).json({ message: '必須フィールドが入力されていません' });
            }

            // ユーザーがサークルのメンバーであることを確認
            const [memberCheck] = await pool.query(
                'SELECT * FROM circle_members WHERE circle_id = ? AND user_id = ?',
                [circleId, user.userId]
            );

            if (memberCheck.length === 0) {
                return res.status(403).json({ message: 'このサークルのメンバーではありません' });
            }

            // ユニークな meeting_id を生成
            let meetingId;
            let isUnique = false;
            while (!isUnique) {
                meetingId = crypto.randomBytes(8).toString('hex');
                const [existingMeetings] = await pool.query(
                    'SELECT id FROM gatherings WHERE meeting_id = ?',
                    [meetingId]
                );
                if (existingMeetings.length === 0) {
                    isUnique = true;
                }
            }

            // 寄合の作成
            const [result] = await pool.query(
                'INSERT INTO gatherings (circle_id, creator_id, theme, datetime, details, meeting_id) VALUES (?, ?, ?, ?, ?, ?)',
                [circleId, user.userId, theme, datetime, details, meetingId]
            );

            // サークルメンバーを寄合に招待
            const [members] = await pool.query(
                'SELECT user_id FROM circle_members WHERE circle_id = ?',
                [circleId]
            );

            for (const member of members) {
                await pool.query(
                    'INSERT INTO gathering_participants (gathering_id, user_id, status) VALUES (?, ?, ?)',
                    [result.insertId, member.user_id, member.user_id === user.userId ? 'accepted' : 'invited']
                );
            }

            res.status(201).json({
                message: '寄合が正常に作成され、メンバーに招待が送信されました',
                gatheringId: result.insertId,
                meetingId: meetingId
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'サーバーエラーが発生しました' });
        }
    }
}
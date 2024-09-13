import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CheckInvitations() {
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/invitations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // 現在時刻より後の寄合のみをフィルタリング
                const futureInvitations = data.invitations.filter(invitation =>
                    new Date(invitation.datetime) > new Date()
                );
                setInvitations(futureInvitations);
            } else {
                setError('招待の取得に失敗しました');
            }
        } catch (error) {
            console.error('Error fetching invitations:', error);
            setError('招待の取得中にエラーが発生しました');
        }
    };

    const handleResponse = async (invitationId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/invitations/${invitationId}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                fetchInvitations(); // 招待リストを更新
            } else {
                setError('招待への返答に失敗しました');
            }
        } catch (error) {
            setError('招待への返答中にエラーが発生しました');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-2xl font-semibold mb-4">寄合招待の確認</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {invitations.length > 0 ? (
                            <ul className="space-y-4">
                                {invitations.map((invitation) => (
                                    <li key={invitation.id} className="border p-4 rounded-md">
                                        <h3 className="font-semibold">{invitation.theme}</h3>
                                        <p>日時: {new Date(invitation.datetime).toLocaleString()}</p>
                                        <p>サークル: {invitation.circle_name}</p>
                                        <div className="mt-2">
                                            <button
                                                onClick={() => handleResponse(invitation.id, 'accepted')}
                                                className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                参加する
                                            </button>
                                            <button
                                                onClick={() => handleResponse(invitation.id, 'declined')}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                参加しない
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>現在、招待はありません。</p>
                        )}
                        <button
                            onClick={() => router.push('/home')}
                            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            ホームに戻る
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
    const [displayName, setDisplayName] = useState('');
    const [currentTime, setCurrentTime] = useState(null);
    const [invitations, setInvitations] = useState([]);
    const router = useRouter();

    // 招待の取得
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
            }
        } catch (error) {
            console.error('Error fetching invitations:', error);
        }
    };

    useEffect(() => {
        // トークンの確認とユーザー名の取得
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const decoded = jwt.decode(token);
            if (decoded && decoded.displayName) {
                setDisplayName(decoded.displayName);
            } else {
                throw new Error('Invalid token structure');
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token');
            router.push('/login');
            return;
        }

        // 招待の初回取得と定期更新
        fetchInvitations();
        const invitationInterval = setInterval(fetchInvitations, 5 * 60 * 1000); // 5分ごとに更新

        // 時計の更新
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
            clearInterval(invitationInterval);
        };
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const handleInvitationClick = (gatheringId) => {
        router.push(`/check-invitations`);
    };

    return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8">
                {/* ヘッダー部分 */}
                <header className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        オンラインサークル 👥
                    </h1>
                    {currentTime && (
                        <div className="text-2xl text-gray-600 mb-4 bg-orange-50 rounded-xl p-3 inline-block">
                            {currentTime.toLocaleString('ja-JP', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            })}
                        </div>
                    )}
                    <div className="mb-6">
                        <p className="text-3xl text-gray-700">
                            <span className="inline-block text-4xl font-bold text-orange-700 bg-orange-50 px-6 py-3 rounded-xl mx-2 border-2 border-orange-200">
                                {displayName}
                            </span>
                            <span className="text-2xl">さん、いらっしゃいませ</span>
                        </p>
                        <p className="text-xl text-gray-600 mt-4">
                            今日もみんなで楽しい時間を過ごしましょう
                        </p>
                    </div>
                </header>

                {/* 招待通知 */}
                {invitations.length > 0 && (
                    <div className="mb-8">
                        {invitations.map((invitation) => (
                            <button
                                key={invitation.id}
                                onClick={() => handleInvitationClick(invitation.id)}
                                className="w-full p-6 bg-yellow-50 border-2 border-yellow-300 rounded-2xl 
                                         shadow-lg hover:bg-yellow-100 transition-colors duration-200 mb-4"
                            >
                                <div className="flex items-center">
                                    <div className="mr-4">
                                        <span className="text-4xl">🎉</span>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-2xl font-bold text-gray-800 mb-2">
                                            新しい寄合にご招待が届いています
                                        </p>
                                        <p className="text-xl text-gray-700">
                                            「{invitation.theme}」
                                        </p>
                                        <p className="text-lg text-gray-600 mt-1">
                                            開催日時：{new Date(invitation.datetime).toLocaleString('ja-JP')}
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <span className="text-orange-600 text-xl flex items-center">
                                            確認する <span className="text-2xl ml-2">➜</span>
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* メインメニュー */}
                <div className="grid grid-cols-1 gap-6 mb-12">
                    <Link href="/check-circles" 
                        className="block p-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                                 text-white rounded-2xl shadow-lg transition-all duration-200 border-2 border-blue-400"
                    >
                        <div className="flex items-center text-3xl font-bold justify-center mb-2">
                            <span className="text-4xl mr-3">👥</span>
                            参加しているサークルを見る
                        </div>
                        <p className="text-xl text-center text-blue-100">
                            仲間たちを見てみましょう
                        </p>
                    </Link>

                    <Link href="/join-circle" 
                        className="block p-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                                 text-white rounded-2xl shadow-lg transition-all duration-200 border-2 border-green-400"
                    >
                        <div className="flex items-center text-3xl font-bold justify-center mb-2">
                            <span className="text-4xl mr-3">✨</span>
                            新しいサークルに参加する
                        </div>
                        <p className="text-xl text-center text-green-100">
                            新しい仲間と出会いましょう
                        </p>
                    </Link>

                    <Link href="/create-gathering" 
                        className="block p-8 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                                 text-white rounded-2xl shadow-lg transition-all duration-200 border-2 border-purple-400"
                    >
                        <div className="flex items-center text-3xl font-bold justify-center mb-2">
                            <span className="text-4xl mr-3">📅</span>
                            寄合を作成する
                        </div>
                        <p className="text-xl text-center text-purple-100">
                            楽しい時間を計画しましょう
                        </p>
                    </Link>

                    <Link href="/gathering-list" 
                        className="block p-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 
                                 text-white rounded-2xl shadow-lg transition-all duration-200 border-2 border-orange-400"
                    >
                        <div className="flex items-center text-3xl font-bold justify-center mb-2">
                            <span className="text-4xl mr-3">📋</span>
                            寄合一覧を見る
                        </div>
                        <p className="text-xl text-center text-orange-100">
                            予定されている集まりを確認しましょう
                        </p>
                    </Link>
                </div>

                {/* フッター部分 */}
                <footer className="text-center">
                    <button
                        onClick={handleLogout}
                        className="px-12 py-4 text-2xl text-gray-600 bg-gray-100 hover:bg-gray-200 
                                 rounded-xl transition-colors duration-200 border-2 border-gray-200
                                 flex items-center justify-center mx-auto"
                    >
                        <span className="text-2xl mr-2">🚪</span>
                        ログアウト
                    </button>
                    <p className="mt-6 text-xl text-gray-600 bg-orange-50 rounded-xl p-4">
                        お困りの際は、お気軽に画面上部のヘルプをご確認ください 💁‍♂️
                    </p>
                </footer>
            </div>
        </div>
    );
}
// src/pages/home.js の修正版

import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
    const [displayName, setDisplayName] = useState('');
    const [currentTime, setCurrentTime] = useState(null);
    const [invitations, setInvitations] = useState([]);
    const [upcomingGatherings, setUpcomingGatherings] = useState([]);
    const [serverTimeDiff, setServerTimeDiff] = useState(0);
    const checkTimerRef = useRef(null);
    const router = useRouter();

    // 招待の取得
    const fetchInvitations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/online-circle/api/invitations', {
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

    // 近づいている寄合を取得する関数
    const fetchUpcomingGatherings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/online-circle/api/upcoming-gatherings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUpcomingGatherings(data.upcomingGatherings);

                // サーバー時間とクライアント時間の差を計算して保存
                const serverTime = new Date(data.serverTime);
                const clientTime = new Date();
                setServerTimeDiff(serverTime - clientTime);

                console.log('Upcoming gatherings:', data.upcomingGatherings);
            }
        } catch (error) {
            console.error('Error fetching upcoming gatherings:', error);
        }
    };

    // 寄合の時間をチェックする関数
    const checkGatheringTime = () => {
        if (upcomingGatherings.length === 0) return;

        // 現在時刻 + サーバーとの時間差
        const now = new Date(new Date().getTime() + serverTimeDiff);

        for (const gathering of upcomingGatherings) {
            const gatheringTime = new Date(gathering.datetime);

            // 現在時刻と寄合開始時刻の差（分）
            const diffMinutes = (gatheringTime - now) / (1000 * 60);

            // 開始時間になった場合（1分以内に開始される寄合）
            if (diffMinutes <= 1 && diffMinutes >= 0) {
                // 確認なしで自動的に寄合ページに遷移
                const gathringUrl = `https://es4.eedept.kobe-u.ac.jp/online-circle/gathering/${gathering.id}`;
                window.location.href = gathringUrl;
                return; // 一度遷移したら終了
            }
        }
    };

    useEffect(() => {
        // トークンの確認とユーザー名の取得
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/online-circle/login');
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
            router.push('/online-circle/login');
            return;
        }

        // 初回データ取得
        fetchInvitations();
        fetchUpcomingGatherings();

        // 定期的なデータ更新の設定
        const invitationInterval = setInterval(fetchInvitations, 5 * 60 * 1000); // 5分ごと
        const gatheringInterval = setInterval(fetchUpcomingGatherings, 60 * 1000); // 1分ごと

        // 時計の更新と寄合チェック（10秒ごと）
        const timer = setInterval(() => {
            const newTime = new Date();
            setCurrentTime(newTime);
            checkGatheringTime();
        }, 10 * 1000);

        checkTimerRef.current = timer;

        return () => {
            clearInterval(timer);
            clearInterval(invitationInterval);
            clearInterval(gatheringInterval);
        };
    }, [router, upcomingGatherings, serverTimeDiff]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/online-circle/login');
    };

    const handleInvitationClick = () => {
        window.location.href = 'https://es4.eedept.kobe-u.ac.jp/online-circle/check-invitations';
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

                {/* 近づいている寄合の通知（参加予定の寄合のみ） */}
                {upcomingGatherings.length > 0 && (
                    <div className="mb-8">
                        {upcomingGatherings.map((gathering) => {
                            const gatheringTime = new Date(gathering.datetime);
                            const now = new Date(new Date().getTime() + serverTimeDiff);
                            const diffMinutes = Math.floor((gatheringTime - now) / (1000 * 60));

                            // 30分以内に開始される寄合のみ表示
                            if (diffMinutes > 30 || diffMinutes < 0) return null;

                            return (
                                <div
                                    key={gathering.id}
                                    className="w-full p-6 bg-red-50 border-2 border-red-300 rounded-2xl 
                                             shadow-lg mb-4"
                                >
                                    <div className="flex items-center">
                                        <div className="mr-4">
                                            <span className="text-4xl">⏰</span>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-2xl font-bold text-gray-800 mb-2">
                                                まもなく寄合が始まります！
                                            </p>
                                            <p className="text-xl text-gray-700">
                                                「{gathering.theme}」
                                            </p>
                                            <p className="text-lg text-gray-600 mt-1">
                                                開始時刻：{gatheringTime.toLocaleString('ja-JP')} (あと約{diffMinutes}分)
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <button
                                                onClick={() => {
                                                    const gathringUrl = `https://es4.eedept.kobe-u.ac.jp/online-circle/gathering/${gathering.id}`;
                                                    window.location.href = gathringUrl;
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                参加する
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

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
                <div className="grid grid-cols-2 gap-6 mb-12">
                    <Link href="/online-circle/check-circles"
                        className="block p-8 bg-indigo-100 border-4 border-indigo-400 hover:bg-indigo-200 
                 rounded-2xl shadow-lg transition-all duration-200">
                        <div className="text-4xl font-bold text-center text-indigo-700">
                            <div className="text-5xl mb-4">👥</div>
                            参加サークルを見る
                        </div>
                    </Link>

                    <Link href="/online-circle/join-circle"
                        className="block p-8 bg-amber-100 border-4 border-amber-400 hover:bg-amber-200
                 rounded-2xl shadow-lg transition-all duration-200">
                        <div className="text-4xl font-bold text-center text-amber-700">
                            <div className="text-5xl mb-4">✨</div>
                            新しく参加する
                        </div>
                    </Link>

                    <Link href="/online-circle/create-gathering"
                        className="block p-8 bg-teal-100 border-4 border-teal-400 hover:bg-teal-200
                 rounded-2xl shadow-lg transition-all duration-200">
                        <div className="text-4xl font-bold text-center text-teal-700">
                            <div className="text-5xl mb-4">📅</div>
                            寄合を作る
                        </div>
                    </Link>

                    <Link href="/online-circle/gathering-list"
                        className="block p-8 bg-rose-100 border-4 border-rose-400 hover:bg-rose-200
                 rounded-2xl shadow-lg transition-all duration-200">
                        <div className="text-4xl font-bold text-center text-rose-700">
                            <div className="text-5xl mb-4">📋</div>
                            寄合一覧
                        </div>
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
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CheckCircles() {
    const [circles, setCircles] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchCircles();
    }, []);

    const fetchCircles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/online-circle/api/circles?type=check', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCircles(data.circles);
            } else {
                setError('サークル情報を取得できませんでした。もう一度お試しください。');
            }
        } catch (error) {
            setError('サークル情報の取得中に問題が発生しました。もう一度お試しください。');
        }
    };

    // ジャンルに応じたアイコンを返す関数
    const getGenreIcon = (genre) => {
        switch (genre) {
            case 'スポーツ':
                return '⚽';
            case '音楽':
                return '🎵';
            case '芸術':
                return '🎨';
            case '学習':
                return '📚';
            default:
                return '✨';
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* ヘッダー */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
                        サークル一覧 🤝
                    </h1>
                    <p className="text-2xl text-center text-gray-600">
                        参加中のサークルをご覧いただけます
                    </p>
                </div>

                {/* エラーメッセージ */}
                {error && (
                    <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 p-6 rounded-2xl mb-6">
                        <p className="text-2xl text-center">{error}</p>
                    </div>
                )}

                {/* サークル一覧 */}
                <div className="space-y-6">
                    {circles.length > 0 ? (
                        circles.map((circle) => (
                            <div
                                key={circle.id}
                                className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200 border-2 border-orange-100"
                            >
                                <div className="flex items-center mb-4">
                                    <span className="text-4xl mr-4">
                                        {getGenreIcon(circle.genre)}
                                    </span>
                                    <h2 className="text-3xl font-bold text-gray-800">
                                        {circle.name}
                                    </h2>
                                </div>

                                <div className="space-y-4 ml-4">
                                    <p className="text-2xl text-gray-700">
                                        <span className="font-semibold">テーマ：</span>
                                        {circle.theme}
                                    </p>
                                    <p className="text-2xl text-gray-700">
                                        <span className="font-semibold">ジャンル：</span>
                                        {circle.genre}
                                    </p>
                                    {circle.details && (
                                        <p className="text-2xl text-gray-700">
                                            <span className="font-semibold">活動内容：</span>
                                            {circle.details}
                                        </p>
                                    )}
                                    <div className="pt-6">
                                        <button
                                            onClick={() => router.push(`/online-circle/circle/${circle.id}`)}
                                            className="w-full text-2xl bg-gradient-to-r from-orange-400 to-orange-500 
                                                     text-white py-4 px-6 rounded-xl hover:from-orange-500 
                                                     hover:to-orange-600 transition-all duration-200 
                                                     shadow-md hover:shadow-lg flex items-center justify-center"
                                        >
                                            <span className="mr-2">👥</span>
                                            サークルの詳しい内容を見る
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-3xl shadow-lg p-8 text-center border-2 border-orange-100">
                            <p className="text-3xl text-gray-600 mb-4">
                                まだサークルに参加していません
                            </p>
                            <p className="text-2xl text-gray-500">
                                新しいサークルに参加して、みんなと楽しい時間を過ごしませんか？
                            </p>
                        </div>
                    )}
                </div>

                {/* 戻るボタン */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/online-circle/home')}
                        className="bg-white text-2xl text-gray-700 py-4 px-12 rounded-2xl 
                                 hover:bg-gray-50 transition-colors duration-200 shadow-md
                                 border-2 border-orange-100 flex items-center mx-auto"
                    >
                        <span className="mr-2">🏠</span>
                        ホームに戻る
                    </button>
                </div>
            </div>
        </div>
    );
}
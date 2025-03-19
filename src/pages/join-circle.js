import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function JoinCircle() {
    const [circles, setCircles] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchCircles();
    }, []);

    const fetchCircles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/online-circle/api/circles?type=join', {
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

    const handleJoin = async (circleId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/online-circle/api/circles/${circleId}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setCircles(circles.filter(circle => circle.id !== circleId));
                alert('サークルへの参加が完了しました！');
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('サークル参加中に問題が発生しました。もう一度お試しください。');
        }
    };

    // ジャンルに応じたアイコンを返す関数
    const getGenreIcon = (genre) => {
        switch (genre) {
            case 'スポーツ': return '⚽';
            case '音楽': return '🎵';
            case '芸術': return '🎨';
            case '学習': return '📚';
            default: return '✨';
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* ヘッダー部分 */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-orange-200">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-4 flex items-center justify-center">
                        <span className="text-5xl mr-3">✨</span>
                        新しい仲間との出会い
                    </h1>
                    <p className="text-2xl text-center text-gray-600">
                        興味のあるサークルに参加して、新しい仲間と楽しい時間を過ごしましょう
                    </p>
                </div>

                {/* エラーメッセージ */}
                {error && (
                    <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 p-6 rounded-2xl mb-8">
                        <p className="text-2xl text-center flex items-center justify-center">
                            <span className="text-3xl mr-2">⚠️</span>
                            {error}
                        </p>
                    </div>
                )}


                {/* サークル一覧 */}
                <div className="space-y-6">
                    {circles.length > 0 ? (
                        circles.map((circle) => (
                            <div key={circle.id}
                                className="bg-white rounded-3xl shadow-lg p-8 border-2 border-orange-200
                                         hover:shadow-xl transition-shadow duration-200">
                                <div className="flex items-center mb-6">
                                    <span className="text-5xl mr-4">{getGenreIcon(circle.genre)}</span>
                                    <h2 className="text-3xl font-bold text-gray-800">{circle.name}</h2>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="bg-orange-50 p-4 rounded-xl">
                                        <p className="text-2xl text-gray-700">
                                            <span className="font-semibold">テーマ：</span>
                                            {circle.theme}
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <p className="text-2xl text-gray-700">
                                            <span className="font-semibold">ジャンル：</span>
                                            {circle.genre}
                                        </p>
                                    </div>
                                    {circle.details && (
                                        <div className="bg-green-50 p-4 rounded-xl">
                                            <p className="text-2xl text-gray-700">
                                                <span className="font-semibold">活動内容：</span>
                                                {circle.details}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleJoin(circle.id)}
                                        className="flex-1 p-4 bg-gradient-to-r from-green-500 to-green-600 
                                                 text-white text-2xl rounded-xl hover:from-green-600 
                                                 hover:to-green-700 transition-all duration-200 flex 
                                                 items-center justify-center"
                                    >
                                        <span className="text-3xl mr-2">🤝</span>
                                        参加する
                                    </button>
                                    <button
                                        onClick={() => router.push(`/circle/${circle.id}`)}
                                        className="flex-1 p-4 bg-gradient-to-r from-blue-500 to-blue-600 
                                                 text-white text-2xl rounded-xl hover:from-blue-600 
                                                 hover:to-blue-700 transition-all duration-200 flex 
                                                 items-center justify-center"
                                    >
                                        <span className="text-3xl mr-2">👀</span>
                                        詳しく見る
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-3xl shadow-lg p-8 text-center border-2 border-orange-200 ">
                            <div className="mb-6">
                                <span className="text-5xl mb-4 block">✨</span>
                                <h3 className="text-3xl text-gray-700 font-bold mb-4">
                                    参加できるサークルが見つかりませんでした
                                </h3>
                                <p className="text-2xl text-gray-600 mb-6">
                                    新しいサークルを作って、あなたの好きな活動を始めてみませんか？
                                </p>
                            </div>

                            <button
                                onClick={() => router.push('/create-circle')}
                                className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-r from-green-500 to-green-600 
                                         text-white text-2xl rounded-2xl hover:from-green-600 
                                         hover:to-green-700 transition-all duration-200 flex 
                                         items-center justify-center shadow-lg"
                            >
                                <span className="text-3xl mr-3">💫</span>
                                新しいサークルを作成する
                            </button>

                            <p className="text-xl text-gray-500 mt-6">
                                また後で参加できるサークルをチェックすることもできます
                            </p>
                        </div>
                    )}
                </div>

                {/* サークル作成案内 */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-green-200">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                            <span className="text-4xl mr-3">💫</span>
                            自分の好きなサークルを作ってみませんか？
                        </h2>
                        <p className="text-2xl text-gray-600 mb-6">
                            あなたの興味や趣味を活かして、新しいサークルを始めましょう
                        </p>
                        <button
                            onClick={() => router.push('/create-circle')}
                            className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 
                     text-white text-2xl rounded-2xl hover:from-green-600 
                     hover:to-green-700 transition-all duration-200 flex 
                     items-center justify-center mx-auto shadow-lg"
                        >
                            <span className="text-3xl mr-2">✨</span>
                            サークルを作成する
                        </button>
                    </div>
                </div>

                {/* 戻るボタン */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/home')}
                        className="px-12 py-4 text-2xl text-gray-700 bg-white rounded-2xl 
                                 hover:bg-gray-50 transition-colors duration-200 flex items-center 
                                 justify-center mx-auto border-2 border-orange-200"
                    >
                        <span className="text-3xl mr-2">🏠</span>
                        ホームに戻る
                    </button>
                </div>
            </div>
        </div>
    );
}
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function GatheringDetail() {
    const [gathering, setGathering] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState('');
    const [isCreator, setIsCreator] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            fetchGatheringDetail();
            fetchParticipants();
        }
    }, [id]);

    const fetchGatheringDetail = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/online-circle/api/gatherings/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setGathering(data.gathering);
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setIsCreator(data.gathering.creator_id === decoded.userId);
            } else {
                setError('寄合の詳細情報を取得できませんでした');
            }
        } catch (error) {
            setError('寄合の詳細情報の取得中に問題が発生しました');
        }
    };

    const fetchParticipants = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/online-circle/api/gatherings/${id}/participants`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setParticipants(data.participants);
            } else {
                setError('参加者情報の取得に失敗しました');
            }
        } catch (error) {
            setError('参加者情報の取得中に問題が発生しました');
        }
    };

    const handleJoinGathering = () => {
        if (gathering.url) {
            window.open(gathering.url, '_blank');
        }
    };

    if (error) return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">
                <div className="text-2xl text-red-600 text-center flex items-center justify-center">
                    <span className="text-3xl mr-2">⚠️</span>
                    {error}
                </div>
                <button
                    onClick={() => router.back()}
                    className="mt-6 px-8 py-3 bg-gray-100 text-xl rounded-xl mx-auto block hover:bg-gray-200"
                >
                    戻る
                </button>
            </div>
        </div>
    );

    if (!gathering) return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">
                <p className="text-2xl text-center">読み込み中です...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* メイン情報カード */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 border-2 border-orange-200">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                            <span className="text-5xl mr-3">📅</span>
                            {gathering.theme}
                        </h1>
                        <p className="text-2xl text-gray-600">
                            {gathering.circle_name}のオンライン寄合
                        </p>
                    </div>

                    {/* 寄合の詳細情報 */}
                    <div className="space-y-6 text-2xl">
                        <div className="bg-blue-50 p-6 rounded-2xl flex items-center">
                            <span className="text-3xl mr-3">🕒</span>
                            <div>
                                <p className="font-bold text-gray-800">開催日時</p>
                                <p className="text-gray-700">
                                    {new Date(gathering.datetime).toLocaleString('ja-JP', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        weekday: 'long'
                                    })}
                                </p>
                            </div>
                        </div>

                        {gathering.details && (
                            <div className="bg-green-50 p-6 rounded-2xl">
                                <div className="flex items-center mb-2">
                                    <span className="text-3xl mr-3">📝</span>
                                    <p className="font-bold text-gray-800">詳細情報</p>
                                </div>
                                <p className="text-gray-700 ml-11">{gathering.details}</p>
                            </div>
                        )}

                        {gathering.url && (
                            <div className="bg-purple-50 p-6 rounded-2xl">
                                <div className="text-center mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                                        <span className="text-3xl mr-2">🎥</span>
                                        オンライン寄合に参加する
                                    </h3>
                                    <p className="text-xl text-gray-600 mt-2">
                                        開催時刻になりましたら、下のボタンから参加できます
                                    </p>
                                </div>

                                <button
                                    onClick={handleJoinGathering}
                                    className="w-full p-6 bg-gradient-to-r from-green-500 to-green-600 
                     text-white rounded-xl hover:from-green-600 hover:to-green-700 
                     transition-all duration-200 flex flex-col items-center 
                     justify-center shadow-lg transform hover:scale-105"
                                >
                                    <div className="text-4xl mb-2">
                                        👥 💻
                                    </div>
                                    <div className="text-2xl font-bold">
                                        タップして寄合に参加する
                                    </div>
                                    <div className="text-lg text-green-100 mt-1">
                                        新しい画面が開きます
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 参加者一覧 */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 border-2 border-orange-200">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                        <span className="text-4xl mr-3">👥</span>
                        参加予定のメンバー
                        <span className="ml-3 text-2xl text-gray-500">
                            ({participants.filter(p => p.status === 'accepted').length}人)
                        </span>
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {participants
                            .filter(p => p.status === 'accepted')
                            .map((participant) => (
                                <div key={participant.id}
                                    className="bg-gray-50 p-4 rounded-xl text-xl text-gray-700 
                                             flex items-center"
                                >
                                    <span className="text-2xl mr-3">👤</span>
                                    {participant.display_name}
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* 操作ボタン */}
                <div className="space-y-4">
                    {isCreator && (
                        <button
                            onClick={() => router.push(`/gathering/edit/${id}`)}
                            className="w-full p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 
                                     text-white text-2xl rounded-xl hover:from-yellow-600 
                                     hover:to-yellow-700 transition-all duration-200 flex 
                                     items-center justify-center shadow-lg"
                        >
                            <span className="text-3xl mr-2">✏️</span>
                            寄合の情報を編集する
                        </button>
                    )}

                    <button
                        onClick={() => router.push('/gathering-list')}
                        className="w-full p-4 bg-white text-gray-700 text-2xl rounded-xl 
                                 hover:bg-gray-50 transition-all duration-200 flex items-center 
                                 justify-center shadow-lg border-2 border-gray-200"
                    >
                        <span className="text-3xl mr-2">⬅️</span>
                        寄合一覧に戻る
                    </button>
                </div>
            </div>
        </div>
    );
}
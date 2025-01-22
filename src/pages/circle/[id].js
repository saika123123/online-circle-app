import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CircleDetail() {
    const [circle, setCircle] = useState(null);
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');
    const [isMember, setIsMember] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            fetchCircleDetail();
        }
    }, [id]);

    const fetchCircleDetail = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/circles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCircle(data.circle);
                setMembers(data.members);
                setIsMember(data.circle.is_member);
                setIsCreator(data.circle.creator_id === JSON.parse(atob(token.split('.')[1])).userId);
            } else {
                setError('サークル情報の取得に失敗しました');
            }
        } catch (error) {
            setError('サークル情報の取得中にエラーが発生しました');
        }
    };

    const handleJoin = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/circles/${id}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setIsMember(true);
                fetchCircleDetail();
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('サークル参加中にエラーが発生しました');
        }
    };

    const handleEdit = () => {
        router.push(`/circle/edit/${id}`);
    };

    const getGenreIcon = (genre) => {
        switch (genre) {
            case 'スポーツ': return '⚽';
            case '音楽': return '🎵';
            case '芸術': return '🎨';
            case '学習': return '📚';
            default: return '✨';
        }
    };

    const handleLeave = async () => {
        if (confirm('本当にこのサークルから脱退しますか？')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/circles/${id}/leave`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    setIsMember(false);
                    alert('サークルから脱退しました');
                } else {
                    const data = await response.json();
                    setError(data.message);
                }
            } catch (error) {
                setError('サークル脱退中にエラーが発生しました');
            }
        }
    };

    const handleDelete = async () => {
        if (confirm('本当にこのサークルを削除しますか？')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/circles/${id}/edit`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    router.push('/home');
                } else {
                    const data = await response.json();
                    setError(data.message);
                }
            } catch (error) {
                setError('サークル削除中にエラーが発生しました');
            }
        }
    };

    if (error) return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">
                <p className="text-2xl text-red-600 text-center">
                    <span className="text-3xl mr-2">⚠️</span>
                    {error}
                </p>
                <button
                    onClick={() => router.back()}
                    className="mt-6 px-8 py-3 bg-gray-100 text-xl rounded-xl mx-auto block hover:bg-gray-200"
                >
                    戻る
                </button>
            </div>
        </div>
    );

    if (!circle) return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">
                <p className="text-2xl text-center">読み込み中です...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* サークル情報カード */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 border-2 border-orange-200">
                    <div className="flex items-center justify-center mb-6">
                        <span className="text-5xl mr-4">{getGenreIcon(circle.genre)}</span>
                        <h1 className="text-4xl font-bold text-gray-800">{circle.name}</h1>
                    </div>

                    <div className="space-y-6 text-2xl">
                        <div className="bg-orange-50 p-6 rounded-2xl">
                            <p className="mb-4">
                                <span className="font-bold">テーマ：</span>
                                <span className="text-gray-700">{circle.theme}</span>
                            </p>
                            <p className="mb-4">
                                <span className="font-bold">ジャンル：</span>
                                <span className="text-gray-700">{circle.genre}</span>
                            </p>
                            <p>
                                <span className="font-bold">対象：</span>
                                <span className="text-gray-700">{circle.gender}</span>
                            </p>
                        </div>

                        {circle.details && (
                            <div className="bg-blue-50 p-6 rounded-2xl">
                                <h2 className="font-bold mb-2">サークル活動について</h2>
                                <p className="text-gray-700">{circle.details}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* メンバー一覧カード */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 border-2 border-orange-200">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                        <span className="text-4xl mr-3">👥</span>
                        メンバー
                        <span className="ml-3 text-2xl text-gray-500">({members.length}人)</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {members.map((member) => (
                            <div key={member.id}
                                className="bg-gray-50 p-4 rounded-xl text-xl text-gray-700 flex items-center">
                                <span className="text-2xl mr-3">👤</span>
                                {member.display_name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* アクションボタン */}
                <div className="space-y-4">
                    {!isMember && (
                        <button
                            onClick={handleJoin}
                            className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 
                                     text-white text-2xl rounded-2xl hover:from-green-600 
                                     hover:to-green-700 transition-all duration-200 flex 
                                     items-center justify-center shadow-lg"
                        >
                            <span className="text-3xl mr-3">🤝</span>
                            このサークルに参加する
                        </button>
                    )}

                    {isCreator && (
                        <button
                            onClick={() => router.push(`/circle/edit/${id}`)}
                            className="w-full p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 
                                     text-white text-2xl rounded-2xl hover:from-yellow-600 
                                     hover:to-yellow-700 transition-all duration-200 flex 
                                     items-center justify-center shadow-lg"
                        >
                            <span className="text-3xl mr-3">✏️</span>
                            サークル情報を編集する
                        </button>
                    )}

                    {isMember && !isCreator && (
                        <button
                            onClick={handleLeave}
                            className="w-full p-4 bg-gradient-to-r from-red-500 to-red-600 
                                     text-white text-2xl rounded-2xl hover:from-red-600 
                                     hover:to-red-700 transition-all duration-200 flex 
                                     items-center justify-center shadow-lg"
                        >
                            <span className="text-3xl mr-3">👋</span>
                            サークルを退会する
                        </button>
                    )}

                    <button
                        onClick={() => router.back()}
                        className="w-full p-4 bg-gray-100 text-gray-700 text-2xl rounded-2xl 
                                 hover:bg-gray-200 transition-all duration-200 flex items-center 
                                 justify-center shadow-lg border-2 border-gray-200"
                    >
                        <span className="text-3xl mr-3">⬅️</span>
                        前の画面に戻る
                    </button>
                </div>
            </div>
        </div>
    );
}
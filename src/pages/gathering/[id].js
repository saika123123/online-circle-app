import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function GatheringDetail() {
    const [gathering, setGathering] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [userStatus, setUserStatus] = useState(null);
    const [error, setError] = useState('');
    const [isCreator, setIsCreator] = useState(false);
    const [isGatheringStarted, setIsGatheringStarted] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            fetchGatheringDetail();
            fetchParticipants();
        }
    }, [id]);

    useEffect(() => {
        if (gathering) {
            const checkGatheringStart = () => {
                const now = new Date();
                const gatheringTime = new Date(gathering.datetime);
                const thirtyMinutesLater = new Date(gatheringTime.getTime() + 30 * 60000);
                if (now >= gatheringTime && now < thirtyMinutesLater) {
                    setIsGatheringStarted(true);
                }
            };

            checkGatheringStart();
            const intervalId = setInterval(checkGatheringStart, 60000); // 1分ごとにチェック

            return () => clearInterval(intervalId);
        }
    }, [gathering]);

    const fetchGatheringDetail = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/gatherings/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setGathering(data.gathering);
                setUserStatus(data.userStatus);
                setIsCreator(data.gathering.creator_id === JSON.parse(atob(token.split('.')[1])).userId);
            } else {
                setError('寄合の詳細情報の取得に失敗しました');
            }
        } catch (error) {
            setError('寄合の詳細情報の取得中にエラーが発生しました');
        }
    };

    const fetchParticipants = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/gatherings/${id}/participants`, {
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
            setError('参加者情報の取得中にエラーが発生しました');
        }
    };

    const handleParticipation = async (status) => {
        if (userStatus && !confirm(`参加状況を "${status}" に変更しますか？`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/gatherings/${id}/participate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                setUserStatus(status);
                fetchParticipants();
            } else {
                setError('参加状況の更新に失敗しました');
            }
        } catch (error) {
            setError('参加状況の更新中にエラーが発生しました');
        }
    };

    const handleJoinGathering = () => {
        if (gathering.url) {
            window.open(gathering.url, '_blank');
        }
    };

    const handleEdit = () => {
        router.push(`/gathering/edit/${id}`);
    };

    const handleDelete = async () => {
        if (confirm('本当にこの寄合を削除しますか？')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/gatherings/${id}/edit`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    router.push('/gathering-list');
                } else {
                    const data = await response.json();
                    setError(data.message);
                }
            } catch (error) {
                setError('寄合削除中にエラーが発生しました');
            }
        }
    };

    if (error) return <div className="text-red-500">{error}</div>;
    if (!gathering) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-yellow-50 py-8 px-4 text-gray-800">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border-4 border-blue-500">
                {error && (
                    <div className="text-red-600 text-2xl mb-6 font-bold bg-red-100 p-4 rounded-lg border-2 border-red-500">
                        {error}
                    </div>
                )}
                {!gathering ? (
                    <div className="text-3xl font-bold text-center">読み込み中...</div>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold mb-8 text-center bg-blue-100 p-4 rounded-lg">
                            {gathering.theme}
                        </h1>
                        <div className="space-y-6 text-2xl">
                            <p className="bg-gray-100 p-4 rounded-lg">
                                <span className="font-bold">日時:</span> {new Date(gathering.datetime).toLocaleString()}
                            </p>
                            <p className="bg-gray-100 p-4 rounded-lg">
                                <span className="font-bold">サークル:</span> {gathering.circle_name}
                            </p>
                            <p className="bg-gray-100 p-4 rounded-lg">
                                <span className="font-bold">詳細:</span> {gathering.details}
                            </p>
                            <p className="bg-gray-100 p-4 rounded-lg">
                                <span className="font-bold">参加用URL:</span><br />
                                {gathering.url ? (
                                    <a href={gathering.url} target="_blank" rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline block mt-2 text-center bg-green-200 p-4 rounded-lg border-2 border-green-500">
                                        ここをタップして参加する
                                    </a>
                                ) : '未設定'}
                            </p>
                            <p className="bg-gray-100 p-4 rounded-lg">
                                <span className="font-bold">あなたの参加状況:</span><br />
                                <span className="block mt-2 text-center text-3xl font-bold">
                                    {userStatus === 'accepted' ? '参加予定' :
                                        userStatus === 'declined' ? '不参加' : '未回答'}
                                </span>
                            </p>
                        </div>

                        <div className="mt-12 space-y-6">
                            <button
                                onClick={() => handleParticipation('accepted')}
                                className={`w-full py-6 text-3xl font-bold rounded-xl ${userStatus === 'accepted'
                                    ? 'bg-green-300 text-green-800 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
                                    }`}
                                disabled={userStatus === 'accepted'}
                            >
                                参加する
                            </button>
                            <button
                                onClick={() => handleParticipation('declined')}
                                className={`w-full py-6 text-3xl font-bold rounded-xl ${userStatus === 'declined'
                                    ? 'bg-red-300 text-red-800 cursor-not-allowed'
                                    : 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
                                    }`}
                                disabled={userStatus === 'declined'}
                            >
                                参加しない
                            </button>
                        </div>

                        <h2 className="text-3xl font-bold mt-16 mb-6 text-center bg-blue-100 p-4 rounded-lg">参加者一覧</h2>
                        <ul className="space-y-4 text-2xl">
                            {participants.map((participant) => (
                                <li key={participant.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                                    <span>{participant.display_name}</span>
                                    <span className={`px-4 py-2 rounded-full ${participant.status === 'accepted' ? 'bg-green-200 text-green-800' :
                                        participant.status === 'declined' ? 'bg-red-200 text-red-800' :
                                            'bg-yellow-200 text-yellow-800'
                                        }`}>
                                        {participant.status === 'accepted' ? '参加' :
                                            participant.status === 'declined' ? '不参加' : '未回答'}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {isCreator && (
                            <div className="mt-8">
                                <button
                                    onClick={() => router.push(`/gathering/edit/${id}`)}
                                    className="px-6 py-3 bg-yellow-500 text-white text-xl font-bold rounded-xl hover:bg-yellow-600 active:bg-yellow-700"
                                >
                                    編集
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => router.push('/gathering-list')}
                            className="mt-16 w-full py-6 bg-blue-500 text-white text-3xl font-bold rounded-xl hover:bg-blue-600 active:bg-blue-700"
                        >
                            寄合一覧に戻る
                        </button>
                    </>
                )}
                {isGatheringStarted && gathering.url && (
                    <div className="mt-8 bg-yellow-100 p-4 rounded-lg border-2 border-yellow-500">
                        <p className="text-2xl font-bold text-center">寄合が始まりました！</p>
                        <button
                            onClick={handleJoinGathering}
                            className="mt-4 w-full py-4 bg-green-500 text-white text-2xl font-bold rounded-xl hover:bg-green-600 active:bg-green-700"
                        >
                            寄合に参加する
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
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

    if (error) return <div className="text-red-500">{error}</div>;
    if (!circle) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-2xl font-semibold mb-4">{circle.name}</h2>
                        <p>テーマ: {circle.theme}</p>
                        <p>ジャンル: {circle.genre}</p>
                        <p>対象性別: {circle.gender}</p>
                        <p>詳細: {circle.details}</p>

                        <h3 className="text-xl font-semibold mt-6 mb-2">メンバー一覧</h3>
                        <ul className="list-disc pl-5">
                            {members.map((member) => (
                                <li key={member.id}>{member.display_name}</li>
                            ))}
                        </ul>

                        {!isMember && (
                            <button
                                onClick={handleJoin}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                サークルに参加する
                            </button>
                        )}

                        {isCreator && (
                            <div className="mt-4">
                                <button
                                    onClick={() => router.push(`/circle/edit/${id}`)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    編集
                                </button>
                            </div>
                        )}

                        {isMember && !isCreator && (
                            <button
                                onClick={handleLeave}
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                サークルから脱退
                            </button>
                        )}

                        <button
                            onClick={() => router.back()}
                            className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            戻る
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
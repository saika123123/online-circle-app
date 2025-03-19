import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CircleActivities() {
    const [userCircles, setUserCircles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchUserCircles();
    }, []);

    const fetchUserCircles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/online-circle/api/user-circles', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUserCircles(data.circles);
            } else {
                throw new Error('サークル情報の取得に失敗しました');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="text-center py-10">読み込み中...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">サークル活動記録</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {userCircles.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {userCircles.map((circle) => (
                            <div key={circle.id} className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4">{circle.name}</h2>
                                <p className="text-gray-600 mb-4">{circle.theme}</p>
                                <Link
                                    href={`/circle/${circle.id}/activities`}
                                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    活動記録を見る
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">
                        参加しているサークルはありません。
                    </p>
                )}

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/online-circle/home')}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        ホームに戻る
                    </button>
                </div>
            </div>
        </div>
    );
}
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
            const response = await fetch('/api/circles?type=check', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched circles:', data.circles); // デバッグ用
                setCircles(data.circles);
            } else {
                setError('サークル情報の取得に失敗しました');
            }
        } catch (error) {
            console.error('Error fetching circles:', error); // デバッグ用
            setError('サークル情報の取得中にエラーが発生しました');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-2xl font-semibold mb-4">参加中のサークル</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {circles.length > 0 ? (
                            <ul className="space-y-4">
                                {circles.map((circle) => (
                                    <li key={circle.id} className="border p-4 rounded-md">
                                        <h3 className="font-semibold">{circle.name}</h3>
                                        <p>テーマ: {circle.theme}</p>
                                        <p>ジャンル: {circle.genre}</p>
                                        <button
                                            onClick={() => router.push(`/circle/${circle.id}`)}
                                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            詳細を見る
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>参加しているサークルはありません。</p>
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
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CircleDetail() {
    const [circle, setCircle] = useState(null);
    const [error, setError] = useState('');
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
            } else {
                setError('サークル情報の取得に失敗しました');
            }
        } catch (error) {
            setError('サークル情報の取得中にエラーが発生しました');
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
                        <button
                            onClick={() => router.push('/check-circles')}
                            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            サークル一覧に戻る
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
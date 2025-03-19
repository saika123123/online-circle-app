import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function GatheringHistory() {
    const [pastGatherings, setPastGatherings] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchGatheringHistory();
    }, []);

    const fetchGatheringHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/online-circle/api/gathering-history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPastGatherings(data.gatherings);
            } else {
                setError('履歴の取得に失敗しました');
            }
        } catch (error) {
            setError('履歴の取得中にエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case '作成者':
                return 'bg-purple-100 text-purple-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'declined':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDateTime = (datetime) => {
        return new Date(datetime).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) return <div className="text-center py-10">読み込み中...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">寄合参加履歴</h1>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {pastGatherings.length > 0 ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        日時
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        テーマ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        サークル
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        参加状況
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        アクション
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pastGatherings.map((gathering) => (
                                    <tr key={gathering.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDateTime(gathering.datetime)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {gathering.theme}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {gathering.circle_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(gathering.status)}`}>
                                                {gathering.status === 'accepted' ? '参加' :
                                                    gathering.status === 'declined' ? '不参加' :
                                                        gathering.status === '作成者' ? '作成者' : '未回答'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => router.push(`/online-circle/gathering/${gathering.id}`)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                詳細を見る
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                        <p className="text-gray-500">参加履歴がありません</p>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/online-circle/home')}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        ホームに戻る
                    </button>
                </div>
            </div>
        </div>
    );
}
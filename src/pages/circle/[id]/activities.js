import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CircleActivities() {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newActivity, setNewActivity] = useState({
        title: '',
        content: '',
        activity_date: new Date().toISOString().split('T')[0]
    });

    const router = useRouter();
    const { id: circleId } = router.query;

    useEffect(() => {
        if (circleId) {
            fetchActivities();
        }
    }, [circleId]);

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/online-circle/api/circles/${circleId}/activities`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setActivities(data.activities);
            } else {
                throw new Error('活動記録の取得に失敗しました');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/online-circle/api/circles/${circleId}/activities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newActivity)
            });

            if (response.ok) {
                setIsCreating(false);
                setNewActivity({
                    title: '',
                    content: '',
                    activity_date: new Date().toISOString().split('T')[0]
                });
                fetchActivities();
            } else {
                throw new Error('活動記録の作成に失敗しました');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    if (isLoading) return <div className="text-center py-10">読み込み中...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">活動記録</h1>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        新規記録を作成
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {isCreating && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">新規活動記録</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    タイトル
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={newActivity.title}
                                    onChange={(e) => setNewActivity({
                                        ...newActivity,
                                        title: e.target.value
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    活動日
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={newActivity.activity_date}
                                    onChange={(e) => setNewActivity({
                                        ...newActivity,
                                        activity_date: e.target.value
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    内容
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={newActivity.content}
                                    onChange={(e) => setNewActivity({
                                        ...newActivity,
                                        content: e.target.value
                                    })}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    onClick={() => setIsCreating(false)}
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    保存
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-6">
                    {activities.map((activity) => (
                        <div key={activity.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold">{activity.title}</h3>
                                <div className="text-sm text-gray-500">
                                    {new Date(activity.activity_date).toLocaleDateString()}
                                </div>
                            </div>
                            <p className="text-gray-700 whitespace-pre-line mb-4">{activity.content}</p>
                            <div className="text-sm text-gray-500">
                                記録者: {activity.display_name}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                <button
                            onClick={() => router.push('/home')}
                            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            ホームに戻る
                        </button>
                </div>
            </div>
        </div>
    );
}
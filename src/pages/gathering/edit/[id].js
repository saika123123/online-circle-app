import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditGathering() {
    const [theme, setTheme] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [details, setDetails] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            fetchGatheringDetails();
        }
    }, [id]);

    const fetchGatheringDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/gatherings/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTheme(data.gathering.theme);
                const datetime = new Date(data.gathering.datetime);
                setDate(datetime.toISOString().split('T')[0]);
                setTime(datetime.toTimeString().split(' ')[0].substr(0, 5));
                setDetails(data.gathering.details);
            } else {
                setError('寄合情報の取得に失敗しました');
            }
        } catch (error) {
            setError('寄合情報の取得中にエラーが発生しました');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/gatherings/${id}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    theme,
                    datetime: `${date}T${time}`,
                    details
                }),
            });

            if (response.ok) {
                router.push(`/gathering/${id}`);
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('寄合編集中にエラーが発生しました');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    寄合を編集
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                                テーマ
                            </label>
                            <input
                                id="theme"
                                name="theme"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                日付
                            </label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                時間
                            </label>
                            <input
                                id="time"
                                name="time"
                                type="time"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                                詳細
                            </label>
                            <textarea
                                id="details"
                                name="details"
                                rows="3"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            ></textarea>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mt-2">
                                {error}
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                更新
                            </button>
                            <button
                                type="submit"
                                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                更新
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                戻る
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
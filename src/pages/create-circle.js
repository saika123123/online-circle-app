import { useRouter } from 'next/router';
import { useState } from 'react';

export default function CreateCircle() {
    const [name, setName] = useState('');
    const [theme, setTheme] = useState('');
    const [genre, setGenre] = useState('');
    const [gender, setGender] = useState('');
    const [details, setDetails] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/circles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, theme, genre, gender, details }),
            });

            if (response.ok) {
                router.push('/home');
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('サークル作成中にエラーが発生しました');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    サークルを作成
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                サークル名
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                                サークルテーマ
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
                            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                                ジャンル
                            </label>
                            <select
                                id="genre"
                                name="genre"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                            >
                                <option value="">選択してください</option>
                                <option value="スポーツ">スポーツ</option>
                                <option value="音楽">音楽</option>
                                <option value="芸術">芸術</option>
                                <option value="学習">学習</option>
                                <option value="その他">その他</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                対象性別
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">選択してください</option>
                                <option value="男性のみ">男性のみ</option>
                                <option value="女性のみ">女性のみ</option>
                                <option value="両方">両方</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                                詳細事項
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

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                作成
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
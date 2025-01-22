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
                alert('サークルの作成が完了しました！\n新しい仲間との楽しい活動を始めましょう。');
                router.push('/home');
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('サークル作成中に問題が発生しました。もう一度お試しください。');
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* ヘッダー */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-orange-200">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-4 flex items-center justify-center">
                        <span className="text-5xl mr-3">✨</span>
                        新しいサークルを作る
                    </h1>
                    <p className="text-2xl text-center text-gray-600">
                        あなたの好きなことを通じて、新しい仲間との出会いを創りましょう
                    </p>
                </div>

                {/* メインフォーム */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-orange-200">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* サークル名 */}
                        <div className="bg-blue-50 p-6 rounded-2xl">
                            <label className="text-2xl font-bold text-gray-700 mb-4 block flex items-center">
                                <span className="text-3xl mr-2">📝</span>
                                サークルの名前
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full p-4 text-2xl border-2 border-blue-200 rounded-xl
                                         focus:border-blue-400 focus:ring focus:ring-blue-200"
                                placeholder="例：楽しい写真部、お茶会サークル"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* テーマ */}
                        <div className="bg-green-50 p-6 rounded-2xl">
                            <label className="text-2xl font-bold text-gray-700 mb-4 block flex items-center">
                                <span className="text-3xl mr-2">🎯</span>
                                サークルのテーマ
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full p-4 text-2xl border-2 border-green-200 rounded-xl
                                         focus:border-green-400 focus:ring focus:ring-green-200"
                                placeholder="例：写真撮影を楽しむ、お茶を通じた交流"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                            />
                        </div>

                        {/* ジャンル */}
                        <div className="bg-purple-50 p-6 rounded-2xl">
                            <label className="text-2xl font-bold text-gray-700 mb-4 block flex items-center">
                                <span className="text-3xl mr-2">🎨</span>
                                活動ジャンル
                            </label>
                            <select
                                required
                                className="w-full p-4 text-2xl border-2 border-purple-200 rounded-xl
                                         focus:border-purple-400 focus:ring focus:ring-purple-200"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                            >
                                <option value="">ジャンルを選んでください</option>
                                <option value="スポーツ">スポーツ</option>
                                <option value="音楽">音楽</option>
                                <option value="芸術">芸術</option>
                                <option value="学習">学習</option>
                                <option value="その他">その他</option>
                            </select>
                        </div>

                        {/* 対象性別 */}
                        <div className="bg-rose-50 p-6 rounded-2xl">
                            <label className="text-2xl font-bold text-gray-700 mb-4 block flex items-center">
                                <span className="text-3xl mr-2">👥</span>
                                参加できる方
                            </label>
                            <select
                                required
                                className="w-full p-4 text-2xl border-2 border-rose-200 rounded-xl
                                         focus:border-rose-400 focus:ring focus:ring-rose-200"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">選んでください</option>
                                <option value="男性のみ">男性のみ</option>
                                <option value="女性のみ">女性のみ</option>
                                <option value="両方">どなたでも</option>
                            </select>
                        </div>

                        {/* 詳細情報 */}
                        <div className="bg-orange-50 p-6 rounded-2xl">
                            <label className="text-2xl font-bold text-gray-700 mb-4 block flex items-center">
                                <span className="text-3xl mr-2">📋</span>
                                活動内容の詳細
                            </label>
                            <textarea
                                rows="4"
                                className="w-full p-4 text-2xl border-2 border-orange-200 rounded-xl
                                         focus:border-orange-400 focus:ring focus:ring-orange-200"
                                placeholder="サークルの活動内容や、こんな方に参加してほしいなど、詳しい情報を書いてください"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            />
                        </div>

                        {/* エラーメッセージ */}
                        {error && (
                            <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 p-6 rounded-2xl">
                                <p className="text-2xl text-center flex items-center justify-center">
                                    <span className="text-3xl mr-2">⚠️</span>
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* ボタン */}
                        <div className="space-y-4 pt-4">
                            <button
                                type="submit"
                                className="w-full p-6 bg-gradient-to-r from-green-500 to-green-600 
                                         text-white text-2xl rounded-xl hover:from-green-600 
                                         hover:to-green-700 transition-all duration-200 flex 
                                         items-center justify-center shadow-lg"
                            >
                                <span className="text-3xl mr-2">✨</span>
                                サークルを作成する
                            </button>

                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full p-4 bg-white text-gray-700 text-2xl rounded-xl 
                                         hover:bg-gray-50 transition-all duration-200 flex 
                                         items-center justify-center shadow-lg border-2 border-gray-200"
                            >
                                <span className="text-3xl mr-2">⬅️</span>
                                前の画面に戻る
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
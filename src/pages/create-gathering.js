import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CreateGathering() {
    const [circles, setCircles] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState('');
    const [theme, setTheme] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('00:00');
    const [details, setDetails] = useState('');
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
                setCircles(data.circles);
            } else {
                setError('サークル情報の取得に失敗しました');
            }
        } catch (error) {
            setError('サークル情報の取得中に問題が発生しました');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/online-circle/api/gatherings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    circleId: selectedCircle,
                    theme,
                    datetime: `${date}T${time}`,
                    details
                }),
            });

            if (response.ok) {
                alert('寄合の作成が完了しました！\nメンバーに招待通知が送られます。');
                router.push('/home');
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('寄合作成中に問題が発生しました');
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* ヘッダー */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-orange-200">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-4 flex items-center justify-center">
                        <span className="text-5xl mr-3">📅</span>
                        みんなで楽しむ寄合を作る
                    </h1>
                    <p className="text-2xl text-center text-gray-600">
                        サークルのメンバーと一緒に楽しい時間を過ごしましょう
                    </p>
                </div>

                {/* メインフォーム */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-orange-200">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* サークル選択 */}
                        <div className="bg-blue-50 p-6 rounded-2xl">
                            <label className="text-2xl font-bold text-gray-700 mb-4 block flex items-center">
                                <span className="text-3xl mr-2">👥</span>
                                寄合を開きたいサークルを選ぶ
                            </label>
                            <select
                                required
                                className="w-full p-4 text-2xl border-2 border-blue-200 rounded-xl
                                         focus:border-blue-400 focus:ring focus:ring-blue-200"
                                value={selectedCircle}
                                onChange={(e) => setSelectedCircle(e.target.value)}
                            >
                                <option value="">サークルを選んでください</option>
                                {circles.map((circle) => (
                                    <option key={circle.id} value={circle.id}>{circle.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* テーマ入力 */}
                        <div className="bg-green-50 p-6 rounded-2xl">
                            <label className="text-2xl font-bold text-gray-700 mb-4 block flex items-center">
                                <span className="text-3xl mr-2">✨</span>
                                寄合のテーマ
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full p-4 text-2xl border-2 border-green-200 rounded-xl
                                         focus:border-green-400 focus:ring focus:ring-green-200"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                placeholder="例：お花見会、読書会、など"
                            />
                        </div>

                        {/* 日時選択部分 */}
                        <div className="bg-purple-50 p-6 rounded-2xl">
                            <label className="text-2xl font-bold text-gray-700 mb-4 block flex items-center">
                                <span className="text-3xl mr-2">🕒</span>
                                開催日時を決める
                            </label>

                            {/* 日付選択 */}
                            <div className="mb-6">
                                <p className="text-xl text-gray-600 mb-4">開催日を選ぶ</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* 今日 */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const today = new Date();
                                            setDate(today.toISOString().split('T')[0]);
                                        }}
                                        className={`px-6 py-4 text-xl rounded-xl border-2 transition-colors duration-200 
                         ${date === new Date().toISOString().split('T')[0]
                                                ? 'bg-purple-200 border-purple-300'
                                                : 'bg-white border-purple-200 hover:bg-purple-50'}`}
                                    >
                                        今日
                                    </button>

                                    {/* 明日 */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const tomorrow = new Date();
                                            tomorrow.setDate(tomorrow.getDate() + 1);
                                            setDate(tomorrow.toISOString().split('T')[0]);
                                        }}
                                        className={`px-6 py-4 text-xl rounded-xl border-2 transition-colors duration-200 
                         ${date === new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
                                                ? 'bg-purple-200 border-purple-300'
                                                : 'bg-white border-purple-200 hover:bg-purple-50'}`}
                                    >
                                        明日
                                    </button>

                                    {/* 明後日 */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const dayAfterTomorrow = new Date();
                                            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
                                            setDate(dayAfterTomorrow.toISOString().split('T')[0]);
                                        }}
                                        className={`px-6 py-4 text-xl rounded-xl border-2 transition-colors duration-200 
                         ${date === new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0]
                                                ? 'bg-purple-200 border-purple-300'
                                                : 'bg-white border-purple-200 hover:bg-purple-50'}`}
                                    >
                                        明後日
                                    </button>

                                    {/* その他の日付 */}
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full p-4 text-xl border-2 border-purple-200 rounded-xl
                             focus:border-purple-400 focus:ring focus:ring-purple-200"
                                        />
                                        <div className="absolute -top-3 left-4 bg-purple-50 px-2 text-sm text-gray-600">
                                            その他の日付
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 時間選択 */}
                            <div>
                                <p className="text-xl text-gray-600 mb-4">開始時間を選ぶ</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* 時間選択 */}
                                    <div className="relative">
                                        <select
                                            className="w-full p-4 text-xl border-2 border-purple-200 rounded-xl
                             focus:border-purple-400 focus:ring focus:ring-purple-200"
                                            value={time.split(':')[0]}
                                            onChange={(e) => {
                                                const [_, minutes] = time.split(':');
                                                setTime(`${e.target.value}:${minutes}`);
                                            }}
                                        >
                                            {Array.from({ length: 24 }, (_, i) => (
                                                <option key={i} value={String(i).padStart(2, '0')}>
                                                    {String(i).padStart(2, '0')}時
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute -top-3 left-4 bg-purple-50 px-2 text-sm text-gray-600">
                                            時
                                        </div>
                                    </div>

                                    {/* 分選択 */}
                                    <div className="relative">
                                        <select
                                            className="w-full p-4 text-xl border-2 border-purple-200 rounded-xl
                             focus:border-purple-400 focus:ring focus:ring-purple-200"
                                            value={time.split(':')[1]}
                                            onChange={(e) => {
                                                const [hours, _] = time.split(':');
                                                setTime(`${hours}:${e.target.value}`);
                                            }}
                                        >
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i} value={String(i * 5).padStart(2, '0')}>
                                                    {String(i * 5).padStart(2, '0')}分
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute -top-3 left-4 bg-purple-50 px-2 text-sm text-gray-600">
                                            分
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 詳細入力 */}
                        <div className="bg-orange-50 p-6 rounded-2xl">
                            <label className="text-2xl font-bold text-gray-700 mb-4 block flex items-center">
                                <span className="text-3xl mr-2">📝</span>
                                寄合の詳しい内容
                            </label>
                            <textarea
                                rows="4"
                                className="w-full p-4 text-2xl border-2 border-orange-200 rounded-xl
                                         focus:border-orange-400 focus:ring focus:ring-orange-200"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="参加者に伝えたい内容を書いてください"
                            ></textarea>
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
                                className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 
                                         text-white text-2xl rounded-xl hover:from-green-600 
                                         hover:to-green-700 transition-all duration-200 flex 
                                         items-center justify-center shadow-lg"
                            >
                                <span className="text-3xl mr-2">✨</span>
                                寄合を作成する
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


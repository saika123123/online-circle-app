import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// カレンダーコンポーネント
const Calendar = ({ gatherings }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const days = [];
    const startDay = firstDayOfMonth.getDay();

    for (let i = 0; i < startDay; i++) {
        days.push({ date: null, hasGathering: false });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const hasGathering = gatherings.some(gathering => {
            const gatheringDate = new Date(gathering.datetime);
            return gatheringDate.getDate() === i &&
                gatheringDate.getMonth() === currentDate.getMonth() &&
                gatheringDate.getFullYear() === currentDate.getFullYear();
        });

        days.push({
            date: i,
            hasGathering,
            isToday: new Date().toDateString() === currentDay.toDateString()
        });
    }

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-orange-200">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handlePreviousMonth}
                    className="p-4 text-2xl hover:bg-gray-100 rounded-xl flex items-center"
                >
                    <span className="mr-2">←</span>前の月
                </button>
                <h2 className="text-3xl font-bold">
                    {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
                </h2>
                <button
                    onClick={handleNextMonth}
                    className="p-4 text-2xl hover:bg-gray-100 rounded-xl flex items-center"
                >
                    次の月<span className="ml-2">→</span>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-xl text-center">
                {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                    <div key={day} className="p-2 font-bold">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`p-4 text-xl text-center rounded-xl border-2 
                                 ${day.date ? 'border-gray-200' : 'border-transparent bg-gray-50'} 
                                 ${day.isToday ? 'bg-blue-100 border-blue-300' : ''} 
                                 ${day.hasGathering ? 'bg-green-100 border-green-300' : ''}`}
                    >
                        {day.date}
                        {day.hasGathering && (
                            <div className="text-sm text-green-600 mt-1">
                                ●
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-center space-x-4 text-lg">
                <div className="flex items-center">
                    <span className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded-full mr-2"></span>
                    今日
                </div>
                <div className="flex items-center">
                    <span className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded-full mr-2"></span>
                    寄合の予定
                </div>
            </div>
        </div>
    );
};

// メインコンポーネント
export default function GatheringList() {
    const [participatingGatherings, setParticipatingGatherings] = useState([]);
    const [declinedGatherings, setDeclinedGatherings] = useState([]);
    const [invitedGatherings, setInvitedGatherings] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    const fetchGatherings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/gatherings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const currentTime = new Date();
                setParticipatingGatherings(filterFutureGatherings(data.participatingGatherings, currentTime));
                setDeclinedGatherings(filterFutureGatherings(data.declinedGatherings, currentTime));
                setInvitedGatherings(filterFutureGatherings(data.invitedGatherings, currentTime));
            } else {
                setError('寄合の情報を取得できませんでした');
            }
        } catch (error) {
            setError('寄合の情報の取得中に問題が発生しました');
        }
    };

    useEffect(() => {
        fetchGatherings();
    }, []);

    const filterFutureGatherings = (gatherings, currentTime) => {
        return gatherings.filter(gathering => {
            const gatheringTime = new Date(gathering.datetime);
            const thirtyMinutesLater = new Date(gatheringTime.getTime() + 2 * 60000);
            return thirtyMinutesLater > currentTime;
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const handleCancelParticipation = async (gatheringId) => {
        if (confirm('この寄合への参加を取り消しますか？')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `/api/gatherings/${gatheringId}/participate`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ status: 'declined' })
                    }
                );
                if (response.ok) {
                    fetchGatherings();
                }
            } catch (error) {
                setError('参加状況の更新中に問題が発生しました');
            }
        }
    };

    const renderGatheringList = (gatherings, title, icon, bgColor, borderColor) => (
        <div className={`mb-8 bg-white rounded-3xl shadow-lg p-8 border-2 ${borderColor}`}>
            <h2 className={`text-3xl font-bold mb-6 text-gray-800 ${bgColor} p-4 rounded-xl flex items-center justify-center`}>
                <span className="text-4xl mr-3">{icon}</span>
                {title}
            </h2>
            {gatherings.length > 0 ? (
                <div className="space-y-6">
                    {gatherings.map((gathering) => (
                        <div key={gathering.id}
                            className="bg-white border-2 border-gray-100 p-6 rounded-2xl 
                                     hover:shadow-lg transition-shadow duration-200">
                            <div className="flex flex-col space-y-4">
                                <h3 className="text-2xl font-bold text-gray-800">{gathering.theme}</h3>
                                <div className="flex items-center text-xl text-gray-600">
                                    <span className="text-2xl mr-2">🕒</span>
                                    {formatDate(gathering.datetime)}
                                </div>
                                <div className="flex items-center text-xl text-gray-600">
                                    <span className="text-2xl mr-2">👥</span>
                                    {gathering.circle_name}
                                </div>
                                <div className="flex space-x-4">
                                    <Link
                                        href={`/gathering/${gathering.id}`}
                                        className="flex-1 p-4 bg-gradient-to-r from-blue-500 to-blue-600 
                                                 text-white text-xl rounded-xl hover:from-blue-600 
                                                 hover:to-blue-700 transition-all duration-200 flex 
                                                 items-center justify-center"
                                    >
                                        <span className="text-2xl mr-2">👀</span>
                                        詳しく見る
                                    </Link>
                                    {gathering.status === 'accepted' && (
                                        <button
                                            onClick={() => handleCancelParticipation(gathering.id)}
                                            className="flex-1 p-4 bg-red-100 text-red-600 text-xl 
                                                     rounded-xl hover:bg-red-200 transition-colors 
                                                     duration-200 flex items-center justify-center"
                                        >
                                            <span className="text-2xl mr-2">❌</span>
                                            参加を取り消す
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-2xl text-center text-gray-600 py-4">
                    予定されている寄合はありません
                </p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-orange-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* ヘッダー */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-orange-200">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-4 flex items-center justify-center">
                        <span className="text-5xl mr-3">📅</span>
                        寄合の予定一覧
                    </h1>
                    <p className="text-2xl text-center text-gray-600">
                        参加予定の寄合をご確認いただけます
                    </p>
                </div>

                {/* エラーメッセージ */}
                {error && (
                    <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 p-6 rounded-2xl mb-8">
                        <p className="text-2xl text-center flex items-center justify-center">
                            <span className="text-3xl mr-2">⚠️</span>
                            {error}
                        </p>
                    </div>
                )}

                {/* カレンダー */}
                <Calendar gatherings={participatingGatherings} />

                {/* 新しい寄合作成へのリンク
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border-2 border-green-200">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                            <span className="text-4xl mr-3">✨</span>
                            新しい寄合を開きませんか？
                        </h2>
                        <p className="text-2xl text-gray-600 mb-6">
                            サークルのメンバーと楽しい時間を計画しましょう
                        </p>
                        <button
                            onClick={() => router.push('/create-gathering')}
                            className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 
                                     text-white text-2xl rounded-2xl hover:from-green-600 
                                     hover:to-green-700 transition-all duration-200 flex 
                                     items-center justify-center mx-auto shadow-lg"
                        >
                            <span className="text-3xl mr-2">📝</span>
                            寄合を作成する
                        </button>
                    </div>
                </div> */}

                {/* 参加予定の寄合 */}
                {renderGatheringList(
                    participatingGatherings,
                    "参加予定の寄合",
                    "🎉",
                    "bg-blue-50",
                    "border-blue-200"
                )}

                {/* 招待された寄合
                {renderGatheringList(
                    invitedGatherings,
                    "招待された寄合",
                    "📨",
                    "bg-green-50",
                    "border-green-200"
                )} */}

                {/* 不参加の寄合 */}
                {renderGatheringList(
                    declinedGatherings,
                    "不参加の寄合",
                    "🚫",
                    "bg-gray-50",
                    "border-gray-200"
                )}

                {/* 戻るボタン */}
                <button
                    onClick={() => router.push('/home')}
                    className="w-full p-4 bg-white text-gray-700 text-2xl rounded-xl 
                             hover:bg-gray-50 transition-all duration-200 flex items-center 
                             justify-center shadow-lg border-2 border-orange-200"
                >
                    <span className="text-3xl mr-2">🏠</span>
                    ホームに戻る
                </button>
            </div>
        </div>
    );
}
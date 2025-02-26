import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ja from 'date-fns/locale/ja';
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
    'ja': ja,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function GatheringList() {
    const [participatingGatherings, setParticipatingGatherings] = useState([]);
    const [declinedGatherings, setDeclinedGatherings] = useState([]);
    const [invitedGatherings, setInvitedGatherings] = useState([]);
    const [error, setError] = useState('');
    const [view, setView] = useState('calendar'); // 'list' or 'calendar'
    const router = useRouter();

    useEffect(() => {
        fetchGatherings();
    }, []);

    const fetchGatherings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/online-circle/api/gatherings', {
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
                setError('寄合の取得に失敗しました');
            }
        } catch (error) {
            setError('寄合の取得中にエラーが発生しました');
        }
    };

    const filterFutureGatherings = (gatherings, currentTime) => {
        return gatherings.filter(gathering => {
            const gatheringTime = new Date(gathering.datetime);
            const thirtyMinutesLater = new Date(gatheringTime.getTime() + 2 * 60000);
            return thirtyMinutesLater > currentTime;
        });
    };

    // カレンダー用のイベントデータを作成
    const calendarEvents = [
        ...participatingGatherings.map(g => ({
            id: g.id,
            title: g.theme,
            start: new Date(g.datetime),
            end: new Date(new Date(g.datetime).getTime() + 60 * 60 * 1000), // 1時間後
            status: 'participating',
            circle: g.circle_name
        })),
        ...invitedGatherings.map(g => ({
            id: g.id,
            title: g.theme,
            start: new Date(g.datetime),
            end: new Date(new Date(g.datetime).getTime() + 60 * 60 * 1000),
            status: 'invited',
            circle: g.circle_name
        })),
        ...declinedGatherings.map(g => ({
            id: g.id,
            title: g.theme,
            start: new Date(g.datetime),
            end: new Date(new Date(g.datetime).getTime() + 60 * 60 * 1000),
            status: 'declined',
            circle: g.circle_name
        }))
    ];

    const eventStyleGetter = (event) => {
        let backgroundColor = '';
        switch (event.status) {
            case 'participating':
                backgroundColor = '#4CAF50';
                break;
            case 'invited':
                backgroundColor = '#FFC107';
                break;
            case 'declined':
                backgroundColor = '#F44336';
                break;
            default:
                backgroundColor = '#2196F3';
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    const renderGatheringList = (gatherings, title, icon) => (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="mr-2">{icon}</span>
                {title}
            </h2>
            {gatherings.length > 0 ? (
                <ul className="space-y-4">
                    {gatherings.map((gathering) => (
                        <li key={gathering.id} className="border-2 border-gray-200 p-4 rounded-lg hover:bg-gray-50">
                            <h3 className="text-xl font-semibold mb-2">{gathering.theme}</h3>
                            <p className="text-lg mb-1">
                                <span role="img" aria-label="日時" className="mr-2">{'\u{1F552}'}</span>
                                {new Date(gathering.datetime).toLocaleString()}
                            </p>
                            <p className="text-lg mb-2">
                                <span role="img" aria-label="サークル" className="mr-2">{'\u{1F465}'}</span>
                                {gathering.circle_name}
                            </p>
                            <Link href={`/online-circle/gathering/${gathering.id}`} className="inline-block mt-2 bg-blue-500 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-blue-600">
                                詳細を見る
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xl">該当する寄合はありません。</p>
            )}
        </div>
    );

    const CustomToolbar = (toolbar) => {
        return (
            <div className="flex justify-center items-center mb-4 p-4 bg-white rounded-lg shadow space-x-4">
                <h3 className="text-xl font-bold">
                    {format(toolbar.date, 'yyyy年 M月')}
                </h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setView('calendar')}
                        className={`px-4 py-2 rounded ${view === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        カレンダー
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        リスト
                    </button>
                </div>
            </div>
        );
    };   
 

    const CustomEvent = ({ event }) => (
        <div className="p-1">
            <div className="font-bold">{event.title}</div>
            <div className="text-sm">{event.circle}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">寄合一覧</h1>
                {error && <p className="text-xl text-red-500 mb-4 text-center">{error}</p>}

                <CustomToolbar 
                    date={new Date()} 
                    onNavigate={() => {}} 
                />

                {view === 'calendar' ? (
                    <div className="bg-white p-4 rounded-lg shadow mb-8" style={{ height: '600px' }}>
                        <Calendar
                            localizer={localizer}
                            events={calendarEvents}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            eventPropGetter={eventStyleGetter}
                            components={{
                                event: CustomEvent
                            }}
                            messages={{
                                next: "次へ",
                                previous: "前へ",
                                today: "今日",
                                month: "月",
                                week: "週",
                                day: "日",
                                agenda: "予定",
                                date: "日付",
                                time: "時間",
                                event: "イベント",
                                noEventsInRange: "この期間にイベントはありません"
                            }}
                            onSelectEvent={(event) => router.push(`/online-circle/gathering/${event.id}`)}
                        />
                    </div>
                ) : (
                    <>
                        {renderGatheringList(participatingGatherings, "参加予定の寄合", '\u{1F389}')}
                        {renderGatheringList(declinedGatherings, "不参加の寄合", '\u{1F6AB}')}
                        {renderGatheringList(invitedGatherings, "招待された寄合（未回答）", '\u{2709}')}
                    </>
                )}

                <button
                    onClick={() => router.push('/online-circle/home')}
                    className="mt-8 w-full bg-green-500 text-white text-xl font-bold py-4 px-6 rounded-lg hover:bg-green-600"
                >
                    ホームに戻る
                </button>
            </div>
        </div>
    );
}

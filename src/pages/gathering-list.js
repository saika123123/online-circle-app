import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function GatheringList() {
    const [participatingGatherings, setParticipatingGatherings] = useState([]);
    const [declinedGatherings, setDeclinedGatherings] = useState([]);
    const [invitedGatherings, setInvitedGatherings] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchGatherings();
    }, []);

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
                                <span role="img" aria-label="日時" className="mr-2">🕒</span>
                                {new Date(gathering.datetime).toLocaleString()}
                            </p>
                            <p className="text-lg mb-2">
                                <span role="img" aria-label="サークル" className="mr-2">👥</span>
                                {gathering.circle_name}
                            </p>
                            <Link href={`/gathering/${gathering.id}`} className="inline-block mt-2 bg-blue-500 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-blue-600">
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

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">寄合一覧</h1>
                {error && <p className="text-xl text-red-500 mb-4 text-center">{error}</p>}

                {renderGatheringList(participatingGatherings, "参加予定の寄合", "🎉")}
                {renderGatheringList(declinedGatherings, "不参加の寄合", "🚫")}
                {renderGatheringList(invitedGatherings, "招待された寄合（未回答）", "✉️")}

                <button
                    onClick={() => router.push('/home')}
                    className="mt-8 w-full bg-green-500 text-white text-xl font-bold py-4 px-6 rounded-lg hover:bg-green-600"
                >
                    ホームに戻る
                </button>
            </div>
        </div>
    );
}
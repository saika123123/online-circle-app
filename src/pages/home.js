import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function Home() {
    const [displayName, setDisplayName] = useState('');
    const [upcomingGatherings, setUpcomingGatherings] = useState([]);
    const router = useRouter();
    const checkIntervalRef = useRef(null);
    const lastCheckTimeRef = useRef(null);

    const fetchUpcomingGatherings = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching upcoming gatherings...');
            const response = await fetch('/api/upcoming-gatherings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUpcomingGatherings(data.upcomingGatherings);
                console.log('Updated upcoming gatherings:', data.upcomingGatherings);

                if (data.serverTime) {
                    const serverTime = new Date(data.serverTime);
                    const localTime = new Date();
                    const timeOffset = serverTime.getTime() - localTime.getTime();
                    localStorage.setItem('serverTimeOffset', timeOffset.toString());
                }
            } else {
                console.error('Error fetching upcoming gatherings:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching upcoming gatherings:', error);
        }
    }, []);

    const notifyAndRedirect = useCallback((gathering) => {
        console.log('Notifying and redirecting for gathering:', gathering);
        if (Notification.permission === "granted") {
            new Notification(`寄合「${gathering.theme}」が始まります！`, {
                body: 'クリックして詳細画面に移動します。',
                icon: '/path/to/your/notification-icon.png' // 通知用のアイコンがあれば指定してください
            });
        }
        // 寄合詳細画面へ遷移
        router.push(`/gathering/${gathering.id}`);
    }, [router]);

    const checkGatheringTime = useCallback(() => {
        const now = new Date();
        const serverTimeOffset = localStorage.getItem('serverTimeOffset');
        const adjustedNow = serverTimeOffset ? new Date(now.getTime() + parseInt(serverTimeOffset)) : now;

        console.log('Checking gathering time at:', adjustedNow.toISOString());

        if (lastCheckTimeRef.current && (adjustedNow - lastCheckTimeRef.current) < 55000) {
            console.log('Skipping check, last check was too recent');
            return;
        }

        lastCheckTimeRef.current = adjustedNow;

        upcomingGatherings.forEach(gathering => {
            const gatheringTime = new Date(gathering.datetime);
            const twoMinutesBefore = new Date(gatheringTime.getTime() - 2 * 60000);
            const thirtyMinutesLater = new Date(gatheringTime.getTime() + 2 * 60000);
            console.log(`Gathering: ${gathering.theme}, Time: ${gatheringTime.toISOString()}`);

            // 開始時間の2分前から30分後までの範囲で通知と遷移を行う
            if (adjustedNow >= twoMinutesBefore && adjustedNow < thirtyMinutesLater) {
                console.log('Gathering should start now or very soon!', gathering);
                notifyAndRedirect(gathering);
            }
        });
    }, [upcomingGatherings, notifyAndRedirect]);

    useEffect(() => {
        console.log('Home component mounted');
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, redirecting to login');
            router.push('/login');
        } else {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setDisplayName(decodedToken.displayName || decodedToken.username);
            fetchUpcomingGatherings();
        }

        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission !== "granted" && Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }

        const fetchInterval = setInterval(fetchUpcomingGatherings, 60000); // 1分ごとに更新
        const checkInterval = setInterval(checkGatheringTime, 60000); // 1分ごとにチェック

        // コンポーネントがマウントされた直後にもチェックを実行
        checkGatheringTime();

        return () => {
            console.log('Home component unmounting');
            clearInterval(fetchInterval);
            clearInterval(checkInterval);
        };
    }, [fetchUpcomingGatherings, router, checkGatheringTime]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '2rem',
    };

    const cardStyle = {
        maxWidth: '36rem',
        margin: '0 auto',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderRadius: '1rem',
        padding: '2rem',
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '1rem',
        backgroundColor: '#4a90e2',
        color: 'white',
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        textDecoration: 'none',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
    };

    const iconStyle = {
        marginRight: '1rem',
        width: '2rem',
        height: '2rem',
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>オンラインサークルサービス</h1>
                <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem', textAlign: 'center' }}>{displayName}さん、サークルへようこそ</p>
                <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>なにをしますか？</p>
                <div>
                    <Link href="/join-circle" style={buttonStyle}>
                        <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        サークルに入る
                    </Link>
                    <Link href="/check-circles" style={buttonStyle}>
                        <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
                        </svg>
                        サークルを確認
                    </Link>
                    <Link href="/create-circle" style={buttonStyle}>
                        <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        サークルを作成
                    </Link>
                    <Link href="/create-gathering" style={buttonStyle}>
                        <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        寄合を作成
                    </Link>
                    <Link href="/check-invitations" style={buttonStyle}>
                        <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        寄合招待を確認
                    </Link>
                    <Link href="/gathering-list" style={buttonStyle}>
                        <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        寄合一覧
                    </Link>
                    <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}>
                        <svg style={iconStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        ログアウト
                    </button>
                </div>
            </div>
        </div>
    );
}
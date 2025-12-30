import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';

const LobbyScreen = () => {
    const { socket } = useSocket();
    const { gameState } = useGame(); // We might not need this here if we handle lobby state locally or lift it

    const [view, setView] = useState('menu'); // menu, create, join, lobby
    const [playerName, setPlayerName] = useState('');
    const [lobbyCode, setLobbyCode] = useState('');
    const [lobbyState, setLobbyState] = useState(null);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (!socket) return;

        socket.on('lobbyUpdated', (lobby) => {
            setLobbyState(lobby);
            setView('lobby');
            setError('');
        });

        socket.on('error', (err) => {
            setError(err);
        });

        return () => {
            socket.off('lobbyUpdated');
            socket.off('error');
        };
    }, [socket]);

    const handleCreate = () => {
        if (!playerName) return setError('Wpisz najpierw swoje imię');
        socket.emit('createLobby', { name: playerName });
    };

    const handleJoin = () => {
        if (!playerName || !lobbyCode) return setError('Wpisz imię i kod lobby');
        socket.emit('joinLobby', { code: lobbyCode.toUpperCase(), name: playerName });
    };

    const handleStart = () => {
        if (!lobbyState) return;
        socket.emit('startGame', { code: lobbyState.code });
    };

    if (view === 'menu') {
        return (
            <div className="lobby-container" style={{ textAlign: 'center', maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
                <h1>Sherlock - Multiplayer</h1>
                <input
                    type="text"
                    placeholder="Wpisz swoje imię"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    style={{ padding: '8px', fontSize: '1.2em', width: '100%', marginBottom: '20px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button onClick={() => setView('join')} disabled={!playerName}>Dołącz do gry</button>
                    <button onClick={handleCreate} disabled={!playerName}>Stwórz nową grę</button>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        );
    }

    if (view === 'join') {
        return (
            <div className="lobby-container" style={{ textAlign: 'center', maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
                <h2>Dołącz do lobby</h2>
                <input
                    type="text"
                    placeholder="Wpisz 6-literowy kod"
                    value={lobbyCode}
                    onChange={e => setLobbyCode(e.target.value)}
                    style={{ padding: '8px', fontSize: '1.2em', width: '100%', marginBottom: '20px', textTransform: 'uppercase' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifySelf: 'center' }}>
                    <button onClick={handleJoin}>Dołącz</button>
                    <button onClick={() => setView('menu')} style={{ background: '#666' }}>Powrót</button>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        );
    }

    if (view === 'lobby' && lobbyState) {
        const isHost = lobbyState.players.find(p => p.name === playerName)?.isHost;
        return (
            <div className="lobby-container" style={{ textAlign: 'center', maxWidth: '500px', margin: 'auto', paddingTop: '50px' }}>
                <h2>Kod lobby: <span style={{ fontFamily: 'monospace', fontSize: '1.5em', border: '1px solid #444', padding: '0 10px' }}>{lobbyState.code}</span></h2>

                <div style={{ margin: '30px 0', border: '1px solid #333', padding: '20px', borderRadius: '8px' }}>
                    <h3>Gracze ({lobbyState.players.length}/4)</h3>
                    <p style={{ color: '#666', fontSize: '1.5em' }}>(min. 3)</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {lobbyState.players.map(p => (
                            <li key={p.id} style={{ padding: '5px', color: p.name === playerName ? 'lime' : 'white' }}>
                                {p.name} {p.isHost ? '(Host)' : ''}
                            </li>
                        ))}
                    </ul>
                </div>

                {isHost ? (
                    <button
                        onClick={handleStart}
                        style={{ fontSize: '1.2em', padding: '10px 30px', opacity: lobbyState.players.length < 3 ? 0.5 : 1 }}
                        disabled={lobbyState.players.length < 3}
                    >
                        Rozpocznij grę
                    </button>
                ) : (
                    <p>Czekanie na rozpoczęcie gry przez hosta...</p>
                )}
            </div>
        );
    }

    return null;
};

export default LobbyScreen;

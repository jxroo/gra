import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';
import { ICONS } from './Icons';

const LobbyScreen = () => {
    const { socket } = useSocket();
    const { gameState } = useGame();

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
        if (!playerName) return setError('Please enter your name');
        socket.emit('createLobby', { name: playerName });
    };

    const handleJoin = () => {
        if (!playerName || !lobbyCode) return setError('Please enter Name and Code');
        socket.emit('joinLobby', { code: lobbyCode.toUpperCase(), name: playerName });
    };

    const handleStart = () => {
        if (!lobbyState) return;
        socket.emit('startGame', { code: lobbyState.code });
    };

    const commonContainerStyle = {
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        margin: 'auto',
        padding: '2rem',
        background: 'rgba(20, 20, 25, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 0 40px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };

    const inputStyle = {
        padding: '12px',
        fontSize: '1.2em',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--color-text-highlight)',
        outline: 'none',
        fontFamily: 'var(--font-ui)',
        textAlign: 'center'
    };

    const buttonStyle = {
        padding: '12px 24px',
        fontSize: '1em',
        background: 'rgba(212, 160, 23, 0.1)',
        border: '1px solid var(--color-primary)',
        color: 'var(--color-primary)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontWeight: '700',
        width: '100%'
    };

    const buttonPrimaryStyle = {
        ...buttonStyle,
        background: 'var(--color-primary)',
        color: '#111',
        boxShadow: '0 0 15px rgba(212, 160, 23, 0.3)'
    };

    if (view === 'menu') {
        return (
            <div className="lobby-container" style={commonContainerStyle}>
                <h1 style={{
                    fontFamily: 'var(--font-header)',
                    color: 'var(--color-primary)',
                    fontSize: '2.5rem',
                    marginBottom: '10px',
                    textShadow: '0 0 20px rgba(212, 160, 23, 0.2)'
                }}>Sherlock</h1>

                <p style={{ color: 'var(--color-text-muted)', marginTop: '-10px', marginBottom: '10px' }}>
                    Dedukcja i Blef
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>TOŻSAMOŚĆ</label>
                    <input
                        type="text"
                        placeholder="NAZWA AGENTA"
                        value={playerName}
                        onChange={e => setPlayerName(e.target.value)}
                        style={inputStyle}
                        onKeyDown={e => e.key === 'Enter' && playerName && setView('join')}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                    <button
                        onClick={() => setView('join')}
                        disabled={!playerName}
                        style={{ ...buttonStyle, opacity: !playerName ? 0.5 : 1 }}
                    >
                        Dołącz do Operacji
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!playerName}
                        style={{ ...buttonPrimaryStyle, opacity: !playerName ? 0.5 : 1 }}
                    >
                        Nowa Sprawa
                    </button>
                </div>
                {error && <p style={{ color: 'var(--color-accent-danger)' }}>{error}</p>}
            </div>
        );
    }

    if (view === 'join') {
        return (
            <div className="lobby-container" style={commonContainerStyle}>
                <h2 style={{ fontFamily: 'var(--font-header)', color: 'var(--color-text-main)' }}>Bezpieczny Dostęp</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>KOD DOSTĘPU</label>
                    <input
                        type="text"
                        placeholder="______"
                        value={lobbyCode}
                        onChange={e => setLobbyCode(e.target.value)}
                        style={{ ...inputStyle, letterSpacing: '5px', fontWeight: '700' }}
                        maxLength={6}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                    <button onClick={() => setView('menu')} style={{ ...buttonStyle, flex: 1, borderColor: '#666', color: '#888' }}>Anuluj</button>
                    <button onClick={handleJoin} style={{ ...buttonPrimaryStyle, flex: 1 }}>Połącz</button>
                </div>
                {error && <p style={{ color: 'var(--color-accent-danger)' }}>{error}</p>}
            </div>
        );
    }

    if (view === 'lobby' && lobbyState) {
        const isHost = lobbyState.players.find(p => p.name === playerName)?.isHost;
        return (
            <div className="lobby-container" style={commonContainerStyle}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    <h2 style={{ marginBottom: '5px', fontSize: '1rem', color: 'var(--color-text-muted)' }}>LOBBY OPERACYJNE</h2>
                    <div style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '3em',
                        fontWeight: '700',
                        color: 'var(--color-primary)',
                        letterSpacing: '5px'
                    }}>
                        {lobbyState.code}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--color-text-main)', textAlign: 'left', marginBottom: '10px' }}>
                        Agenci ({lobbyState.players.length}/4)
                    </h3>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '10px',
                        borderRadius: '4px'
                    }}>
                        {lobbyState.players.map(p => (
                            <div key={p.id} style={{
                                padding: '10px',
                                background: p.name === playerName ? 'rgba(212, 160, 23, 0.1)' : 'rgba(255,255,255,0.05)',
                                color: p.name === playerName ? 'var(--color-primary)' : 'var(--color-text-main)',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                border: p.name === playerName ? '1px solid rgba(212, 160, 23, 0.3)' : '1px solid transparent'
                            }}>
                                <span>{p.name} {p.name === playerName && '(TY)'}</span>
                                {p.isHost && <ICONS.Badge size={16} color="var(--color-primary)" title="Host" />}
                            </div>
                        ))}
                        {Array.from({ length: Math.max(0, 4 - lobbyState.players.length) }).map((_, i) => (
                            <div key={i} style={{
                                padding: '10px',
                                border: '1px dashed rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                textAlign: 'left'
                            }}>
                                Szukanie...
                            </div>
                        ))}
                    </div>
                </div>

                {lobbyState.players.length < 3 && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Oczekiwanie na min. 3 agentów...</p>}

                {isHost ? (
                    <button
                        onClick={handleStart}
                        style={{
                            ...buttonPrimaryStyle,
                            opacity: lobbyState.players.length < 3 ? 0.5 : 1,
                            cursor: lobbyState.players.length < 3 ? 'not-allowed' : 'pointer'
                        }}
                        disabled={lobbyState.players.length < 3}
                    >
                        ROZPOCZNIJ GRĘ
                    </button>
                ) : (
                    <div style={{ padding: '10px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        Oczekiwanie na rozpoczęcie...
                    </div>
                )}
            </div>
        );
    }

    return null;
};

export default LobbyScreen;

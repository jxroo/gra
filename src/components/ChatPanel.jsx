import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';
import { ICONS } from './Icons';

export const ChatPanel = () => {
    const { socket } = useSocket();
    const { gameState, localPlayer } = useGame(); // Added localPlayer to identify own messages
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!socket) return;
        const handleMsg = (msg) => setMessages(prev => [...prev, msg]);
        socket.on('chatMessage', handleMsg);
        return () => socket.off('chatMessage', handleMsg);
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = (e) => {
        e.preventDefault();
        if (!input.trim() || !gameState.lobbyCode) return;
        socket.emit('gameAction', {
            code: gameState.lobbyCode,
            type: 'chat',
            payload: { message: input }
        });
        setInput('');
    };

    return (
        <div className="panel-glass" style={{
            height: '240px',
            marginTop: 'var(--spacing-md)',
            background: 'rgba(15, 15, 20, 0.85)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '700',
                fontFamily: 'var(--font-header)'
            }}>
                <ICONS.Book size={14} color="var(--color-primary)" /> Szyfrowany Kanał
            </div>

            {/* Messages Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
            }}>
                {messages.map((m, i) => {
                    const isSystem = m.sender === 'System';
                    const isMe = m.sender === (localPlayer?.name || 'Ja'); // Basic check, better if we use IDs

                    return (
                        <div key={i} style={{
                            fontSize: '0.85rem',
                            padding: '4px 8px',
                            background: isSystem ? 'transparent' : 'rgba(255,255,255,0.03)',
                            borderLeft: isSystem ? 'none' : `2px solid ${isMe ? 'var(--color-primary)' : 'var(--color-accent-info)'}`,
                            marginLeft: isMe ? 'auto' : '0',
                            maxWidth: '90%',
                            borderRadius: '0 4px 4px 0'
                        }}>
                            {!isMe && !isSystem && <span style={{
                                fontWeight: '700',
                                color: 'var(--color-text-muted)',
                                fontSize: '0.75rem',
                                display: 'block',
                                marginBottom: '2px'
                            }}>{m.sender}</span>}

                            <span style={{
                                color: isSystem ? 'var(--color-secondary)' : 'var(--color-text-main)',
                                fontStyle: isSystem ? 'italic' : 'normal'
                            }}>
                                {m.text}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={send} style={{
                display: 'flex',
                padding: '8px',
                background: 'rgba(0,0,0,0.2)',
                gap: '8px'
            }}>
                <input
                    style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '6px 10px',
                        color: 'var(--color-text-highlight)',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-ui)',
                        outline: 'none'
                    }}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Wpisz wiadomość..."
                />
                <button type="submit" style={{
                    border: '1px solid var(--color-primary-dim)',
                    background: 'rgba(212, 160, 23, 0.1)',
                    color: 'var(--color-primary)',
                    padding: '0 12px',
                    fontSize: '0.8rem',
                    borderRadius: '4px'
                }}>
                    WYŚLIJ
                </button>
            </form>
        </div>
    );
};

export const NotesPanel = () => (
    <div className="panel-glass" style={{
        marginTop: 'var(--spacing-md)',
        height: '150px',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(15, 15, 20, 0.85)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
    }}>
        <div style={{
            fontSize: '0.8rem',
            color: 'var(--color-primary)',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '700',
            fontFamily: 'var(--font-header)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <ICONS.Search size={14} /> Prywatne Notatki
        </div>
        <textarea
            placeholder="Notatki śledcze..."
            style={{
                flex: 1,
                background: 'transparent',
                color: 'var(--color-text-main)',
                border: 'none',
                padding: '10px',
                fontSize: '0.9rem',
                resize: 'none',
                fontFamily: 'var(--font-ui)',
                outline: 'none',
                lineHeight: '1.5'
            }}
        />
    </div>
);

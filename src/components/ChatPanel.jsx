import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';

export const ChatPanel = () => {
    const { socket } = useSocket();
    const { gameState } = useGame();
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
        <div style={{ display: 'flex', flexDirection: 'column', height: '200px', border: '1px solid #444', marginTop: '10px', background: '#222' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '5px', fontSize: '0.8rem' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', color: '#aaa' }}>{m.sender}: </span>
                        <span>{m.text}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={send} style={{ display: 'flex', borderTop: '1px solid #444' }}>
                <input
                    style={{ flex: 1, background: 'local', border: 'none', padding: '5px', color: 'white' }}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Chat..."
                />
                <button type="submit" style={{ border: 'none', background: '#444', color: 'white', cursor: 'pointer' }}>Send</button>
            </form>
        </div>
    );
};

export const NotesPanel = () => (
    <div style={{ border: '1px solid #444', marginTop: '10px', background: '#222', height: '80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '0.7rem', color: '#666', padding: '2px 5px', background: '#1a1a1a' }}>NOTES</div>
        <textarea
            placeholder="Your private notes..."
            style={{
                flex: 1,
                background: '#222',
                color: '#ddd',
                border: 'none',
                padding: '5px',
                fontSize: '0.8rem',
                resize: 'none'
            }}
        />
    </div>
);

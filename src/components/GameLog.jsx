import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { ICONS } from './Icons';

const GameLog = () => {
    const { messageLog } = useGame();
    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messageLog]);

    const getLogStyle = (type) => {
        const baseStyle = {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            marginBottom: '6px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            lineHeight: '1.4',
            color: '#eee',
            borderLeft: '4px solid transparent',
            background: 'rgba(255, 255, 255, 0.03)'
        };

        let specificStyle = {};
        let Icon = ICONS.Info;
        let iconColor = '#888';

        switch (type) {
            case 'system':
                specificStyle = { background: 'transparent', color: '#888', fontStyle: 'italic', paddingLeft: '0' };
                Icon = ICONS.Info; // Or maybe no icon?
                break;
            case 'investigation':
                specificStyle = { background: 'rgba(0, 100, 255, 0.08)', borderLeftColor: '#00aaff' };
                Icon = ICONS.Search;
                iconColor = '#00aaff';
                break;
            case 'investigation_bot':
                specificStyle = { background: 'rgba(120, 0, 255, 0.08)', borderLeftColor: '#aa44ff' };
                Icon = ICONS.Robot;
                iconColor = '#aa44ff';
                break;
            case 'response':
                specificStyle = { background: 'rgba(0, 200, 100, 0.08)', borderLeftColor: '#00cc66' };
                Icon = ICONS.Check;
                iconColor = '#00cc66';
                break;
            case 'response_empty':
                specificStyle = { color: '#aaa' };
                Icon = ICONS.Cross;
                iconColor = '#666';
                break;
            case 'interrogation':
                specificStyle = { background: 'rgba(255, 140, 0, 0.08)', borderLeftColor: 'orange' };
                Icon = ICONS.Badge; // Badge represents authority/interrogation
                iconColor = 'orange';
                break;
            case 'accusation':
                specificStyle = { background: 'rgba(255, 50, 50, 0.1)', borderLeftColor: '#ff4444', fontWeight: '500' };
                Icon = ICONS.Alert;
                iconColor = '#ff4444';
                break;
            case 'success':
                specificStyle = {
                    background: 'rgba(255, 215, 0, 0.15)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    color: '#ffd700',
                    justifyContent: 'center',
                    fontSize: '1rem'
                };
                Icon = ICONS.Badge;
                iconColor = '#ffd700';
                break;
            case 'failure':
                specificStyle = { background: 'rgba(200, 0, 0, 0.15)', color: '#ff6666' };
                Icon = ICONS.Skull;
                iconColor = '#ff6666';
                break;
            case 'error':
                specificStyle = { color: '#ff5555' };
                Icon = ICONS.Alert;
                iconColor = '#ff5555';
                break;
            default:
                break;
        }

        return { style: { ...baseStyle, ...specificStyle }, Icon, iconColor };
    };

    return (
        <div className="game-log-wrapper" style={{
            marginTop: '0.5rem',
            background: 'rgba(20, 20, 30, 0.95)',
            borderTop: '1px solid #444',
            borderRadius: '8px',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0
        }}>
            {/* Separate Header */}
            <h4 style={{
                margin: '0',
                padding: '12px 1rem',
                color: '#aaa',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'rgb(30, 30, 40)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '2px solid #444',
                borderRadius: '8px 8px 0 0'
            }}>
                <ICONS.Book size={14} /> Przebieg gry
            </h4>

            {/* Scrollable Container */}
            <div className="game-log-container" style={{
                padding: '1rem',
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0
            }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {messageLog.length === 0 && (
                        <div style={{ color: '#555', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                            Gra rozpoczęta. Czekam na ruch...
                        </div>
                    )}

                    {messageLog.map(msg => {
                        const { style, Icon, iconColor } = getLogStyle(msg.type);
                        return (
                            <div key={msg.id} style={style}>
                                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                    <Icon size={18} color={iconColor} />
                                </div>
                                <div>{msg.text}</div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
};

export default GameLog;

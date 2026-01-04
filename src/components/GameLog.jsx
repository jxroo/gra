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
            gap: '12px',
            padding: '10px 14px',
            marginBottom: '8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            color: 'var(--color-text-main)',
            borderLeft: '4px solid transparent',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
            transition: 'all 0.2s ease'
        };

        let specificStyle = {};
        let Icon = ICONS.Info;
        let iconColor = 'var(--color-text-muted)';

        switch (type) {
            case 'system':
                specificStyle = {
                    background: 'transparent',
                    color: 'var(--color-text-muted)',
                    fontStyle: 'italic',
                    paddingLeft: '0',
                    borderLeft: 'none'
                };
                Icon = ICONS.Info;
                break;
            case 'investigation':
                specificStyle = {
                    background: 'rgba(52, 152, 219, 0.1)',
                    borderLeftColor: 'var(--color-accent-info)'
                };
                Icon = ICONS.Search;
                iconColor = 'var(--color-accent-info)';
                break;
            case 'investigation_bot':
                specificStyle = {
                    background: 'rgba(155, 89, 182, 0.1)',
                    borderLeftColor: '#9b59b6'
                };
                Icon = ICONS.Robot;
                iconColor = '#9b59b6';
                break;
            case 'response':
                specificStyle = {
                    background: 'rgba(39, 174, 96, 0.1)',
                    borderLeftColor: 'var(--color-accent-success)'
                };
                Icon = ICONS.Check;
                iconColor = 'var(--color-accent-success)';
                break;
            case 'response_empty':
                specificStyle = {
                    color: 'var(--color-text-muted)',
                    background: 'rgba(255,255,255,0.02)'
                };
                Icon = ICONS.Cross;
                iconColor = 'var(--color-text-muted)';
                break;
            case 'interrogation':
                specificStyle = {
                    background: 'rgba(230, 126, 34, 0.15)',
                    borderLeftColor: '#e67e22',
                    boxShadow: '0 0 10px rgba(230, 126, 34, 0.1)'
                };
                Icon = ICONS.Badge;
                iconColor = '#e67e22';
                break;
            case 'accusation':
                specificStyle = {
                    background: 'rgba(192, 57, 43, 0.15)',
                    borderLeftColor: 'var(--color-accent-danger)',
                    fontWeight: '600',
                    color: '#ffcccc'
                };
                Icon = ICONS.Alert;
                iconColor = 'var(--color-accent-danger)';
                break;
            case 'success':
                specificStyle = {
                    background: 'rgba(212, 160, 23, 0.15)',
                    border: '1px solid var(--color-primary-dim)',
                    color: 'var(--color-primary)',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: '700'
                };
                Icon = ICONS.Badge;
                iconColor = 'var(--color-primary)';
                break;
            case 'failure':
                specificStyle = {
                    background: 'rgba(192, 57, 43, 0.15)',
                    border: '1px solid var(--color-accent-danger)',
                    color: '#ff6666'
                };
                Icon = ICONS.Skull;
                iconColor = '#ff6666';
                break;
            case 'error':
                specificStyle = { color: 'var(--color-accent-danger)' };
                Icon = ICONS.Alert;
                iconColor = 'var(--color-accent-danger)';
                break;
            default:
                break;
        }

        return { style: { ...baseStyle, ...specificStyle }, Icon, iconColor };
    };

    return (
        <div className="sheet-container" style={{
            marginTop: 'var(--spacing-md)',
            flex: 1,
            minHeight: 0,
            background: 'rgba(20, 20, 25, 0.9)'
        }}>
            {/* Header */}
            <h4 style={{
                margin: '0',
                padding: '12px 1rem',
                color: 'var(--color-primary-dim)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-header)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '1px solid var(--color-border)'
            }}>
                <ICONS.Book size={16} color="var(--color-primary)" /> Dziennik Sprawy
            </h4>

            {/* Scrollable Container */}
            <div className="game-log-container" style={{
                padding: 'var(--spacing-md)',
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0
            }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {messageLog.length === 0 && (
                        <div style={{
                            color: 'var(--color-text-muted)',
                            fontStyle: 'italic',
                            textAlign: 'center',
                            marginTop: '40px',
                            fontFamily: 'var(--font-header)',
                            opacity: 0.6
                        }}>
                            Śledztwo rozpoczęte. Oczekiwanie na dane...
                        </div>
                    )}

                    {messageLog.map(msg => {
                        const { style, Icon, iconColor } = getLogStyle(msg.type);
                        return (
                            <div key={msg.id} style={style}>
                                <div style={{
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    filter: `drop-shadow(0 0 5px ${iconColor})` // Soft glow for icons
                                }}>
                                    <Icon size={20} color={iconColor} />
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

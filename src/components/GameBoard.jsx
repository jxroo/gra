import React from 'react';
import { useGame } from '../context/GameContext';

import ActionControls from './ActionControls';
import { ICONS } from './Icons';

const getIconComponent = (symbolName) => {
    switch (symbolName) {
        case 'czaszka': return ICONS.Skull;
        case 'zarowka': return ICONS.Bulb;
        case 'naszyjnik': return ICONS.Necklace;
        case 'odznaka': return ICONS.Badge;
        case 'ksiazka': return ICONS.Book;
        case 'piesc': return ICONS.Fist;
        case 'fajka': return ICONS.Pipe;
        case 'oko': return ICONS.Eye;
        default: return null;
    }
};

const GameBoard = () => {
    const { gameState, localPlayer } = useGame();

    return (
        <div className="game-controls" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-lg)',
            padding: 'var(--spacing-sm)',
            /* height: '100%' REMOVED */
        }}>
            {/* Crime Scene Section */}
            <div className="center-cards" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.3)',
                padding: '10px',
                borderRadius: '8px',
                border: '1px dashed var(--color-border)'
            }}>
                <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '1rem',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-header)',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                }}>
                    Miejsce Zbrodni
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Single criminal card face-down/up */}
                    {gameState.criminal && (
                        gameState.phase === 'GAME_OVER' ? (
                            <div className="card" style={{
                                width: '100px', height: '150px',
                                background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)',
                                color: '#111',
                                borderRadius: '8px', padding: '8px',
                                display: 'flex', flexDirection: 'column',
                                fontSize: '0.9rem',
                                border: '2px solid #fff',
                                boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                                zIndex: 100,
                                transform: 'scale(1.1)',
                                transition: 'all 0.5s ease'
                            }}>
                                <div style={{
                                    fontWeight: '900',
                                    fontSize: '0.9rem',
                                    marginBottom: '8px',
                                    borderBottom: '2px solid rgba(0,0,0,0.1)',
                                    textAlign: 'center',
                                    fontFamily: 'var(--font-header)'
                                }}>SPRAWCA</div>
                                <div style={{
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    marginBottom: 'auto',
                                    textAlign: 'center',
                                    fontFamily: 'var(--font-ui)'
                                }}>{gameState.criminal.name}</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                                    {gameState.criminal.symbols.map(s => {
                                        const IconComponent = getIconComponent(s);
                                        return (
                                            <div key={s} style={{
                                                background: 'rgba(255,255,255,0.4)',
                                                borderRadius: '4px',
                                                padding: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {IconComponent && <IconComponent size={24} color="#111" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="card-back" style={{
                                width: '80px', height: '120px',
                                background: 'linear-gradient(135deg, #2c3e50 0%, #000 100%)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '6px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: '2rem', fontWeight: 'bold', color: 'rgba(255,215,0,0.2)',
                                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                            }}>
                                ?
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Hand Section */}
            <div className="my-hand" style={{
                /* marginTop: 'auto', REMOVED */
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                padding: '10px',
                borderRadius: '8px'
            }}>
                <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '0.9rem',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-header)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>Twoje Dowody</h3>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {localPlayer.hand.map((card) => (
                        <div key={card.id} className="card" style={{
                            width: '90px', height: '140px',
                            background: 'linear-gradient(180deg, #e0e0e0 0%, #bdc3c7 100%)',
                            color: '#2c3e50',
                            borderRadius: '6px', padding: '6px',
                            display: 'flex', flexDirection: 'column',
                            fontSize: '0.9rem',
                            border: '1px solid #999',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            position: 'relative',
                            transition: 'transform 0.2s'
                        }}>
                            {/* Clip/Tape visual if wanted later */}
                            <div style={{
                                fontWeight: '700',
                                fontSize: '0.8rem',
                                marginBottom: '4px',
                                lineHeight: '1.1',
                                borderBottom: '1px solid rgba(0,0,0,0.1)',
                                paddingBottom: '4px',
                                fontFamily: 'var(--font-ui)'
                            }}>{card.name}</div>

                            <div style={{
                                marginTop: 'auto',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '3px',
                                justifyContent: 'center'
                            }}>
                                {card.symbols.map(s => {
                                    const IconComponent = getIconComponent(s);
                                    let color = '#333';
                                    switch (s) {
                                        case 'czaszka': color = '#7f8c8d'; break;
                                        case 'zarowka': color = '#f5b041'; break;
                                        case 'naszyjnik': color = '#8e44ad'; break;
                                        case 'odznaka': color = '#d35400'; break;
                                        case 'ksiazka': color = '#2980b9'; break;
                                        case 'piesc': color = '#c0392b'; break;
                                        case 'fajka': color = '#5d4037'; break;
                                        case 'oko': color = '#27ae60'; break;
                                    }

                                    return (
                                        <div key={s} title={s} style={{
                                            background: 'rgba(255,255,255,0.7)',
                                            borderRadius: '3px',
                                            padding: '4px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: 'inset 0 0 2px rgba(0,0,0,0.1)'
                                        }}>
                                            {IconComponent ? <IconComponent size={20} color={color} strokeWidth={2} /> : s[0]}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ActionControls />
        </div>
    );
};

export default GameBoard;

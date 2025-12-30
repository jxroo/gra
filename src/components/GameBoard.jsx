import React from 'react';
import { useGame } from '../context/GameContext';

import ActionControls from './ActionControls';
import { ICONS } from './Icons';

const getIconComponent = (symbolName) => {
    switch (symbolName) {
        case 'czaszka': return ICONS.Skull;
        case 'zarowka': return ICONS.Bulb; // Assuming you have Bulb or similar
        case 'naszyjnik': return ICONS.Necklace;
        case 'odznaka': return ICONS.Badge;
        case 'ksiazka': return ICONS.Book; // Assuming Book
        case 'piesc': return ICONS.Fist; // Assuming Fist
        case 'fajka': return ICONS.Pipe; // Assuming Pipe
        case 'oko': return ICONS.Eye;
        default: return null;
    }
};

const GameBoard = () => {
    const { gameState, localPlayer, messageLog } = useGame();

    return (
        <div className="game-controls">
            <div className="center-cards">
                <h3>Miejsce zbrodni</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Single criminal card face-down */}
                    {gameState.criminal && (
                        gameState.phase === 'GAME_OVER' ? (
                            <div className="card" style={{
                                width: '80px', height: '120px',
                                background: '#ffd700', color: '#111',
                                borderRadius: '6px', padding: '6px',
                                display: 'flex', flexDirection: 'column',
                                fontSize: '0.8rem',
                                border: '3px solid #f1c40f',
                                boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
                                zIndex: 100
                            }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '8px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>SPRAWCA</div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: 'auto' }}>{gameState.criminal.name}</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                                    {gameState.criminal.symbols.map(s => {
                                        const IconComponent = getIconComponent(s);
                                        return (
                                            <div key={s} style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {IconComponent && <IconComponent size={20} color="#111" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="card-back" style={{
                                width: '60px', height: '90px',
                                background: '#444', border: '2px solid #666',
                                borderRadius: '4px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', fontWeight: 'bold', color: '#666'
                            }}>
                                ?
                            </div>
                        )
                    )}
                </div>
            </div>



            {/* Opponent info removed as requested */}

            {/* Your Hand */}
            <div className="my-hand" style={{ marginTop: 'auto', textAlign: 'center' }}>
                <h3>Twoja ręka</h3>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {localPlayer.hand.map((card) => (
                        <div key={card.id} className="card" style={{
                            width: '80px', height: '120px',
                            background: '#eee', color: '#333',
                            borderRadius: '6px', padding: '4px',
                            display: 'flex', flexDirection: 'column',
                            fontSize: '0.8rem',
                            border: '1px solid #999'
                        }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '4px', lineHeight: '1.1' }}>{card.name}</div>

                            <div style={{
                                marginTop: 'auto',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '2px',
                                justifyContent: 'center'
                            }}>
                                {card.symbols.map(s => {
                                    const IconComponent = getIconComponent(s);
                                    let color = '#333';
                                    switch (s) {
                                        case 'czaszka': color = '#7f8c8d'; break;
                                        case 'zarowka': color = '#f1c40f'; break;
                                        case 'naszyjnik': color = '#9b59b6'; break;
                                        case 'odznaka': color = '#e67e22'; break;
                                        case 'ksiazka': color = '#2980b9'; break;
                                        case 'piesc': color = '#c0392b'; break;
                                        case 'fajka': color = '#5d4037'; break;
                                        case 'oko': color = '#27ae60'; break;
                                    }

                                    return (
                                        <div key={s} title={s} style={{
                                            background: '#ddd', borderRadius: '4px', padding: '4px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {IconComponent ? <IconComponent size={22} color={color} strokeWidth={2} /> : s[0]}
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

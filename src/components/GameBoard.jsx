import React from 'react';
import { useGame } from '../context/GameContext';

import ActionControls from './ActionControls';

const GameBoard = () => {
    const { gameState, localPlayer, messageLog } = useGame();

    return (
        <div className="game-controls">
            <div className="center-cards">
                <h3>Crime Scene</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {gameState.centerCards.map((card, idx) => (
                        <div key={idx} className="card-back" style={{
                            width: '60px', height: '90px',
                            background: '#444', border: '2px solid #666',
                            borderRadius: '4px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            ?
                        </div>
                    ))}
                </div>
            </div>

            <div className="log-area" style={{
                position: 'absolute', top: 10, right: 10,
                width: '250px', height: '150px',
                background: 'rgba(0,0,0,0.5)', overflowY: 'auto',
                fontSize: '0.8rem', padding: '5px'
            }}>
                {messageLog.map(msg => <div key={msg.id}>{msg.text}</div>)}
            </div>

            {/* Opponent info removed as requested */}

            <div className="my-hand" style={{ marginTop: 'auto', textAlign: 'center' }}>
                <h3>Your Hand</h3>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {localPlayer.hand.map((card) => (
                        <div key={card.id} className="card" style={{
                            width: '80px', height: '120px',
                            background: '#eee', color: '#333',
                            borderRadius: '6px', padding: '4px',
                            display: 'flex', flexDirection: 'column',
                            fontSize: '0.8rem'
                        }}>
                            <strong>{card.name}</strong>
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
                                {card.symbols.map(s => (
                                    <span key={s} title={s} style={{ fontSize: '10px', background: '#ccc', borderRadius: '4px', padding: '2px' }}>
                                        {s[0].toUpperCase()}
                                    </span>
                                ))}
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

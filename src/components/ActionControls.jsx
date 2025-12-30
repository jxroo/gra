import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SYMBOLS, CARDS, SYMBOL_EMOJIS } from '../data/gameData';

const ActionControls = () => {
    const { gameState, localPlayer, performInvestigation, performInterrogation, performAccusation } = useGame();
    const [mode, setMode] = useState('IDLE'); // IDLE, SELECT_SYMBOL_INV, SELECT_PLAYER_INT, SELECT_SYMBOL_INT, SELECT_SUSPECT
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);

    const isMyTurn = gameState.currentPlayerId === localPlayer.id;

    if (localPlayer.eliminated) {
        return (
            <div className="controls" style={{ padding: '1rem', background: 'rgba(255, 0, 0, 0.1)', marginTop: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 0, 0, 0.3)', textAlign: 'center' }}>
                <strong style={{ color: '#ff4444' }}>Jesteś wyeliminowany(a)</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#aaa' }}>Możesz jedynie obserwować przebieg gry.</p>
            </div>
        );
    }

    if (!isMyTurn) {
        return <div className="controls" style={{ padding: '1rem', background: '#333', marginTop: '1rem', borderRadius: '8px' }}>
            <em>Czekanie na gracza {gameState.players.find(p => p.id === gameState.currentPlayerId)?.name}</em>
        </div>;
    }

    const cancel = () => {
        setMode('IDLE');
        setSelectedPlayerId(null);
    };

    return (
        <div className="controls" style={{ padding: '1rem', background: '#333', marginTop: '1rem', borderRadius: '8px' }}>
            {mode === 'IDLE' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setMode('SELECT_SYMBOL_INV')}>Dochodzenie</button>
                    <button onClick={() => setMode('SELECT_PLAYER_INT')}>Przesłuchanie</button>
                    <button onClick={() => setMode('SELECT_SUSPECT')} style={{ backgroundColor: '#c0392b', color: 'white' }}>Zgadnij sprawcę</button>
                </div>
            )}

            {mode === 'SELECT_SYMBOL_INV' && (
                <div>
                    <h4>Wybierz symbol do sprawdzenia:</h4>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {Object.values(SYMBOLS).map(sym => (
                            <button key={sym} onClick={() => { performInvestigation(sym); cancel(); }}>{sym}</button>
                        ))}
                    </div>
                    <button onClick={cancel} style={{ marginTop: '10px', background: '#555' }}>Anuluj</button>
                </div>
            )}

            {mode === 'SELECT_PLAYER_INT' && (
                <div>
                    <h4>Wybierz gracza do przesłuchania:</h4>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {gameState.players.filter(p => p.id !== localPlayer.id).map(p => (
                            <button key={p.id} onClick={() => { setSelectedPlayerId(p.id); setMode('SELECT_SYMBOL_INT'); }}>
                                {p.name}
                            </button>
                        ))}
                    </div>
                    <button onClick={cancel} style={{ marginTop: '10px', background: '#555' }}>Anuluj</button>
                </div>
            )}

            {mode === 'SELECT_SYMBOL_INT' && (
                <div>
                    <h4>Zapytaj gracza {gameState.players.find(p => p.id === selectedPlayerId)?.name} o:</h4>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {Object.values(SYMBOLS).map(sym => (
                            <button key={sym} onClick={() => { performInterrogation(selectedPlayerId, sym); cancel(); }}>{sym}</button>
                        ))}
                    </div>
                    <button onClick={cancel} style={{ marginTop: '10px', background: '#555' }}>Anuluj</button>
                </div>
            )}

            {mode === 'SELECT_SUSPECT' && (
                <div>
                    <h4>Kogo oskarżasz?</h4>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', maxHeight: '200px', overflowY: 'auto' }}>
                        {CARDS.map(card => (
                            <button key={card.id} onClick={() => { performAccusation(card.id); cancel(); }}>
                                {card.name}
                            </button>
                        ))}
                    </div>
                    <button onClick={cancel} style={{ marginTop: '10px', background: '#555' }}>Anuluj</button>
                </div>
            )}
        </div>
    );
};

export default ActionControls;

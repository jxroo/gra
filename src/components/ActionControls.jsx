import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SYMBOLS, CARDS } from '../data/gameData';
import { ICONS } from './Icons';

const SYMBOL_COLORS = {
    [SYMBOLS.FAJKA]: '#8d6e63',
    [SYMBOLS.ZAROWKA]: '#ffeb3b',
    [SYMBOLS.PIESC]: '#e57373',
    [SYMBOLS.ODZNAKA]: '#ffd700',
    [SYMBOLS.KSIAZKA]: '#4fc3f7',
    [SYMBOLS.NASZYJNIK]: '#ce93d8',
    [SYMBOLS.OKO]: '#a5d6a7',
    [SYMBOLS.CZASZKA]: '#cfd8dc',
};

const SYMBOL_ICONS = {
    [SYMBOLS.FAJKA]: ICONS.Pipe,
    [SYMBOLS.ZAROWKA]: ICONS.Bulb,
    [SYMBOLS.PIESC]: ICONS.Fist,
    [SYMBOLS.ODZNAKA]: ICONS.Badge,
    [SYMBOLS.KSIAZKA]: ICONS.Book,
    [SYMBOLS.NASZYJNIK]: ICONS.Necklace,
    [SYMBOLS.OKO]: ICONS.Eye,
    [SYMBOLS.CZASZKA]: ICONS.Skull,
};

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
        const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
        return <div className="controls" style={{ padding: '1rem', background: '#333', marginTop: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <em style={{ color: '#aaa' }}>Czekanie na gracza <span style={{ color: '#fff', fontWeight: 'bold' }}>{currentPlayer?.name}</span>...</em>
        </div>;
    }

    const cancel = () => {
        setMode('IDLE');
        setSelectedPlayerId(null);
    };

    const SymbolSelector = ({ onSelect }) => (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginTop: '10px'
        }}>
            {Object.values(SYMBOLS).map(sym => {
                const Icon = SYMBOL_ICONS[sym];
                return (
                    <button
                        key={sym}
                        onClick={() => onSelect(sym)}
                        style={{
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#444',
                            border: '1px solid #555',
                            borderRadius: '6px'
                        }}
                    >
                        <Icon size={24} color={SYMBOL_COLORS[sym]} />
                        <span style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' }}>{sym}</span>
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="controls" style={{ padding: '1rem', background: '#333', marginTop: '1rem', borderRadius: '8px' }}>
            {mode === 'IDLE' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ flex: 1 }} onClick={() => setMode('SELECT_SYMBOL_INV')}>Dochodzenie</button>
                    <button style={{ flex: 1 }} onClick={() => setMode('SELECT_PLAYER_INT')}>Przesłuchanie</button>
                    <button
                        style={{ flex: 1, backgroundColor: '#c0392b', color: 'white' }}
                        onClick={() => setMode('SELECT_SUSPECT')}
                    >
                        Zgadnij sprawcę
                    </button>
                </div>
            )}

            {mode === 'SELECT_SYMBOL_INV' && (
                <div>
                    <h4 style={{ margin: '0 0 10px 0' }}>Wybierz symbol do sprawdzenia:</h4>
                    <SymbolSelector onSelect={(sym) => { performInvestigation(sym); cancel(); }} />
                    <button onClick={cancel} style={{ marginTop: '15px', background: '#555', width: '100%' }}>Anuluj</button>
                </div>
            )}

            {mode === 'SELECT_PLAYER_INT' && (
                <div>
                    <h4 style={{ margin: '0 0 10px 0' }}>Wybierz gracza do przesłuchania:</h4>
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                        {gameState.players.filter(p => p.id !== localPlayer.id).map(p => (
                            <button key={p.id} onClick={() => { setSelectedPlayerId(p.id); setMode('SELECT_SYMBOL_INT'); }}>
                                {p.name}
                            </button>
                        ))}
                    </div>
                    <button onClick={cancel} style={{ marginTop: '15px', background: '#555', width: '100%' }}>Anuluj</button>
                </div>
            )}

            {mode === 'SELECT_SYMBOL_INT' && (
                <div>
                    <h4 style={{ margin: '0 0 10px 0' }}>
                        Zapytaj gracza <span style={{ color: 'lime' }}>{gameState.players.find(p => p.id === selectedPlayerId)?.name}</span> o:
                    </h4>
                    <SymbolSelector onSelect={(sym) => { performInterrogation(selectedPlayerId, sym); cancel(); }} />
                    <button onClick={cancel} style={{ marginTop: '15px', background: '#555', width: '100%' }}>Anuluj</button>
                </div>
            )}

            {mode === 'SELECT_SUSPECT' && (
                <div>
                    <h4 style={{ margin: '0 0 10px 0' }}>Kogo oskarżasz?</h4>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '8px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '4px'
                    }}>
                        {CARDS.map(card => (
                            <button
                                key={card.id}
                                onClick={() => { performAccusation(card.id); cancel(); }}
                                style={{ textAlign: 'left', padding: '10px', fontSize: '0.85rem' }}
                            >
                                {card.name}
                            </button>
                        ))}
                    </div>
                    <button onClick={cancel} style={{ marginTop: '15px', background: '#555', width: '100%' }}>Anuluj</button>
                </div>
            )}
        </div>
    );
};

export default ActionControls;

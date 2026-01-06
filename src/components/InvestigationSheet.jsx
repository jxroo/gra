import React, { useState } from 'react';
import { SYMBOLS, SYMBOL_COUNTS, CARDS, SYMBOL_EMOJIS } from '../data/gameData';
import { useGame } from '../context/GameContext';
import { ICONS } from './Icons';

// Use polished colors from palette or specific accent colors
const SYMBOL_COLORS = {
    [SYMBOLS.FAJKA]: '#8d6e63',
    [SYMBOLS.ZAROWKA]: '#ffd700',
    [SYMBOLS.PIESC]: '#e57373',
    [SYMBOLS.ODZNAKA]: '#ffb74d',
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

const InvestigationSheet = () => {
    const { gameState, localPlayer } = useGame();
    const [gridState, setGridState] = useState({});
    const [characterState, setCharacterState] = useState({});

    const orderedSymbols = [
        SYMBOLS.FAJKA, SYMBOLS.ZAROWKA, SYMBOLS.PIESC, SYMBOLS.ODZNAKA,
        SYMBOLS.KSIAZKA, SYMBOLS.NASZYJNIK, SYMBOLS.OKO, SYMBOLS.CZASZKA
    ];

    const toggleCell = (pIdx, sym) => {
        // Only allow toggling via input for now, but keeping function for future click-handling if needed
    };

    const toggleCharacter = (id) => {
        setCharacterState(prev => ({ ...prev, [id]: !prev[id] }));
    };

    let playerRows = ['Me', 'P2', 'P3', 'P4'];
    if (gameState.players.length > 0) {
        const localIdx = gameState.players.findIndex(p => p.id === localPlayer.id);
        if (localIdx !== -1) {
            playerRows = [
                gameState.players[localIdx].name,
                ...gameState.players.filter((_, idx) => idx !== localIdx).map(p => p.name)
            ];
        } else {
            playerRows = gameState.players.map(p => p.name);
        }
    }

    return (
        <div className="sheet-layout" style={{
            display: 'flex',
            flexDirection: 'column',
            /* height: '100%', REMOVED */
            gap: 'var(--spacing-md)',
            color: 'var(--color-text-main)'
        }}>
            {/* Header Area */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '8px',
                marginBottom: '4px'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontFamily: 'var(--font-header)',
                    color: 'var(--color-primary)'
                }}>
                    Tabela Dochodzenia
                </h3>
            </div>

            {/* Grid Area */}
            <div className="table-container" style={{
                overflowX: 'auto',
                flex: '0 0 auto',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
                padding: '4px'
            }}>
                <table style={{ borderCollapse: 'separate', borderSpacing: '0', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{
                                padding: '8px',
                                borderBottom: '2px solid var(--color-border)',
                                borderRight: '1px solid rgba(255,255,255,0.1)'
                            }}></th>
                            {orderedSymbols.map(sym => {
                                const Icon = SYMBOL_ICONS[sym];
                                return (
                                    <th key={sym} style={{
                                        borderBottom: '2px solid var(--color-border)',
                                        borderLeft: '1px solid rgba(255,255,255,0.05)',
                                        padding: '8px 4px',
                                        textAlign: 'center',
                                        minWidth: '50px'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                            <Icon size={20} color={SYMBOL_COLORS[sym]} />
                                            <span style={{ fontSize: '0.7em', color: 'var(--color-text-muted)' }}>{SYMBOL_COUNTS[sym]}</span>
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {playerRows.map((pName, pIdx) => (
                            <tr key={pIdx}>
                                <td style={{
                                    padding: '8px',
                                    fontWeight: '700',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    borderRight: '1px solid rgba(255,255,255,0.1)',
                                    color: pIdx === 0 ? 'var(--color-primary)' : 'var(--color-text-main)',
                                    textAlign: 'right',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {pName}
                                </td>
                                {orderedSymbols.map(sym => {
                                    const state = gridState[`${pIdx}_${sym}`];
                                    const bgColor = state === '✓' ? 'rgba(39, 174, 96, 0.2)' :
                                        state === '✗' ? 'rgba(192, 57, 43, 0.2)' :
                                            state === '?' ? 'rgba(212, 160, 23, 0.1)' : 'transparent';

                                    return (
                                        <td key={sym}
                                            style={{
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                borderLeft: '1px solid rgba(255,255,255,0.05)',
                                                textAlign: 'center',
                                                height: '40px',
                                                backgroundColor: bgColor,
                                                transition: 'background-color 0.2s',
                                                position: 'relative',
                                            }}
                                        >
                                            <input
                                                type="text"
                                                maxLength={1}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'transparent',
                                                    color: state === '?' ? 'var(--color-primary)' : 
                                                           state === '✗' ? 'var(--color-accent-danger)' : 
                                                           state === '✓' ? 'var(--color-accent-success)' : '#fff',
                                                    border: 'none',
                                                    textAlign: 'center',
                                                    fontSize: '1.2rem',
                                                    fontFamily: 'var(--font-ui)',
                                                    fontWeight: '700',
                                                    caretColor: 'var(--color-primary)',
                                                    outline: 'none',
                                                    padding: 0
                                                }}
                                                value={state || ''}
                                                onChange={e => {
                                                    const val = e.target.value.toUpperCase(); // Force uppercase for symbols if used
                                                    setGridState(prev => ({ ...prev, [`${pIdx}_${sym}`]: val }));
                                                }}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Suspects Lineup */}
            <div style={{
                /* marginTop: 'auto', REMOVED */
                /* flex: 1, REMOVED */
                display: 'flex',
                flexDirection: 'column',
                /* minHeight: '120px', REMOVED */
                borderTop: '1px solid var(--color-border)',
                paddingTop: 'var(--spacing-md)'
            }}>
                <h4 style={{
                    fontFamily: 'var(--font-header)',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.8rem',
                    marginBottom: '8px',
                    marginLeft: '4px'
                }}>
                    Lista Podejrzanych
                </h4>
                <div style={{
                    display: 'flex',
                    gap: '4px',
                    flexWrap: 'wrap',
                    paddingBottom: '8px',
                    justifyContent: 'center'
                }}>
                    {CARDS.map(char => (
                        <div key={char.id}
                            onClick={() => toggleCharacter(char.id)}
                            style={{
                                flexShrink: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '8px', /* Restoration: Back to 8px */
                                background: characterState[char.id] ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.05)',
                                opacity: characterState[char.id] ? 0.4 : 1,
                                borderRadius: '4px',
                                width: '120px', /* Increased from 90px to 120px */
                                border: characterState[char.id] ? '1px solid #333' : '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                transform: characterState[char.id] ? 'scale(0.95)' : 'scale(1)',
                                filter: characterState[char.id] ? 'grayscale(0.8)' : 'none'
                            }}
                        >
                            <div style={{
                                fontSize: '0.8rem', /* Increased from 0.7rem */
                                textAlign: 'center',
                                height: '2.4em',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                color: characterState[char.id] ? '#666' : 'var(--color-text-highlight)',
                                fontFamily: 'var(--font-ui)',
                                marginBottom: '2px',
                                lineHeight: '1.2'
                            }}>
                                {char.name}
                            </div>

                            <div style={{
                                marginTop: 'auto',
                                display: 'flex',
                                gap: '4px',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                width: '100%'
                            }}>
                                {char.symbols.map((s, i) => {
                                    const Icon = SYMBOL_ICONS[s];
                                    return (
                                        <div key={i} style={{
                                            padding: '2px',
                                            background: 'rgba(0,0,0,0.3)',
                                            borderRadius: '3px'
                                        }}>
                                            <Icon size={14} color={SYMBOL_COLORS[s]} />
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Elimination Marker Overlay */}
                            {characterState[char.id] && (
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%) rotate(-15deg)',
                                    color: 'var(--color-accent-danger)',
                                    fontSize: '3rem',
                                    fontWeight: '900',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                                    zIndex: 10,
                                    pointerEvents: 'none',
                                    border: '3px solid var(--color-accent-danger)',
                                    padding: '0 8px',
                                    borderRadius: '4px',
                                    opacity: 0.8
                                }}>
                                    ODPADŁ
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InvestigationSheet;

import React, { useState } from 'react';
import { SYMBOLS, SYMBOL_COUNTS, CARDS, SYMBOL_EMOJIS } from '../data/gameData';
import { useGame } from '../context/GameContext';
import { ICONS } from './Icons';

// Mapping symbols to Icon components
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
    // 4 Players x 8 Symbols Grid
    // We need to track state for each cell.
    // keys: playerIdx_symbolKey
    // values: '' (empty), 'check', 'cross', '?'
    const [gridState, setGridState] = useState({});

    // Characters checkbox state
    // keys: cardId
    // values: boolean
    const [characterState, setCharacterState] = useState({});

    // Fixed order for consistency: 
    // fajka, zarowka, piesc, odznaka, ksiazka, naszyjnik, oko, czaszka
    const orderedSymbols = [
        SYMBOLS.FAJKA, SYMBOLS.ZAROWKA, SYMBOLS.PIESC, SYMBOLS.ODZNAKA,
        SYMBOLS.KSIAZKA, SYMBOLS.NASZYJNIK, SYMBOLS.OKO, SYMBOLS.CZASZKA
    ];

    const toggleCell = (pIdx, sym) => {
        const key = `${pIdx}_${sym}`;
        setGridState(prev => {
            const current = prev[key];
            let nextVal;
            if (!current) nextVal = '✓';
            else if (current === '✓') nextVal = '✗';
            else if (current === '✗') nextVal = '?';
            else nextVal = '';
            return { ...prev, [key]: nextVal };
        });
    };

    const toggleCharacter = (id) => {
        setCharacterState(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // We need 4 rows for players. 
    // In a real game, these might be named "Me", "Player 2", etc.
    // Let's use indices 0-3.
    const playerRows = ['Me', 'P2', 'P3', 'P4'];

    return (
        <div className="sheet" style={{ color: '#fff', fontSize: '0.9rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0 }}>Investigation Sheet</h3>
            </div>

            {/* Top Grid: 4x8 */}
            <div style={{ overflowX: 'auto', flexShrink: 0 }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
                    <colgroup><col style={{ width: '80px' }} />{orderedSymbols.map(sym => <col key={sym} />)}</colgroup>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #666', padding: '4px' }}></th>
                            {orderedSymbols.map(sym => {
                                const Icon = SYMBOL_ICONS[sym];
                                return (
                                    <th key={sym} style={{
                                        borderBottom: '1px solid #666',
                                        borderLeft: '1px solid #444',
                                        padding: '4px', textAlign: 'center'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>
                                            <Icon size={20} color="#ddd" />
                                        </div>
                                        <div style={{ color: '#aaa', fontSize: '0.7em' }}>({SYMBOL_COUNTS[sym]})</div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {playerRows.map((pName, pIdx) => (
                            <tr key={pIdx}>
                                <td style={{ borderBottom: '1px solid #444', padding: '4px', fontWeight: 'bold' }}>{pName}</td>
                                {orderedSymbols.map(sym => (
                                    <td key={sym}
                                        onClick={() => toggleCell(pIdx, sym)}
                                        style={{
                                            borderBottom: '1px solid #444',
                                            borderLeft: '1px solid #444',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            height: '34px',
                                            fontSize: '1.1rem',
                                            backgroundColor: gridState[`${pIdx}_${sym}`] === '✓' ? 'rgba(0, 255, 0, 0.2)' :
                                                gridState[`${pIdx}_${sym}`] === '✗' ? 'rgba(255, 0, 0, 0.2)' : 'transparent'
                                        }}
                                    >
                                        {gridState[`${pIdx}_${sym}`]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom List: Characters (Horizontal) */}
            <div style={{ marginTop: 'auto', overflowY: 'auto', flex: 1, paddingTop: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {CARDS.map(char => (
                        <div key={char.id} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            padding: '6px', background: characterState[char.id] ? '#111' : '#2b2b2b',
                            opacity: characterState[char.id] ? 0.5 : 1,
                            borderRadius: '4px', width: '100px', border: '1px solid #444'
                        }}>
                            <div
                                onClick={() => toggleCharacter(char.id)}
                                style={{
                                    width: '18px', height: '18px',
                                    border: '1px solid #888',
                                    borderRadius: '3px',
                                    marginBottom: '4px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                    background: characterState[char.id] ? '#000' : 'transparent',
                                    fontSize: '12px'
                                }}
                            >
                                {characterState[char.id] && '✓'}
                            </div>
                            <strong style={{ fontSize: '0.7rem', textAlign: 'center', height: '28px', lineHeight: '14px', marginBottom: '4px' }}>{char.name}</strong>
                            <div style={{ fontSize: '1rem', color: '#ccc', marginTop: 'auto', display: 'flex', gap: '3px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {char.symbols.map((s, i) => {
                                    const Icon = SYMBOL_ICONS[s];
                                    return <Icon key={i} size={14} color="#ccc" />
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InvestigationSheet;

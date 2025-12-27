import React, { createContext, useContext, useState, useMemo } from 'react';
import { CARDS } from '../data/gameData';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        phase: 'SETUP', // SETUP, PLAYING, GAME_OVER
        players: [],
        currentPlayerId: null,
        centerCards: [], // The criminal (and decoys in 2p)
        turnOrder: [],
    });

    const [localPlayer, setLocalPlayer] = useState({
        id: 'p1', // Mock local player ID
        name: 'Player 1',
        hand: [],
        sheet: {}, // Investigation sheet state
    });

    const [messageLog, setMessageLog] = useState([]);

    // Actions
    const startGame = (playerCount = 3) => {
        // 1. Shuffle Cards
        const shuffled = [...CARDS].sort(() => Math.random() - 0.5);

        // 2. Select Criminal (1 card) - simplified for >2 players
        const criminal = shuffled.pop();
        const centerCards = [criminal];

        // 3. Deal cards
        // 3 players: 4 cards each. (13 - 1 = 12 / 3 = 4)
        // 4 players: 3 cards each. (13 - 1 = 12 / 4 = 3)
        const dealtPlayers = [];
        for (let i = 0; i < playerCount; i++) {
            const hand = shuffled.splice(0, (12 / playerCount));
            dealtPlayers.push({
                id: `p${i + 1}`,
                name: `Player ${i + 1}`,
                cardCount: hand.length,
                // In a real networked game, we wouldn't know other players' hands.
                // For this local-first version, we might store them but hide them from UI.
                _hand: hand,
            });
        }

        // Set local player hand (assuming p1 is local)
        const p1Hand = dealtPlayers[0]._hand;

        setGameState({
            phase: 'PLAYING',
            players: dealtPlayers,
            currentPlayerId: 'p1',
            centerCards: centerCards.map(c => ({ ...c, revealed: false })), // hide info
            turnOrder: dealtPlayers.map(p => p.id),
        });

        setLocalPlayer(prev => ({
            ...prev,
            hand: p1Hand,
        }));

        addToLog(`Game started with ${playerCount} players.`);
    };

    const addToLog = (msg) => {
        setMessageLog(prev => [...prev, { id: Date.now(), text: msg }]);
    };

    const performInvestigation = (symbol) => {
        // In a real game, this would query other players.
        // Here we just log it and maybe show a toast/alert.
        addToLog(`You asked: "Who has ${symbol}?"`);

        // Mock response from bots
        const responders = gameState.players
            .filter(p => p.id !== localPlayer.id) // excluding self
            .filter(p => p._hand && p._hand.some(c => c.symbols.includes(symbol)));

        if (responders.length > 0) {
            const names = responders.map(p => p.name).join(', ');
            addToLog(`Responders: ${names} raised their hand.`);
        } else {
            addToLog(`No one raised their hand.`);
        }

        endTurn();
    };

    const performInterrogation = (targetPlayerId, symbol) => {
        const target = gameState.players.find(p => p.id === targetPlayerId);
        if (!target) return;

        addToLog(`You asked ${target.name}: "How many ${symbol} do you have?"`);

        // Mock response
        const count = target._hand ? target._hand.filter(c => c.symbols.includes(symbol)).length : 0;
        addToLog(`${target.name} answered: "${count}".`);

        endTurn();
    };

    const performAccusation = (suspectCardId) => {
        // Check if correct
        const criminal = gameState.centerCards[0]; // Assuming 1 criminal
        const suspect = CARDS.find(c => c.id === Number(suspectCardId));

        addToLog(`You accused suspect: ${suspect.name}.`);

        if (criminal.id === suspect.id) {
            addToLog(`CORRECT! You found the criminal! YOU WIN!`);
            setGameState(prev => ({ ...prev, phase: 'GAME_OVER', winner: localPlayer.id }));
        } else {
            addToLog(`WRONG! That is not the criminal.`);
            // Elimination logic would go here
        }

        endTurn();
    };

    const endTurn = () => {
        // Simple round robin
        const currentIdx = gameState.turnOrder.indexOf(gameState.currentPlayerId);
        const nextIdx = (currentIdx + 1) % gameState.turnOrder.length;
        const nextId = gameState.turnOrder[nextIdx];

        setGameState(prev => ({
            ...prev,
            currentPlayerId: nextId
        }));

        // If next is bot, maybe auto-play? Keep it manual for now.
    };

    const value = useMemo(() => ({
        gameState,
        localPlayer,
        messageLog,
        startGame,
        addToLog,
        performInvestigation,
        performInterrogation,
        performAccusation
    }), [gameState, localPlayer, messageLog, performInvestigation, performInterrogation, performAccusation, startGame, addToLog]);

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

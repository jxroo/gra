import React, { createContext, useContext, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { CARDS, SYMBOLS } from '../data/gameData';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

// Simple unique ID generator
let logIdCounter = 0;
const getUniqueLogId = () => ++logIdCounter;

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        phase: 'SETUP', // SETUP, PLAYING, GAME_OVER
        players: [],
        currentPlayerId: null,
        criminal: null, // The face-down card
        eliminated: [], // Player IDs who made wrong accusations
        turnOrder: [],
        winner: null,
    });

    const [localPlayer, setLocalPlayer] = useState({
        id: 'p1',
        name: 'You',
        hand: [],
    });

    const [messageLog, setMessageLog] = useState([]);

    // Helper: Add message to log with unique ID and type
    const addToLog = useCallback((msg, type = 'info') => {
        setMessageLog(prev => [...prev, { id: getUniqueLogId(), text: msg, type }]);
    }, []);

    // Helper: Get next active player (skip eliminated)
    const getNextActivePlayer = useCallback((currentId, turnOrder, eliminated) => {
        const activeOrder = turnOrder.filter(id => !eliminated.includes(id));
        if (activeOrder.length <= 1) return null; // Game should end

        const currentIdx = activeOrder.indexOf(currentId);
        const nextIdx = (currentIdx + 1) % activeOrder.length;
        return activeOrder[nextIdx];
    }, []);

    // Helper: Check win condition
    const checkWinCondition = useCallback((eliminated, turnOrder) => {
        const activePlayers = turnOrder.filter(id => !eliminated.includes(id));
        if (activePlayers.length === 1) {
            return activePlayers[0]; // Last standing wins
        }
        return null;
    }, []);

    // ACTION: Start Game
    const startGame = useCallback((playerCount = 3) => {
        logIdCounter = 0; // Reset log counter

        // 1. Shuffle Cards
        const shuffled = [...CARDS].sort(() => Math.random() - 0.5);

        // 2. Select Criminal (1 card face-down in center)
        const criminal = shuffled.pop();

        // 3. Deal remaining cards
        const cardsPerPlayer = Math.floor(12 / playerCount);
        const dealtPlayers = [];

        for (let i = 0; i < playerCount; i++) {
            const hand = shuffled.splice(0, cardsPerPlayer);
            dealtPlayers.push({
                id: `p${i + 1}`,
                name: i === 0 ? 'You' : `Player ${i + 1}`,
                hand: hand,
                cardCount: hand.length,
            });
        }

        const p1Hand = dealtPlayers[0].hand;

        setGameState({
            phase: 'PLAYING',
            players: dealtPlayers,
            currentPlayerId: 'p1',
            criminal: criminal,
            eliminated: [],
            turnOrder: dealtPlayers.map(p => p.id),
            winner: null,
        });

        setLocalPlayer(prev => ({
            ...prev,
            hand: p1Hand,
        }));

        setMessageLog([]);
        addToLog(`Game started with ${playerCount} players.`, 'system');
        addToLog(`You have ${p1Hand.length} cards in hand.`, 'system');
    }, [addToLog]);

    // ACTION: Investigation
    const performInvestigation = useCallback((symbol) => {
        if (gameState.currentPlayerId !== localPlayer.id) {
            addToLog("It's not your turn!", 'error');
            return;
        }

        addToLog(`You asked: "Who has ${symbol}?"`, 'investigation');

        const responders = gameState.players
            .filter(p => p.id !== localPlayer.id)
            .filter(p => !gameState.eliminated.includes(p.id))
            .filter(p => p.hand && p.hand.some(c => c.symbols.includes(symbol)));

        if (responders.length > 0) {
            const names = responders.map(p => p.name).join(', ');
            addToLog(`${names} raised their hand.`, 'response');
        } else {
            addToLog(`No one raised their hand.`, 'response_empty');
        }

        advanceTurn();
    }, [gameState, localPlayer.id, addToLog]);

    // ACTION: Interrogation
    const performInterrogation = useCallback((targetPlayerId, symbol) => {
        if (gameState.currentPlayerId !== localPlayer.id) {
            addToLog("It's not your turn!");
            return;
        }

        const target = gameState.players.find(p => p.id === targetPlayerId);
        if (!target) {
            addToLog("Invalid target player.");
            return;
        }

        addToLog(`You asked ${target.name}: "How many ${symbol} do you have?"`, 'interrogation');

        const count = target.hand
            ? target.hand.reduce((sum, card) => {
                return sum + card.symbols.filter(s => s === symbol).length;
            }, 0)
            : 0;

        addToLog(`${target.name} answered: "${count}"`, 'response');

        advanceTurn();
    }, [gameState, localPlayer.id, addToLog]);

    // ACTION: Accusation
    const performAccusation = useCallback((suspectCardId) => {
        if (gameState.currentPlayerId !== localPlayer.id) {
            addToLog("It's not your turn!");
            return;
        }

        const suspect = CARDS.find(c => c.id === Number(suspectCardId));
        if (!suspect) {
            addToLog("Invalid suspect.");
            return;
        }

        addToLog(`You accused: ${suspect.name}`, 'accusation');

        if (gameState.criminal.id === suspect.id) {
            addToLog(`CORRECT! ${suspect.name} is the criminal! YOU WIN!`, 'success');
            setGameState(prev => ({
                ...prev,
                phase: 'GAME_OVER',
                winner: localPlayer.id,
            }));
        } else {
            addToLog(`WRONG! That is not the criminal.`, 'failure');
            addToLog(`You are eliminated from the game.`, 'failure');

            const newEliminated = [...gameState.eliminated, localPlayer.id];
            const lastStanding = checkWinCondition(newEliminated, gameState.turnOrder);

            if (lastStanding) {
                const winner = gameState.players.find(p => p.id === lastStanding);
                addToLog(`${winner.name} wins as the last remaining player!`, 'success');
                setGameState(prev => ({
                    ...prev,
                    phase: 'GAME_OVER',
                    eliminated: newEliminated,
                    winner: lastStanding,
                }));
            } else {
                setGameState(prev => ({
                    ...prev,
                    eliminated: newEliminated,
                }));
                advanceTurn();
            }
        }
    }, [gameState, localPlayer.id, addToLog, checkWinCondition]);

    // Advance Turn: Move to next player and auto-play bots
    const advanceTurn = useCallback(() => {
        setGameState(prev => {
            const nextPlayer = getNextActivePlayer(prev.currentPlayerId, prev.turnOrder, prev.eliminated);

            if (!nextPlayer) {
                return prev;
            }

            return {
                ...prev,
                currentPlayerId: nextPlayer,
            };
        });
    }, [getNextActivePlayer]);

    // Effect: Auto-play bot turns
    useEffect(() => {
        if (gameState.phase !== 'PLAYING') return;
        if (gameState.currentPlayerId === localPlayer.id) return;
        if (gameState.eliminated.includes(gameState.currentPlayerId)) {
            advanceTurn();
            return;
        }

        const currentBot = gameState.players.find(p => p.id === gameState.currentPlayerId);
        if (!currentBot) return;

        // Bot takes a turn after a short delay
        const timer = setTimeout(() => {
            // Simple bot AI: random investigation
            const symbols = Object.values(SYMBOLS);
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

            // Log turn start
            // We can add a "turn" log if we want, but "asked" implies it

            addToLog(`${currentBot.name} asked: "Who has ${randomSymbol}?"`, 'investigation_bot');

            const responders = gameState.players
                .filter(p => p.id !== currentBot.id)
                .filter(p => !gameState.eliminated.includes(p.id))
                .filter(p => p.hand && p.hand.some(c => c.symbols.includes(randomSymbol)));

            if (responders.length > 0) {
                const names = responders.map(p => p.name).join(', ');
                addToLog(`${names} raised their hand.`, 'response');
            } else {
                addToLog(`No one raised their hand.`, 'response_empty');
            }

            advanceTurn();
        }, 1200);

        return () => clearTimeout(timer);
    }, [gameState.currentPlayerId, gameState.phase, gameState.players, gameState.eliminated, localPlayer.id, addToLog, advanceTurn]);

    const value = useMemo(() => ({
        gameState,
        localPlayer,
        messageLog,
        startGame,
        addToLog,
        performInvestigation,
        performInterrogation,
        performAccusation,
    }), [gameState, localPlayer, messageLog, startGame, addToLog, performInvestigation, performInterrogation, performAccusation]);

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

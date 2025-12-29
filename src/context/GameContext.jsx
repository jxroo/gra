import React, { createContext, useContext, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { CARDS, SYMBOLS } from '../data/gameData';
import { useSocket } from './SocketContext';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

// Simple unique ID generator
let logIdCounter = 0;
const getUniqueLogId = () => ++logIdCounter;

export const GameProvider = ({ children }) => {
    const { socket } = useSocket();

    // State
    const [gameState, setGameState] = useState({
        phase: 'SETUP', // SETUP, PLAYING, GAME_OVER
        players: [],
        currentPlayerId: null,
        criminal: null, // The face-down card
        eliminated: [], // Player IDs who made wrong accusations
        turnOrder: [],
        winner: null,
        lobbyCode: null // Added for multiplayer
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

    // --- SOCKET INTEGRATION ---
    useEffect(() => {
        if (!socket) return;

        // On game start
        socket.on('gameStarted', (data) => {
            setGameState(prev => ({
                ...prev,
                phase: data.phase,
                players: data.players,
                turnOrder: data.turnOrder,
                currentPlayerId: data.currentPlayerId,
            }));

            setMessageLog([]);
            addToLog("Game Started!", "system");
        });

        // On hand update (private)
        socket.on('yourHand', (hand) => {
            setLocalPlayer(prev => ({ ...prev, hand }));
        });

        // On state update (turn change, logs)
        socket.on('stateUpdate', (data) => {
            setGameState(prev => ({
                ...prev,
                currentPlayerId: data.currentPlayerId,
            }));

            // Append logs
            if (data.log && data.log.length > 0) {
                setMessageLog(prev => {
                    const newLogs = data.log.filter(l => !prev.some(pl => pl.id === l.id));
                    return [...prev, ...newLogs];
                });
            }
        });

        // On Game Over
        socket.on('gameOver', (data) => {
            setGameState(prev => ({
                ...prev,
                phase: 'GAME_OVER',
                winner: data.winner,
                criminal: data.criminal
            }));
            addToLog(`GAME OVER! Winner: ${data.winner}`, 'system');
        });

        // On Lobby update (to keep lobbyCode sync if needed)
        socket.on('lobbyUpdated', (lobby) => {
            // Store lobby info if valuable
            setGameState(prev => ({ ...prev, lobbyCode: lobby.code }));
            // Also update local player ID if we find ourselves
            const me = lobby.players.find(p => p.id === socket.id);
            if (me) {
                setLocalPlayer(prev => ({ ...prev, id: me.id, name: me.name }));
            }
        });

        return () => {
            socket.off('gameStarted');
            socket.off('yourHand');
            socket.off('stateUpdate');
            socket.off('gameOver');
            socket.off('lobbyUpdated');
        };
    }, [socket, addToLog]);


    // ACTION: Start Game (Only host triggers this via LobbyScreen, but we keep this stub or remove)
    const startGame = useCallback((playerCount = 3) => {
        // Deprecated in MP mode, handled by LobbyScreen -> socket -> server
        console.warn("startGame called locally, but should be via socket");
    }, []);

    // ACTION: Investigation
    const performInvestigation = useCallback((symbol) => {
        if (!socket || !gameState.lobbyCode) return;
        socket.emit('gameAction', {
            code: gameState.lobbyCode,
            type: 'investigation',
            payload: { symbol }
        });
        // We do NOT optimize locally; rely on server response to avoid desync
    }, [socket, gameState.lobbyCode]);

    // ACTION: Interrogation
    const performInterrogation = useCallback((targetPlayerId, symbol) => {
        if (!socket || !gameState.lobbyCode) return;
        socket.emit('gameAction', {
            code: gameState.lobbyCode,
            type: 'interrogation',
            payload: { targetId: targetPlayerId, symbol }
        });
    }, [socket, gameState.lobbyCode]);

    // ACTION: Accusation
    const performAccusation = useCallback((suspectCardId) => {
        if (!socket || !gameState.lobbyCode) return;
        socket.emit('gameAction', {
            code: gameState.lobbyCode,
            type: 'accusation',
            payload: { cardId: suspectCardId }
        });
    }, [socket, gameState.lobbyCode]);

    const value = useMemo(() => ({
        gameState,
        localPlayer,
        messageLog,
        startGame,  // Exported but deprecated
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

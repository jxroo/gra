import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { LobbyManager } from './lobbyManager.js';
import { CARDS, SYMBOLS } from '../src/data/gameData.js'; // We'll need to make sure this path works or duplicate data

// Minimal game data duplication if import fails (Node might struggle with .jsx or client paths without config)
// For simplicity, let's redefine minimal needed data or try to import if it's a pure JS file.
// gameData.js is outside. Let's just create a helper here to avoid import issues.
const SERVER_CARDS = [
    { id: 1, name: "Sebastian Moran", symbols: ['czaszka', 'piesc'] },
    { id: 2, name: "Irene Adler", symbols: ['czaszka', 'zarowka', 'naszyjnik'] },
    { id: 3, name: "Inspector G. Lestrade", symbols: ['odznaka', 'oko', 'ksiazka'] },
    { id: 4, name: "Inspector Gregson", symbols: ['odznaka', 'piesc', 'ksiazka'] },
    { id: 5, name: "Inspector Baynes", symbols: ['zarowka', 'odznaka'] },
    { id: 6, name: "Inspector Bradstreet", symbols: ['piesc', 'odznaka'] },
    { id: 7, name: "Inspector Hopkins", symbols: ['odznaka', 'fajka', 'oko'] },
    { id: 8, name: "Sherlock Holmes", symbols: ['fajka', 'zarowka', 'piesc'] },
    { id: 9, name: "John H. Watson", symbols: ['fajka', 'oko', 'piesc'] },
    { id: 10, name: "Mycroft Holmes", symbols: ['fajka', 'zarowka', 'ksiazka'] },
    { id: 11, name: "Mrs. Hudson", symbols: ['fajka', 'naszyjnik'] },
    { id: 12, name: "Mary Morstan", symbols: ['ksiazka', 'naszyjnik'] },
    { id: 13, name: "James Moriarty", symbols: ['czaszka', 'zarowka'] }
];

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // In production, restrict this
        methods: ["GET", "POST"]
    }
});

const lobbyManager = new LobbyManager();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('createLobby', ({ name }) => {
        const code = lobbyManager.createLobby(socket.id, name);
        socket.join(code);
        const lobby = lobbyManager.getLobby(code);
        io.to(code).emit('lobbyUpdated', lobby);
    });

    socket.on('joinLobby', ({ code, name }) => {
        const result = lobbyManager.joinLobby(code, socket.id, name);
        if (result.error) {
            socket.emit('error', result.error);
        } else {
            socket.join(code);
            io.to(code).emit('lobbyUpdated', result.lobby);
        }
    });

    socket.on('startGame', ({ code }) => {
        const lobby = lobbyManager.getLobby(code);
        if (!lobby || lobby.hostId !== socket.id) return;
        if (lobby.players.length < 3) {
            socket.emit('error', 'Potrzeba minimum 3 graczy, aby rozpocząć grę.');
            return;
        }

        // Game Setup Logic
        const shuffled = [...SERVER_CARDS].sort(() => Math.random() - 0.5);
        const criminal = shuffled.pop();

        // Deal cards
        const playerCount = lobby.players.length;
        const cardsPerPlayer = Math.floor(shuffled.length / playerCount);

        lobby.players.forEach((player, i) => {
            player.hand = shuffled.splice(0, cardsPerPlayer);
            player.cardCount = player.hand.length; // Public info
        });

        // Set turn order
        lobby.gameState.phase = 'PLAYING';
        lobby.gameState.criminal = criminal; // Only server knows this initially
        lobby.gameState.turnOrder = lobby.players.map(p => p.id);
        lobby.gameState.currentPlayerIdx = 0;

        // Log start
        lobby.gameState.log.push({ id: Date.now(), text: `Gra rozpoczęta z udziałem ${playerCount} graczy.`, type: 'system' });

        // Broadcast to everyone (sanitized)
        io.to(code).emit('gameStarted', {
            phase: 'PLAYING',
            turnOrder: lobby.gameState.turnOrder,
            currentPlayerId: lobby.gameState.turnOrder[0],
            players: lobby.players.map(p => ({
                id: p.id,
                name: p.name,
                cardCount: p.cardCount,
                // Don't send other players' hands!
            }))
        });

        // Send individual hands
        lobby.players.forEach(p => {
            io.to(p.id).emit('yourHand', p.hand);
        });
    });

    socket.on('gameAction', ({ code, type, payload }) => {
        const lobby = lobbyManager.getLobby(code);
        if (!lobby) return;

        // Verify turn
        // Verify turn, unless it's a chat message
        const currentPlayerId = lobby.gameState.turnOrder[lobby.gameState.currentPlayerIdx];
        if (type !== 'chat' && socket.id !== currentPlayerId) {
            socket.emit('error', 'To nie jest Twoja tura');
            return;
        }

        const player = lobby.players.find(p => p.id === socket.id);

        // Block eliminated players from everything except chat
        if (type !== 'chat' && player.eliminated) {
            socket.emit('error', 'Jesteś wyeliminowany(a) i nie możesz wykonywać ruchów.');
            return;
        }
        let logEntry = null;
        let shouldAdvanceTurn = true;

        if (type === 'investigation') {
            const { symbol } = payload;
            logEntry = { id: Date.now(), text: `${player.name} pyta: "Kto ma symbol: ${symbol}?"`, type: 'investigation' };

            // Check who has the symbol
            const responders = lobby.players
                .filter(p => p.id !== player.id && !p.eliminated)
                .filter(p => p.hand.some(c => c.symbols.includes(symbol)));

            const responderNames = responders.map(p => p.name).join(', ');
            const responseText = responders.length > 0
                ? `${responderNames} podnieśli rękę.`
                : `Nikt nie podniósł ręki.`;

            lobby.gameState.log.push(logEntry);
            lobby.gameState.log.push({ id: Date.now() + 1, text: responseText, type: responders.length > 0 ? 'response' : 'response_empty' });

        } else if (type === 'interrogation') {
            const { targetId, symbol } = payload;
            const target = lobby.players.find(p => p.id === targetId);
            if (!target) return;

            logEntry = { id: Date.now(), text: `${player.name} pyta gracza ${target.name}: "Ile masz symboli: ${symbol}?"`, type: 'interrogation' };

            const count = target.hand.reduce((sum, card) => sum + (card.symbols.includes(symbol) ? 1 : 0), 0);

            lobby.gameState.log.push(logEntry);
            lobby.gameState.log.push({ id: Date.now() + 1, text: `${target.name} odpowiada: "${count}"`, type: 'response' });

        } else if (type === 'accusation') {
            const { cardId } = payload;
            const suspect = SERVER_CARDS.find(c => c.id === Number(cardId));
            logEntry = { id: Date.now(), text: `${player.name} oskarża: ${suspect.name}`, type: 'accusation' };
            lobby.gameState.log.push(logEntry);

            if (lobby.gameState.criminal.id === suspect.id) {
                // Win
                lobby.gameState.phase = 'GAME_OVER';
                lobby.gameState.winner = player.id; // Still store ID for internal state
                io.to(code).emit('gameOver', { winner: player.name, criminal: lobby.gameState.criminal });
                shouldAdvanceTurn = false;
            } else {
                // Elimination
                player.eliminated = true;
                socket.emit('error', 'Niestety, to nie ten sprawca. Odpadasz z gry!');
                lobby.gameState.log.push({ id: Date.now() + 1, text: `BŁĄD! ${player.name} odpada z gry.`, type: 'failure' });

                // Check if everyone else is eliminated
                const activePlayers = lobby.players.filter(p => !p.eliminated);
                if (activePlayers.length === 1) {
                    lobby.gameState.phase = 'GAME_OVER';
                    lobby.gameState.winner = activePlayers[0].id;
                    io.to(code).emit('gameOver', { winner: activePlayers[0].name, criminal: lobby.gameState.criminal });
                    shouldAdvanceTurn = false;
                }
            }
        } else if (type === 'chat') {
            const { message } = payload;
            io.to(code).emit('chatMessage', { sender: player.name, text: message });
            shouldAdvanceTurn = false; // Chat doesn't consume turn
        }

        if (shouldAdvanceTurn && lobby.gameState.phase === 'PLAYING') {
            // Find next non-eliminated player
            let nextIdx = (lobby.gameState.currentPlayerIdx + 1) % lobby.gameState.turnOrder.length;
            let loopCount = 0;
            while (
                lobby.players.find(p => p.id === lobby.gameState.turnOrder[nextIdx]).eliminated &&
                loopCount < lobby.players.length
            ) {
                nextIdx = (nextIdx + 1) % lobby.gameState.turnOrder.length;
                loopCount++;
            }

            lobby.gameState.currentPlayerIdx = nextIdx;

            io.to(code).emit('stateUpdate', {
                currentPlayerId: lobby.gameState.turnOrder[nextIdx],
                log: lobby.gameState.log.slice(-2) // Send recent logs
            });
        }
    });

    socket.on('disconnect', () => {
        const result = lobbyManager.leaveLobby(socket.id);
        if (result && result.action !== 'deleted') {
            io.to(result.code).emit('lobbyUpdated', result.lobby);
        }
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { LobbyManager } from './lobbyManager.js';
import { CARDS, SYMBOLS } from './gameData.js';


const app = express();

// Use environment variable for CORS origin in production, default to * for dev
const allowedOrigins = [
    'http://192.168.0.26:5173/',
    'http://localhost:5173',
    'https://sherlockholmesbyjaro.netlify.app'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app build folder
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
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
        const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
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
            const suspect = CARDS.find(c => c.id === Number(cardId));
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

// For any request that doesn't match one above, send back React's index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

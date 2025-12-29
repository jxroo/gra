export class LobbyManager {
    constructor() {
        this.lobbies = new Map(); // code -> lobby object
    }

    createLobby(hostSocketId, hostName) {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        this.lobbies.set(code, {
            code,
            hostId: hostSocketId, // socket ID of the host
            players: [{
                id: hostSocketId,
                name: hostName,
                isHost: true,
                hand: [],           // Cards in hand
                eliminated: false,  // If they made a wrong accusation
                connected: true
            }],
            gameState: {
                phase: 'LOBBY', // LOBBY, PLAYING, GAME_OVER
                criminal: null, // The hidden card
                turnOrder: [],  // Array of socket IDs
                currentPlayerIdx: 0,
                log: []
            }
        });

        return code;
    }

    getLobby(code) {
        return this.lobbies.get(code);
    }

    joinLobby(code, socketId, playerName) {
        const lobby = this.lobbies.get(code);
        if (!lobby) return { error: 'Lobby not found' };
        if (lobby.gameState.phase !== 'LOBBY') return { error: 'Game already started' };
        if (lobby.players.length >= 6) return { error: 'Lobby full' };
        if (lobby.players.some(p => p.name === playerName)) return { error: 'Name taken' };

        const newPlayer = {
            id: socketId,
            name: playerName,
            isHost: false,
            hand: [],
            eliminated: false,
            connected: true
        };

        lobby.players.push(newPlayer);
        return { lobby };
    }

    leaveLobby(socketId) {
        for (const [code, lobby] of this.lobbies.entries()) {
            const playerIndex = lobby.players.findIndex(p => p.id === socketId);
            if (playerIndex !== -1) {
                const player = lobby.players[playerIndex];

                // If in lobby phase, remove player
                if (lobby.gameState.phase === 'LOBBY') {
                    lobby.players.splice(playerIndex, 1);

                    // If host left, delete lobby or assign new host
                    if (player.isHost) {
                        if (lobby.players.length === 0) {
                            this.lobbies.delete(code);
                            return { code, action: 'deleted' };
                        } else {
                            lobby.players[0].isHost = true;
                        }
                    }
                } else {
                    // In game, mark as disconnected
                    player.connected = false;
                }

                return { code, lobby };
            }
        }
        return null;
    }
}

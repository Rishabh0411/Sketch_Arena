"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const roomManager = __importStar(require("./roomManager"));
const gameLogic = __importStar(require("./gameLogic"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Admin endpoint to view rooms
app.get('/admin/rooms', (req, res) => {
    const rooms = roomManager.getAllRooms().map(room => ({
        id: room.id,
        players: roomManager.getPlayerCount(room),
        status: room.gameState.status,
        lastActivity: new Date(room.lastActivity).toISOString()
    }));
    res.json(rooms);
});
// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    let currentPlayer = null;
    let currentRoom = null;
    // Join or create room
    socket.on('joinRoom', ({ playerName, roomId }) => {
        try {
            // Sanitize player name
            const cleanName = playerName.trim().slice(0, 20).replace(/[^\w\s\-]/g, '');
            if (!cleanName) {
                socket.emit('error', { message: 'Invalid player name' });
                return;
            }
            // Get or create room
            let room = roomId ? roomManager.getRoom(roomId) : null;
            if (roomId && !room) {
                socket.emit('error', { message: 'Room not found' });
                return;
            }
            if (!room) {
                room = roomManager.createRoom();
            }
            // Check if room is full
            if (roomManager.getPlayerCount(room) >= 10) {
                socket.emit('error', { message: 'Room is full' });
                return;
            }
            // Create player
            const player = {
                id: roomManager.generatePlayerId(),
                name: cleanName,
                socketId: socket.id,
                teamId: 'A', // Will be assigned by addPlayerToRoom
                isDrawer: false,
                hasGuessed: false,
                status: 'active'
            };
            // Add player to room
            roomManager.addPlayerToRoom(room, player);
            currentPlayer = player;
            currentRoom = room.id;
            // Join socket room
            socket.join(room.id);
            // Send room state to player
            socket.emit('roomJoined', {
                room: serializeRoom(room),
                playerId: player.id
            });
            // Broadcast to others
            socket.to(room.id).emit('playerJoined', {
                player: serializePlayer(player)
            });
            console.log(`Player ${cleanName} joined room ${room.id}`);
        }
        catch (error) {
            console.error('Error joining room:', error);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });
    // Start game
    socket.on('startGame', () => {
        if (!currentPlayer || !currentRoom)
            return;
        const room = roomManager.getRoom(currentRoom);
        if (!room)
            return;
        // Only host can start
        if (room.hostId !== currentPlayer.id) {
            socket.emit('error', { message: 'Only host can start the game' });
            return;
        }
        const started = gameLogic.startGame(room);
        if (!started) {
            socket.emit('error', { message: 'Cannot start game. Need at least 2 players.' });
            return;
        }
        // Broadcast game start
        io.to(room.id).emit('gameStarted', {
            maxRounds: room.gameState.maxRounds
        });
        // Start first turn
        gameLogic.startTurn(room, io);
    });
    // Select word
    socket.on('selectWord', ({ word }) => {
        if (!currentPlayer || !currentRoom)
            return;
        const room = roomManager.getRoom(currentRoom);
        if (!room)
            return;
        // Only current drawer can select word
        if (room.gameState.currentDrawerId !== currentPlayer.id) {
            return;
        }
        const selected = gameLogic.selectWord(room, word, io);
        if (selected) {
            socket.emit('wordConfirmed', { word });
        }
    });
    // Drawing events
    socket.on('draw', (data) => {
        if (!currentPlayer || !currentRoom)
            return;
        const room = roomManager.getRoom(currentRoom);
        if (!room)
            return;
        // Only drawer can draw
        if (room.gameState.currentDrawerId !== currentPlayer.id) {
            return;
        }
        // Validate coordinates for pen/eraser/fill tools
        if (data.x !== undefined && (data.x < 0 || data.x > 800 || data.y < 0 || data.y > 600)) {
            return;
        }
        // Validate coordinates for shape tools
        if (data.startX !== undefined && (data.startX < 0 || data.startX > 800 || data.startY < 0 || data.startY > 600)) {
            return;
        }
        // Add to drawing history
        const drawingEvent = {
            ...data,
            playerId: currentPlayer.id,
            timestamp: Date.now()
        };
        room.drawingHistory.push(drawingEvent);
        // Broadcast to room
        socket.to(room.id).emit('drawData', drawingEvent);
    });
    // Clear canvas
    socket.on('clearCanvas', () => {
        if (!currentPlayer || !currentRoom)
            return;
        const room = roomManager.getRoom(currentRoom);
        if (!room)
            return;
        // Only drawer can clear
        if (room.gameState.currentDrawerId !== currentPlayer.id) {
            return;
        }
        room.drawingHistory = [];
        io.to(room.id).emit('canvasCleared');
    });
    // Guess
    socket.on('guess', ({ message }) => {
        if (!currentPlayer || !currentRoom)
            return;
        const room = roomManager.getRoom(currentRoom);
        if (!room)
            return;
        // Sanitize guess
        const cleanGuess = message.trim().slice(0, 100);
        // Drawer cannot guess
        if (currentPlayer.id === room.gameState.currentDrawerId) {
            return;
        }
        // Handle guess
        const isCorrect = gameLogic.handleGuess(room, currentPlayer, cleanGuess, io);
        if (!isCorrect) {
            // Broadcast guess to team only
            const drawer = room.players[room.gameState.currentDrawerId];
            if (drawer && currentPlayer.teamId === drawer.teamId) {
                io.to(room.id).emit('chatMessage', {
                    playerId: currentPlayer.id,
                    playerName: currentPlayer.name,
                    message: cleanGuess,
                    timestamp: Date.now(),
                    teamId: currentPlayer.teamId
                });
            }
        }
    });
    // Chat message
    socket.on('chatMessage', ({ message }) => {
        if (!currentPlayer || !currentRoom)
            return;
        const room = roomManager.getRoom(currentRoom);
        if (!room)
            return;
        // Sanitize
        const cleanMessage = message.trim().slice(0, 200);
        // Broadcast to all
        io.to(room.id).emit('chatMessage', {
            playerId: currentPlayer.id,
            playerName: currentPlayer.name,
            message: cleanMessage,
            timestamp: Date.now()
        });
    });
    // Disconnect
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        if (!currentPlayer || !currentRoom)
            return;
        const room = roomManager.getRoom(currentRoom);
        if (!room)
            return;
        // Mark as disconnected
        currentPlayer.status = 'disconnected';
        currentPlayer.disconnectTime = Date.now();
        // Notify others
        io.to(room.id).emit('playerDisconnected', {
            playerId: currentPlayer.id,
            playerName: currentPlayer.name
        });
        // If drawer disconnects, skip turn
        if (room.gameState.currentDrawerId === currentPlayer.id && room.gameState.status === 'playing') {
            io.to(room.id).emit('drawerDisconnected', {
                message: 'Drawer disconnected. Skipping turn...'
            });
            // Skip turn logic would go here
        }
        // Remove after grace period (60 seconds)
        setTimeout(() => {
            const updatedRoom = roomManager.getRoom(currentRoom);
            if (updatedRoom && updatedRoom.players[currentPlayer.id]?.status === 'disconnected') {
                roomManager.removePlayerFromRoom(updatedRoom, currentPlayer.id);
                io.to(updatedRoom.id).emit('playerLeft', {
                    playerId: currentPlayer.id,
                    playerName: currentPlayer.name
                });
                // Clean up timers if room deleted
                if (!roomManager.getRoom(currentRoom)) {
                    gameLogic.cleanupRoom(updatedRoom);
                }
            }
        }, 60000);
    });
});
// Helper functions
function serializeRoom(room) {
    return {
        id: room.id,
        players: Object.values(room.players).map(serializePlayer),
        teams: room.teams,
        gameState: {
            ...room.gameState,
            currentWord: null // Never send word to client
        },
        hostId: room.hostId
    };
}
function serializePlayer(player) {
    return {
        id: player.id,
        name: player.name,
        teamId: player.teamId,
        isDrawer: player.isDrawer,
        hasGuessed: player.hasGuessed,
        status: player.status
    };
}
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});

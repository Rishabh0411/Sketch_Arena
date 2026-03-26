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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoomId = generateRoomId;
exports.generatePlayerId = generatePlayerId;
exports.createRoom = createRoom;
exports.getRoom = getRoom;
exports.getRoomByPlayerId = getRoomByPlayerId;
exports.deleteRoom = deleteRoom;
exports.addPlayerToRoom = addPlayerToRoom;
exports.removePlayerFromRoom = removePlayerFromRoom;
exports.getRandomWords = getRandomWords;
exports.getPlayerCount = getPlayerCount;
exports.getActivePlayers = getActivePlayers;
exports.getAllRooms = getAllRooms;
exports.changePlayerTeam = changePlayerTeam;
exports.changeTeamName = changeTeamName;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// In-memory storage
const rooms = new Map();
const playerToRoom = new Map(); // playerId -> roomId
// Load words
let wordList = [];
try {
    const wordsPath = path.join(__dirname, '../data/words.json');
    const wordsData = fs.readFileSync(wordsPath, 'utf-8');
    wordList = JSON.parse(wordsData);
}
catch (error) {
    console.error('Failed to load words:', error);
    wordList = ['cat', 'dog', 'house', 'tree', 'car']; // Fallback
}
function generateRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return rooms.has(id) ? generateRoomId() : id;
}
function generatePlayerId() {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function createRoom() {
    const roomId = generateRoomId();
    const room = {
        id: roomId,
        players: {},
        teams: {
            A: { id: 'A', name: 'Team A', score: 0, players: [] },
            B: { id: 'B', name: 'Team B', score: 0, players: [] }
        },
        gameState: {
            status: 'waiting',
            currentDrawerId: null,
            currentWord: null,
            wordOptions: [],
            round: 0,
            maxRounds: 3,
            timer: 0,
            startTime: null,
            turnStartTime: null
        },
        drawingHistory: [],
        lastActivity: Date.now(),
        hostId: ''
    };
    rooms.set(roomId, room);
    return room;
}
function getRoom(roomId) {
    return rooms.get(roomId);
}
function getRoomByPlayerId(playerId) {
    const roomId = playerToRoom.get(playerId);
    return roomId ? rooms.get(roomId) : undefined;
}
function deleteRoom(roomId) {
    const room = rooms.get(roomId);
    if (room) {
        // Remove all player mappings
        Object.keys(room.players).forEach(playerId => {
            playerToRoom.delete(playerId);
        });
    }
    rooms.delete(roomId);
}
function addPlayerToRoom(room, player) {
    room.players[player.id] = player;
    playerToRoom.set(player.id, room.id);
    // Set first player as host
    if (!room.hostId) {
        room.hostId = player.id;
    }
    // Auto-assign to team with fewer players
    assignTeam(room, player);
    room.lastActivity = Date.now();
}
function removePlayerFromRoom(room, playerId) {
    const player = room.players[playerId];
    if (!player)
        return;
    // Remove from team
    const team = room.teams[player.teamId];
    team.players = team.players.filter(id => id !== playerId);
    // Remove from room
    delete room.players[playerId];
    playerToRoom.delete(playerId);
    // Transfer host if needed
    if (room.hostId === playerId) {
        const remainingPlayers = Object.keys(room.players);
        room.hostId = remainingPlayers.length > 0 ? remainingPlayers[0] : '';
    }
    room.lastActivity = Date.now();
    // Delete room if empty
    if (Object.keys(room.players).length === 0) {
        deleteRoom(room.id);
    }
}
function assignTeam(room, player) {
    const teamASizeWithNew = room.teams.A.players.length;
    const teamBSize = room.teams.B.players.length;
    // Assign to team with fewer players
    const teamId = teamASizeWithNew <= teamBSize ? 'A' : 'B';
    player.teamId = teamId;
    room.teams[teamId].players.push(player.id);
}
function getRandomWords(count = 3) {
    const shuffled = [...wordList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
function getPlayerCount(room) {
    return Object.keys(room.players).length;
}
function getActivePlayers(room) {
    return Object.values(room.players).filter(p => p.status === 'active');
}
function getAllRooms() {
    return Array.from(rooms.values());
}
function changePlayerTeam(room, playerId, newTeamId) {
    const player = room.players[playerId];
    if (!player)
        return false;
    // Don't allow team changes during active game
    if (room.gameState.status === 'playing')
        return false;
    const oldTeamId = player.teamId;
    // Remove from old team
    room.teams[oldTeamId].players = room.teams[oldTeamId].players.filter(id => id !== playerId);
    // Add to new team
    room.teams[newTeamId].players.push(playerId);
    player.teamId = newTeamId;
    room.lastActivity = Date.now();
    return true;
}
function changeTeamName(room, teamId, newName) {
    // Don't allow during active game
    if (room.gameState.status === 'playing')
        return false;
    // Validate name
    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName.length > 20)
        return false;
    room.teams[teamId].name = trimmedName;
    room.lastActivity = Date.now();
    return true;
}
// Cleanup inactive rooms (30 minutes)
setInterval(() => {
    const now = Date.now();
    const INACTIVE_THRESHOLD = 30 * 60 * 1000; // 30 minutes
    Array.from(rooms.entries()).forEach(([roomId, room]) => {
        if (now - room.lastActivity > INACTIVE_THRESHOLD) {
            console.log(`Cleaning up inactive room: ${roomId}`);
            deleteRoom(roomId);
        }
    });
}, 5 * 60 * 1000); // Check every 5 minutes

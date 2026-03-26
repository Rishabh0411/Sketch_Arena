import { Room, Player, TeamId, GameState } from './types';
import * as fs from 'fs';
import * as path from 'path';

// In-memory storage
const rooms = new Map<string, Room>();
const playerToRoom = new Map<string, string>(); // playerId -> roomId

// Load words
let wordList: string[] = [];
try {
  const wordsPath = path.join(__dirname, '../data/words.json');
  const wordsData = fs.readFileSync(wordsPath, 'utf-8');
  wordList = JSON.parse(wordsData);
} catch (error) {
  console.error('Failed to load words:', error);
  wordList = ['cat', 'dog', 'house', 'tree', 'car']; // Fallback
}

export function generateRoomId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rooms.has(id) ? generateRoomId() : id;
}

export function generatePlayerId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createRoom(): Room {
  const roomId = generateRoomId();
  
  const room: Room = {
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

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId);
}

export function getRoomByPlayerId(playerId: string): Room | undefined {
  const roomId = playerToRoom.get(playerId);
  return roomId ? rooms.get(roomId) : undefined;
}

export function deleteRoom(roomId: string): void {
  const room = rooms.get(roomId);
  if (room) {
    // Remove all player mappings
    Object.keys(room.players).forEach(playerId => {
      playerToRoom.delete(playerId);
    });
  }
  rooms.delete(roomId);
}

export function addPlayerToRoom(room: Room, player: Player): void {
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

export function removePlayerFromRoom(room: Room, playerId: string): void {
  const player = room.players[playerId];
  if (!player) return;
  
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

function assignTeam(room: Room, player: Player): void {
  const teamASizeWithNew = room.teams.A.players.length;
  const teamBSize = room.teams.B.players.length;
  
  // Assign to team with fewer players
  const teamId: TeamId = teamASizeWithNew <= teamBSize ? 'A' : 'B';
  player.teamId = teamId;
  room.teams[teamId].players.push(player.id);
}

export function getRandomWords(count: number = 3): string[] {
  const shuffled = [...wordList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getPlayerCount(room: Room): number {
  return Object.keys(room.players).length;
}

export function getActivePlayers(room: Room): Player[] {
  return Object.values(room.players).filter(p => p.status === 'active');
}

export function getAllRooms(): Room[] {
  return Array.from(rooms.values());
}

export function changePlayerTeam(room: Room, playerId: string, newTeamId: TeamId): boolean {
  const player = room.players[playerId];
  if (!player) return false;
  
  // Don't allow team changes during active game
  if (room.gameState.status === 'playing') return false;
  
  const oldTeamId = player.teamId;
  
  // Remove from old team
  room.teams[oldTeamId].players = room.teams[oldTeamId].players.filter(id => id !== playerId);
  
  // Add to new team
  room.teams[newTeamId].players.push(playerId);
  player.teamId = newTeamId;
  
  room.lastActivity = Date.now();
  return true;
}

export function changeTeamName(room: Room, teamId: TeamId, newName: string): boolean {
  // Don't allow during active game
  if (room.gameState.status === 'playing') return false;
  
  // Validate name
  const trimmedName = newName.trim();
  if (!trimmedName || trimmedName.length > 20) return false;
  
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

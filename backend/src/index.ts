import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { Player, TeamId } from './types';
import * as roomManager from './roomManager';
import * as gameLogic from './gameLogic';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

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
  
  let currentPlayer: Player | null = null;
  let currentRoom: string | null = null;
  
  // Join or create room
  socket.on('joinRoom', ({ playerName, roomId, teamId }: { playerName: string; roomId?: string; teamId?: TeamId }) => {
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
      
      // Create player with chosen team or auto-assign
      const assignedTeamId: TeamId = teamId && (teamId === 'A' || teamId === 'B') ? teamId : roomManager.getBalancedTeamId(room);
      
      const player: Player = {
        id: roomManager.generatePlayerId(),
        name: cleanName,
        socketId: socket.id,
        teamId: assignedTeamId,
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
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });
  
  // Start game
  socket.on('startGame', () => {
    if (!currentPlayer || !currentRoom) return;
    
    const room = roomManager.getRoom(currentRoom);
    if (!room) return;
    
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
  socket.on('selectWord', ({ word }: { word: string }) => {
    if (!currentPlayer || !currentRoom) return;
    
    const room = roomManager.getRoom(currentRoom);
    if (!room) return;
    
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
  socket.on('draw', (data: any) => {
    if (!currentPlayer || !currentRoom) return;
    
    const room = roomManager.getRoom(currentRoom);
    if (!room) return;
    
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
    if (!currentPlayer || !currentRoom) return;
    
    const room = roomManager.getRoom(currentRoom);
    if (!room) return;
    
    // Only drawer can clear
    if (room.gameState.currentDrawerId !== currentPlayer.id) {
      return;
    }
    
    room.drawingHistory = [];
    io.to(room.id).emit('canvasCleared');
  });
  
  // Guess
  socket.on('guess', ({ message }: { message: string }) => {
    if (!currentPlayer || !currentRoom) return;
    
    const room = roomManager.getRoom(currentRoom);
    if (!room) return;
    
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
      const drawer = room.players[room.gameState.currentDrawerId!];
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
  socket.on('chatMessage', ({ message }: { message: string }) => {
    if (!currentPlayer || !currentRoom) return;
    
    const room = roomManager.getRoom(currentRoom);
    if (!room) return;
    
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
  
  // Change team
  socket.on('changeTeam', ({ teamId }: { teamId: TeamId }) => {
    if (!currentPlayer || !currentRoom) return;
    
    const room = roomManager.getRoom(currentRoom);
    if (!room) return;
    
    const success = roomManager.changePlayerTeam(room, currentPlayer.id, teamId);
    
    if (success) {
      // Send updated room state to everyone
      const serializedRoom = serializeRoom(room);
      io.to(room.id).emit('roomStateUpdate', { room: serializedRoom });
    } else {
      socket.emit('error', { message: 'Cannot change teams during game' });
    }
  });
  
  // Change team name
  socket.on('changeTeamName', ({ teamId, name }: { teamId: TeamId; name: string }) => {
    if (!currentPlayer || !currentRoom) return;
    
    const room = roomManager.getRoom(currentRoom);
    if (!room) return;
    
    const success = roomManager.changeTeamName(room, teamId, name);
    
    if (success) {
      // Send updated room state to everyone
      const serializedRoom = serializeRoom(room);
      io.to(room.id).emit('roomStateUpdate', { room: serializedRoom });
    } else {
      socket.emit('error', { message: 'Invalid team name or cannot change during game' });
    }
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    if (!currentPlayer || !currentRoom) return;
    
    const room = roomManager.getRoom(currentRoom);
    if (!room) return;
    
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
      const updatedRoom = roomManager.getRoom(currentRoom!);
      if (updatedRoom && updatedRoom.players[currentPlayer!.id]?.status === 'disconnected') {
        roomManager.removePlayerFromRoom(updatedRoom, currentPlayer!.id);
        
        io.to(updatedRoom.id).emit('playerLeft', {
          playerId: currentPlayer!.id,
          playerName: currentPlayer!.name
        });
        
        // Clean up timers if room deleted
        if (!roomManager.getRoom(currentRoom!)) {
          gameLogic.cleanupRoom(updatedRoom);
        }
      }
    }, 60000);
  });
});

// Helper functions
function serializeRoom(room: any) {
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

function serializePlayer(player: any) {
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

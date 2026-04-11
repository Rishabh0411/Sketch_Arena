# 🎨 Sketch Arena — Multiplayer Drawing & Guessing Game

[![Version](https://img.shields.io/badge/version-1.0.0--draft-blue.svg)](https://github.com/your-repo/sketch-arena)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)

> A real-time multiplayer drawing-and-guessing game with team-based competitive gameplay, built with React, TypeScript, Socket.IO, and Node.js.

**Version:** 1.0.0 (Working Draft)  
**Last Updated:** 2026-03-26  
**Team:** Sketch Arena

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [How to Play](#-how-to-play)
- [Product Definition](#1-product-definition)
- [Game Rules](#2-game-rules-formal-specification)
- [System Architecture](#3-system-architecture)
- [Data Model](#4-data-model-strict-definition)
- [API & Socket Contract](#5-api--socket-contract-critical)
- [Frontend UI/UX](#6-frontend-uiux-react--typescript)
- [Game Engine Logic](#7-game-engine-logic)
- [Timer System](#8-timer-system)
- [Scoring Algorithm](#9-scoring-algorithm)
- [Edge Cases & Solutions](#11-edge-cases--solutions)
- [Security & Validation](#-security--validation)
- [Performance & Optimization](#-performance--optimization)
- [Troubleshooting](#-troubleshooting)
- [Testing Plan](#12-testing-plan)
- [Deployment](#10-deployment-architecture)
- [Contributing](#-contributing)
- [FAQ](#-faq)

---

## Overview

Sketch Arena is a real-time multiplayer application built around an event-driven, server-controlled game loop. It supports team-based competitive gameplay with rooms, round-robin drawers, private word selection, and server-authoritative scoring.

**Key Features:**
- 🎮 Real-time multiplayer gameplay
- 👥 Team-based competition (2 teams)
- 🎨 HTML5 Canvas drawing
- ⚡ WebSocket-powered synchronization
- 🏆 Time-based scoring system
- 🔗 Easy room sharing via invite links

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 or **yarn** >= 1.22.0
- **Git** ([Download](https://git-scm.com/))
- *Optional:* **Redis** >= 6.0 (for production scaling)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/sketch-arena.git
   cd sketch-arena
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables:**

   **Backend** (`backend/.env`):
   ```env
   PORT=4000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:4173
   REDIS_URL=redis://localhost:6379  # Optional
   MAX_ROOMS=1000
   MAX_PLAYERS_PER_ROOM=10
   WORD_LIST_PATH=./data/words.json
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_SOCKET_URL=ws://localhost:4000
   ```

### Running Locally

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:4000
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:4173
   ```

3. **Open multiple browser tabs** to test multiplayer functionality:
   - Tab 1: `http://localhost:4173`
   - Tab 2: `http://localhost:4173`

---

## 🎮 How to Play

### For Players

1. **Enter your name** on the landing page
2. **Create a new room** or **join with a room code**
3. **Share the invite link** with friends
4. **Wait in the lobby** until all players join
5. **Game starts** when host clicks "Start Game"

### Gameplay

- **Drawing Turn:** When it's your turn, choose a word and draw it
- **Guessing:** Watch your teammate draw and type your guess in chat
- **Scoring:** 
  - Correct guess = 100 points + time bonus
  - Time expires = opposing team gets 50 points
- **Winning:** Team with most points after all rounds wins!

**Tips:**
- ✏️ Draw clear, simple shapes
- 🕐 Guess quickly for more points
- 💬 Only your team sees your guesses
- 🎯 Strategic word choice matters

---

## 1. Product Definition

Product Name (working): Sketch Arena

Core Concept

A real-time, multiplayer drawing-and-guessing game where:

- Players join rooms via code or invite link
- Players are assigned to teams
- One player from a team draws
- Only their team guesses
- If guessed correctly → team earns points
- If time expires → opposing team earns points

## 2. Game Rules (Formal Specification)

### 2.1 Room Rules

Each room contains:

- 2 teams (Team A, Team B)
- 2–10 players
- Each player belongs to exactly one team

### 2.2 Turn Rules

Each turn consists of:

1. Drawer Selection
	 - A player from a team is selected (round-robin)
2. Word Selection
	 - Drawer is given 3 random words
	 - Chooses one within 10 seconds
3. Drawing Phase
	 - Timer starts (e.g., 80 seconds)
	 - Only drawer can draw
4. Guessing Phase
	 - Only same-team players can guess

### 2.3 Scoring Rules

- If team guesses correctly:
	- Base score: 100 points
	- Time bonus: bonus = remainingTime * multiplier
	- Total awarded: teamScore += base + bonus
- If timer expires:
	- Opposing team gets: opponentScore += base / 2

### 2.4 Win Condition

Game ends after:

- Fixed rounds OR
- Score threshold

Winner: team with highest score

## 3. System Architecture

### 3.1 High-Level Design

Frontend (React + TypeScript)
	↓
Socket.IO (WebSocket Layer)
	↓
Node.js Server (Game Engine)
	↓
In-Memory Store (Redis optional)

### 3.2 Architectural Principles

- Server-authoritative state
- Event-driven communication
- Room isolation via Socket.IO rooms or namespaces
- Stateless frontend

## 4. Data Model (Strict Definition)

### 4.1 Player Model

```ts
type Player = {
	id: string
	name: string
	socketId: string
	teamId: "A" | "B"
	isDrawer: boolean
	hasGuessed: boolean
}
```

### 4.2 Team Model

```ts
type Team = {
	id: "A" | "B"
	score: number
	players: string[] // playerIds
}
```

### 4.3 Room Model

```ts
type Room = {
	id: string
	players: Record<string, Player>
	teams: Record<"A" | "B", Team>

	gameState: {
		status: "waiting" | "playing" | "finished"
		currentDrawerId: string
		currentWord: string
		wordOptions: string[]
		round: number
		maxRounds: number
		timer: number
		startTime: number
	}
}
```

## 5. API & Socket Contract (CRITICAL)

This section defines the socket API and messages. The server is authoritative and emits state updates frequently.

### Technical Implementation Notes

**WebSocket Reconnection Strategy:**
- Client stores `playerId` in localStorage for persistent identity
- On disconnect, client automatically attempts reconnection
- Server maintains 60-second grace period for disconnected players
- Full state resync on successful reconnection

**State Synchronization Algorithm:**
```js
// Server maintains authoritative state
const rooms = new Map(); // roomId -> Room

// Client receives state updates
socket.on('roomStateUpdate', (fullState) => {
  // Replace entire local state
  localRoomState = fullState;
  renderUI(localRoomState);
});

// Optimistic updates for drawing (client-side prediction)
function handleLocalDraw(x, y) {
  // Draw immediately for responsiveness
  drawOnCanvas(x, y);
  
  // Send to server for validation
  socket.emit('draw', { x, y });
}

// Server validates and broadcasts
socket.on('draw', (data) => {
  if (validate(data)) {
    io.to(room.id).emit('drawData', data);
  }
});
```

**Conflict Resolution Mechanism:**
- Last-write-wins for drawing events (timestamped)
- Server-authoritative for game state changes
- Client cannot override server decisions

**Error Handling Patterns:**
```js
// Server emits specific error types
socket.emit('error', {
  type: 'INVALID_ACTION',
  message: 'Cannot draw when not your turn',
  code: 'ERR_NOT_DRAWER'
});

// Client handles gracefully
socket.on('error', ({ type, message, code }) => {
  switch (code) {
    case 'ERR_NOT_DRAWER':
      showToast('It\'s not your turn to draw');
      break;
    case 'ERR_RATE_LIMIT':
      showToast('You\'re doing that too fast');
      break;
    default:
      console.error(message);
  }
});
```

**Heartbeat Implementation:**
```js
// Server pings every 25 seconds
setInterval(() => {
  io.sockets.emit('ping');
}, 25000);

// Client responds to keep connection alive
socket.on('ping', () => {
  socket.emit('pong');
});

// Server tracks last pong time
socket.on('pong', () => {
  socket.data.lastPong = Date.now();
});

// Disconnect stale connections (60s timeout)
setInterval(() => {
  io.sockets.sockets.forEach((socket) => {
    if (Date.now() - socket.data.lastPong > 60000) {
      socket.disconnect(true);
    }
  });
}, 30000);
```

### 5.1 Connection Flow

- Event: `connect` — triggered automatically by Socket.IO
- Server assigns `socketId`

### 5.2 Join Room

Client → Server:

```json
joinRoom({
	roomId?: string,
	playerName: string
})
```

Server Logic:

- If `roomId` exists → join
- Else → create new room
- Assign team: balance teams automatically

Server → Client:

- `roomStateUpdate(room: Room)` — full room state snapshot

### 5.3 Invite Link

Format:

```
https://your-app.com/room/{roomId}
```

Frontend reads `roomId` from URL and auto-calls `joinRoom` when present.

### 5.4 Start Game

Client → Server:

```json
startGame()
```

Server:

- Validate minimum players
- Initialize: round = 1, scores = 0
- Trigger first turn

### 5.5 Turn Start

Server → Clients:

```json
turnStart({
	drawerId: string,
	teamId: "A" | "B",
	wordOptions: string[]
})
```

- Only drawer receives `wordOptions` privately (socket emit to drawer)

### 5.6 Word Selection

Client (Drawer) → Server:

```json
selectWord({ word: string })
```

Server:

- Set `currentWord`
- Start timer

### 5.7 Drawing Event

Client → Server:

```json
draw({ x, y, color, size })
```

Server → Room:

- `drawData(...)` broadcast to room

Notes: drawing events should be throttled on the client and perhaps batched server-side.

### 5.8 Guess Event

Client → Server:

```json
guess({ message: string })
```

Server Logic:

```js
if (player.teamId === drawer.teamId) {
	if (message === currentWord) {
		handleCorrectGuess()
	}
}
```

### 5.9 Correct Guess Handling

Server:

- Stop timer
- Calculate score (base + bonus)
- Update team score

Broadcast:

- `correctGuess({ teamId, pointsAwarded })`

### 5.10 Timer Expiry

Server:

- If no correct guess: opponentTeam.score += basePoints / 2

Broadcast:

- `turnEnd({ reason: "timeout" })`

### 5.11 State Sync

Server → Clients (frequent):

- `roomStateUpdate(room)` — full or diff updates

## 6. Frontend UI/UX (React + TypeScript)

### 6.1 Screens

1. Landing Page
	 - Input: name
	 - Buttons: Create Room, Join via code
2. Lobby Screen
	 - Show: Room code, Invite link, Teams (A vs B)
	 - Allow: Drag/drop or auto team assign
3. Game Screen Layout

-----------------------------------
| Team A Score | Timer | Team B   |
-----------------------------------
| Player List (Left) | Canvas    |
-----------------------------------
| Chat (Bottom)                  |
-----------------------------------

### 6.2 Visual Design Principles

- Minimalistic
- High contrast colors
- Smooth transitions
- Real-time feedback

### 6.3 Canvas Behavior

- HTML5 Canvas
- Sync via sockets
- Throttled drawing events

## 7. Game Engine Logic

### State Machine Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    GAME STATE FLOW                      │
└─────────────────────────────────────────────────────────┘

     [Room Created]
           │
           v
    ┌────────────┐
    │  WAITING   │ ◄─── Players join/leave
    └────────────┘      Team assignment
           │
           │ (Start Game triggered)
           v
    ┌────────────┐
    │  PLAYING   │ ◄──┐
    └────────────┘    │
           │          │
           ├──────────┘ (Next turn)
           │
           │ (All rounds complete)
           v
    ┌────────────┐
    │  FINISHED  │
    └────────────┘
           │
           v
      [Cleanup]
```

### Turn Lifecycle Sequence

```
Drawer         Server          Guessers        Timer
  │              │                │              │
  │─ SELECT ────→│                │              │
  │              │─ START TURN ──→│              │
  │              │                │              │
  │              │────────────────────── START ─→│
  │              │                │              │
  │─ DRAW ──────→│                │              │
  │              │─ BROADCAST ───→│              │
  │              │    DRAW        │              │
  │              │                │              │
  │              │←─── GUESS ─────│              │
  │              │                │              │
  │              │─ (validate) ───│              │
  │              │                │              │
  │              │  [IF CORRECT]  │              │
  │              │─ STOP ─────────────────────────│
  │              │─ AWARD SCORE ─→│              │
  │              │                │              │
  │              │─ END TURN ─────→              │
  │              │                │              │
  │              │  [IF TIMEOUT]  │              │
  │              │←──────────────────── EXPIRED ─│
  │              │─ AWARD OPP ────→│              │
  │              │─ NEXT TURN ────→│              │
```

### Connection Flow Diagram

```
Client                        Server
  │                             │
  │──── connect ───────────────→│
  │                             │ (assign socketId)
  │←─── connected ──────────────│
  │                             │
  │──── joinRoom ──────────────→│
  │    { roomId?, name }        │ (validate input)
  │                             │ (create/join room)
  │                             │ (assign team)
  │←─── roomStateUpdate ────────│
  │    (full room state)        │
  │                             │
  │←─── playerJoined ───────────│ (broadcast to others)
  │                             │
  │──── startGame ─────────────→│ (if host)
  │                             │ (validate min players)
  │←─── gameStarted ────────────│ (broadcast)
  │←─── turnStart ──────────────│
  │                             │
  │        [GAME LOOP]          │
  │                             │
  │──── disconnect ────────────→│
  │                             │ (grace period: 60s)
  │                             │ (if drawer, skip turn)
  │    [reconnect]              │
  │──── reconnect ─────────────→│
  │    { playerId, roomId }     │ (restore session)
  │←─── roomStateUpdate ────────│
  │←─── reconnectSuccess ───────│
```

### Score Calculation Flowchart

```
              [Guess Received]
                     │
                     v
              ┌─────────────┐
              │  Normalize  │
              │   (lower)   │
              └─────────────┘
                     │
                     v
              ┌─────────────┐
          NO  │  Matches    │  YES
        ┌─────│  current    │─────┐
        │     │   word?     │     │
        │     └─────────────┘     │
        │                         │
        v                         v
  ┌──────────┐           ┌──────────────┐
  │  Return  │           │  Stop Timer  │
  │  false   │           └──────────────┘
  └──────────┘                   │
                                 v
                        ┌─────────────────┐
                        │  Get Remaining  │
                        │      Time       │
                        └─────────────────┘
                                 │
                                 v
                        ┌─────────────────┐
                        │ Calculate Score │
                        │ base = 100      │
                        │ bonus = time*2  │
                        │ total = b + b   │
                        └─────────────────┘
                                 │
                                 v
                        ┌─────────────────┐
                        │  Award to Team  │
                        │  team.score +=  │
                        └─────────────────┘
                                 │
                                 v
                        ┌─────────────────┐
                        │  Broadcast      │
                        │  correctGuess   │
                        └─────────────────┘
                                 │
                                 v
                           [Next Turn]
```

### Player Turn Rotation

Turn Rotation

```js
function getNextDrawer(room) {
	// rotate across all players
}
```

Team-Based Guess Restriction

```js
if (player.teamId !== drawer.teamId) {
	// reject guess
}
```

## 8. Timer System

Start:

```js
setInterval(() => {
	remainingTime--
}, 1000)
```

Stop:

- On correct guess OR timeout

Notes: timer should be server-authoritative. Clients receive remaining time updates.

## 9. Scoring Algorithm

Constants:

```js
const base = 100
const multiplier = 2

// awarded points
points = base + (remainingTime * multiplier)
```

## 10. Deployment Architecture

Frontend

- Host: Vercel (recommended)
- Build: Vite + React TypeScript

Backend

- Host: Render (recommended) or any managed Node.js host
- Node.js server
- Optional Redis for rooms and scaling (sticky sessions or Redis-backed pub/sub)

## 11. Edge Cases & Solutions

This section documents critical edge cases and their handling strategies.

### 11.1 Network & Connectivity Issues

#### Player Disconnection (Mid-Game)
**Issue:** Player loses connection during active game

**Solution:**
```js
// Server-side handling
socket.on('disconnect', () => {
  const player = getPlayerBySocketId(socket.id);
  const room = getRoomByPlayerId(player.id);
  
  // Mark as disconnected but keep in room for 60 seconds
  player.status = 'disconnected';
  player.disconnectTime = Date.now();
  
  // If drawer disconnects, skip turn immediately
  if (player.id === room.gameState.currentDrawerId) {
    skipTurn(room, 'drawer_disconnect');
  }
  
  // Broadcast player status
  io.to(room.id).emit('playerDisconnected', { 
    playerId: player.id, 
    gracePeriod: 60000 
  });
  
  // Auto-remove after grace period
  setTimeout(() => {
    if (player.status === 'disconnected') {
      removePlayer(room, player.id);
    }
  }, 60000);
});
```

**Additional Considerations:**
- Display "Reconnecting..." UI for disconnected players
- Pause timer if critical player (drawer) disconnects
- Notify team members of disconnection

#### Player Reconnection
**Issue:** Player reconnects with new socket ID

**Solution:**
```js
// Client stores unique playerId in localStorage
const playerId = localStorage.getItem('playerId') || generateId();

// On reconnect, send playerId to rejoin
socket.emit('reconnect', { playerId, roomId });

// Server-side
socket.on('reconnect', ({ playerId, roomId }) => {
  const player = getPlayerById(playerId);
  if (player && player.status === 'disconnected') {
    player.socketId = socket.id;
    player.status = 'active';
    
    // Send full state snapshot
    socket.emit('roomStateUpdate', getRoom(roomId));
    socket.emit('reconnectSuccess', { 
      message: 'Welcome back!',
      missedEvents: getEventsSince(player.disconnectTime)
    });
  }
});
```

#### Network Lag & Packet Loss
**Issue:** Drawing events arrive out of order or delayed

**Solution:**
```js
// Client-side: Add sequence numbers to drawing events
let drawSequence = 0;
const drawEvent = {
  x, y, color, size,
  seq: drawSequence++,
  timestamp: Date.now()
};

// Server-side: Buffer and reorder
const drawBuffer = [];
socket.on('draw', (data) => {
  drawBuffer.push(data);
  
  // Sort by sequence and flush in order
  drawBuffer.sort((a, b) => a.seq - b.seq);
  
  // Broadcast ordered events
  while (drawBuffer.length > 0 && drawBuffer[0].seq === expectedSeq) {
    const event = drawBuffer.shift();
    io.to(room.id).emit('drawData', event);
    expectedSeq++;
  }
});
```

**Throttling Strategy:**
```js
// Client: Throttle draw events (max 60 per second)
let lastDraw = 0;
const DRAW_THROTTLE = 16; // ~60 FPS

canvas.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastDraw < DRAW_THROTTLE) return;
  
  lastDraw = now;
  socket.emit('draw', { x: e.x, y: e.y, ... });
});
```

### 11.2 Security Edge Cases

#### Chat/Input Injection
**Issue:** Malicious HTML/script injection in guesses or names

**Solution:**
```js
// Server-side validation
function sanitizeInput(input) {
  return input
    .trim()
    .slice(0, 100) // Max length
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/[^\w\s\-]/g, ''); // Only alphanumeric + spaces
}

socket.on('guess', ({ message }) => {
  const clean = sanitizeInput(message);
  if (clean.length === 0) return;
  
  // Additional: rate limiting (see below)
  handleGuess(player, clean);
});
```

#### Rate Limiting (Spam Prevention)
**Issue:** Player spams guesses or drawing events

**Solution:**
```js
// Rate limiter using sliding window
const rateLimiter = new Map();

function checkRateLimit(playerId, action, limit, windowMs) {
  const key = `${playerId}:${action}`;
  const now = Date.now();
  
  if (!rateLimiter.has(key)) {
    rateLimiter.set(key, []);
  }
  
  const timestamps = rateLimiter.get(key);
  
  // Remove old timestamps outside window
  const recent = timestamps.filter(t => now - t < windowMs);
  
  if (recent.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  recent.push(now);
  rateLimiter.set(key, recent);
  return true;
}

// Usage
socket.on('guess', ({ message }) => {
  if (!checkRateLimit(player.id, 'guess', 5, 1000)) {
    socket.emit('rateLimitError', { 
      message: 'Too many guesses. Please wait.' 
    });
    return;
  }
  // Process guess...
});
```

#### Word Leaking (Drawer Sharing Answer)
**Issue:** Drawer types the answer in chat to cheat

**Solution:**
```js
// Block drawer from sending messages during their turn
socket.on('chatMessage', ({ message }) => {
  const room = getRoom(player.roomId);
  
  if (player.id === room.gameState.currentDrawerId) {
    socket.emit('error', { 
      message: 'Drawers cannot chat during their turn' 
    });
    return;
  }
  
  // Also check if message contains the current word
  if (message.toLowerCase().includes(room.gameState.currentWord.toLowerCase())) {
    socket.emit('error', { 
      message: 'Cannot send messages containing the answer' 
    });
    return;
  }
  
  broadcastChat(room, player, sanitizeInput(message));
});
```

#### Client-Side Manipulation
**Issue:** User modifies client code to see hidden word

**Solution:**
- **Never send word to non-drawers:** Only emit `wordOptions` to the drawer's socket
- **Server-authoritative validation:** All game state changes validated on server
- **Obfuscation:** Use encrypted payloads for sensitive data

```js
// Good: Only drawer receives word
io.to(drawer.socketId).emit('wordOptions', { 
  options: ['cat', 'house', 'tree'] 
});

// Bad: Broadcasting to everyone
io.to(room.id).emit('wordOptions', ...); // DON'T DO THIS
```

### 11.3 Game Logic Edge Cases

#### Concurrent Correct Guesses
**Issue:** Two players guess correctly at same millisecond

**Solution:**
```js
let turnResolved = false;

socket.on('guess', ({ message }) => {
  // Atomic check-and-set
  if (turnResolved) {
    socket.emit('guessTooLate', { 
      message: 'Someone guessed first!' 
    });
    return;
  }
  
  if (message.toLowerCase() === currentWord.toLowerCase()) {
    turnResolved = true; // Lock immediately
    handleCorrectGuess(player);
  }
});
```

#### Drawer Selects Word After Timeout
**Issue:** Drawer delays and selects word after 10s countdown

**Solution:**
```js
// Start selection timer
const selectionTimer = setTimeout(() => {
  if (!room.gameState.currentWord) {
    // Auto-select random word
    const randomWord = wordOptions[Math.floor(Math.random() * 3)];
    room.gameState.currentWord = randomWord;
    startDrawingPhase(room);
    
    io.to(room.id).emit('wordAutoSelected', { 
      message: 'Time expired. Word auto-selected.' 
    });
  }
}, 10000);

socket.on('selectWord', ({ word }) => {
  clearTimeout(selectionTimer);
  
  // Validate word is in options
  if (!wordOptions.includes(word)) {
    socket.emit('error', { message: 'Invalid word selection' });
    return;
  }
  
  room.gameState.currentWord = word;
  startDrawingPhase(room);
});
```

#### Timer Drift
**Issue:** Client and server timers become desynchronized

**Solution:**
```js
// Server is authoritative - broadcasts remaining time every second
setInterval(() => {
  const remaining = calculateRemainingTime(room);
  io.to(room.id).emit('timerUpdate', { remaining });
}, 1000);

// Client syncs to server time
socket.on('timerUpdate', ({ remaining }) => {
  // Update UI with server's authoritative time
  updateTimerDisplay(remaining);
});
```

#### Empty Team After Disconnections
**Issue:** All players from Team A disconnect

**Solution:**
```js
function rebalanceTeams(room) {
  const teamA = room.teams.A.players;
  const teamB = room.teams.B.players;
  
  if (teamA.length === 0 && teamB.length > 0) {
    // Move half of Team B to Team A
    const toMove = teamB.splice(0, Math.ceil(teamB.length / 2));
    teamA.push(...toMove);
    
    toMove.forEach(playerId => {
      const player = room.players[playerId];
      player.teamId = 'A';
    });
    
    io.to(room.id).emit('teamsRebalanced', { 
      teams: room.teams 
    });
  }
}

// Call after any player removal
function removePlayer(room, playerId) {
  // ... remove logic ...
  rebalanceTeams(room);
  
  // If not enough players, pause game
  if (getTotalPlayers(room) < 2) {
    pauseGame(room, 'insufficient_players');
  }
}
```

#### Mid-Turn Team Changes
**Issue:** Player switches teams while being the drawer

**Solution:**
```js
// Prevent team changes during active turn
socket.on('changeTeam', ({ newTeamId }) => {
  const room = getRoom(player.roomId);
  
  if (room.gameState.status === 'playing') {
    socket.emit('error', { 
      message: 'Cannot change teams during a turn' 
    });
    return;
  }
  
  // Only allow in lobby
  if (room.gameState.status === 'waiting') {
    player.teamId = newTeamId;
    io.to(room.id).emit('playerTeamChanged', { 
      playerId: player.id, 
      teamId: newTeamId 
    });
  }
});
```

### 11.4 Scalability Edge Cases

#### Room Limit Exceeded
**Issue:** Server runs out of memory with too many rooms

**Solution:**
```js
const MAX_ROOMS = process.env.MAX_ROOMS || 1000;

function createRoom() {
  if (Object.keys(rooms).length >= MAX_ROOMS) {
    throw new Error('Server capacity reached. Please try again later.');
  }
  
  // Also: Clean up abandoned rooms
  cleanupInactiveRooms();
  
  return new Room(generateRoomId());
}

function cleanupInactiveRooms() {
  const now = Date.now();
  const INACTIVE_THRESHOLD = 30 * 60 * 1000; // 30 minutes
  
  Object.values(rooms).forEach(room => {
    if (now - room.lastActivity > INACTIVE_THRESHOLD) {
      deleteRoom(room.id);
    }
  });
}
```

#### Canvas Drawing Performance
**Issue:** Too many drawing points causes lag

**Solution:**
```js
// Client-side: Simplify strokes using Ramer-Douglas-Peucker
function simplifyStroke(points, tolerance = 2) {
  // Reduce point density while preserving shape
  return rdpSimplify(points, tolerance);
}

// Batch multiple points into single event
const pointBuffer = [];
const BATCH_SIZE = 10;

function handleMouseMove(e) {
  pointBuffer.push({ x: e.x, y: e.y });
  
  if (pointBuffer.length >= BATCH_SIZE) {
    const simplified = simplifyStroke(pointBuffer);
    socket.emit('drawBatch', { points: simplified });
    pointBuffer.length = 0;
  }
}
```

#### Memory Leak from Event Listeners
**Issue:** Socket listeners not cleaned up properly

**Solution:**
```js
// Track listeners for cleanup
const socketListeners = new Map();

function registerSocketEvents(socket, room) {
  const listeners = {
    draw: (data) => handleDraw(room, socket, data),
    guess: (data) => handleGuess(room, socket, data),
    // ... more listeners
  };
  
  // Register all listeners
  Object.entries(listeners).forEach(([event, handler]) => {
    socket.on(event, handler);
  });
  
  // Store for cleanup
  socketListeners.set(socket.id, listeners);
}

function cleanupSocket(socket) {
  const listeners = socketListeners.get(socket.id);
  
  if (listeners) {
    Object.entries(listeners).forEach(([event, handler]) => {
      socket.off(event, handler);
    });
    socketListeners.delete(socket.id);
  }
}

socket.on('disconnect', () => {
  cleanupSocket(socket);
});
```

### 11.5 UI/UX Edge Cases

#### Mobile Responsiveness
**Issue:** Canvas too small on mobile devices

**Solution:**
```js
// Auto-scale canvas to viewport
function resizeCanvas() {
  const container = document.getElementById('canvas-container');
  const maxWidth = container.clientWidth;
  const maxHeight = window.innerHeight * 0.6;
  
  canvas.width = Math.min(800, maxWidth);
  canvas.height = Math.min(600, maxHeight);
  
  // Redraw current canvas state
  redrawCanvas();
}

window.addEventListener('resize', debounce(resizeCanvas, 250));
```

#### Touch Drawing vs Mouse
**Issue:** Touch events work differently than mouse

**Solution:**
```js
// Unified event handling
function getPointerPosition(e) {
  const rect = canvas.getBoundingClientRect();
  
  if (e.touches && e.touches[0]) {
    // Touch event
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }
  
  // Mouse event
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// Prevent scrolling while drawing
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startDrawing(getPointerPosition(e));
}, { passive: false });
```

#### Browser Tab Inactive
**Issue:** Timer continues when user switches tabs

**Solution:**
```js
// Client-side: Sync on visibility change
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Request fresh state when returning
    socket.emit('requestSync');
  }
});

// Server sends full state
socket.on('requestSync', () => {
  socket.emit('roomStateUpdate', getRoom(player.roomId));
});
```

---

## 🔒 Security & Validation

### Input Sanitization

All user inputs must be sanitized to prevent XSS and injection attacks:

```js
// Central validation module
const validator = {
  playerName: (name) => {
    return name
      .trim()
      .slice(0, 20)
      .replace(/[^\w\s\-]/g, '')
      .replace(/\s+/g, ' ');
  },
  
  guess: (text) => {
    return text
      .trim()
      .slice(0, 100)
      .replace(/[<>]/g, '');
  },
  
  roomId: (id) => {
    return /^[A-Z0-9]{6}$/.test(id) ? id : null;
  }
};

// Apply at socket layer
socket.on('joinRoom', ({ playerName, roomId }) => {
  const cleanName = validator.playerName(playerName);
  const cleanRoomId = roomId ? validator.roomId(roomId) : null;
  
  if (!cleanName) {
    socket.emit('error', { message: 'Invalid player name' });
    return;
  }
  
  // Proceed with clean inputs
  handleJoinRoom(socket, cleanName, cleanRoomId);
});
```

### Anti-Cheating Mechanisms

**1. Word Visibility Control**
```js
// Never broadcast word to all players
function startTurn(room, drawer) {
  const wordOptions = getRandomWords(3);
  
  // Only send to drawer
  io.to(drawer.socketId).emit('wordOptions', { options: wordOptions });
  
  // Others see masked word
  const otherPlayers = getTeamPlayers(room, drawer.teamId);
  otherPlayers.forEach(p => {
    io.to(p.socketId).emit('wordMasked', { 
      length: currentWord.length,
      hint: getMaskedWord(currentWord) // "_ _ _ _"
    });
  });
}
```

**2. Server-Side Validation**
```js
// Validate all game actions server-side
socket.on('draw', (data) => {
  const room = getRoom(player.roomId);
  
  // Only drawer can draw
  if (player.id !== room.gameState.currentDrawerId) {
    return; // Silently reject
  }
  
  // Validate coordinates are within canvas bounds
  if (!isValidCoordinate(data.x, data.y)) {
    return;
  }
  
  // Validate color from allowed palette
  if (!ALLOWED_COLORS.includes(data.color)) {
    data.color = '#000000'; // Default to black
  }
  
  // Broadcast validated data
  io.to(room.id).emit('drawData', data);
});
```

**3. Timing Attack Prevention**
```js
// Prevent using guess timing to deduce word length
async function handleGuess(player, guess) {
  const room = getRoom(player.roomId);
  const correct = guess.toLowerCase() === room.gameState.currentWord.toLowerCase();
  
  // Always wait same amount before responding
  await sleep(50); // Constant delay
  
  if (correct) {
    handleCorrectGuess(room, player);
  } else {
    // Send generic feedback (no hints)
    socket.emit('guessResult', { correct: false });
  }
}
```

### Rate Limiting Strategies

**Per-Socket Rate Limits:**
```js
const RATE_LIMITS = {
  guess: { max: 5, window: 1000 },      // 5 guesses per second
  draw: { max: 60, window: 1000 },      // 60 draw events per second
  chat: { max: 3, window: 1000 },       // 3 messages per second
  joinRoom: { max: 10, window: 60000 }  // 10 room joins per minute
};

// Apply middleware
socket.use((packet, next) => {
  const [event, data] = packet;
  const limit = RATE_LIMITS[event];
  
  if (limit && !checkRateLimit(socket.id, event, limit.max, limit.window)) {
    return next(new Error('Rate limit exceeded'));
  }
  
  next();
});
```

### Word Validation Rules

```js
// Word list validation
const WORD_RULES = {
  minLength: 3,
  maxLength: 20,
  allowedPattern: /^[a-zA-Z\s\-]+$/, // Letters, spaces, hyphens only
  bannedWords: ['inappropriate', 'offensive'] // Load from config
};

function validateWord(word) {
  if (word.length < WORD_RULES.minLength) return false;
  if (word.length > WORD_RULES.maxLength) return false;
  if (!WORD_RULES.allowedPattern.test(word)) return false;
  if (WORD_RULES.bannedWords.includes(word.toLowerCase())) return false;
  return true;
}

// Filter word list on server startup
const wordList = loadWords()
  .filter(validateWord)
  .map(w => w.toLowerCase().trim());
```

### Authentication Considerations

For production deployments, consider adding:

```js
// Optional: JWT-based authentication
const jwt = require('jsonwebtoken');

// On socket connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(); // Allow anonymous play
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication failed'));
  }
});

// Track player stats with user accounts
if (socket.user) {
  player.userId = socket.user.id;
  player.isAuthenticated = true;
}
```

---

## ⚡ Performance & Optimization

### Canvas Drawing Optimization

**1. Throttle Drawing Events**
```js
// Client-side: Use requestAnimationFrame
let pendingDrawPoints = [];
let rafId = null;

function queueDrawPoint(x, y) {
  pendingDrawPoints.push({ x, y });
  
  if (!rafId) {
    rafId = requestAnimationFrame(flushDrawPoints);
  }
}

function flushDrawPoints() {
  if (pendingDrawPoints.length > 0) {
    // Batch send all pending points
    socket.emit('drawBatch', { 
      points: pendingDrawPoints.slice() 
    });
    pendingDrawPoints = [];
  }
  rafId = null;
}
```

**2. Optimize Canvas Rendering**
```js
// Use offscreen canvas for better performance
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d', { 
  alpha: false,
  desynchronized: true 
});

// Batch render multiple strokes
function renderStrokes(strokes) {
  offscreenCtx.clearRect(0, 0, width, height);
  
  strokes.forEach(stroke => {
    offscreenCtx.beginPath();
    offscreenCtx.strokeStyle = stroke.color;
    offscreenCtx.lineWidth = stroke.size;
    offscreenCtx.lineCap = 'round';
    
    stroke.points.forEach((point, i) => {
      if (i === 0) {
        offscreenCtx.moveTo(point.x, point.y);
      } else {
        offscreenCtx.lineTo(point.x, point.y);
      }
    });
    
    offscreenCtx.stroke();
  });
  
  // Copy to visible canvas
  ctx.drawImage(offscreenCanvas, 0, 0);
}
```

### Socket Event Throttling/Batching

**Server-Side Event Batching:**
```js
// Collect drawing events and broadcast in batches
const drawBatchQueue = new Map(); // roomId -> events[]

setInterval(() => {
  drawBatchQueue.forEach((events, roomId) => {
    if (events.length > 0) {
      io.to(roomId).emit('drawBatch', { events });
      drawBatchQueue.set(roomId, []);
    }
  });
}, 16); // ~60fps

socket.on('draw', (data) => {
  const room = getRoom(player.roomId);
  
  if (!drawBatchQueue.has(room.id)) {
    drawBatchQueue.set(room.id, []);
  }
  
  drawBatchQueue.get(room.id).push(data);
});
```

### Memory Management Strategies

**1. Room Cleanup**
```js
// Automatic cleanup of finished games
function scheduleRoomCleanup(room) {
  room.cleanupTimer = setTimeout(() => {
    if (room.gameState.status === 'finished' && room.players.length === 0) {
      deleteRoom(room.id);
      console.log(`Room ${room.id} cleaned up`);
    }
  }, 10 * 60 * 1000); // 10 minutes after game ends
}

// Clear on new activity
function resetCleanupTimer(room) {
  if (room.cleanupTimer) {
    clearTimeout(room.cleanupTimer);
  }
  room.lastActivity = Date.now();
}
```

**2. Drawing History Limits**
```js
// Cap drawing history to prevent memory bloat
const MAX_STROKES = 1000;

function addStroke(room, stroke) {
  room.drawingHistory.push(stroke);
  
  // Remove oldest strokes if limit exceeded
  if (room.drawingHistory.length > MAX_STROKES) {
    room.drawingHistory = room.drawingHistory.slice(-MAX_STROKES);
  }
}
```

### Database/Redis Caching Strategies

**Using Redis for Scalability:**
```js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// Store room state in Redis
async function saveRoom(room) {
  await redis.setex(
    `room:${room.id}`,
    3600, // 1 hour TTL
    JSON.stringify(room)
  );
}

async function loadRoom(roomId) {
  const data = await redis.get(`room:${roomId}`);
  return data ? JSON.parse(data) : null;
}

// Use Redis pub/sub for multi-server setup
const pub = new Redis(process.env.REDIS_URL);
const sub = new Redis(process.env.REDIS_URL);

sub.subscribe('room-events');
sub.on('message', (channel, message) => {
  const event = JSON.parse(message);
  // Broadcast to local sockets
  io.to(event.roomId).emit(event.type, event.data);
});

// Publish events to other servers
function broadcastToRoom(roomId, type, data) {
  pub.publish('room-events', JSON.stringify({ roomId, type, data }));
}
```

### Load Testing Recommendations

```bash
# Install artillery for load testing
npm install -g artillery

# Create load test config (artillery.yml)
cat > artillery.yml << 'EOF'
config:
  target: 'http://localhost:4000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
  socketio:
    transports: ['websocket']

scenarios:
  - name: "Join room and draw"
    engine: socketio
    flow:
      - emit:
          channel: "joinRoom"
          data:
            playerName: "Player{{ $randomString() }}"
      - think: 2
      - emit:
          channel: "draw"
          data:
            x: "{{ $randomNumber(0, 800) }}"
            y: "{{ $randomNumber(0, 600) }}"
            color: "#000000"
      - think: 0.1
      - loop:
          - emit:
              channel: "draw"
              data:
                x: "{{ $randomNumber(0, 800) }}"
                y: "{{ $randomNumber(0, 600) }}"
          - think: 0.05
        count: 100
EOF

# Run load test
artillery run artillery.yml
```

**Monitoring Recommendations:**
- Use `clinic.js` for Node.js profiling
- Monitor memory usage with `process.memoryUsage()`
- Track socket connection counts
- Log room creation/deletion rates
- Set up alerts for high CPU/memory usage

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Issue: Canvas not synchronizing between players

**Symptoms:** Drawer sees their strokes, but others don't

**Solutions:**
1. Check browser console for socket connection errors
2. Verify CORS settings allow WebSocket connections
3. Ensure drawing events are being emitted:
   ```js
   // Add debug logging
   socket.on('draw', (data) => {
     console.log('Draw event received:', data);
   });
   ```
4. Check that drawer validation is working correctly
5. Verify socket rooms are set up correctly

#### Issue: Timer shows different times on different clients

**Symptoms:** Countdown timer is desynchronized

**Solutions:**
1. Use server-authoritative time (server broadcasts time every second)
2. Don't rely on client-side `setInterval` for game logic
3. Sync client time on visibility change:
   ```js
   document.addEventListener('visibilitychange', () => {
     if (!document.hidden) {
       socket.emit('requestSync');
     }
   });
   ```

#### Issue: "Room not found" error

**Symptoms:** Player cannot join via invite link

**Possible Causes:**
- Room was cleaned up due to inactivity
- Invalid room ID format
- Server restarted (in-memory rooms lost)

**Solutions:**
1. Implement persistent storage (Redis/Database)
2. Increase room timeout period
3. Add room existence check before redirect:
   ```js
   socket.emit('checkRoom', { roomId }, (exists) => {
     if (!exists) {
       showError('Room not found or expired');
     }
   });
   ```

#### Issue: High latency / lag

**Symptoms:** Drawing appears delayed, guesses take time to register

**Solutions:**
1. Check network tab for slow requests
2. Reduce drawing point density (simplify strokes)
3. Implement client-side prediction for drawings
4. Use WebSocket (not polling) for Socket.IO
5. Enable compression:
   ```js
   const io = require('socket.io')(server, {
     perMessageDeflate: {
       threshold: 1024 // Compress messages > 1KB
     }
   });
   ```

#### Issue: Memory leak over time

**Symptoms:** Server slows down after hours of runtime

**Solutions:**
1. Clean up event listeners on disconnect
2. Implement room cleanup for inactive rooms
3. Cap drawing history size
4. Use weak references for temporary data
5. Monitor with:
   ```js
   setInterval(() => {
     const usage = process.memoryUsage();
     console.log(`Memory: ${Math.round(usage.heapUsed / 1024 / 1024)} MB`);
   }, 60000);
   ```

### Debugging Tips

**Enable Socket.IO Debug Logs:**
```bash
# Client
localStorage.debug = 'socket.io-client:socket';

# Server
DEBUG=socket.io* node server.js
```

**Inspect Room State:**
```js
// Add admin endpoint
app.get('/admin/rooms', (req, res) => {
  const roomData = Object.values(rooms).map(room => ({
    id: room.id,
    players: room.players.length,
    status: room.gameState.status,
    lastActivity: room.lastActivity
  }));
  res.json(roomData);
});
```

**Network Monitoring:**
```js
// Log all socket events
const originalEmit = socket.emit;
socket.emit = function(...args) {
  console.log('Emitting:', args[0], args[1]);
  return originalEmit.apply(socket, args);
};
```

### Cross-Browser Compatibility

**Known Issues:**

| Browser | Issue | Workaround |
|---------|-------|------------|
| Safari (iOS) | Touch events don't prevent scroll | Use `{ passive: false }` on listeners |
| Firefox | Canvas toDataURL() slower | Cache rendered strokes |
| Edge (old) | WebSocket disconnect on idle | Implement heartbeat ping/pong |
| Chrome (mobile) | Canvas touch offset incorrect | Recalculate on orientation change |

**Testing Checklist:**
- ✅ Chrome Desktop (latest)
- ✅ Firefox Desktop (latest)
- ✅ Safari Desktop (latest)
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)
- ✅ Edge (latest)

---

## 12. Testing Plan

- Local multi-tab testing
- Simulate: slow network, rapid drawing
- Unit tests: game state transitions, scoring
- Integration: multi-client socket flows

## 13. Execution Plan (Time-Based)

Phase 1 (2–3 hrs)
- Room + socket setup

Phase 2 (3–4 hrs)
- Drawing sync

Phase 3 (3 hrs)
- Game logic + teams

Phase 4 (2 hrs)
- UI polish

Phase 5 (1 hr)
- Deployment

## Final Product Definition

Sketch Arena is a real-time multiplayer application built around an event-driven, server-controlled game loop. It supports team-based competitive gameplay with rooms, round-robin drawers, private word selection, and server-authoritative scoring.

---

## 👥 Contributing

We welcome contributions to Sketch Arena! Here's how you can help:

### Development Workflow

1. **Fork the repository** and clone your fork
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our code style
4. **Test thoroughly:**
   - Run existing tests: `npm test`
   - Test manually with multiple clients
   - Check for memory leaks and performance issues
5. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add player reconnection grace period"
   ```
6. **Push and create a pull request**

### Code Style Guidelines

**JavaScript/TypeScript:**
- Use ES6+ features
- Prefer `const` over `let`
- Use async/await over promises
- Add JSDoc comments for complex functions
- Keep functions small and focused (< 50 lines)

**Naming Conventions:**
```js
// Variables and functions: camelCase
const playerScore = 100;
function calculateBonus(time) { }

// Classes and types: PascalCase
class GameRoom { }
type PlayerState = { }

// Constants: UPPER_SNAKE_CASE
const MAX_PLAYERS = 10;
const DEFAULT_TIMER = 80;

// Private methods: _prefixUnderscore
function _validateInternal() { }
```

**Socket Events:**
```js
// Use kebab-case for event names
socket.emit('room-joined', data);
socket.on('player-disconnected', handler);
```

### Testing Requirements

All new features should include:
- Unit tests for business logic
- Integration tests for socket events
- Manual testing with 4+ concurrent players
- Performance testing for high-frequency events (drawing)

**Example Test:**
```js
describe('Scoring System', () => {
  it('should award bonus points based on remaining time', () => {
    const baseScore = 100;
    const remainingTime = 30;
    const bonus = calculateTimeBonus(remainingTime);
    expect(bonus).toBe(60); // 30 * 2
  });
});
```

### Pull Request Template

When submitting a PR, include:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings/errors
```

### Issue Reporting Guidelines

**Bug Reports:**
```markdown
**Describe the bug**
Clear description of what's wrong

**To Reproduce**
Steps to reproduce:
1. Join room with code ABC123
2. Start drawing as Team A
3. See error...

**Expected behavior**
What should happen

**Screenshots/Logs**
Add console logs or screenshots

**Environment**
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 98]
- Node version: [e.g., 18.0.0]
```

**Feature Requests:**
- Describe the feature clearly
- Explain the use case
- Consider edge cases
- Suggest implementation approach (optional)

### Areas for Contribution

**High Priority:**
- [ ] Mobile touch optimization
- [ ] Reconnection stability improvements
- [ ] Redis integration for horizontal scaling
- [ ] Canvas drawing performance

**Feature Requests:**
- [ ] Spectator mode
- [ ] Custom word lists
- [ ] Player statistics/leaderboard
- [ ] Drawing replay feature
- [ ] Private rooms with passwords

**Documentation:**
- [ ] API documentation (JSDoc)
- [ ] Architecture diagrams
- [ ] Deployment guides (AWS, DigitalOcean, etc.)
- [ ] Video tutorials

---

## ❓ FAQ

### General Questions

**Q: Is this game free to play?**  
A: Yes, Sketch Arena is completely free and open-source.

**Q: How many players can join a room?**  
A: Each room supports 2-10 players, divided into 2 teams.

**Q: Can I play on mobile?**  
A: Yes! The game is responsive and works on mobile browsers with touch support.

**Q: Do I need an account to play?**  
A: No, you can play anonymously. Simply enter a name and start playing.

### Technical Questions

**Q: What technologies does this use?**  
A: 
- **Frontend:** React, TypeScript, Vite, HTML5 Canvas
- **Backend:** Node.js, Socket.IO, Express
- **Optional:** Redis for scaling

**Q: Can I self-host this game?**  
A: Absolutely! Follow the [Quick Start](#-quick-start) guide to run it locally or deploy to your own server.

**Q: How does the scoring system work?**  
A: Base score is 100 points. Time bonus is calculated as `remainingTime * 2`. If time expires, the opposing team gets 50 points.

**Q: Is there a limit to how many rooms can be created?**  
A: By default, 1000 rooms. This can be configured via `MAX_ROOMS` environment variable.

**Q: How long do rooms persist?**  
A: Rooms are cleaned up after 30 minutes of inactivity or when all players leave.

### Gameplay Questions

**Q: Can I see what the other team is drawing?**  
A: Yes! Both teams can see the drawing, but only the drawer's team can submit guesses.

**Q: What happens if a player disconnects?**  
A: They have 60 seconds to reconnect. If the drawer disconnects, the turn is skipped.

**Q: Can I change teams mid-game?**  
A: No, team changes are only allowed in the lobby before the game starts.

**Q: How are words chosen?**  
A: The drawer is shown 3 random words and must choose one within 10 seconds. If time expires, a word is auto-selected.

**Q: Is there a chat feature?**  
A: Yes, but messages containing the answer are blocked. Drawers cannot chat during their turn.

### Development Questions

**Q: How do I contribute?**  
A: See the [Contributing](#-contributing) section above!

**Q: Can I use this in my own project?**  
A: Yes, this project is under the MIT license. Feel free to use, modify, and distribute.

**Q: Where can I report bugs?**  
A: Create an issue on GitHub with details about the bug and steps to reproduce.

**Q: How can I add custom word lists?**  
A: Edit the `words.json` file in the backend or set `WORD_LIST_PATH` to your custom file.

**Q: Can this scale to thousands of concurrent players?**  
A: Yes, with Redis for state management and multiple server instances behind a load balancer using sticky sessions.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by classic drawing games like Pictionary and Skribbl.io
- Built with ❤️ by the Sketch Arena team
- Special thanks to all contributors and players

---

## 📞 Contact & Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/your-org/sketch-arena/issues)
- **Discussions:** [Join the community](https://github.com/your-org/sketch-arena/discussions)
- **Email:** support@sketcharena.com *(optional)*

---

**Happy drawing! 🎨**

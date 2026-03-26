"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = startGame;
exports.startTurn = startTurn;
exports.selectWord = selectWord;
exports.handleGuess = handleGuess;
exports.cleanupRoom = cleanupRoom;
const roomManager_1 = require("./roomManager");
const DRAWING_TIME = parseInt(process.env.DRAWING_TIME || '80000'); // 80 seconds
const WORD_SELECTION_TIME = parseInt(process.env.WORD_SELECTION_TIME || '10000'); // 10 seconds
const BASE_SCORE = 100;
const TIME_MULTIPLIER = 2;
const roomTimers = new Map();
function startGame(room) {
    if (room.gameState.status !== 'waiting') {
        return false;
    }
    const playerCount = Object.keys(room.players).length;
    if (playerCount < 2) {
        return false;
    }
    // Initialize game state
    room.gameState.status = 'playing';
    room.gameState.round = 1;
    room.gameState.startTime = Date.now();
    room.teams.A.score = 0;
    room.teams.B.score = 0;
    // Reset player states
    Object.values(room.players).forEach(player => {
        player.isDrawer = false;
        player.hasGuessed = false;
    });
    return true;
}
function startTurn(room, io) {
    const drawer = selectNextDrawer(room);
    if (!drawer) {
        endGame(room, io);
        return;
    }
    room.gameState.currentDrawerId = drawer.id;
    drawer.isDrawer = true;
    // Reset guessed status for all players
    Object.values(room.players).forEach(player => {
        player.hasGuessed = false;
    });
    // Clear drawing history
    room.drawingHistory = [];
    // Give word options
    const wordOptions = (0, roomManager_1.getRandomWords)(3);
    room.gameState.wordOptions = wordOptions;
    room.gameState.currentWord = null;
    // Send word options only to drawer
    io.to(drawer.socketId).emit('wordOptions', { options: wordOptions });
    // Broadcast turn start (without word)
    io.to(room.id).emit('turnStart', {
        drawerId: drawer.id,
        drawerName: drawer.name,
        teamId: drawer.teamId,
        round: room.gameState.round
    });
    // Auto-select word after timeout
    const autoSelectTimer = setTimeout(() => {
        if (!room.gameState.currentWord && room.gameState.status === 'playing') {
            const randomWord = wordOptions[Math.floor(Math.random() * wordOptions.length)];
            selectWord(room, randomWord, io);
            io.to(room.id).emit('wordAutoSelected', {
                message: 'Time expired. Word auto-selected.'
            });
        }
    }, WORD_SELECTION_TIME);
    roomTimers.set(room.id, { timeout: autoSelectTimer });
}
function selectWord(room, word, io) {
    // Validate word is in options
    if (!room.gameState.wordOptions.includes(word)) {
        return false;
    }
    // Clear auto-select timer
    const timers = roomTimers.get(room.id);
    if (timers?.timeout) {
        clearTimeout(timers.timeout);
    }
    room.gameState.currentWord = word;
    room.gameState.turnStartTime = Date.now();
    room.gameState.timer = DRAWING_TIME / 1000; // seconds
    // Send masked word to non-drawers
    const maskedWord = '_'.repeat(word.length);
    io.to(room.id).emit('wordSelected', {
        wordLength: word.length,
        maskedWord: maskedWord
    });
    // Start countdown timer
    startTimer(room, io);
    return true;
}
function startTimer(room, io) {
    const interval = setInterval(() => {
        if (room.gameState.status !== 'playing' || !room.gameState.currentWord) {
            clearInterval(interval);
            return;
        }
        room.gameState.timer--;
        // Broadcast timer update
        io.to(room.id).emit('timerUpdate', { remaining: room.gameState.timer });
        if (room.gameState.timer <= 0) {
            clearInterval(interval);
            handleTimeout(room, io);
        }
    }, 1000);
    const timers = roomTimers.get(room.id) || {};
    timers.interval = interval;
    roomTimers.set(room.id, timers);
}
function handleGuess(room, player, guess, io) {
    if (!room.gameState.currentWord)
        return false;
    if (player.hasGuessed)
        return false;
    // Player must be on drawer's team
    const drawer = room.players[room.gameState.currentDrawerId];
    if (!drawer || player.teamId !== drawer.teamId) {
        return false;
    }
    // Check if guess is correct
    const isCorrect = guess.toLowerCase().trim() === room.gameState.currentWord.toLowerCase();
    if (isCorrect) {
        handleCorrectGuess(room, player, io);
        return true;
    }
    // Mark as guessed (prevent spam)
    player.hasGuessed = true;
    return false;
}
function handleCorrectGuess(room, player, io) {
    // Stop timer
    const timers = roomTimers.get(room.id);
    if (timers?.interval) {
        clearInterval(timers.interval);
    }
    // Calculate score
    const remainingTime = room.gameState.timer;
    const timeBonus = remainingTime * TIME_MULTIPLIER;
    const totalPoints = BASE_SCORE + timeBonus;
    // Award points to drawer's team
    const drawer = room.players[room.gameState.currentDrawerId];
    const team = room.teams[drawer.teamId];
    team.score += totalPoints;
    // Broadcast correct guess
    io.to(room.id).emit('correctGuess', {
        playerId: player.id,
        playerName: player.name,
        word: room.gameState.currentWord,
        points: totalPoints,
        teamId: drawer.teamId,
        teamScore: team.score
    });
    // Move to next turn after delay
    setTimeout(() => {
        nextTurn(room, io);
    }, 3000);
}
function handleTimeout(room, io) {
    // Award points to opposing team
    const drawer = room.players[room.gameState.currentDrawerId];
    if (drawer) {
        const opposingTeamId = drawer.teamId === 'A' ? 'B' : 'A';
        const opposingTeam = room.teams[opposingTeamId];
        opposingTeam.score += BASE_SCORE / 2;
        io.to(room.id).emit('turnTimeout', {
            word: room.gameState.currentWord,
            opposingTeamId,
            pointsAwarded: BASE_SCORE / 2,
            teamScore: opposingTeam.score
        });
    }
    // Move to next turn
    setTimeout(() => {
        nextTurn(room, io);
    }, 3000);
}
function nextTurn(room, io) {
    // Clear current drawer
    if (room.gameState.currentDrawerId) {
        const prevDrawer = room.players[room.gameState.currentDrawerId];
        if (prevDrawer) {
            prevDrawer.isDrawer = false;
        }
    }
    // Check if round should end
    const totalPlayers = Object.keys(room.players).length;
    const playersPerTeam = Math.ceil(totalPlayers / 2);
    // Simple round logic: each player draws once per round
    if (room.gameState.round >= room.gameState.maxRounds) {
        endGame(room, io);
    }
    else {
        // Next round
        room.gameState.round++;
        startTurn(room, io);
    }
}
function selectNextDrawer(room) {
    // Round-robin selection
    const activePlayers = Object.values(room.players).filter(p => p.status === 'active');
    if (activePlayers.length === 0)
        return null;
    // Alternate between teams
    const currentDrawerId = room.gameState.currentDrawerId;
    const currentDrawer = currentDrawerId ? room.players[currentDrawerId] : null;
    if (!currentDrawer) {
        // First turn - select from Team A
        const teamAPlayers = activePlayers.filter(p => p.teamId === 'A');
        return teamAPlayers.length > 0 ? teamAPlayers[0] : activePlayers[0];
    }
    // Alternate to other team
    const nextTeam = currentDrawer.teamId === 'A' ? 'B' : 'A';
    const nextTeamPlayers = activePlayers.filter(p => p.teamId === nextTeam && !p.isDrawer);
    if (nextTeamPlayers.length > 0) {
        return nextTeamPlayers[0];
    }
    // Fallback: any player who hasn't drawn yet
    const notDrawnYet = activePlayers.filter(p => !p.isDrawer);
    return notDrawnYet.length > 0 ? notDrawnYet[0] : null;
}
function endGame(room, io) {
    room.gameState.status = 'finished';
    // Clear timers
    const timers = roomTimers.get(room.id);
    if (timers) {
        if (timers.interval)
            clearInterval(timers.interval);
        if (timers.timeout)
            clearTimeout(timers.timeout);
        roomTimers.delete(room.id);
    }
    // Determine winner
    const teamAScore = room.teams.A.score;
    const teamBScore = room.teams.B.score;
    const winnerId = teamAScore > teamBScore ? 'A' :
        teamBScore > teamAScore ? 'B' :
            null;
    io.to(room.id).emit('gameEnded', {
        winnerId,
        teamAScore,
        teamBScore,
        message: winnerId ? `Team ${winnerId} wins!` : 'It\'s a tie!'
    });
}
function cleanupRoom(room) {
    const timers = roomTimers.get(room.id);
    if (timers) {
        if (timers.interval)
            clearInterval(timers.interval);
        if (timers.timeout)
            clearTimeout(timers.timeout);
        roomTimers.delete(room.id);
    }
}

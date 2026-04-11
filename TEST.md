# Sketch Arena - Testing Guide

## Quick Start Test

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend  
```bash
cd frontend
npm run dev
```

## Manual Test Checklist

### Landing Page
- Open http://localhost:5173
- Enter name and create/join room
- Should see lobby with room code

### Game Start
- Host clicks "Start Game" button
- Both players switch to game screen
- Drawer sees word options
- Timer counts down

### Guessing
- Type guesses in chat
- Correct guess awards points
- Scores update in real-time

## What Works

✅ Room creation & joining
✅ Team balancing
✅ Game start
✅ Word selection
✅ Timer system
✅ Guessing & scoring
✅ Round progression
✅ Winner determination
✅ Real-time updates

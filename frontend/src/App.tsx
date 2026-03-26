import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

interface Player {
  id: string;
  name: string;
  teamId: 'A' | 'B';
  isDrawer: boolean;
}

interface Room {
  id: string;
  players: Player[];
  teams: {
    A: { name: string; score: number; players: string[] };
    B: { name: string; score: number; players: string[] };
  };
  gameState: {
    status: 'waiting' | 'playing' | 'finished';
    currentDrawerId: string | null;
    round: number;
    timer: number;
  };
  hostId: string;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [view, setView] = useState<'landing' | 'lobby' | 'game'>('landing');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [guessInput, setGuessInput] = useState('');
  const [error, setError] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B' | null>(null);
  const [editingTeamName, setEditingTeamName] = useState<'A' | 'B' | null>(null);
  const [teamNameInput, setTeamNameInput] = useState('');
  
  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const fillColor = '#FFFFFF'; // Background color
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'fill' | 'line' | 'rectangle' | 'circle'>('pen');
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [tempCanvas, setTempCanvas] = useState<ImageData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('error', (data: { message: string }) => {
      setError(data.message);
    });

    newSocket.on('roomJoined', (data: { room: Room; playerId: string }) => {
      console.log('Room joined:', data);
      setRoom(data.room);
      setPlayerId(data.playerId);
      setView('lobby');
      setError('');
    });

    newSocket.on('playerJoined', (data: { player: Player }) => {
      console.log('Player joined:', data);
      setRoom(prev => {
        if (!prev) return null;
        // Check if player already exists
        const playerExists = prev.players.some(p => p.id === data.player.id);
        if (playerExists) return prev;
        return { ...prev, players: [...prev.players, data.player] };
      });
      addMessage(`${data.player.name} joined the room`);
    });

    newSocket.on('roomStateUpdate', (data: { room: Room }) => {
      setRoom(data.room);
    });

    newSocket.on('gameStarted', () => {
      setView('game');
      addMessage('Game started!');
    });

    newSocket.on('wordOptions', (data: { options: string[] }) => {
      setWordOptions(data.options);
    });

    newSocket.on('turnStart', (data: { drawerName: string; round: number }) => {
      addMessage(`Round ${data.round}: ${data.drawerName} is drawing!`);
      setWordOptions([]);
    });

    newSocket.on('timerUpdate', (data: { remaining: number }) => {
      setRoom(prev => prev ? { ...prev, gameState: { ...prev.gameState, timer: data.remaining } } : null);
    });

    newSocket.on('correctGuess', (data: { playerName: string; word: string; points: number; teamId: 'A' | 'B'; teamScore: number }) => {
      addMessage(`🎉 ${data.playerName} guessed "${data.word}" correctly! +${data.points} points`);
      // Update team score
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          teams: {
            ...prev.teams,
            [data.teamId]: { ...prev.teams[data.teamId], score: data.teamScore }
          }
        };
      });
    });

    newSocket.on('turnTimeout', (data: { word: string; opposingTeamId: 'A' | 'B'; teamScore: number }) => {
      addMessage(`⏰ Time's up! The word was "${data.word}"`);
      // Update opposing team score
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          teams: {
            ...prev.teams,
            [data.opposingTeamId]: { ...prev.teams[data.opposingTeamId], score: data.teamScore }
          }
        };
      });
    });

    newSocket.on('gameEnded', (data: { winnerId: 'A' | 'B' | null; message: string }) => {
      addMessage(`🏆 ${data.message}`);
    });

    newSocket.on('chatMessage', (data: { playerName: string; message: string }) => {
      addMessage(`${data.playerName}: ${data.message}`);
    });

    newSocket.on('drawData', (data: any) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (data.tool === 'pen' || data.tool === 'eraser') {
        drawOnCanvas(data.x, data.y, data.color, data.size, data.tool);
      } else if (data.tool === 'fill') {
        floodFill(data.x, data.y, data.color);
      } else if (data.tool === 'line') {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.size;
        ctx.beginPath();
        ctx.moveTo(data.startX, data.startY);
        ctx.lineTo(data.endX, data.endY);
        ctx.stroke();
      } else if (data.tool === 'rectangle') {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.size;
        ctx.strokeRect(data.startX, data.startY, data.endX - data.startX, data.endY - data.startY);
      } else if (data.tool === 'circle') {
        const radius = Math.sqrt(Math.pow(data.endX - data.startX, 2) + Math.pow(data.endY - data.startY, 2));
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.size;
        ctx.beginPath();
        ctx.arc(data.startX, data.startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    newSocket.on('canvasCleared', () => {
      clearCanvas();
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (msg: string) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleCreateRoom = () => {
    if (!socket || !playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    socket.emit('joinRoom', { playerName: playerName.trim(), teamId: selectedTeam });
  };

  const handleJoinRoom = () => {
    if (!socket || !playerName.trim() || !roomCode.trim()) {
      setError('Please enter your name and room code');
      return;
    }
    socket.emit('joinRoom', { playerName: playerName.trim(), roomId: roomCode.toUpperCase(), teamId: selectedTeam });
  };

  const handleChangeTeam = (teamId: 'A' | 'B') => {
    if (socket && room && room.gameState.status === 'waiting') {
      socket.emit('changeTeam', { teamId });
    }
  };

  const handleStartEditTeamName = (teamId: 'A' | 'B') => {
    if (room && room.gameState.status === 'waiting') {
      setEditingTeamName(teamId);
      setTeamNameInput(room.teams[teamId].name);
    }
  };

  const handleSaveTeamName = () => {
    if (socket && editingTeamName && teamNameInput.trim()) {
      socket.emit('changeTeamName', { teamId: editingTeamName, name: teamNameInput.trim() });
      setEditingTeamName(null);
      setTeamNameInput('');
    }
  };

  const handleCancelEditTeamName = () => {
    setEditingTeamName(null);
    setTeamNameInput('');
  };

  const handleStartGame = () => {
    if (socket && room && playerId === room.hostId) {
      socket.emit('startGame');
    }
  };

  const handleSelectWord = (word: string) => {
    if (socket) {
      socket.emit('selectWord', { word });
      setWordOptions([]);
    }
  };

  const handleSendGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && guessInput.trim()) {
      socket.emit('guess', { message: guessInput.trim() });
      setGuessInput('');
    }
  };

  // Canvas drawing functions
  const drawOnCanvas = (x: number, y: number, color: string, size: number, drawTool: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;
    ctx.strokeStyle = drawTool === 'eraser' ? '#FFFFFF' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const floodFill = (startX: number, startY: number, fillColorVal: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const targetColor = getPixelColor(imageData, startX, startY);
    const fillRGB = hexToRgb(fillColorVal);
    
    if (colorsMatch(targetColor, fillRGB)) return;

    const pixelStack = [[startX, startY]];
    const visited = new Set<string>();

    while (pixelStack.length > 0) {
      const [x, y] = pixelStack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key)) continue;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      
      const currentColor = getPixelColor(imageData, x, y);
      if (!colorsMatch(currentColor, targetColor)) continue;

      visited.add(key);
      setPixelColor(imageData, x, y, fillRGB);

      pixelStack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (imageData: ImageData, x: number, y: number) => {
    const index = (y * imageData.width + x) * 4;
    return [
      imageData.data[index],
      imageData.data[index + 1],
      imageData.data[index + 2],
      imageData.data[index + 3]
    ];
  };

  const setPixelColor = (imageData: ImageData, x: number, y: number, color: number[]) => {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = color[0];
    imageData.data[index + 1] = color[1];
    imageData.data[index + 2] = color[2];
    imageData.data[index + 3] = 255;
  };

  const hexToRgb = (hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      255
    ] : [0, 0, 0, 255];
  };

  const colorsMatch = (a: number[], b: number[]) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawer) return;
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'fill') {
      floodFill(x, y, currentColor);
      socket.emit('draw', { x, y, color: currentColor, size: brushSize, tool: 'fill' });
      return;
    }

    setIsDrawing(true);
    setStartPos({ x, y });

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setTempCanvas(imageData);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawer) return;
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    
    const ctx = canvas.getContext('2d');
    if (!ctx || !startPos) return;

    if (tool === 'pen') {
      drawOnCanvas(x, y, currentColor, brushSize, 'pen');
      socket.emit('draw', { x, y, color: currentColor, size: brushSize, tool: 'pen' });
    } else if (tool === 'eraser') {
      drawOnCanvas(x, y, currentColor, brushSize, 'eraser');
      socket.emit('draw', { x, y, color: currentColor, size: brushSize, tool: 'eraser' });
    } else if (tempCanvas) {
      ctx.putImageData(tempCanvas, 0, 0);
      
      ctx.strokeStyle = currentColor;
      ctx.fillStyle = currentColor;
      ctx.lineWidth = brushSize;

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === 'rectangle') {
        ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawer || !isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    if (startPos && (tool === 'line' || tool === 'rectangle' || tool === 'circle')) {
      socket.emit('draw', {
        tool,
        startX: startPos.x,
        startY: startPos.y,
        endX: x,
        endY: y,
        color: currentColor,
        size: brushSize
      });
    }

    setIsDrawing(false);
    setStartPos(null);
    setTempCanvas(null);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
    }
  };

  const handleClearCanvas = () => {
    if (!isDrawer || !socket) return;
    clearCanvas();
    socket.emit('clearCanvas');
  };

  const currentPlayer = room?.players.find(p => p.id === playerId);
  const isDrawer = currentPlayer?.isDrawer || false;
  const isHost = playerId === room?.hostId;

  // Landing Page
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">🎨 Sketch Arena</h1>
          <p className="text-center text-gray-600 mb-6">Draw, Guess, and Win!</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            maxLength={20}
          />

          {/* Team Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Choose Your Team (Optional)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedTeam('A')}
                className={`py-3 px-4 rounded-lg border-2 font-semibold transition ${
                  selectedTeam === 'A' 
                    ? 'bg-blue-100 border-blue-600 text-blue-800' 
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                }`}
              >
                Team A {selectedTeam === 'A' && '✓'}
              </button>
              <button
                onClick={() => setSelectedTeam('B')}
                className={`py-3 px-4 rounded-lg border-2 font-semibold transition ${
                  selectedTeam === 'B' 
                    ? 'bg-pink-100 border-pink-600 text-pink-800' 
                    : 'bg-white border-gray-300 text-gray-700 hover:border-pink-400'
                }`}
              >
                Team B {selectedTeam === 'B' && '✓'}
              </button>
            </div>
            {selectedTeam && (
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-xs text-gray-500 hover:text-gray-700 mt-1"
              >
                Clear selection (auto-assign)
              </button>
            )}
          </div>

          <button
            onClick={handleCreateRoom}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg mb-3 transition"
          >
            Create New Room
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <input
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            maxLength={6}
          />

          <button
            onClick={handleJoinRoom}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  // Lobby
  if (view === 'lobby' && room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-2xl p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800">Lobby</h2>
              <div className="text-right">
                <div className="text-sm text-gray-600">Room Code</div>
                <div className="text-2xl font-bold text-purple-600">{room.id}</div>
              </div>
            </div>

            {/* Debug info */}
            <div className="bg-gray-100 p-2 rounded mb-3 text-xs text-gray-600">
              Your ID: {playerId} | Host ID: {room.hostId} | You are {isHost ? 'HOST 👑' : 'not host'}
            </div>

            <button
              onClick={handleStartGame}
              disabled={room.players.length < 2}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg mb-4 transition"
            >
              {!isHost && '(Only host can start) '}
              {room.players.length < 2 ? 'Need at least 2 players' : isHost ? 'Start Game' : 'Waiting for host to start...'}
            </button>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Team A */}
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  {editingTeamName === 'A' ? (
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={teamNameInput}
                        onChange={(e) => setTeamNameInput(e.target.value)}
                        className="flex-1 px-2 py-1 border border-blue-400 rounded text-sm"
                        maxLength={20}
                        autoFocus
                      />
                      <button onClick={handleSaveTeamName} className="text-green-600 hover:text-green-700">✓</button>
                      <button onClick={handleCancelEditTeamName} className="text-red-600 hover:text-red-700">✕</button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-lg text-blue-800">
                        {room.teams.A.name} ({room.players.filter(p => p.teamId === 'A').length})
                      </h3>
                      {room.gameState.status === 'waiting' && (
                        <button
                          onClick={() => handleStartEditTeamName('A')}
                          className="text-xs text-blue-600 hover:text-blue-700"
                          title="Edit team name"
                        >
                          ✏️
                        </button>
                      )}
                    </>
                  )}
                </div>
                {room.players.filter(p => p.teamId === 'A').map(player => (
                  <div key={player.id} className="py-1 text-gray-700 flex items-center justify-between">
                    <span>
                      {player.name} {player.id === playerId && '(You)'} {player.id === room.hostId && '👑'}
                    </span>
                    {player.id === playerId && room.gameState.status === 'waiting' && (
                      <button
                        onClick={() => handleChangeTeam('B')}
                        className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 rounded"
                      >
                        Switch →
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Team B */}
              <div className="bg-pink-50 p-4 rounded-lg border-2 border-pink-200">
                <div className="flex items-center justify-between mb-3">
                  {editingTeamName === 'B' ? (
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={teamNameInput}
                        onChange={(e) => setTeamNameInput(e.target.value)}
                        className="flex-1 px-2 py-1 border border-pink-400 rounded text-sm"
                        maxLength={20}
                        autoFocus
                      />
                      <button onClick={handleSaveTeamName} className="text-green-600 hover:text-green-700">✓</button>
                      <button onClick={handleCancelEditTeamName} className="text-red-600 hover:text-red-700">✕</button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-lg text-pink-800">
                        {room.teams.B.name} ({room.players.filter(p => p.teamId === 'B').length})
                      </h3>
                      {room.gameState.status === 'waiting' && (
                        <button
                          onClick={() => handleStartEditTeamName('B')}
                          className="text-xs text-pink-600 hover:text-pink-700"
                          title="Edit team name"
                        >
                          ✏️
                        </button>
                      )}
                    </>
                  )}
                </div>
                {room.players.filter(p => p.teamId === 'B').map(player => (
                  <div key={player.id} className="py-1 text-gray-700 flex items-center justify-between">
                    <span>
                      {player.name} {player.id === playerId && '(You)'} {player.id === room.hostId && '👑'}
                    </span>
                    {player.id === playerId && room.gameState.status === 'waiting' && (
                      <button
                        onClick={() => handleChangeTeam('A')}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        ← Switch
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  if (view === 'game' && room) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">Round {room.gameState.round}</span>
              <div className="text-2xl font-bold">{room.gameState.timer}s</div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-sm text-gray-600">{room.teams.A.name}</div>
                <div className="text-2xl font-bold text-blue-600">{room.teams.A.score}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">{room.teams.B.name}</div>
                <div className="text-2xl font-bold text-pink-600">{room.teams.B.score}</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {/* Players sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold mb-2">Players</h3>
                {room.players.map(player => (
                  <div
                    key={player.id}
                    className={`py-2 px-2 rounded mb-1 ${
                      player.isDrawer ? 'bg-yellow-100 font-bold' : ''
                    } ${player.teamId === 'A' ? 'text-blue-700' : 'text-pink-700'}`}
                  >
                    {player.isDrawer && '✏️ '}
                    {player.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas area */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                {wordOptions.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Choose a word:</h3>
                    <div className="flex gap-2">
                      {wordOptions.map(word => (
                        <button
                          key={word}
                          onClick={() => handleSelectWord(word)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drawing Tools - MS Paint Style */}
                {isDrawer && (
                  <div className="mb-4">
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm">
                      <div className="grid grid-cols-12 gap-4">
                        {/* Tools Column */}
                        <div className="col-span-2">
                          <div className="bg-gray-50 border border-gray-300 rounded p-2">
                            <div className="text-xs font-bold text-gray-600 mb-2">Tools</div>
                            <div className="grid grid-cols-2 gap-1">
                              <button
                                onClick={() => setTool('pen')}
                                title="Pencil"
                                className={`aspect-square flex items-center justify-center border-2 rounded transition ${
                                  tool === 'pen' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'
                                }`}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => setTool('fill')}
                                title="Fill with color"
                                className={`aspect-square flex items-center justify-center border-2 rounded transition ${
                                  tool === 'fill' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'
                                }`}
                              >
                                🪣
                              </button>
                              <button
                                onClick={() => setTool('eraser')}
                                title="Eraser"
                                className={`aspect-square flex items-center justify-center border-2 rounded transition ${
                                  tool === 'eraser' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'
                                }`}
                              >
                                🧹
                              </button>
                              <button
                                onClick={() => setTool('line')}
                                title="Line"
                                className={`aspect-square flex items-center justify-center border-2 rounded transition ${
                                  tool === 'line' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'
                                }`}
                              >
                                📏
                              </button>
                              <button
                                onClick={() => setTool('rectangle')}
                                title="Rectangle"
                                className={`aspect-square flex items-center justify-center border-2 rounded transition ${
                                  tool === 'rectangle' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'
                                }`}
                              >
                                ▭
                              </button>
                              <button
                                onClick={() => setTool('circle')}
                                title="Circle"
                                className={`aspect-square flex items-center justify-center border-2 rounded transition ${
                                  tool === 'circle' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'
                                }`}
                              >
                                ○
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Colors and Sizes */}
                        <div className="col-span-10">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Color Palette */}
                            <div className="bg-gray-50 border border-gray-300 rounded p-2">
                              <div className="text-xs font-bold text-gray-600 mb-2">Colors</div>
                              <div className="grid grid-cols-10 gap-1">
                                {[
                                  '#000000', '#787878', '#880000', '#ED1C24', '#FF7F27', '#FFF200', 
                                  '#22B14C', '#00A2E8', '#3F48CC', '#A349A4',
                                  '#FFFFFF', '#C3C3C3', '#B97A57', '#FFAEC9', '#FFC90E', '#EFE4B0',
                                  '#B5E61D', '#99D9EA', '#7092BE', '#C8BFE7'
                                ].map(color => (
                                  <button
                                    key={color}
                                    onClick={() => setCurrentColor(color)}
                                    className={`aspect-square border-2 transition ${
                                      currentColor === color ? 'border-black scale-110' : 'border-gray-400'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                              <div className="mt-2 flex gap-2 items-center">
                                <div className="flex items-center gap-1">
                                  <div className="w-8 h-8 border-2 border-gray-400" style={{ backgroundColor: currentColor }}></div>
                                  <div className="w-8 h-8 border-2 border-gray-400" style={{ backgroundColor: fillColor }}></div>
                                </div>
                                <input
                                  type="color"
                                  value={currentColor}
                                  onChange={(e) => setCurrentColor(e.target.value)}
                                  className="h-8 w-16 cursor-pointer"
                                  title="Custom color"
                                />
                              </div>
                            </div>

                            {/* Brush Sizes and Actions */}
                            <div className="space-y-2">
                              <div className="bg-gray-50 border border-gray-300 rounded p-2">
                                <div className="text-xs font-bold text-gray-600 mb-2">Brush Size</div>
                                <div className="flex gap-2">
                                  {[1, 3, 5, 8, 12, 16].map(size => (
                                    <button
                                      key={size}
                                      onClick={() => setBrushSize(size)}
                                      className={`w-12 h-12 flex items-center justify-center border-2 rounded transition ${
                                        brushSize === size ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'
                                      }`}
                                    >
                                      <div
                                        className="rounded-full bg-black"
                                        style={{ width: size + 'px', height: size + 'px' }}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={handleClearCanvas}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
                              >
                                🗑️ Clear Canvas
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Canvas */}
                <div className="bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`w-full ${isDrawer ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
                    style={{ backgroundColor: '#FFFFFF' }}
                  />
                </div>
              </div>

              {/* Chat/Guess area */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold mb-2">Chat</h3>
                <div className="h-48 overflow-y-auto mb-3 border-2 border-gray-300 rounded p-3 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-gray-400 text-sm">Messages will appear here...</div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className="text-sm py-1 px-2 mb-1 bg-white rounded border border-gray-200">
                        {msg}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendGuess} className="flex gap-2">
                  <input
                    type="text"
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    placeholder={isDrawer ? "You can't guess while drawing" : "Type your guess..."}
                    disabled={isDrawer}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={isDrawer}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}

export default App;

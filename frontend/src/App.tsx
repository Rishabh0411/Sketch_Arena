import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import LandingPage from './pages/LandingPage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';

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
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [guessInput, setGuessInput] = useState('');
  
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
      console.error('Socket error:', data.message);
    });

    newSocket.on('roomJoined', (data: { room: Room; playerId: string }) => {
      console.log('Room joined:', data);
      setRoom(data.room);
      setPlayerId(data.playerId);
      setView('lobby');
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

    newSocket.on('wordConfirmed', (data: { word: string }) => {
      setCurrentWord(data.word);
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

  const handleCreateRoom = (name: string) => {
    if (!socket || !name.trim()) {
      console.error('Please enter your name');
      return;
    }
    socket.emit('joinRoom', { playerName: name.trim(), teamId: null });
  };

  const handleJoinRoom = (name: string, code: string) => {
    if (!socket || !name.trim() || !code.trim()) {
      console.error('Please enter your name and room code');
      return;
    }
    socket.emit('joinRoom', { playerName: name.trim(), roomId: code.toUpperCase(), teamId: null });
  };

  const handleChangeTeam = (teamId: 'A' | 'B') => {
    if (socket && room && room.gameState.status === 'waiting') {
      socket.emit('changeTeam', { teamId });
    }
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

  // Landing Page
  if (view === 'landing') {
    return <LandingPage onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
  }

  // Lobby
  if (view === 'lobby' && room && playerId) {
    return (
      <LobbyPage
        room={room}
        playerId={playerId}
        onStartGame={handleStartGame}
        onChangeTeam={handleChangeTeam}
        onChangeTeamName={(teamId, name) => {
          if (socket) {
            socket.emit('changeTeamName', { teamId, name });
          }
        }}
      />
    );
  }

  // Game Screen
  if (view === 'game' && room && playerId) {
    return (
      <GamePage
        room={room}
        playerId={playerId}
        wordOptions={wordOptions}
        messages={messages}
        guessInput={guessInput}
        setGuessInput={setGuessInput}
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        tool={tool}
        setTool={setTool}
        isDrawing={isDrawing}
        canvasRef={canvasRef}
        messagesEndRef={messagesEndRef}
        onSelectWord={handleSelectWord}
        onSendGuess={handleSendGuess}
        onClearCanvas={handleClearCanvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    );
  }

  return <div className="min-h-screen bg-background text-on-background flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
      <p className="font-headline text-secondary">Loading...</p>
    </div>
  </div>;
}

export default App;

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

type TeamId = 'A' | 'B';
type GameStatus = 'waiting' | 'playing' | 'finished';

interface Player {
  id: string;
  name: string;
  teamId: TeamId;
  isDrawer: boolean;
}

interface TeamInfo {
  name: string;
  score: number;
  players: string[];
}

interface Room {
  id: string;
  players: Player[];
  teams: {
    A: TeamInfo;
    B: TeamInfo;
  };
  gameState: {
    status: GameStatus;
    currentDrawerId: string | null;
    round: number;
    timer: number;
  };
  hostId: string;
}

type IncomingDrawData = {
  tool: 'pen' | 'eraser' | 'fill' | 'line' | 'rectangle' | 'circle';
  x: number;
  y: number;
  color: string;
  size: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
};

const avatarPool = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDwXR5a1uTOGgqCV-6aWqnckvoYtizkEDJQUfulTSQdV_vQ1i_f8TnLlMLEkitxHdsaN6a39-3ZIvGoZuNq06yEpUoQo-NMYw-fWs_Bq8AJKp_Un4wMd7qm_-YQBFPZMdAgZHKWJlRm8saHdJ7FplnQMWwPSH6JNrS2YQtdzIaLLF5n_LSeWJ17zvEdusH43bTxkjg58xZyXpF50ochctDJSDxcwUrox9dc7lvMbFNrMokRtF2fQ557_jJe35E1K4znUetMBxlTPu8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCYq7xGCRhucx3eYYOp0-auJOAJwNwkDa-sagmBuIbToeUTuloOR5jkOCozeBfMojUM1LOm7n5IonCjnccsw8xNIF9lpDkC9SODLMJtSp7ZXEYmVOFlzjLeX8pY9lsc3TjDRKfH15JGR6IcJ7VX6SJDf83_xpO1s2Qz-RF1mcAkNMo3SzhttRZTpXRBbLbJsUBPaRU9wFBUrar3DAEcflvqxS7GUyy4QDngIUebVrXDQujp2QBOv9V76uKfiui1l1mepjHbL8KqUYY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDsYDyihY8x3rg20vOfYOU9424c3ctcFn6OUGLNMoXWO_Lv69t7lTTyP_zyOOHFR7qwPI4sDME0f9yObIGe4aMlSOEENaKdJVACK3TgiyS6xR1lB6H8Nu2PUAZT_5Fey-AopYG5KCEZBRxzY7wh-dWZJUQXFajdbCLw7C73hDnaWaXyv0bWSJ9JAdEj4IiyYpHdoBUMwCVxzk0-DC23SyqzwNxvYPt0_tZRGqRwOu6ZZ8j2Dko4gHJkpsuP8YDqx7ouZzE2BVhixIU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA0RkrvtFhA7H1KhhqtLR0nNPNufH2IHLYjn_DS1xJfulNX6pn4P_4a3oZ-IOiQwcrycFU1q-d3ZTIrcoOcrswXHoaCJumJfXqqA2NmkGTcYWPHcpjqmu4S6PD4XN391egW34NV-yPPAFsnP_W66ZHmrnFWHe02hZMba5lUNreVVSNx7lS2P9jketpZrzlwrMK4QBb38Urhjp5EgeM3-nNIh65n_KOTV92oabnwqa7v2SkkegCPx-x_ze2kRTL7_DW-mdJsccy1sEs',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC6GDX5jtLghzgc-9ytvRL3dywy2eL4yhcUkb3cvC9_U4BEedviw5W8lE4zLyae7JuG1H953o8C5Gh0LXhYNKJJVe4RsrR989Vk-0_4dGyS0a_u0HZLuwTxyhc5LanOQIEiAbTEnIOYGrxvEmTVNlB0Ftz6Xn-4W4ceEbO44TxzOPOrJEmiXgs451c8IOGN1KDOcnUiWVUee0o79mAzj3Kmo7StqC-J5noyMsKuNknzQr2dECJ07bSoKC9-KIcYi3C4nCwtu49G-x0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBdUsXC8z2Sd-c-A-59UFdLxfvAM-Ep3cSKuVdm_D8r0SNCkyTfbVupi3eK664XohsvW09o93TJBdoWnNNc3LTcDAWe-8NW1OrjkBTGp63qXC-sZxd2mHYLy5pd3imE8rgbF_Flhm-WKsTFoLEL1eBhwxwMuiYOEdSjAZ9Ejg-4vAbcho0CRaYrxZVWIs3nlXxoLbwkExoSYkB6ly_BdyNqJdRQyD8vF3zE2T8iFlu6Dh4Fdbirn0zBrnqFCm_zp14oW2EcZInpxGc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA5zGTNXVbsu0vqR4RPESLRfmquJ-xSduaqWvUldGGWceU1GrW00D3FDlI5XHO0ZYl9hmzsoB2Dc-0W8VCrRpNXNRWWGR21nxZ5PjzQQ2tMCh4D_ryZtHxcFZJfdg1pVuWx1yORKvaA8ZTb6nhZ46zO_whzXUmv95EZrMU_usBHCxS_mSjqpMOUDVTbIseZkcSHHPYnDan15K-Yfc8M_mY4ql77w4vSMiC3nNe72r_GpEhGtH8s4BwUN5559GPVHX8WmA3BshQJvFs',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAtuBGqj5hLvEZ-NaXjyGx4lY1091Sa_30iKT06kuxPwz1eGzAQAJv-XXFq2Er1KHSatH53PeMRbTVklLJw7fQ8ue6eUPw00HfX_2zpcbqaMEn3isscrvnCJ3TO4r3u-wBkradTu7WJFCVFV8TL3qtl4sIChPI_TDSEiZOWZYzOXeDpP084uqG89hyxEaWXzmvw5yEmLJXwIAr3lpGYSMcKpV4wK-VQTXj5hyVDyfix48EXFkmnNygnUjCG1kMLMYB86wuLNchGNdk',
];

const colorSwatches = [
  '#000000',
  '#002f7e',
  '#6eed53',
  '#0068d4',
  '#f4d041',
  '#93000a',
  '#ffffff',
  '#acc7ff',
];

const brushSizes = [4, 8, 12, 16];

const formatTimer = (seconds: number) => {
  const safe = Math.max(0, seconds || 0);
  const mins = Math.floor(safe / 60);
  const secs = (safe % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const getPixelColor = (imageData: ImageData, x: number, y: number) => {
  const index = (y * imageData.width + x) * 4;
  return [
    imageData.data[index],
    imageData.data[index + 1],
    imageData.data[index + 2],
    imageData.data[index + 3],
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
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        255,
      ]
    : [0, 0, 0, 255];
};

const colorsMatch = (a: number[], b: number[]) =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

function App() {
  const socket = useMemo<Socket>(() => io(SOCKET_URL), []);
  const [view, setView] = useState<'landing' | 'lobby' | 'game'>('landing');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [guessInput, setGuessInput] = useState('');
  const [error, setError] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamId | null>(null);
  const [lobbyView, setLobbyView] = useState<'teams' | 'individual'>('teams');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#6eed53');
  const [brushSize, setBrushSize] = useState(8);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'fill' | 'line' | 'rectangle' | 'circle'>('pen');
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [tempCanvas, setTempCanvas] = useState<ImageData | null>(null);
  const fillColor = '#ffffff';

  const addMessage = useCallback((msg: string) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [fillColor]);

  const drawOnCanvas = useCallback((x: number, y: number, color: string, size: number, drawTool: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;
    ctx.strokeStyle = drawTool === 'eraser' ? '#ffffff' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const floodFill = useCallback((startX: number, startY: number, fillColorVal: string) => {
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

      const current = getPixelColor(imageData, x, y);
      if (!colorsMatch(current, targetColor)) continue;

      visited.add(key);
      setPixelColor(imageData, x, y, fillRGB);

      pixelStack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  useEffect(() => {
    clearCanvas();
  }, [clearCanvas]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    socket.on('connect', () => {
      setError('');
    });

    socket.on('error', (data: { message: string }) => {
      setError(data.message);
    });

    socket.on('roomJoined', (data: { room: Room; playerId: string }) => {
      setRoom(data.room);
      setPlayerId(data.playerId);
      setView('lobby');
      setError('');
    });

    socket.on('playerJoined', (data: { player: Player }) => {
      setRoom(prev => {
        if (!prev) return null;
        const exists = prev.players.some(p => p.id === data.player.id);
        if (exists) return prev;
        return { ...prev, players: [...prev.players, data.player] };
      });
      addMessage(`${data.player.name} joined the room`);
    });

    socket.on('roomStateUpdate', (data: { room: Room }) => {
      setRoom(data.room);
    });

    socket.on('gameStarted', () => {
      setView('game');
      addMessage('Game started!');
    });

    socket.on('wordOptions', (data: { options: string[] }) => {
      setWordOptions(data.options);
    });

    socket.on('turnStart', (data: { drawerName: string; round: number }) => {
      addMessage(`Round ${data.round}: ${data.drawerName} is drawing!`);
      setWordOptions([]);
    });

    socket.on('timerUpdate', (data: { remaining: number }) => {
      setRoom(prev => (prev ? { ...prev, gameState: { ...prev.gameState, timer: data.remaining } } : null));
    });

    socket.on('correctGuess', (data: { playerName: string; word: string; points: number; teamId: TeamId; teamScore: number }) => {
      addMessage(`🎉 ${data.playerName} guessed "${data.word}" correctly! +${data.points} points`);
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          teams: {
            ...prev.teams,
            [data.teamId]: { ...prev.teams[data.teamId], score: data.teamScore },
          },
        };
      });
    });

    socket.on('turnTimeout', (data: { word: string; opposingTeamId: TeamId; teamScore: number }) => {
      addMessage(`⏰ Time's up! The word was "${data.word}"`);
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          teams: {
            ...prev.teams,
            [data.opposingTeamId]: { ...prev.teams[data.opposingTeamId], score: data.teamScore },
          },
        };
      });
    });

    socket.on('gameEnded', (data: { message: string }) => {
      addMessage(`🏆 ${data.message}`);
    });

    socket.on('chatMessage', (data: { playerName: string; message: string }) => {
      addMessage(`${data.playerName}: ${data.message}`);
    });

    socket.on('drawData', (data: IncomingDrawData) => {
      if (data.tool === 'pen' || data.tool === 'eraser') {
        drawOnCanvas(data.x, data.y, data.color, data.size, data.tool);
      } else if (data.tool === 'fill') {
        floodFill(data.x, data.y, data.color);
      } else {
        if (data.startX === undefined || data.startY === undefined || data.endX === undefined || data.endY === undefined) {
          return;
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.size;
        if (data.tool === 'line') {
          ctx.beginPath();
          ctx.moveTo(data.startX, data.startY);
          ctx.lineTo(data.endX, data.endY);
          ctx.stroke();
        } else if (data.tool === 'rectangle') {
          ctx.strokeRect(data.startX, data.startY, data.endX - data.startX, data.endY - data.startY);
        } else if (data.tool === 'circle') {
          const radius = Math.sqrt(Math.pow(data.endX - data.startX, 2) + Math.pow(data.endY - data.startY, 2));
          ctx.beginPath();
          ctx.arc(data.startX, data.startY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    });

    socket.on('canvasCleared', () => {
      clearCanvas();
    });

    return () => {
      socket.close();
    };
  }, [addMessage, clearCanvas, drawOnCanvas, floodFill, socket]);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    socket.emit('createRoom', { playerName: playerName.trim(), teamId: selectedTeam });
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) {
      setError('Please enter your name and room code');
      return;
    }
    socket.emit('joinRoom', { playerName: playerName.trim(), roomId: roomCode.toUpperCase(), teamId: selectedTeam });
  };

  const handleChangeTeam = (teamId: TeamId) => {
    if (room && room.gameState.status === 'waiting') {
      socket.emit('changeTeam', { teamId });
    }
  };

  const handleStartGame = () => {
    if (room && playerId === room.hostId) {
      socket.emit('startGame');
    }
  };

  const handleSelectWord = (word: string) => {
    socket.emit('selectWord', { word });
    setWordOptions([]);
  };

  const handleSendGuess = (e: FormEvent) => {
    e.preventDefault();
    if (guessInput.trim()) {
      socket.emit('guess', { message: guessInput.trim() });
      setGuessInput('');
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

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

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

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

  const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawer || !isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

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
        size: brushSize,
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
    if (!isDrawer) return;
    clearCanvas();
    socket.emit('clearCanvas');
  };

  const currentPlayer = room?.players.find(p => p.id === playerId);
  const isDrawer = currentPlayer?.isDrawer || false;
  const isHost = playerId === room?.hostId;

  const playersByTeam = useMemo(() => {
    if (!room) {
      return { A: [], B: [] };
    }
    return {
      A: room.players.filter(p => p.teamId === 'A'),
      B: room.players.filter(p => p.teamId === 'B'),
    };
  }, [room]);

  const drawerName = useMemo(() => {
    if (!room) return 'Waiting...';
    const drawer = room.players.find(p => p.id === room.gameState.currentDrawerId);
    return drawer?.name || 'Waiting...';
  }, [room]);

  if (view === 'landing') {
    return (
      <div className="relative min-h-screen bg-background text-on-background overflow-hidden">
        <div className="absolute top-10 -left-24 w-[520px] h-[520px] bg-primary/10 blur-[140px] rounded-full -z-10" />
        <div className="absolute bottom-0 -right-32 w-[560px] h-[560px] bg-secondary-container/10 blur-[180px] rounded-full -z-10" />
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#001038] flex justify-between items-center w-full px-6 py-4 shadow-lg">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-black text-primary tracking-tighter italic font-headline">Skribbl Atelier</span>
            <nav className="hidden md:flex gap-6 items-center">
              <a className="text-secondary font-medium font-headline hover:text-primary transition-colors duration-300" href="#">How to Play</a>
              <a className="text-secondary font-medium font-headline hover:text-primary transition-colors duration-300" href="#">Gallery</a>
              <a className="text-secondary font-medium font-headline hover:text-primary transition-colors duration-300" href="#">Shop</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleJoinRoom}
              className="px-4 py-2 rounded-xl bg-secondary-container text-on-secondary-container font-headline text-sm hover:opacity-90 transition-all active:scale-95"
            >
              Join Game
            </button>
            <button
              onClick={handleCreateRoom}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-headline text-sm hover:shadow-[0_0_24px_rgba(110,237,83,0.35)] transition-all active:scale-95"
            >
              Create Room
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 pt-28 pb-16 px-6 lg:px-0">
          <div className="space-y-6">
            <p className="text-xs font-label uppercase tracking-[0.3em] text-secondary">Multiplayer drawing arena</p>
            <h1 className="text-5xl font-black font-headline italic leading-tight">
              Draw bold. Guess fast. <span className="text-primary">Rule the Atelier.</span>
            </h1>
            <p className="text-lg text-secondary max-w-xl">
              Create or join a room, team up with friends, and bring the vibrant Skribbl Atelier look to life with every stroke.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-2xl border border-white/5">
                <div className="text-xs font-label text-secondary/70 uppercase tracking-[0.2em]">Players online</div>
                <div className="text-3xl font-black text-primary">120</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/5">
                <div className="text-xs font-label text-secondary/70 uppercase tracking-[0.2em]">Public rooms</div>
                <div className="text-3xl font-black text-tertiary">48</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/5">
                <div className="text-xs font-label text-secondary/70 uppercase tracking-[0.2em]">Avg. round</div>
                <div className="text-3xl font-black text-secondary">80s</div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-white/10 shadow-2xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-headline">Enter the Studio</h2>
              <span className="tag-pill bg-primary/10 text-primary border border-primary/30">Live</span>
            </div>

            {error && (
              <div className="bg-error/10 border border-error/40 text-on-error px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-label text-secondary/80">Your artist name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                className="w-full bg-surface-container-low border border-outline/20 rounded-xl px-4 py-3 text-on-background placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Felix, Luna_Art..."
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-label text-secondary/80">Choose your team (optional)</p>
              <div className="grid grid-cols-2 gap-3">
                {(['A', 'B'] as TeamId[]).map(team => (
                  <button
                    key={team}
                    onClick={() => setSelectedTeam(team)}
                    className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                      selectedTeam === team
                        ? team === 'A'
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-tertiary/10 border-tertiary text-tertiary'
                        : 'bg-surface-container-low border-outline/20 text-on-background hover:border-primary/40'
                    }`}
                  >
                    Team {team} {selectedTeam === team ? '✓' : ''}
                  </button>
                ))}
              </div>
              {selectedTeam && (
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-xs text-secondary hover:text-primary transition-colors"
                >
                  Clear selection (auto-assign)
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-label text-secondary/80">Have a room code?</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full bg-surface-container-low border border-outline/20 rounded-xl px-4 py-3 text-on-background placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase"
                placeholder="SKRT24"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleJoinRoom}
                className="w-full bg-secondary-container text-on-secondary-container font-bold py-3 px-4 rounded-xl transition hover:opacity-90 active:scale-95"
              >
                Join Room
              </button>
              <button
                onClick={handleCreateRoom}
                className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-xl transition hover:shadow-[0_0_20px_rgba(110,237,83,0.35)] active:scale-95"
              >
                Create New
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'lobby' && room) {
    return (
      <div className="min-h-screen bg-background text-on-background overflow-hidden">
        <header className="fixed top-0 left-0 right-0 z-40 bg-[#001038] flex justify-between items-center w-full px-6 py-4 shadow-lg">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-black text-primary tracking-tighter italic font-headline">Skribbl Atelier</span>
            <nav className="hidden md:flex gap-6 items-center">
              <a className="text-primary border-b-2 border-primary pb-1 font-headline hover:text-primary transition-colors duration-300" href="#">How to Play</a>
              <a className="text-secondary font-medium font-headline hover:text-primary transition-colors duration-300" href="#">Gallery</a>
              <a className="text-secondary font-medium font-headline hover:text-primary transition-colors duration-300" href="#">Shop</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-xl bg-secondary-container text-on-secondary-container font-headline text-sm hover:opacity-90 transition-all active:scale-95">
              Share Invite
            </button>
            <button
              onClick={handleStartGame}
              disabled={room.players.length < 2 || !isHost}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-headline text-sm hover:shadow-[0_0_24px_rgba(110,237,83,0.35)] transition-all active:scale-95 disabled:opacity-60 disabled:shadow-none"
            >
              {isHost ? 'Start Game' : 'Waiting for host'}
            </button>
          </div>
        </header>

        <div className="flex">
          <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-4 z-30 bg-[#001038]/70 backdrop-blur-xl w-64 pt-24 shadow-[0px_20px_40px_rgba(0,0,0,0.15)]">
            <div className="mb-8 px-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline/20">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>meeting_room</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-secondary font-headline">Room {room.id}</p>
                  <p className="text-xs text-secondary/60 font-label">Round {room.gameState.round || 1}</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 text-primary font-bold border-r-4 border-primary bg-white/5 transition-all translate-x-1 rounded-lg">
                <span className="material-symbols-outlined">home</span>
                <span className="font-label text-sm">Lobby</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-secondary opacity-70 hover:bg-white/10 hover:text-white transition-all rounded-lg">
                <span className="material-symbols-outlined">group</span>
                <span className="font-label text-sm">Players</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-secondary opacity-70 hover:bg-white/10 hover:text-white transition-all rounded-lg">
                <span className="material-symbols-outlined">chat</span>
                <span className="font-label text-sm">Chat</span>
              </div>
            </nav>
            <div className="mt-auto space-y-2 border-t border-outline/10 pt-6">
              <button className="w-full py-3 px-4 rounded-xl bg-primary/10 text-primary font-headline text-sm mb-4 hover:bg-primary/20 transition-all">Invite Friends</button>
              <button className="flex items-center gap-3 px-4 py-2 text-secondary opacity-70 hover:text-white transition-all">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-label text-sm">Settings</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 text-error opacity-70 hover:opacity-100 transition-all">
                <span className="material-symbols-outlined">logout</span>
                <span className="font-label text-sm">Leave</span>
              </button>
            </div>
          </aside>

          <main className="ml-64 pt-24 min-h-screen w-full">
            <div className="max-w-7xl mx-auto p-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                  <h2 className="text-4xl font-black font-headline text-on-background tracking-tight mb-2 italic">
                    Lobby: {lobbyView === 'teams' ? 'Teams View' : 'Individual View'}
                  </h2>
                  <p className="text-secondary font-label text-sm uppercase tracking-widest">
                    Waiting for players to join the scribble fest...
                  </p>
                </div>
                <div className="bg-surface-container-low p-1.5 rounded-full flex items-center shadow-inner">
                  <button
                    onClick={() => setLobbyView('individual')}
                    className={`px-6 py-2 rounded-full text-sm font-bold font-headline transition-all ${
                      lobbyView === 'individual' ? 'bg-primary text-on-primary shadow-lg scale-105' : 'text-secondary opacity-70 hover:opacity-100'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => setLobbyView('teams')}
                    className={`px-8 py-2 rounded-full text-sm font-bold font-headline transition-all ${
                      lobbyView === 'teams' ? 'bg-primary text-on-primary shadow-lg scale-105' : 'text-secondary opacity-70 hover:opacity-100'
                    }`}
                  >
                    Teams
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-8">
                {lobbyView === 'teams' ? (
                  <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(Object.keys(playersByTeam) as TeamId[]).map(teamId => {
                      const teamPlayers = playersByTeam[teamId];
                      const isTeamA = teamId === 'A';
                      return (
                        <div key={teamId} className="flex flex-col gap-4">
                          <div className="flex items-center justify-between px-2">
                            <h3 className={`font-headline font-extrabold text-xl ${isTeamA ? 'text-primary' : 'text-tertiary'} italic flex items-center gap-2`}>
                              <span className="material-symbols-outlined">{isTeamA ? 'palette' : 'ink_highlighter'}</span>
                              {room.teams[teamId].name}
                            </h3>
                            <span className={`font-label text-xs px-3 py-1 rounded-full border ${isTeamA ? 'border-primary/20 text-primary bg-primary/10' : 'border-tertiary/20 text-tertiary bg-tertiary/10'}`}>
                              {teamPlayers.length} Players
                            </span>
                          </div>
                          <div className="flex flex-col gap-3">
                            {teamPlayers.map((player, idx) => (
                              <div
                                key={player.id}
                                className="glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all group border border-transparent hover:border-primary/20"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${isTeamA ? 'border-primary' : 'border-tertiary'} ${isTeamA ? 'neon-glow' : ''}`}>
                                      <img className="w-full h-full object-cover" src={avatarPool[(idx + player.name.length) % avatarPool.length]} alt={player.name} />
                                    </div>
                                    {player.id === room.hostId && (
                                      <div className={`absolute -bottom-1 -right-1 ${isTeamA ? 'bg-primary text-on-primary' : 'bg-tertiary text-on-tertiary'} text-[10px] font-black px-1.5 rounded-md`}>
                                        Host
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-headline font-bold text-on-background">{player.name}</p>
                                    <p className="font-label text-xs text-secondary/60">
                                      {player.id === playerId ? 'You' : 'Player'} • {player.isDrawer ? 'Drawing' : 'Ready'}
                                    </p>
                                  </div>
                                </div>
                                {player.id === playerId && room.gameState.status === 'waiting' && (
                                  <button
                                    onClick={() => handleChangeTeam(isTeamA ? 'B' : 'A')}
                                    className="text-xs font-bold px-3 py-1 rounded-lg border border-outline/20 text-secondary hover:border-primary/40 transition"
                                  >
                                    Switch
                                  </button>
                                )}
                              </div>
                            ))}
                            <div className="border-2 border-dashed border-outline/30 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer group">
                              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">person_add</span>
                              <span className="text-xs font-label text-outline group-hover:text-primary transition-colors">
                                Join Team {teamId}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="col-span-12 lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {room.players.map((player, idx) => (
                        <div
                          key={player.id}
                          className={`surface-container-low rounded-xl p-4 flex items-center justify-between group hover:surface-container transition-all border-l-4 ${
                            player.isDrawer ? 'border-primary' : 'border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-outline/20 p-1">
                                <img className="w-full h-full rounded-full bg-surface-container-high" src={avatarPool[(idx + player.name.length) % avatarPool.length]} alt={player.name} />
                              </div>
                              {player.isDrawer && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                                  <span className="material-symbols-outlined text-[12px] text-on-primary font-bold">brush</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-on-background font-headline">{player.name} {player.id === room.hostId ? '👑' : ''}</p>
                              <p className={`text-xs font-label ${player.isDrawer ? 'text-primary uppercase' : 'text-secondary/70'}`}>
                                {player.isDrawer ? 'Drawing' : player.teamId === 'A' ? 'Team A' : 'Team B'}
                              </p>
                            </div>
                          </div>
                          {player.id === playerId && room.gameState.status === 'waiting' && (
                            <button
                              onClick={() => handleChangeTeam(player.teamId === 'A' ? 'B' : 'A')}
                              className="text-xs bg-primary text-on-primary px-3 py-1 rounded-lg shadow hover:shadow-[0_0_14px_rgba(110,237,83,0.35)] transition"
                            >
                              Switch
                            </button>
                          )}
                        </div>
                      ))}
                      <div className="border-2 border-dashed border-outline/20 rounded-xl p-4 flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer">
                        <div className="flex items-center gap-3 text-secondary/40">
                          <span className="material-symbols-outlined">person_add</span>
                          <span className="font-label text-sm uppercase">Invite Player</span>
                        </div>
                      </div>
                    </div>

                    <div className="surface-container-highest/40 rounded-2xl p-6 glass-panel border border-white/5">
                      <h3 className="text-xs font-label uppercase tracking-[0.2em] text-secondary mb-6">Game Settings</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-[10px] font-label text-secondary/60 mb-1 uppercase">Rounds</p>
                          <p className="font-headline font-bold text-lg">3 Rounds</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-label text-secondary/60 mb-1 uppercase">Draw Time</p>
                          <p className="font-headline font-bold text-lg">80 Seconds</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-label text-secondary/60 mb-1 uppercase">Language</p>
                          <p className="font-headline font-bold text-lg">English</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-label text-secondary/60 mb-1 uppercase">Custom Words</p>
                          <p className="font-headline font-bold text-lg text-primary">Enabled</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <aside className="col-span-12 lg:col-span-4 flex flex-col h-[700px]">
                  <div className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden border border-outline/10">
                    <div className="p-6 bg-surface-container-low flex items-center justify-between">
                      <h3 className="font-headline font-bold text-lg text-secondary flex items-center gap-2">
                        <span className="material-symbols-outlined">forum</span>
                        Lobby Chat
                      </h3>
                      <span className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 custom-scrollbar">
                      {messages.length === 0 ? (
                        <p className="text-sm text-secondary/60">Say hi and plan your strategy...</p>
                      ) : (
                        messages.map((msg, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-label text-primary uppercase font-bold">System</span>
                              <span className="text-[10px] text-outline font-label">now</span>
                            </div>
                            <p className="text-sm bg-surface-container-high/40 p-3 rounded-xl rounded-tl-none text-on-background">{msg}</p>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendGuess} className="p-4 bg-surface-container-low border-t border-outline/10">
                      <div className="relative flex items-center">
                        <input
                          className="w-full bg-surface-container-lowest border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/50 text-on-background font-body"
                          placeholder="Type a message..."
                          type="text"
                          value={guessInput}
                          onChange={(e) => setGuessInput(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="absolute right-2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined">send</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </aside>
              </div>

              <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 pb-20">
                <button className="group flex items-center gap-3 px-8 py-5 rounded-full bg-surface-container-highest text-secondary font-headline font-bold hover:bg-surface-bright transition-all active:scale-95 border border-white/5">
                  <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">share</span>
                  Share Invite
                </button>
                <button
                  onClick={handleStartGame}
                  disabled={!isHost}
                  className="group flex items-center gap-4 px-12 py-5 rounded-full bg-primary text-on-primary font-headline font-black text-xl hover:shadow-[0_0_30px_rgba(110,237,83,0.4)] transition-all active:scale-95 italic disabled:opacity-60"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  Start Game
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (view === 'game' && room) {
    return (
      <div className="min-h-screen bg-background text-on-background overflow-hidden">
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#001038] flex justify-between items-center w-full px-6 py-4 shadow-lg">
          <div className="flex items-center gap-8">
            <h1 className="font-headline text-2xl font-black text-primary tracking-tighter italic">Skribbl Atelier</h1>
            <nav className="hidden md:flex gap-6">
              <a className="font-headline font-bold tracking-tight text-secondary font-medium hover:text-primary transition-colors duration-300" href="#">How to Play</a>
              <a className="font-headline font-bold tracking-tight text-secondary font-medium hover:text-primary transition-colors duration-300" href="#">Gallery</a>
              <a className="font-headline font-bold tracking-tight text-secondary font-medium hover:text-primary transition-colors duration-300" href="#">Shop</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 font-headline font-bold text-on-primary bg-primary rounded-xl scale-95 duration-150 active:opacity-80">Create Room</button>
            <button className="px-4 py-2 font-headline font-bold text-on-secondary-container bg-secondary-container rounded-xl scale-95 duration-150 active:opacity-80">Join Game</button>
            <div className="flex gap-2 ml-2">
              <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">settings</span>
              <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">help</span>
            </div>
          </div>
        </header>

        <div className="flex h-screen pt-20">
          <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-4 z-40 bg-[#001038]/60 backdrop-blur-xl w-64 pt-24 shadow-[0px_20px_40px_rgba(0,0,0,0.15)]">
            <div className="mb-8 px-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline/20 flex items-center justify-center overflow-hidden">
                  <img alt="Room Icon" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAinLyp3eFGFMsr0mU8ta3HzU4TCV0sR3N3pu81RH-Ln6EtQPlZK8t0wTgb_CcKDlEuG8Fyd8zZXLQ0HrtJLszB00Mj2f-eDdwSvNt6EzGetTBUDufUazwnd4PNDl2qM5itdoeEt4vftxbphDtcWG3tQhHo-8gWEcUuhI8X9xvmDYuWa4BbA-XhXhZij6S7-lqmMdap9PYRlNNn87i5xIU6dhCxbUcVnMFDlL-vKjxnzd8mKZyk7sSETrbLipoQaV5Z4i8nXLYJuDY" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-secondary font-headline">Room {room.id}</h2>
                  <p className="text-xs text-secondary/70 font-label">Round {room.gameState.round}</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary opacity-70 hover:bg-white/10 hover:text-white transition-all translate-x-1 duration-200">
                <span className="material-symbols-outlined">home</span>
                <span className="font-label">Lobby</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-r-4 border-primary bg-white/5 translate-x-1 duration-200">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>brush</span>
                <span className="font-label">Drawing</span>
              </div>
            </nav>
            <div className="mt-auto flex flex-col gap-2 border-t border-outline/10 pt-6">
              <button className="w-full py-3 px-4 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-all mb-4 font-headline text-sm">Invite Friends</button>
              <button className="flex items-center gap-3 px-4 py-2 text-secondary opacity-70 hover:text-white transition-all">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-label text-sm">Settings</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2 text-error/80 hover:text-error transition-all">
                <span className="material-symbols-outlined">logout</span>
                <span className="font-label text-sm">Leave</span>
              </button>
            </div>
          </aside>

          <main className="ml-64 mr-80 flex-1 flex flex-col p-6 gap-6 overflow-y-auto custom-scrollbar">
            <div className="bg-surface-container-low rounded-full px-8 py-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-4">
                <div className="bg-tertiary-container text-on-tertiary-container font-label font-bold px-3 py-1 rounded-lg text-sm">
                  {formatTimer(room.gameState.timer)}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  {Array.from({ length: 7 }).map((_, idx) => (
                    <span key={idx} className="w-6 h-1 bg-on-surface/40 self-end mb-1" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-label text-xs text-secondary/60 uppercase tracking-widest">Drawing:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-on-surface">{drawerName}</span>
                  <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>brush</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex-1 bg-white rounded-3xl canvas-shadow overflow-hidden group border border-outline/5">
              {wordOptions.length > 0 && (
                <div className="absolute top-4 left-4 z-20 flex gap-3">
                  {wordOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => handleSelectWord(option)}
                      className="px-4 py-2 rounded-xl bg-primary text-on-primary font-headline font-bold shadow hover:shadow-[0_0_16px_rgba(110,237,83,0.35)] transition"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[200px] text-on-background/30">edit_square</span>
              </div>
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={`w-full h-full ${isDrawer ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-container-highest/60 backdrop-blur-xl p-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/5">
                <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                  {brushSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`w-10 h-10 rounded-full border-2 transition ${brushSize === size ? 'border-primary ring-2 ring-primary/40' : 'border-outline/30 hover:border-primary/40'}`}
                    >
                      <span
                        className="block rounded-full bg-on-surface"
                        style={{ width: size, height: size, margin: '0 auto' }}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {colorSwatches.map(color => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition ${currentColor === color ? 'ring-4 ring-primary/40 border-primary' : 'border-outline/30 hover:border-primary/40'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-primary via-tertiary to-error cursor-pointer overflow-hidden border border-outline/30">
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      value={currentColor}
                      onChange={(e) => setCurrentColor(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                  <button className={`p-2 rounded-full transition ${tool === 'pen' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-secondary'}`} onClick={() => setTool('pen')}>
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button className={`p-2 rounded-full transition ${tool === 'eraser' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-secondary'}`} onClick={() => setTool('eraser')}>
                    <span className="material-symbols-outlined">ink_eraser</span>
                  </button>
                  <button className={`p-2 rounded-full transition ${tool === 'line' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-secondary'}`} onClick={() => setTool('line')}>
                    <span className="material-symbols-outlined">show_chart</span>
                  </button>
                  <button className={`p-2 rounded-full transition ${tool === 'rectangle' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-secondary'}`} onClick={() => setTool('rectangle')}>
                    <span className="material-symbols-outlined">crop_landscape</span>
                  </button>
                  <button className={`p-2 rounded-full transition ${tool === 'circle' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-secondary'}`} onClick={() => setTool('circle')}>
                    <span className="material-symbols-outlined">radio_button_unchecked</span>
                  </button>
                  <button className={`p-2 rounded-full transition ${tool === 'fill' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-secondary'}`} onClick={() => setTool('fill')}>
                    <span className="material-symbols-outlined">format_color_fill</span>
                  </button>
                  <button onClick={handleClearCanvas} className="p-2 hover:bg-white/10 rounded-full transition-colors text-error">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 h-32">
              <div className="bg-surface-container-high rounded-2xl p-4 flex flex-col justify-between border-l-4 border-primary">
                <span className="font-label text-[10px] uppercase tracking-tighter text-secondary/50">Next Turn</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
                    <img alt="Next Player" className="w-full h-full object-cover" src={avatarPool[2]} />
                  </div>
                  <span className="font-headline font-bold text-on-surface">Up Next</span>
                </div>
              </div>
              <div className="bg-surface-container-high rounded-2xl p-4 flex flex-col justify-between">
                <span className="font-label text-[10px] uppercase tracking-tighter text-secondary/50">Leaderboard Position</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-tertiary italic">
                    {room.teams.A.score > room.teams.B.score ? '#1' : '#2'}
                  </span>
                  <span className="text-xs text-secondary/60">out of 2</span>
                </div>
              </div>
              <div className="bg-surface-container-high rounded-2xl p-4 flex flex-col justify-between group cursor-pointer hover:bg-surface-container-highest transition-colors">
                <span className="font-label text-[10px] uppercase tracking-tighter text-secondary/50">Current Streak</span>
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  <span className="text-2xl font-black">4x</span>
                </div>
              </div>
            </div>
          </main>

          <aside className="fixed right-0 top-0 h-full w-80 bg-surface-container-lowest border-l border-outline/5 pt-24 pb-6 px-4 flex flex-col gap-6">
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
              <h3 className="font-label text-xs uppercase tracking-widest text-secondary/40 px-2 mb-2">Players</h3>
              {room.players.map((player, idx) => (
                <div key={player.id} className={`flex items-center justify-between p-3 rounded-xl ${player.isDrawer ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-white/5 transition-colors group'}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full overflow-hidden ${player.isDrawer ? 'border-2 border-primary' : 'border border-outline/20'}`}>
                        <img alt={player.name} className="w-full h-full object-cover" src={avatarPool[(idx + player.name.length) % avatarPool.length]} />
                      </div>
                      {player.isDrawer && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-0.5">
                          <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>brush</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${player.isDrawer ? 'text-primary' : 'text-on-surface'}`}>
                        {player.name} {player.id === room.hostId ? '👑' : ''}
                      </p>
                      <p className="text-[10px] font-label text-secondary/60">{player.isDrawer ? 'Drawing...' : 'Thinking...'}</p>
                    </div>
                  </div>
                  <span className={`font-black ${player.teamId === 'A' ? 'text-primary' : 'text-tertiary'}`}>
                    {player.teamId === 'A' ? room.teams.A.score : room.teams.B.score}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col bg-surface-container rounded-2xl overflow-hidden shadow-inner border border-outline/5">
              <div className="p-4 border-b border-outline/5">
                <h3 className="font-label text-xs uppercase tracking-widest text-secondary/60">Live Guesses</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="text-sm text-secondary/60">Guesses will appear here...</div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className="text-sm bg-primary/5 p-2 rounded-lg border border-outline/10 text-on-surface">
                      {msg}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendGuess} className="p-4 bg-surface-container-lowest border-t border-outline/5">
                <div className="relative flex items-center">
                  <input
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/50 font-body placeholder:text-secondary/30"
                    placeholder={isDrawer ? "You can't guess while drawing" : "Type a guess..."}
                    type="text"
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    disabled={isDrawer}
                  />
                  <button
                    type="submit"
                    disabled={isDrawer}
                    className="absolute right-2 w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-lg">send</span>
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-background text-on-background flex items-center justify-center">Loading...</div>;
}

export default App;

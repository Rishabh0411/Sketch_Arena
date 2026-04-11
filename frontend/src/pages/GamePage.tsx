import type { FormEvent } from 'react';

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

interface GamePageProps {
  room: Room;
  playerId: string;
  wordOptions: string[];
  messages: string[];
  guessInput: string;
  setGuessInput: (value: string) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  tool: 'pen' | 'eraser' | 'fill' | 'line' | 'rectangle' | 'circle';
  setTool: (tool: 'pen' | 'eraser' | 'fill' | 'line' | 'rectangle' | 'circle') => void;
  isDrawing: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onSelectWord: (word: string) => void;
  onSendGuess: (e: FormEvent) => void;
  onClearCanvas: () => void;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export default function GamePage({
  room,
  playerId,
  wordOptions,
  messages,
  guessInput,
  setGuessInput,
  currentColor,
  setCurrentColor,
  brushSize,
  setBrushSize,
  tool,
  setTool,
  canvasRef,
  messagesEndRef,
  onSelectWord,
  onSendGuess,
  onClearCanvas,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: GamePageProps) {
  const currentPlayer = room.players.find(p => p.id === playerId);
  const isDrawer = currentPlayer?.isDrawer || false;
  const drawer = room.players.find(p => p.isDrawer);

  return (
    <div className="bg-background text-on-background font-body min-h-screen overflow-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background flex justify-between items-center w-full px-6 py-4">
        <div className="flex items-center gap-8">
          <h1 className="font-headline text-2xl font-black text-primary tracking-tighter italic">
            Skribbl Atelier
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary hover:text-primary transition-colors cursor-pointer">
            settings
          </span>
          <span className="material-symbols-outlined text-secondary hover:text-primary transition-colors cursor-pointer">
            help
          </span>
        </div>
      </header>

      <div className="flex h-screen pt-20">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto custom-scrollbar">
          {/* Word Selection */}
          {wordOptions.length > 0 && isDrawer && (
            <div className="glass-panel rounded-2xl p-6 border border-outline-variant/10">
              <h3 className="font-headline font-bold text-lg mb-4 text-primary">Choose your word:</h3>
              <div className="flex gap-4">
                {wordOptions.map(word => (
                  <button
                    key={word}
                    onClick={() => onSelectWord(word)}
                    className="flex-1 bg-gradient-to-br from-primary via-primary to-primary-container text-on-primary py-4 rounded-xl font-headline text-xl font-black italic tracking-tight shadow-[0_8px_20px_-5px_rgba(110,237,83,0.4)] hover:scale-105 active:scale-95 transition-all"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Game Header */}
          <div className="bg-surface-container-low rounded-full px-8 py-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-tertiary-container text-on-tertiary-container font-label font-bold px-4 py-2 rounded-lg text-base">
                {room.gameState.timer}s
              </div>
              <div className="text-xs font-label text-secondary/60 uppercase tracking-widest">
                Round {room.gameState.round}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-label text-xs text-secondary/60 uppercase tracking-widest">Drawing:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-on-surface">{drawer?.name || 'Waiting...'}</span>
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    brush
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-xs text-primary font-label uppercase">{ room.teams.A.name}</div>
                <div className="text-2xl font-black text-primary">{room.teams.A.score}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-tertiary font-label uppercase">{room.teams.B.name}</div>
                <div className="text-2xl font-black text-tertiary">{room.teams.B.score}</div>
              </div>
            </div>
          </div>

          {/* Canvas Section */}
          <div className="relative flex-1 bg-white rounded-3xl canvas-shadow overflow-hidden group min-h-[400px]">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              className={`w-full h-full ${isDrawer ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
              style={{ backgroundColor: '#FFFFFF' }}
            />

            {/* Floating Toolbar */}
            {isDrawer && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-container-highest/80 backdrop-blur-xl p-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/5 transition-transform group-hover:scale-[1.02]">
                {/* Brush Sizes */}
                <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                  {[2, 5, 8, 12].map(size => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`rounded-full transition-all ${
                        brushSize === size
                          ? 'bg-primary ring-4 ring-primary/20'
                          : 'bg-on-surface/20 hover:bg-on-surface/40'
                      }`}
                      style={{ width: size * 2 + 'px', height: size * 2 + 'px' }}
                      title={`Size ${size}`}
                    />
                  ))}
                </div>

                {/* Colors */}
                <div className="flex items-center gap-2">
                  {['#000000', '#FFFFFF', '#FF0000', '#6eed53', '#0068d4', '#f4d041', '#93000a'].map(color => (
                    <div
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform ${
                        color === '#FFFFFF' ? 'border border-outline/20' : ''
                      } ${currentColor === color ? 'ring-4 ring-primary/30' : ''}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-8 h-8 rounded-full cursor-pointer bg-gradient-to-tr from-primary via-tertiary to-error overflow-hidden"
                    title="Custom color"
                  />
                </div>

                {/* Tools */}
                <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                  <button
                    onClick={() => setTool('pen')}
                    className={`p-2 rounded-full transition-colors ${
                      tool === 'pen' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-secondary'
                    }`}
                    title="Pen"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`p-2 rounded-full transition-colors ${
                      tool === 'eraser' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-secondary'
                    }`}
                    title="Eraser"
                  >
                    <span className="material-symbols-outlined">ink_eraser</span>
                  </button>
                  <button
                    onClick={() => setTool('fill')}
                    className={`p-2 rounded-full transition-colors ${
                      tool === 'fill' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-secondary'
                    }`}
                    title="Fill"
                  >
                    <span className="material-symbols-outlined">format_color_fill</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                  <button
                    onClick={onClearCanvas}
                    className="p-2 hover:bg-error/10 text-error rounded-full transition-colors"
                    title="Clear canvas"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Players & Chat */}
        <aside className="w-80 flex flex-col gap-6 p-6 pl-0">
          {/* Players List */}
          <div className="glass-panel rounded-2xl p-6 border border-outline-variant/10">
            <h3 className="font-headline font-bold text-lg text-secondary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">group</span>
              Players
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {room.players.map(player => (
                <div
                  key={player.id}
                  className={`p-3 rounded-xl flex items-center justify-between transition-all ${
                    player.isDrawer
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-surface-container-high/40 hover:bg-surface-container-high/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {player.isDrawer && (
                      <span className="material-symbols-outlined text-primary text-sm">brush</span>
                    )}
                    <span className={`text-sm font-bold ${
                      player.teamId === 'A' ? 'text-primary' : 'text-tertiary'
                    }`}>
                      {player.name}
                    </span>
                    {player.id === playerId && (
                      <span className="text-[10px] text-secondary/60 font-label">(You)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="glass-panel rounded-2xl flex flex-col flex-1 overflow-hidden border border-outline-variant/10 min-h-[300px]">
            <div className="p-6 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/10">
              <h3 className="font-headline font-bold text-lg text-secondary flex items-center gap-2">
                <span className="material-symbols-outlined">forum</span>
                Live Chat
              </h3>
              <span className="w-3 h-3 bg-primary rounded-full animate-pulse"></span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="text-secondary/40 text-sm text-center py-8">
                  Chat messages will appear here...
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className="text-sm bg-surface-container-high/40 p-3 rounded-xl text-on-background">
                    {msg}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-surface-container-low border-t border-outline-variant/10">
              <form onSubmit={onSendGuess} className="relative flex items-center">
                <input
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  disabled={isDrawer}
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/50 text-on-background font-body disabled:opacity-50"
                  placeholder={isDrawer ? "You can't guess while drawing" : "Type your guess..."}
                />
                <button
                  type="submit"
                  disabled={isDrawer}
                  className="absolute right-2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

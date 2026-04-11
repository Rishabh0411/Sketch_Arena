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
  currentWord: string;
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
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onSelectWord: (word: string) => void;
  onSendGuess: (e: FormEvent) => void;
  onClearCanvas: () => void;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

const palette = ['#000000', '#FFFFFF', '#FF0000', '#6eed53', '#0068d4', '#f4d041', '#93000a'];
const brushSizes = [4, 6, 10, 14];
const avatarPool = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCfWeBf_UJlQN4UshjEWNT-QqhD6vo-YEuKoK3l8etA5sNjGx2xyVk8aZ3NZSOu_wtlFCc5FUM01_VPJzBjqRWHWWVV1RYxBwxmGMIe3Kv2u29GQ89oLqLj_uD0GSv7auJpEpNgfM75gzviLl2OVCfj4F6Iuh6Ani8AVP1fSDpL4eGVsP-YZBwk1gQqav7Kux_I2BBlYuGa1RzFiSEXgLoPPg7gwMOL2RW4wRictq_xB44TchsugDTPbZG3S11sJ5DxJfmRhboSWxU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuByxDGiMBCiiksuXyApTVFWnjUNPlKJHyuTXRV4V__BvrEj-6mkFZxhAR_TPss1VkQfli4Jo3mS9RyYrY0nvJGgkl3wBvz62ZXLXsTqmthJ1G_4Zfbl-IDalknNk75xt59NA3iHs-J7l3v9AHyQeC5RhZQCR-MZ3aBYdXJVlq87E50zCQfJw3DWNupAx9LHGSjO68ExjZpbPS-XefDcVjzYmMGrCw0ExfK9g1srJMSR7eFf10ZaNV6hvmLp_D0ZIhgX1UnxshsNb3Y',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBGbGurlkgL2wMVuTcifXQzusxL60nHrjdqpndjA2qrzrf0FboQhs_UiltFLJrCPZUbI5KNkI-kmsHNQLGVGfXcB6VLJm-rWX5M05uCElCDsbIuPlZiE3BIO0ZuMxQrU-8lOpuSRiGnrqVtnP21XGVSqyLQdYmpCf1dfvpUqlsmAbnNZarjpdfILlUO6I5gCIVQqkdd47C_EL_NeHTKx7vn9SQOUl79S0NeFF5Nfn-Knu86XjguDJyYuMsH45-yR-65PP0ifSv487U',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA5zGTNXVbsu0vqR4RPESLRfmquJ-xSduaqWvUldGGWceU1GrW00D3FDlI5XHO0ZYl9hmzsoB2Dc-0W8VCrRpNXNRWWGR21nxZ5PjzQQ2tMCh4D_ryZtHxcFZJfdg1pVuWx1yORKvaA8ZTb6nhZ46zO_whzXUmv95EZrMU_usBHCxS_mSjqpMOUDVTbIseZkcSHHPYnDan15K-Yfc8M_mY4ql77w4vSMiC3nNe72r_GpEhGtH8s4BwUN5559GPVHX8WmA3BshQJvFs',
];

const getAvatar = (index: number) => avatarPool[index % avatarPool.length];

export default function GamePage({
  room,
  playerId,
  currentWord,
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
  const nextUp = room.players.find(p => !p.isDrawer && p.id !== playerId);

  const wordSlots = (currentWord ? currentWord.split('') : Array.from({ length: 7 }, () => '')).map((char, index) =>
    isDrawer || index === 0 ? char : ''
  );

  const formattedTimer = room.gameState.timer.toString().padStart(2, '0');

  return (
    <div className="bg-background text-on-background font-body min-h-screen overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#001038] flex justify-between items-center w-full px-6 py-4 max-w-full">
        <div className="flex items-center gap-8">
          <h1 className="font-headline text-2xl font-black text-primary tracking-tighter italic">Skribbl Atelier</h1>
          <nav className="hidden md:flex gap-6">
            <a className="font-headline font-bold tracking-tight text-secondary font-medium hover:text-primary transition-colors duration-300" href="#">
              How to Play
            </a>
            <a className="font-headline font-bold tracking-tight text-secondary font-medium hover:text-primary transition-colors duration-300" href="#">
              Gallery
            </a>
            <a className="font-headline font-bold tracking-tight text-secondary font-medium hover:text-primary transition-colors duration-300" href="#">
              Shop
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 font-headline font-bold text-on-primary bg-primary rounded-xl scale-95 duration-150 active:opacity-80">
            Create Room
          </button>
          <button className="px-4 py-2 font-headline font-bold text-on-secondary-container bg-secondary-container rounded-xl scale-95 duration-150 active:opacity-80">
            Join Game
          </button>
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
                <img
                  alt="Room Icon"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAinLyp3eFGFMsr0mU8ta3HzU4TCV0sR3N3pu81RH-Ln6EtQPlZK8t0wTgb_CcKDlEuG8Fyd8zZXLQ0HrtJLszB00Mj2f-eDdwSvNt6EzGetTBUDufUazwnd4PNDl2qM5itdoeEt4vftxbphDtcWG3tQhHo-8gWEcUuhI8X9xvmDYuWa4BbA-XhXhZij6S7-lqmMdap9PYRlNNn87i5xIU6dhCxbUcVnMFDlL-vKjxnzd8mKZyk7sSETrbLipoQaV5Z4i8nXLYJuDY"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#acc7ff] font-headline">Room #{room.id}</h2>
                <p className="text-xs text-secondary/70 font-label">Round {room.gameState.round}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 flex flex-col gap-2">
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all translate-x-1 duration-200" href="#">
              <span className="material-symbols-outlined">home</span>
              <span className="font-label">Lobby</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-r-4 border-primary bg-white/5 translate-x-1 duration-200" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
              <span className="font-label">Players</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all translate-x-1 duration-200" href="#">
              <span className="material-symbols-outlined">chat</span>
              <span className="font-label">Chat</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all translate-x-1 duration-200" href="#">
              <span className="material-symbols-outlined">brush</span>
              <span className="font-label">Tools</span>
            </a>
          </nav>
          <div className="mt-auto flex flex-col gap-2 border-t border-outline/10 pt-6">
            <button className="w-full py-3 px-4 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-all mb-4 font-headline text-sm">
              Invite Friends
            </button>
            <div className="flex items-center justify-between px-4">
              <div className="text-xs text-secondary/60 font-label uppercase">Scores</div>
              <div className="flex gap-3 text-sm font-bold">
                <span className="text-primary">{room.teams.A.score}</span>
                <span className="text-secondary/50">|</span>
                <span className="text-tertiary">{room.teams.B.score}</span>
              </div>
            </div>
            <a className="flex items-center gap-3 px-4 py-2 text-[#acc7ff] opacity-70 hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label text-sm">Settings</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-2 text-error/80 hover:text-error transition-all" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label text-sm">Leave</span>
            </a>
          </div>
        </aside>

        <main className="ml-64 mr-80 flex-1 flex flex-col p-6 gap-6 overflow-y-auto custom-scrollbar">
          {wordOptions.length > 0 && isDrawer && (
            <div className="bg-surface-container-high/50 border border-white/5 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline text-lg font-bold text-primary">Choose your word</h3>
                <span className="text-xs font-label uppercase text-secondary/60 tracking-[0.2em]">Secret</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {wordOptions.map((word) => (
                  <button
                    key={word}
                    onClick={() => onSelectWord(word)}
                    className="bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-headline text-xl font-black italic tracking-tight shadow-[0_8px_20px_-5px_rgba(110,237,83,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {word}
                    <span className="material-symbols-outlined text-lg">bolt</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-surface-container-low rounded-full px-8 py-4 flex items-center justify-between shadow-lg border border-white/5">
            <div className="flex items-center gap-4">
              <div className="bg-tertiary-container text-on-tertiary-container font-label font-bold px-4 py-2 rounded-lg text-base">
                {formattedTimer}s
              </div>
              <div className="text-xs font-label text-secondary/60 uppercase tracking-widest">
                Round {room.gameState.round}
              </div>
            </div>
            <div className="flex gap-3">
              {wordSlots.map((slot, index) => (
                slot ? (
                  <span key={`${slot}-${index}`} className="font-headline text-2xl font-black text-primary mx-1">
                    {slot.toUpperCase()}
                  </span>
                ) : (
                  <span key={`blank-${index}`} className="w-6 h-1 bg-on-surface/40 self-end mb-1 rounded-full"></span>
                )
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-label text-secondary/60 uppercase tracking-widest">Drawing</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-on-surface">{drawer?.name || 'Waiting...'}</span>
                  <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>brush</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-xs text-primary font-label uppercase">{room.teams.A.name}</div>
                  <div className="text-2xl font-black text-primary">{room.teams.A.score}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-tertiary font-label uppercase">{room.teams.B.name}</div>
                  <div className="text-2xl font-black text-tertiary">{room.teams.B.score}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex-1 bg-white rounded-3xl canvas-shadow overflow-hidden group min-h-[420px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[200px]">edit_square</span>
            </div>
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
            {isDrawer && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-container-highest/60 backdrop-blur-xl p-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/5 transition-transform group-hover:scale-105">
                <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                  {brushSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`rounded-full transition-all ${
                        brushSize === size ? 'bg-primary ring-4 ring-primary/20' : 'bg-on-surface/20 hover:bg-on-surface/40'
                      }`}
                      style={{ width: size * 2 + 'px', height: size * 2 + 'px' }}
                      title={`Size ${size}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {palette.map((color) => (
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-32">
            <div className="bg-surface-container-high rounded-2xl p-4 flex flex-col justify-between border-l-4 border-primary">
              <span className="font-label text-[10px] uppercase tracking-tighter text-secondary/50">Next Turn</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
                  <img alt="Next player" className="w-full h-full" src={getAvatar(0)} />
                </div>
                <span className="font-headline font-bold text-on-surface">{nextUp?.name || 'TBD'}</span>
              </div>
            </div>
            <div className="bg-surface-container-high rounded-2xl p-4 flex flex-col justify-between">
              <span className="font-label text-[10px] uppercase tracking-tighter text-secondary/50">Leaderboard Position</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-tertiary italic">#{room.teams.A.score >= room.teams.B.score ? 1 : 2}</span>
                <span className="text-xs text-secondary/60">team lead</span>
              </div>
            </div>
            <div className="bg-surface-container-high rounded-2xl p-4 flex flex-col justify-between group cursor-pointer hover:bg-surface-container-highest transition-colors">
              <span className="font-label text-[10px] uppercase tracking-tighter text-secondary/50">Current Streak</span>
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span className="text-2xl font-black">{messages.length > 0 ? Math.min(messages.length, 9) : 0}x</span>
              </div>
            </div>
          </div>
        </main>

        <aside className="fixed right-0 top-0 h-full w-80 bg-surface-container-lowest border-l border-outline/5 pt-24 pb-6 px-4 flex flex-col gap-6">
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            <h3 className="font-label text-xs uppercase tracking-widest text-secondary/40 px-2 mb-2">Players</h3>
            {room.players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-xl ${player.isDrawer ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-white/5'} transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full border-2 ${player.isDrawer ? 'border-primary' : 'border-outline/20'} overflow-hidden`}>
                      <img alt={player.name} className="w-full h-full object-cover" src={getAvatar(index)} />
                    </div>
                    {player.isDrawer && (
                      <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-0.5">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>brush</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">
                      {player.name} {player.id === playerId ? '(You)' : ''}
                    </p>
                    <p className="text-[10px] font-label text-secondary/60">
                      {player.isDrawer ? 'Drawing...' : 'Thinking...'}
                    </p>
                  </div>
                </div>
                <span className={`font-black ${player.teamId === 'A' ? 'text-primary' : 'text-tertiary'}`}>
                  {player.teamId}
                </span>
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col bg-surface-container rounded-2xl overflow-hidden shadow-inner">
            <div className="p-4 border-b border-outline/5">
              <h3 className="font-label text-xs uppercase tracking-widest text-secondary/60">Live Guesses</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="text-secondary/50 text-sm">No guesses yet. Be the first!</div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className="text-sm bg-surface-container-high/50 p-2 rounded-xl text-on-surface">
                    {msg}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-surface-container-lowest border-t border-white/5">
              <form onSubmit={onSendGuess} className="relative flex items-center">
                <input
                  className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/50 font-body placeholder:text-secondary/30"
                  placeholder={isDrawer ? "You're drawing" : 'Type a message...'}
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  disabled={isDrawer}
                />
                <button
                  type="submit"
                  disabled={isDrawer}
                  className="absolute right-3 w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

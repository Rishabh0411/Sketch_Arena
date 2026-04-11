import { useState } from 'react';

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

interface LobbyPageProps {
  room: Room;
  playerId: string;
  onStartGame: () => void;
  onChangeTeam: (teamId: 'A' | 'B') => void;
  onChangeTeamName: (teamId: 'A' | 'B', name: string) => void;
}

export default function LobbyPage({
  room,
  playerId,
  onStartGame,
  onChangeTeam,
  onChangeTeamName
}: LobbyPageProps) {
  const [viewMode, setViewMode] = useState<'teams' | 'individual'>('teams');
  const [editingTeam, setEditingTeam] = useState<'A' | 'B' | null>(null);
  const [teamNameInput, setTeamNameInput] = useState('');

  const isHost = playerId === room.hostId;
  const teamAPlayers = room.players.filter(p => p.teamId === 'A');
  const teamBPlayers = room.players.filter(p => p.teamId === 'B');

  const handleStartEditTeamName = (teamId: 'A' | 'B') => {
    setEditingTeam(teamId);
    setTeamNameInput(room.teams[teamId].name);
  };

  const handleSaveTeamName = () => {
    if (editingTeam && teamNameInput.trim()) {
      onChangeTeamName(editingTeam, teamNameInput.trim());
      setEditingTeam(null);
    }
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-none flex justify-between items-center w-full px-6 py-4">
        <div className="flex items-center gap-8">
          <h1 className="font-headline font-black text-2xl text-primary tracking-tighter italic">
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

      {/* Main Content */}
      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <h2 className="text-4xl font-black font-headline text-on-background tracking-tight mb-2 italic">
                Lobby: {viewMode === 'teams' ? 'Teams View' : 'Individual View'}
              </h2>
              <p className="text-secondary font-label text-sm uppercase tracking-widest">
                Room Code: <span className="text-primary font-black text-lg">{room.id}</span>
              </p>
            </div>
            
            {/* Toggle View */}
            <div className="bg-surface-container-low p-1.5 rounded-full flex items-center shadow-inner">
              <button
                onClick={() => setViewMode('individual')}
                className={`px-6 py-2 rounded-full text-sm font-bold font-headline transition-all ${
                  viewMode === 'individual'
                    ? 'bg-primary text-on-primary shadow-lg scale-105'
                    : 'text-secondary opacity-60 hover:opacity-100'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setViewMode('teams')}
                className={`px-8 py-2 rounded-full text-sm font-bold font-headline transition-all ${
                  viewMode === 'teams'
                    ? 'bg-primary text-on-primary shadow-lg scale-105'
                    : 'text-secondary opacity-60 hover:opacity-100'
                }`}
              >
                Teams
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team A */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                {editingTeam === 'A' ? (
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={teamNameInput}
                      onChange={(e) => setTeamNameInput(e.target.value)}
                      className="flex-1 bg-surface-container-lowest border-2 border-primary rounded-xl px-4 py-2 text-on-surface focus:ring-0 font-headline"
                      maxLength={20}
                      autoFocus
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveTeamName()}
                    />
                    <button
                      onClick={handleSaveTeamName}
                      className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingTeam(null)}
                      className="px-4 py-2 bg-error text-on-error rounded-xl font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-headline font-extrabold text-xl text-primary italic flex items-center gap-2">
                      <span className="material-symbols-outlined">palette</span>
                      {room.teams.A.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-label text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                        {teamAPlayers.length} Players
                      </span>
                      {room.gameState.status === 'waiting' && (
                        <button
                          onClick={() => handleStartEditTeamName('A')}
                          className="material-symbols-outlined text-primary hover:text-primary-fixed cursor-pointer"
                        >
                          edit
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                {teamAPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className="glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all group border border-transparent hover:border-primary/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                          index === 0 ? 'border-primary neon-glow' : 'border-outline-variant/30'
                        }`}>
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-2xl">
                              person
                            </span>
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[10px] font-black px-1.5 rounded-md">
                            CAPTAIN
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-headline font-bold text-on-background">
                          {player.name} {player.id === playerId && '(You)'}
                        </p>
                        <p className="font-label text-xs text-secondary/60">
                          Lv. {Math.floor(Math.random() * 50 + 1)} • {index === 0 ? 'Captain' : 'Player'}
                        </p>
                      </div>
                    </div>
                    {player.id === playerId && room.gameState.status === 'waiting' && (
                      <button
                        onClick={() => onChangeTeam('B')}
                        className="px-3 py-1 bg-tertiary text-on-tertiary rounded-lg text-xs font-bold hover:scale-105 transition-transform"
                      >
                        Switch →
                      </button>
                    )}
                  </div>
                ))}
                {room.gameState.status === 'waiting' && teamAPlayers.length < 6 && (
                  <div className="border-2 border-dashed border-outline-variant/30 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer group">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                      person_add
                    </span>
                    <span className="text-xs font-label text-outline group-hover:text-primary transition-colors">
                      Join Team A
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Team B */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                {editingTeam === 'B' ? (
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={teamNameInput}
                      onChange={(e) => setTeamNameInput(e.target.value)}
                      className="flex-1 bg-surface-container-lowest border-2 border-tertiary rounded-xl px-4 py-2 text-on-surface focus:ring-0 font-headline"
                      maxLength={20}
                      autoFocus
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveTeamName()}
                    />
                    <button
                      onClick={handleSaveTeamName}
                      className="px-4 py-2 bg-tertiary text-on-tertiary rounded-xl font-bold"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingTeam(null)}
                      className="px-4 py-2 bg-error text-on-error rounded-xl font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-headline font-extrabold text-xl text-tertiary italic flex items-center gap-2">
                      <span className="material-symbols-outlined">ink_highlighter</span>
                      {room.teams.B.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-label text-xs bg-tertiary/10 text-tertiary px-3 py-1 rounded-full border border-tertiary/20">
                        {teamBPlayers.length} Players
                      </span>
                      {room.gameState.status === 'waiting' && (
                        <button
                          onClick={() => handleStartEditTeamName('B')}
                          className="material-symbols-outlined text-tertiary hover:text-tertiary-fixed cursor-pointer"
                        >
                          edit
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                {teamBPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className="glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all group border border-transparent hover:border-tertiary/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                          index === 0 ? 'border-tertiary shadow-[0_0_15px_rgba(244,208,65,0.3)]' : 'border-outline-variant/30'
                        }`}>
                          <div className="w-full h-full bg-gradient-to-br from-tertiary/20 to-secondary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-tertiary text-2xl">
                              person
                            </span>
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="absolute -bottom-1 -right-1 bg-tertiary text-on-tertiary text-[10px] font-black px-1.5 rounded-md">
                            CAPTAIN
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-headline font-bold text-on-background">
                          {player.name} {player.id === playerId && '(You)'}
                        </p>
                        <p className="font-label text-xs text-secondary/60">
                          Lv. {Math.floor(Math.random() * 50 + 1)} • {index === 0 ? 'Captain' : 'Player'}
                        </p>
                      </div>
                    </div>
                    {player.id === playerId && room.gameState.status === 'waiting' && (
                      <button
                        onClick={() => onChangeTeam('A')}
                        className="px-3 py-1 bg-primary text-on-primary rounded-lg text-xs font-bold hover:scale-105 transition-transform"
                      >
                        ← Switch
                      </button>
                    )}
                  </div>
                ))}
                {room.gameState.status === 'waiting' && teamBPlayers.length < 6 && (
                  <div className="border-2 border-dashed border-outline-variant/30 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-tertiary/5 hover:border-tertiary/40 transition-all cursor-pointer group">
                    <span className="material-symbols-outlined text-outline group-hover:text-tertiary transition-colors">
                      person_add
                    </span>
                    <span className="text-xs font-label text-outline group-hover:text-tertiary transition-colors">
                      Join Team B
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          {room.gameState.status === 'waiting' && (
            <div className="mt-12 flex justify-center">
              <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-8 border border-outline-variant/10 shadow-2xl">
                <div className="flex items-center gap-4 md:pr-8 md:border-r border-outline-variant/20">
                  <div>
                    <p className="text-sm font-headline font-bold">{room.players.length} Players Ready</p>
                    <p className="text-[10px] font-label text-secondary/60">Min 2 / Max 12</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  {isHost ? (
                    <button
                      onClick={onStartGame}
                      disabled={room.players.length < 2}
                      className="px-12 py-3 bg-primary text-on-primary font-headline font-black rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(110,237,83,0.4)] transition-all active:scale-95 italic text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      START DASH
                    </button>
                  ) : (
                    <div className="px-12 py-3 bg-surface-container-high text-secondary font-headline font-bold rounded-xl text-center">
                      Waiting for host...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import { useMemo, useState } from 'react';

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

const avatarPool = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCYq7xGCRhucx3eYYOp0-auJOAJwNwkDa-sagmBuIbToeUTuloOR5jkOCozeBfMojUM1LOm7n5IonCjnccsw8xNIF9lpDkC9SODLMJtSp7ZXEYmVOFlzjLeX8pY9lsc3TjDRKfH15JGR6IcJ7VX6SJDf83_xpO1s2Qz-RF1mcAkNMo3SzhttRZTpXRBbLbJsUBPaRU9wFBUrar3DAEcflvqxS7GUyy4QDngIUebVrXDQujp2QBOv9V76uKfiui1l1mepjHbL8KqUYY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDsYDyihY8x3rg20vOfYOU9424c3ctcFn6OUGLNMoXWO_Lv69t7lTTyP_zyOOHFR7qwPI4sDME0f9yObIGe4aMlSOEENaKdJVACK3TgiyS6xR1lB6H8Nu2PUAZT_5Fey-AopYG5KCEZBRxzY7wh-dWZJUQXFajdbCLw7C73hDnaWaXyv0bWSJ9JAdEj4IiyYpHdoBUMwCVxzk0-DC23SyqzwNxvYPt0_tZRGqRwOu6ZZ8j2Dko4gHJkpsuP8YDqx7ouZzE2BVhixIU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBdUsXC8z2Sd-c-A-59UFdLxfvAM-Ep3cSKuVdm_D8r0SNCkyTfbVupi3eK664XohsvW09o93TJBdoWnNNc3LTcDAWe-8NW1OrjkBTGp63qXC-sZxd2mHYLy5pd3imE8rgbF_Flhm-WKsTFoLEL1eBhwxwMuiYOEdSjAZ9Ejg-4vAbcho0CRaYrxZVWIs3nlXxoLbwkExoSYkB6ly_BdyNqJdRQyD8vF3zE2T8iFlu6Dh4Fdbirn0zBrnqFCm_zp14oW2EcZInpxGc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAtnz87y10zR-Ncth64pYgg-pTTi0lIYFUzStmONuHsuDyBEK_XdxmRsFklsj2e_5izOUjWyGGizzfWTL9ZL54DlOiiQZAGmQqJ5VynMvAgSVEDCjOpyFEP3Xm1am0t2Dq6QDBkKtQV_I15eBFigXJPnDN2y0HwL1DiMSs5jgG58NZdtGGo8sO3Ymm22wFZAUIRG3hfDeQIYsPb3bSGKXV0fk83GxQ3HM9Y1Nfzp_CJ1kgmqlEftxi6YNQluE-O-t7SOuOeftk5mVA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDwXR5a1uTOGgqCV-6aWqnckvoYtizkEDJQUfulTSQdV_vQ1i_f8TnLlMLEkitxHdsaN6a39-3ZIvGoZuNq06yEpUoQo-NMYw-fWs_Bq8AJKp_Un4wMd7qm_-YQBFPZMdAgZHKWJlRm8saHdJ7FplnQMWwPSH6JNrS2YQtdzIaLLF5n_LSeWJ17zvEdusH43bTxkjg58xZyXpF50ochctDJSDxcwUrox9dc7lvMbFNrMokRtF2fQ557_jJe35E1K4znUetMBxlTPu8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBOYSTqGoB6IS3o8zFX7Xe3Jm_zKuu_bf6yVUUKSShHy-uECmi0xrVeJSe_LDxJWhxblDgX1fH0H8YI-wfl0szIgiJUnG6aPi8mbMHH6mmGKS66Y8kidB-wlxAtwi-DMB-QUneu7ljqKp95iNcpQ2RZ3AbONmreLHJdqBRHxa9meigEFTeOBX488854EclpcTSijENOSgWcqfes0vCJKtrShxe78CI60ywJE6aPTzN6g-8ZB4ucd5j2qSC-5VYsKA-gc10culkii1M',
];

const getAvatar = (index: number) => avatarPool[index % avatarPool.length];

const getPlayerLevel = (player: Player, index: number) => {
  const base = [...player.id].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (base + index * 7) % 50 + 1;
};

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
  const playerTeam = room.players.find(p => p.id === playerId)?.teamId;

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

  const renderTeamColumn = (teamId: 'A' | 'B', players: Player[], accent: 'primary' | 'tertiary') => {
    const accentText = accent === 'primary' ? 'text-primary' : 'text-tertiary';
    const accentBorder = accent === 'primary' ? 'border-primary' : 'border-tertiary';
    const accentBadge = accent === 'primary'
      ? 'bg-primary/10 text-primary border border-primary/20'
      : 'bg-tertiary/10 text-tertiary border border-tertiary/20';
    const inviteBadge = accent === 'primary'
      ? 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
      : 'bg-tertiary/10 text-tertiary hover:bg-tertiary/20 border border-tertiary/20';
    const hoverBorder = accent === 'primary' ? 'hover:border-primary/20' : 'hover:border-tertiary/20';
    const teamName = room.teams[teamId].name;

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          {editingTeam === teamId ? (
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                className={`flex-1 bg-surface-container-lowest border-2 ${accentBorder} rounded-xl px-4 py-2 text-on-surface focus:ring-0 font-headline`}
                maxLength={20}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSaveTeamName()}
              />
              <button
                onClick={handleSaveTeamName}
                className={`px-4 py-2 ${accent === 'primary' ? 'bg-primary text-on-primary' : 'bg-tertiary text-on-tertiary'} rounded-xl font-bold`}
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
              <h3 className={`font-headline font-extrabold text-xl ${accentText} italic flex items-center gap-2`}>
                <span className="material-symbols-outlined">{teamId === 'A' ? 'palette' : 'ink_highlighter'}</span>
                {teamName}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`font-label text-xs px-3 py-1 rounded-full ${accentBadge}`}>
                  {players.length} Players
                </span>
                {room.gameState.status === 'waiting' && isHost && (
                  <button
                    onClick={() => handleStartEditTeamName(teamId)}
                    className={`material-symbols-outlined ${accentText} hover:opacity-80 cursor-pointer`}
                  >
                    edit
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`glass-panel p-4 rounded-xl flex items-center justify-between transition-all border border-transparent ${hoverBorder} hover:bg-white/5`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${index === 0 ? accentBorder : 'border-outline-variant/30'} ${index === 0 ? 'shadow-[0_0_15px_rgba(110,237,83,0.3)]' : ''}`}>
                    <img className="w-full h-full object-cover" src={getAvatar(index)} alt={player.name} />
                  </div>
                  {index === 0 && (
                    <div className={`absolute -bottom-1 -right-1 ${accent === 'primary' ? 'bg-primary text-on-primary' : 'bg-tertiary text-on-tertiary'} text-[10px] font-black px-1.5 rounded-md`}>
                      CAPTAIN
                    </div>
                  )}
                  {player.id === room.hostId && (
                    <div className="absolute -top-1 -left-1 bg-surface-container-highest text-secondary text-[10px] px-1 rounded">Host</div>
                  )}
                </div>
                <div>
                  <p className="font-headline font-bold text-on-background">
                    {player.name} {player.id === playerId && '(You)'}
                  </p>
                  <p className="font-label text-xs text-secondary/60">
                    Lv. {getPlayerLevel(player, index)} • {player.isDrawer ? 'Drawing' : index === 0 ? 'Captain' : 'Player'}
                  </p>
                </div>
              </div>
              {player.id === playerId ? (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${accentBadge}`}>You</span>
              ) : room.gameState.status === 'waiting' && (
                <button
                  onClick={() => onChangeTeam(teamId)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${inviteBadge}`}
                >
                  Invite
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => onChangeTeam(teamId)}
            className="border-2 border-dashed border-outline/20 rounded-xl p-4 flex items-center justify-center hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3 text-secondary/60">
              <span className="material-symbols-outlined">person_add</span>
              <span className="font-label text-sm uppercase">{playerTeam === teamId ? 'You are in this team' : `Join Team ${teamId}`}</span>
            </div>
          </button>
        </div>
      </div>
    );
  };

  const lobbyTitle = useMemo(
    () => (viewMode === 'teams' ? 'Lobby: Teams View' : 'Lobby: Individual View'),
    [viewMode]
  );

  return (
    <div className="bg-background text-on-background font-body min-h-screen overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#001038] border-none flex justify-between items-center w-full px-6 py-4 max-w-full">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-primary tracking-tighter italic font-headline">Skribbl Atelier</span>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="text-primary border-b-2 border-primary pb-1 font-headline hover:text-primary transition-colors duration-300" href="#">
              How to Play
            </a>
            <a className="text-secondary font-medium font-headline hover:text-primary transition-colors duration-300" href="#">
              Gallery
            </a>
            <a className="text-secondary font-medium font-headline hover:text-primary transition-colors duration-300" href="#">
              Shop
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors duration-300 scale-95 duration-150 active:opacity-80">settings</button>
            <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors duration-300 scale-95 duration-150 active:opacity-80">help</button>
          </div>
          <div className="flex items-center gap-3 ml-2">
            <button className="px-4 py-2 rounded-xl bg-secondary-container text-on-secondary-container font-headline text-sm hover:opacity-90 transition-all active:scale-95">Join Game</button>
            <button className="px-4 py-2 rounded-xl bg-primary text-on-primary font-headline text-sm hover:opacity-90 transition-all active:scale-95">Create Room</button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-4 z-40 bg-[#001038]/60 backdrop-blur-xl w-64 pt-24 shadow-[0px_20px_40px_rgba(0,0,0,0.15)]">
          <div className="mb-8 px-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline/20">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>meeting_room</span>
              </div>
              <div>
                <p className="text-lg font-bold text-[#acc7ff] font-headline">Room #{room.id}</p>
                <p className="text-xs text-secondary/60 font-label">Round {room.gameState.round}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-2">
            <a className="flex items-center gap-3 px-4 py-3 text-primary font-bold border-r-4 border-primary bg-white/5 transition-all translate-x-1 duration-200" href="#">
              <span className="material-symbols-outlined">home</span>
              <span className="font-['Be_Vietnam_Pro'] text-sm">Lobby</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined">group</span>
              <span className="font-['Be_Vietnam_Pro'] text-sm">Players</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined">chat</span>
              <span className="font-['Be_Vietnam_Pro'] text-sm">Chat</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined">brush</span>
              <span className="font-['Be_Vietnam_Pro'] text-sm">Tools</span>
            </a>
          </nav>
          <div className="mt-auto space-y-2 border-t border-outline/10 pt-6">
            <button className="w-full py-3 px-4 rounded-xl bg-primary/10 text-primary font-headline text-sm mb-4 hover:bg-primary/20 transition-all">Invite Friends</button>
            <a className="flex items-center gap-3 px-4 py-2 text-[#acc7ff] opacity-70 hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-['Be_Vietnam_Pro'] text-sm">Settings</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-2 text-[#acc7ff] opacity-70 hover:text-error transition-all" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-['Be_Vietnam_Pro'] text-sm">Leave</span>
            </a>
          </div>
        </aside>

        <main className="ml-64 pt-24 min-h-screen p-8 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
              <div>
                <h2 className="text-4xl font-black font-headline text-on-background tracking-tight mb-2 italic">
                  {lobbyTitle}
                </h2>
                <p className="text-secondary font-label text-sm uppercase tracking-widest">
                  Room Code: <span className="text-primary font-black text-lg">{room.id}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="glass-panel px-6 py-3 rounded-xl border border-outline/10 flex items-center gap-4">
                  <span className="text-xs font-label uppercase tracking-widest text-secondary/60">Round</span>
                  <span className="text-xl font-bold font-headline text-tertiary tracking-widest uppercase">{room.gameState.round}</span>
                </div>
                <div className="bg-surface-container-low p-1.5 rounded-full flex items-center shadow-inner">
                  <button
                    onClick={() => setViewMode('individual')}
                    className={`px-6 py-2 rounded-full text-sm font-bold font-headline transition-all ${viewMode === 'individual' ? 'bg-primary text-on-primary shadow-lg scale-105' : 'text-secondary opacity-60 hover:opacity-100'}`}
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => setViewMode('teams')}
                    className={`px-8 py-2 rounded-full text-sm font-bold font-headline transition-all ${viewMode === 'teams' ? 'bg-primary text-on-primary shadow-lg scale-105' : 'text-secondary opacity-60 hover:opacity-100'}`}
                  >
                    Teams
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'teams' ? (
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderTeamColumn('A', teamAPlayers, 'primary')}
                  {renderTeamColumn('B', teamBPlayers, 'tertiary')}
                </div>
                <aside className="col-span-12 lg:col-span-4 space-y-4">
                  <div className="glass-panel rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-label text-xs uppercase tracking-[0.2em] text-secondary">Room Snapshot</h3>
                      <span className="text-xs font-label bg-primary/10 text-primary px-2 py-1 rounded uppercase">Live</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary/70 text-sm">Host</span>
                        <span className="font-headline font-bold text-on-background">
                          {room.players.find(p => p.id === room.hostId)?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary/70 text-sm">{room.teams.A.name}</span>
                        <span className="font-headline font-bold text-primary">{room.teams.A.score}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary/70 text-sm">{room.teams.B.name}</span>
                        <span className="font-headline font-bold text-tertiary">{room.teams.B.score}</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      {isHost ? (
                        <button
                          onClick={onStartGame}
                          className="w-full group flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-primary text-on-primary font-headline font-black text-lg hover:shadow-[0_0_30px_rgba(110,237,83,0.4)] transition-all active:scale-95 italic"
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                          Start Game
                        </button>
                      ) : (
                        <div className="w-full text-center text-secondary/70 text-sm font-label py-3 rounded-full border border-white/5">
                          Waiting for host to start
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="glass-panel rounded-2xl p-6 border border-white/5">
                    <h3 className="font-label text-xs uppercase tracking-[0.2em] text-secondary mb-4">Game Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-label text-secondary/60 mb-1 uppercase">Status</p>
                        <p className="font-headline font-bold text-lg capitalize">{room.gameState.status}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-label text-secondary/60 mb-1 uppercase">Timer</p>
                        <p className="font-headline font-bold text-lg">{room.gameState.timer}s</p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-8 items-start">
                <section className="col-span-12 lg:col-span-7 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {room.players.map((player, index) => {
                      const isCurrent = player.id === playerId;
                      const isHostPlayer = player.id === room.hostId;
                      const targetTeam = player.teamId === 'A' ? room.teams.B.name : room.teams.A.name;
                      return (
                        <div
                          key={player.id}
                          className={`surface-container-low rounded-xl p-4 flex items-center justify-between group hover:surface-container transition-all border-l-4 ${player.teamId === 'A' ? 'border-primary' : 'border-tertiary'} relative overflow-hidden`}
                        >
                          {isHostPlayer && <div className="absolute top-2 right-2 text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-full font-label uppercase">Host</div>}
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-outline/20 p-1">
                                <img alt={`${player.name} avatar`} className="w-full h-full rounded-full bg-surface-container-high" src={getAvatar(index)} />
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-on-background font-headline">
                                {isCurrent ? `You (${player.name})` : player.name}
                              </p>
                              <p className={`text-xs font-label uppercase ${player.teamId === 'A' ? 'text-primary' : 'text-tertiary'}`}>
                                Team {player.teamId} • Lv. {getPlayerLevel(player, index)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-secondary/60 font-label">
                              {player.isDrawer ? 'Drawing next' : 'Ready'}
                            </span>
                            {room.gameState.status === 'waiting' && isCurrent && (
                              <button
                                onClick={() => onChangeTeam(player.teamId === 'A' ? 'B' : 'A')}
                                className="px-3 py-1 rounded-full bg-surface-container-high text-secondary text-xs hover:bg-surface-bright transition-colors"
                              >
                                Switch to {targetTeam}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div className="border-2 border-dashed border-outline/20 rounded-xl p-4 flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 text-secondary/40">
                        <span className="material-symbols-outlined">person_add</span>
                        <span className="font-label text-sm uppercase">Invite Player</span>
                      </div>
                    </div>
                  </div>
                </section>
                <aside className="col-span-12 lg:col-span-5 flex flex-col h-[600px]">
                  <div className="surface-container-low rounded-2xl flex flex-col h-full overflow-hidden border border-white/5 shadow-2xl">
                    <div className="bg-surface-container-highest px-6 py-4 flex items-center justify-between border-b border-white/5">
                      <h2 className="font-headline font-bold text-secondary flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">chat_bubble</span>
                        Lobby Chat
                      </h2>
                      <span className="text-[10px] font-label bg-primary/20 text-primary px-2 py-1 rounded uppercase">Live</span>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                      <div className="text-secondary/50 text-sm">Chat will appear here once the game starts.</div>
                    </div>
                    <div className="p-4 bg-surface-container-lowest border-t border-white/5">
                      <div className="relative flex items-center">
                        <input className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/50 font-body placeholder:text-secondary/30" placeholder="Type a message..." type="text" disabled />
                        <button className="absolute right-3 w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center cursor-not-allowed">
                          <span className="material-symbols-outlined text-lg">send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

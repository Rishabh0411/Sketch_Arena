import { useState } from 'react';

interface LandingPageProps {
  onCreateRoom: (playerName: string) => void;
  onJoinRoom: (playerName: string, roomCode: string) => void;
}

export default function LandingPage({ onCreateRoom, onJoinRoom }: LandingPageProps) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  const handlePlayNow = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    onCreateRoom(playerName);
  };

  const handleJoinPrivate = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!roomCode.trim()) {
      alert('Please enter a room code');
      return;
    }
    onJoinRoom(playerName, roomCode);
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-none flex justify-between items-center w-full px-6 py-4 max-w-full">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black text-primary tracking-tighter italic font-headline">
            Skribbl Atelier
          </h1>
          <nav className="hidden md:flex gap-6">
            <a className="font-headline font-bold tracking-tight text-primary border-b-2 border-primary pb-1" href="#">
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
          <button 
            onClick={() => setIsJoiningRoom(false)}
            className="px-4 py-2 font-headline font-bold text-on-primary bg-primary rounded-xl scale-95 hover:scale-100 transition-transform duration-150 active:opacity-80"
          >
            Create Room
          </button>
          <button 
            onClick={() => setIsJoiningRoom(true)}
            className="px-4 py-2 font-headline font-bold text-on-secondary-container bg-secondary-container rounded-xl scale-95 hover:scale-100 transition-transform duration-150 active:opacity-80"
          >
            Join Game
          </button>
          <div className="flex gap-2 ml-2">
            <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">
              settings
            </span>
            <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">
              help
            </span>
          </div>
        </div>
      </header>

      <main className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Background Texture */}
        <div className="fixed inset-0 canvas-grain opacity-10"></div>
        
        {/* Hero Branding */}
        <section className="text-center mb-12 relative w-full flex flex-col items-center">
          <div className="absolute -top-40 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full -z-10"></div>
          <div className="inline-block px-4 py-1.5 rounded-full glass border border-primary/20 text-primary font-label text-[10px] uppercase tracking-[0.2em] font-bold mb-6">
            The Digital Sketchbook Experience
          </div>
          <h2 className="font-headline text-7xl md:text-[10rem] font-extrabold tracking-tighter italic text-primary leading-[0.8] mb-4 drop-shadow-[0_10px_30px_rgba(110,237,83,0.3)]">
            SKRIBBL<br />
            <span className="text-secondary ml-12">ATELIER</span>
          </h2>
        </section>

        {/* Entry Card Container */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
          {/* Left: Avatar Customizer */}
          <div className="lg:col-span-5 bg-surface-container-low/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline text-xl font-bold text-on-surface">Your Artist Profile</h3>
              <span className="p-2 bg-surface-container-highest rounded-full text-primary">
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square max-w-[280px] mb-8 group/avatar">
                <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl group-hover/avatar:bg-primary/40 transition-all duration-500"></div>
                <div className="relative w-full h-full bg-surface-container-high rounded-[2rem] flex items-center justify-center border-2 border-outline/10 overflow-hidden shadow-inner">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[120px] text-primary opacity-40">
                      person
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-primary p-3 rounded-2xl shadow-xl transform translate-y-2 opacity-0 group-hover/avatar:translate-y-0 group-hover/avatar:opacity-100 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-on-primary font-bold">auto_fix_high</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 w-full gap-3">
                <div className="flex items-center justify-between bg-surface-container-lowest/80 rounded-2xl p-4 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group/row">
                  <span className="font-label text-xs uppercase tracking-widest text-secondary/60 font-bold group-hover/row:text-primary transition-colors">
                    Face Structure
                  </span>
                  <div className="flex gap-2">
                    <button className="p-1 hover:text-primary">
                      <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                    <button className="p-1 hover:text-primary">
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-surface-container-lowest/80 rounded-2xl p-4 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group/row">
                  <span className="font-label text-xs uppercase tracking-widest text-secondary/60 font-bold group-hover/row:text-primary transition-colors">
                    Palette Theme
                  </span>
                  <div className="flex gap-2">
                    <button className="p-1 hover:text-primary">
                      <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                    <button className="p-1 hover:text-primary">
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action Panel */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-surface-container-low/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl flex-grow flex flex-col justify-center">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="font-label text-xs text-tertiary ml-1 uppercase tracking-[0.3em] font-bold">
                    Artist Alias
                  </label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary/40 group-focus-within:text-primary transition-colors">
                      stylus
                    </span>
                    <input
                      className="w-full bg-surface-container-lowest/80 border-2 border-white/5 rounded-[1.5rem] py-6 pl-16 pr-6 text-on-surface focus:ring-0 focus:border-primary placeholder:text-on-surface-variant/20 font-headline text-2xl font-bold transition-all"
                      placeholder="How shall we call you?"
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handlePlayNow()}
                    />
                  </div>
                </div>

                {isJoiningRoom && (
                  <div className="space-y-3">
                    <label className="font-label text-xs text-secondary ml-1 uppercase tracking-[0.3em] font-bold">
                      Room Code
                    </label>
                    <div className="relative group">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary/40 group-focus-within:text-primary transition-colors">
                        meeting_room
                      </span>
                      <input
                        className="w-full bg-surface-container-lowest/80 border-2 border-white/5 rounded-[1.5rem] py-6 pl-16 pr-6 text-on-surface focus:ring-0 focus:border-primary placeholder:text-on-surface-variant/20 font-headline text-2xl font-bold transition-all uppercase"
                        placeholder="ENTER CODE"
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleJoinPrivate()}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isJoiningRoom ? (
                    <>
                      <button
                        onClick={handleJoinPrivate}
                        className="bg-gradient-to-br from-primary via-primary to-primary-container text-on-primary py-6 rounded-[1.5rem] font-headline text-3xl font-black italic tracking-tighter shadow-[0_15px_35px_-5px_rgba(110,237,83,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        JOIN ROOM
                        <span className="material-symbols-outlined text-3xl">login</span>
                      </button>
                      <button
                        onClick={() => setIsJoiningRoom(false)}
                        className="bg-surface-container-highest text-on-surface py-6 rounded-[1.5rem] font-headline text-lg font-bold tracking-tight hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handlePlayNow}
                        className="bg-gradient-to-br from-primary via-primary to-primary-container text-on-primary py-6 rounded-[1.5rem] font-headline text-3xl font-black italic tracking-tighter shadow-[0_15px_35px_-5px_rgba(110,237,83,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        PLAY NOW
                        <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                      </button>
                      <button
                        onClick={() => setIsJoiningRoom(true)}
                        className="bg-secondary-container text-on-secondary-container py-6 rounded-[1.5rem] font-headline text-lg font-bold tracking-tight hover:bg-secondary/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">meeting_room</span>
                        Private Room
                      </button>
                    </>
                  )}
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                    </span>
                    <span className="text-sm font-label text-secondary/60">42,801 artists sketching</span>
                  </div>
                  <div className="flex items-center gap-4 text-secondary/40 font-label text-xs">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">bolt</span> v2.4.0
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">cloud_done</span> US-East
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Bento Bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* News Card */}
              <div className="bg-surface-container-low/50 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 flex flex-col justify-between group cursor-pointer hover:bg-surface-container-low transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-secondary text-sm">campaign</span>
                    <span className="font-label text-[10px] uppercase font-bold tracking-widest text-secondary/50">
                      Atelier Bulletin
                    </span>
                  </div>
                  <h4 className="font-headline font-bold text-lg text-on-surface leading-tight group-hover:text-primary transition-colors">
                    Spring Brush Collection is live!
                  </h4>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-primary gap-1">
                  Read update <span className="material-symbols-outlined text-sm">north_east</span>
                </div>
              </div>

              {/* Mini Gallery Card */}
              <div className="bg-surface-container-low/50 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 flex flex-col justify-between group cursor-pointer hover:bg-surface-container-low transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-secondary text-sm">palette</span>
                    <span className="font-label text-[10px] uppercase font-bold tracking-widest text-secondary/50">
                      Daily Masterpiece
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest overflow-hidden border border-white/10">
                      <div className="w-full h-full bg-gradient-to-br from-primary to-tertiary"></div>
                    </div>
                    <span className="font-headline font-bold text-on-surface">Weekly Hall of Fame</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-secondary gap-1">
                  View gallery <span className="material-symbols-outlined text-sm">north_east</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Attribution Footer */}
      <div className="w-full py-8 px-6 text-center text-on-surface-variant/30 text-[10px] font-label uppercase tracking-widest">
        <span>© 2024 ATELIER LABS. ALL RIGHTS RESERVED.</span>
      </div>
    </div>
  );
}

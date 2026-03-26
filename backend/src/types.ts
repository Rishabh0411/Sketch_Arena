export type TeamId = "A" | "B";
export type GameStatus = "waiting" | "playing" | "finished";

export interface Player {
  id: string;
  name: string;
  socketId: string;
  teamId: TeamId;
  isDrawer: boolean;
  hasGuessed: boolean;
  status: "active" | "disconnected";
  disconnectTime?: number;
}

export interface Team {
  id: TeamId;
  name: string;
  score: number;
  players: string[]; // playerIds
}

export interface GameState {
  status: GameStatus;
  currentDrawerId: string | null;
  currentWord: string | null;
  wordOptions: string[];
  round: number;
  maxRounds: number;
  timer: number;
  startTime: number | null;
  turnStartTime: number | null;
}

export interface Room {
  id: string;
  players: Record<string, Player>;
  teams: Record<TeamId, Team>;
  gameState: GameState;
  drawingHistory: DrawingEvent[];
  lastActivity: number;
  hostId: string;
}

export interface DrawingEvent {
  x: number;
  y: number;
  color: string;
  size: number;
  playerId: string;
  timestamp: number;
}

export interface ChatMessage {
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  isGuess?: boolean;
}

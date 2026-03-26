export type TeamId = "A" | "B";
export type GameStatus = "waiting" | "playing" | "finished";

export interface Player {
  id: string;
  name: string;
  teamId: TeamId;
  isDrawer: boolean;
  hasGuessed: boolean;
  status: "active" | "disconnected";
}

export interface Team {
  id: TeamId;
  score: number;
  players: string[];
}

export interface GameState {
  status: GameStatus;
  currentDrawerId: string | null;
  round: number;
  maxRounds: number;
  timer: number;
}

export interface Room {
  id: string;
  players: Player[];
  teams: Record<TeamId, Team>;
  gameState: GameState;
  hostId: string;
}

export interface ChatMessage {
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
}

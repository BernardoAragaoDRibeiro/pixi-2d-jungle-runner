export const GameState = {
  IDLE: "IDLE",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER",
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

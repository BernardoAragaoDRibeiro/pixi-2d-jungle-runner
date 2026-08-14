import { useEffect, useRef } from "react";
import { Game } from "./game/Game";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const game = new Game();
    gameRef.current = game;
    game.init(containerRef.current);

    return () => {
      game.destroy();
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} />;
}

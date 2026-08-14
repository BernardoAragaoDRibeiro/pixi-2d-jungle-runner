import { Application, Text } from "pixi.js";
import { Player } from "./Player";
import { Ground } from "./Ground";
import { ObstacleManager } from "./ObstacleManager";
import { GameState } from "./GameState";
import { ScreenShake } from "./ScreenShake";
import { DustEmitter } from "./DustEmitter";
import { Background } from "./Background";

export class Game {
  private app: Application;
  private player: Player;
  private ground: Ground;
  private obstacleManager: ObstacleManager;
  private screenShake: ScreenShake;
  private dustEmitter: DustEmitter;
  private background: Background;

  private state: GameState = GameState.IDLE;
  private speed = 300;
  private score = 0;
  private scoreTimer = 0;
  private highScore = 0;

  private scoreText!: Text;
  private messageText!: Text;
  private highScoreText!: Text;

  constructor() {
    this.app = new Application();
    this.player = new Player();
    this.ground = new Ground(800);
    this.obstacleManager = new ObstacleManager();
    this.screenShake = new ScreenShake(this.app.stage);
    this.dustEmitter = new DustEmitter();
    this.background = new Background();
  }

  async init(container: HTMLElement): Promise<void> {
    await this.app.init({
      width: 800,
      height: 300,
      background: "#16213e",
      antialias: true,
      resizeTo: undefined,
    });

    container.appendChild(this.app.canvas);
    this.app.canvas.style.width = "100%";
    this.app.canvas.style.maxWidth = "800px";
    this.app.canvas.style.height = "auto";
    this.app.canvas.style.display = "block";
    this.app.canvas.style.touchAction = "none";

    this.screenShake = new ScreenShake(this.app.stage);

    this.player.onLand = () => {
      this.dustEmitter.emit(this.player.view.x, this.player.view.y);
    };

    this.app.stage.addChild(this.background.view);
    this.app.stage.addChild(this.ground.view);
    this.app.stage.addChild(this.obstacleManager.view);
    this.app.stage.addChild(this.player.view);
    this.app.stage.addChild(this.dustEmitter.view);

    this.highScore = parseInt(localStorage.getItem("highScore") ?? "0");

    this.scoreText = new Text({
      text: "Score: 0",
      style: { fill: "#ffffff", fontSize: 20, fontFamily: "monospace" },
    });
    this.scoreText.x = 16;
    this.scoreText.y = 16;
    this.app.stage.addChild(this.scoreText);

    this.highScoreText = new Text({
      text: "Score: 0",
      style: { fill: "#f5a623", fontSize: 20, fontFamily: "monospace" },
    });
    this.highScoreText.anchor.set(1, 0);
    this.highScoreText.x = 784;
    this.highScoreText.y = 16;
    this.app.stage.addChild(this.highScoreText);

    this.messageText = new Text({
      text: "Pressione ESPAÇO para começar",
      style: { fill: "#e94560", fontSize: 22, fontFamily: "monospace" },
    });
    this.messageText.anchor.set(0.5);
    this.messageText.x = 400;
    this.messageText.y = 140;
    this.app.stage.addChild(this.messageText);

    window.addEventListener("keydown", this.handleInput);
    this.app.ticker.add(this.update);
    window.addEventListener("pointerdown", this.handlePointer);
    this.app.ticker.add(this.update);
  }

  private handleInput = (e: KeyboardEvent): void => {
    if (e.code !== "Space") return;

    if (this.state === GameState.IDLE || this.state === GameState.GAME_OVER) {
      this.startGame();
      return;
    }

    if (this.state === GameState.PLAYING) {
      this.player.jump();
    }
  };

  private handlePointer = (): void => {
    if (this.state === GameState.IDLE || this.state === GameState.GAME_OVER) {
      this.startGame();
      return;
    }
    if (this.state === GameState.PLAYING) {
      this.player.jump();
    }
  };

  private startGame(): void {
    this.state = GameState.PLAYING;
    this.score = 0;
    this.scoreTimer = 0;
    this.speed = 300;
    this.messageText.text = "";
    this.obstacleManager.reset();
  }

  private triggerGameOver(): void {
    this.state = GameState.GAME_OVER;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore.toString());
      this.highScoreText.text = `Best: ${this.highScore}`;
    }

    this.player.flash();
    this.screenShake.trigger(8, 0.4);
    this.messageText.text = `Game Over — Score: ${this.score}\nPressione ESPAÇO para tentar novamente`;
  }

  private checkCollision(): boolean {
    const p = this.player.getBounds();

    for (const obstacle of this.obstacleManager.getObstacles()) {
      const o = obstacle.getBounds();
      if (
        p.x < o.x + o.width &&
        p.x + p.width > o.x &&
        p.y < o.y + o.height &&
        p.y + p.height > o.y
      ) {
        return true;
      }
    }

    return false;
  }

  private update = (): void => {
    const delta = this.app.ticker.deltaMS / 1000;

    this.screenShake.update(delta);
    this.dustEmitter.update(delta);

    if (this.state !== GameState.PLAYING) return;

    this.player.update(delta);
    this.obstacleManager.update(delta, this.speed);
    this.background.update(delta, this.speed);

    this.scoreTimer += delta;
    if (this.scoreTimer >= 0.1) {
      this.score++;
      this.scoreTimer = 0;
      this.speed = 300 + this.score * 1.5;
      this.scoreText.text = `Score: ${this.score}`;
    }

    if (this.checkCollision()) {
      this.triggerGameOver();
    }
  };

  destroy(): void {
    window.removeEventListener("keydown", this.handleInput);
    window.removeEventListener("pointerdown", this.handlePointer);
    this.app.ticker.remove(this.update);
    this.app.destroy();
  }
}

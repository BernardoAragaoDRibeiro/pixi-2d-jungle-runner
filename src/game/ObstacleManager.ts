import { Container } from "pixi.js";
import { Obstacle } from "./Obstacle";

export class ObstacleManager {
  readonly view: Container;
  private obstacles: Obstacle[] = [];

  private readonly SPAWN_X = 820;
  private readonly MIN_INTERVAL = 0.8;
  private readonly MAX_INTERVAL = 2.2;

  private timer = 0;
  private nextSpawn = 1.5;

  constructor() {
    this.view = new Container();
  }

  update(delta: number, speed: number): void {
    this.timer += delta;

    if (this.timer >= this.nextSpawn) {
      this.spawnObstacle();
      this.timer = 0;
      this.nextSpawn =
        this.MIN_INTERVAL +
        Math.random() * (this.MAX_INTERVAL - this.MIN_INTERVAL);
    }

    for (const obstacle of this.obstacles) {
      obstacle.update(delta, speed);
    }

    const before = this.obstacles.length;
    this.obstacles = this.obstacles.filter((o) => {
      if (o.isOffScreen()) {
        this.view.removeChild(o.view);
        return false;
      }
      return true;
    });
  }

  getObstacles(): Obstacle[] {
    return this.obstacles;
  }

  reset(): void {
    for (const o of this.obstacles) {
      this.view.removeChild(o.view);
    }
    this.obstacles = [];
    this.timer = 0;
    this.nextSpawn = 1.5;
  }

  private spawnObstacle(): void {
    const obstacle = new Obstacle(this.SPAWN_X);
    this.obstacles.push(obstacle);
    this.view.addChild(obstacle.view);
  }
}

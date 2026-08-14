import { Graphics, Container } from "pixi.js";

export class Obstacle {
  readonly view: Container;
  private readonly WIDTH = 20;
  private readonly HEIGHT = 40;

  constructor(spawnX: number) {
    this.view = new Container();
    this.view.x = spawnX;
    this.view.y = 180;

    const body = new Graphics();
    body.rect(0, 0, this.WIDTH, this.HEIGHT);
    body.fill("#f5a623");
    this.view.addChild(body);
  }

  update(delta: number, speed: number): void {
    this.view.x -= speed * delta;
  }

  isOffScreen(): boolean {
    return this.view.x + 20 < 0;
  }

  getBounds() {
    return {
      x: this.view.x + 4,
      y: this.view.y + 4,
      width: this.WIDTH - 8,
      height: this.HEIGHT - 8,
    };
  }
}

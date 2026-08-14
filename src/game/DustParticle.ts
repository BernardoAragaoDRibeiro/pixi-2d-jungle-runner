import { Graphics } from "pixi.js";

export class DustParticle {
  readonly view: Graphics;
  private vx: number;
  private vy: number;
  private life: number;
  private maxLife: number;

  constructor(x: number, y: number) {
    this.view = new Graphics();
    this.view.circle(0, 0, 8);
    this.view.fill("#e0d6d8");
    this.view.x = x + (Math.random() * 40 - 20);
    this.view.y = y;

    this.vx = (Math.random() * 2 - 1) * 80;
    this.vy = -Math.random() * 80 - 60;
    this.life = 0;
    this.maxLife = 0.6 + Math.random() * 0.3;
  }

  update(delta: number): boolean {
    this.life += delta;
    this.view.x += this.vx * delta;
    this.view.y += this.vy * delta;
    this.vy += 80 * delta;
    this.view.alpha = 1 - this.life / this.maxLife;
    return this.life < this.maxLife;
  }
}

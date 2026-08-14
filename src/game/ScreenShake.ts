import { Container } from "pixi.js";

export class ScreenShake {
  private target: Container;
  private duration = 0;
  private intensity = 0;

  constructor(target: Container) {
    this.target = target;
  }

  trigger(intensity: number, duration: number): void {
    this.intensity = intensity;
    this.duration = duration;
  }

  update(delta: number): void {
    if (this.duration <= 0) {
      this.target.x = 0;
      this.target.y = 0;
      return;
    }

    this.duration -= delta;
    const amount = this.intensity * (this.duration > 0 ? 1 : 0);
    this.target.x = (Math.random() * 2 - 1) * amount;
    this.target.y = (Math.random() * 2 - 1) * amount;
  }
}

import { Container } from "pixi.js";
import { DustParticle } from "./DustParticle";

export class DustEmitter {
  readonly view: Container;
  private particles: DustParticle[] = [];

  constructor() {
    this.view = new Container();
  }

  emit(x: number, y: number): void {
    for (let i = 0; i < 10; i++) {
      const p = new DustParticle(x, y);
      this.particles.push(p);
      this.view.addChild(p.view);
    }
  }

  update(delta: number): void {
    this.particles = this.particles.filter((p) => {
      const alive = p.update(delta);
      if (!alive) this.view.removeChild(p.view);
      return alive;
    });
  }
}

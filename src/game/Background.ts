import { Graphics, Container } from "pixi.js";

interface Layer {
  container: Container;
  speed: number;
  blocks: Graphics[];
}

export class Background {
  readonly view: Container;
  private layers: Layer[];

  private readonly WIDTH = 800;
  private readonly HEIGHT = 220;

  constructor() {
    this.view = new Container();
    this.layers = [
      this.createLayer(6, 0.2, 60, 80, "#1a2a4a"),
      this.createLayer(10, 0.5, 30, 50, "#162040"),
    ];
  }

  private createLayer(
    count: number,
    speed: number,
    minH: number,
    maxH: number,
    color: string,
  ): Layer {
    const container = new Container();
    const blocks: Graphics[] = [];

    for (let i = 0; i < count; i++) {
      const h = minH + Math.random() * (maxH - minH);
      const w = 20 + Math.random() * 40;
      const x = Math.random() * this.WIDTH * 2;
      const y = this.HEIGHT - h;

      const block = new Graphics();
      block.rect(0, 0, w, h);
      block.fill(color);
      block.x = x;
      block.y = y;

      blocks.push(block);
      container.addChild(block);
    }

    this.view.addChild(container);
    return { container, speed, blocks };
  }

  update(delta: number, gameSpeed: number): void {
    for (const layer of this.layers) {
      for (const block of layer.blocks) {
        block.x -= gameSpeed * layer.speed * delta;

        if (block.x + block.width < 0) {
          block.x = this.WIDTH + Math.random() * 200;
        }
      }
    }
  }
}

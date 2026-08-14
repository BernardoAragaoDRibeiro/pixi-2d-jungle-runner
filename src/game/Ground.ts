import { Graphics, Container } from "pixi.js";

export class Ground {
  readonly view: Container;

  constructor(width: number) {
    this.view = new Container();

    const line = new Graphics();
    line.rect(0, 0, width, 4);
    line.fill("#e94560");

    const floor = new Graphics();
    floor.rect(0, 4, width, 76);
    floor.fill("#0f3460");

    this.view.addChild(line, floor);
    this.view.y = 220;
  }
}

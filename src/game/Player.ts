import { Graphics, Container } from "pixi.js";

export class Player {
  readonly view: Container;
  private body: Graphics;

  private readonly GROUND_Y = 220;
  private readonly GRAVITY = 1800;
  private readonly JUMP_FORCE = -650;

  private velocityY = 0;
  private isGrounded = true;

  private flashTimer = 0;
  private isFlashing = false;

  onLand?: () => void;

  constructor() {
    this.view = new Container();
    this.view.x = 120;
    this.view.y = this.GROUND_Y;

    this.body = new Graphics();
    this.body.rect(-20, -40, 40, 40);
    this.body.fill("#e94560");
    this.view.addChild(this.body);
  }

  jump(): void {
    if (!this.isGrounded) return;
    this.velocityY = this.JUMP_FORCE;
    this.isGrounded = false;
  }

  flash(): void {
    this.isFlashing = true;
    this.flashTimer = 0;
  }

  update(delta: number): void {
    if (!this.isGrounded) {
      this.velocityY += this.GRAVITY * delta;
      this.view.y += this.velocityY * delta;

      if (this.view.y >= this.GROUND_Y) {
        this.view.y = this.GROUND_Y;
        this.velocityY = 0;
        this.isGrounded = true;
        this.onLand?.();
      }
    }

    if (this.isFlashing) {
      this.flashTimer += delta;
      this.body.alpha = Math.sin(this.flashTimer * 40) > 0 ? 1 : 0.2;
      if (this.flashTimer >= 0.5) {
        this.isFlashing = false;
        this.body.alpha = 1;
      }
    }
  }

  getBounds() {
    return {
      x: this.view.x - 16,
      y: this.view.y - 36,
      width: 32,
      height: 36,
    };
  }
}

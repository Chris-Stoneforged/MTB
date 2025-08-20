import { type, Schema } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") playerName: String;
  @type("number") maxHealth: number;
  @type("number") currentHealth: number;

  constructor() {
    super();

    this.maxHealth = 10;
    this.currentHealth;
  }
}

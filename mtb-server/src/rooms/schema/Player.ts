import { type, Schema } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") player_name: String;
}

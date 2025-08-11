import { MapSchema, Schema, type } from "@colyseus/schema";
import { Player } from "./Player";

export class MatchRoomState extends Schema {
  @type({ map: Player }) players: MapSchema<Player> = new MapSchema<Player>();
}

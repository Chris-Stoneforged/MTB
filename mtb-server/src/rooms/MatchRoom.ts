import { Room, Client } from "@colyseus/core";
import { MatchRoomState } from "./schema/MatchRoomState";

export class MatchRoom extends Room<MatchRoomState> {
  maxClients = 4;
  state = new MatchRoomState();

  onCreate(options: any) {
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}

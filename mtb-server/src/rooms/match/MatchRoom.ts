import { Room, Client } from "@colyseus/core";
import { MatchRoomState } from "./schema/MatchRoomState";
import { Player } from "./schema/Player";

export class MatchRoom extends Room<MatchRoomState> {
  maxClients: number = 2;
  state: MatchRoomState = new MatchRoomState();

  turnOrder: string[];
  turnIndex: number = 0;
  readyClients: number = 0;

  onCreate(options: any) {
    this.onMessage("end_turn", this.onTurnEnded);
    this.onMessage("ready", this.onClientReady);
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new Player());
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  onClientReady = (client: Client) => {
    this.readyClients += 1;
    if (this.readyClients === this.maxClients) {
      this.startMatch();
    }
  };

  startMatch() {
    this.turnOrder = this.clients.map((client) => client.sessionId);
    this.turnIndex = Math.floor(Math.random() * this.clients.length);

    this.setTurn();
  }

  onTurnEnded = (client: Client, message: any) => {
    if (client.sessionId !== this.state.currentTurn) {
      client.error(401, "Cannot end turn on another player's turn.");
      return;
    }

    this.turnIndex += 1;
    if (this.turnIndex >= this.clients.length) {
      this.turnIndex = 0;
    }

    this.setTurn();
  };

  setTurn() {
    this.state.currentTurn = this.turnOrder[this.turnIndex];
    this.broadcast("turn_changed", { currentTurn: this.state.currentTurn });
  }
}

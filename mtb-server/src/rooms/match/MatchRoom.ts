import { Room, Client } from "@colyseus/core";
import { MatchRoomState } from "./schema/MatchRoomState";
import { Player } from "./schema/Player";

export class MatchRoom extends Room<MatchRoomState> {
  maxClients: number = 2;
  state: MatchRoomState = new MatchRoomState();

  turnOrder: string[];
  turnIndex: number = 0;

  onCreate(options: any) {
    this.onMessage("end_turn", this.onTurnEnded);

    let readyClients: number = 0;
    this.onMessage("ready", (client: Client) => {
      readyClients += 1;
      if (readyClients === this.maxClients) {
        this.startMatch();
      }
    });
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

  startMatch() {
    this.turnOrder = this.clients.map((client) => client.sessionId);
    this.turnIndex = Math.floor(Math.random() * this.clients.length);
    this.state.currentTurn = this.turnOrder[this.turnIndex];

    console.log(`Current turn is ${this.state.currentTurn}`);
    this.clients.getById(this.state.currentTurn).send("turn_started");
  }

  onTurnEnded(client: Client, message: any) {
    client.send("turn_ended");
    this.flipTurn();
    this.clients.getById(this.state.currentTurn).send("turn_started");
  }

  flipTurn() {
    this.turnIndex += 1;
    if (this.turnIndex >= this.clients.length) {
      this.turnIndex = 0;
    }

    this.state.currentTurn = this.turnOrder[this.turnIndex];
  }
}

import { Room, Client, Delayed } from "@colyseus/core";
import { MatchRoomState } from "./schema/MatchRoomState";
import { Player } from "./schema/Player";

type MatchSettings = {
  maxPlayers: number;
  turnDurationTImeoutMillis: number;
};

type UseActionMessageData = {
  actionId: string;
};

const settings: MatchSettings = {
  maxPlayers: 2,
  turnDurationTImeoutMillis: 10_000,
};

export class MatchRoom extends Room<MatchRoomState> {
  maxClients: number = settings.maxPlayers;
  state: MatchRoomState = new MatchRoomState();

  turnOrder: string[];
  turnIndex: number = 0;
  turnTimeout: Delayed;

  onCreate(options: any) {
    this.onMessage("end_turn", this.onTurnEnded);
    this.onMessage<UseActionMessageData>("use_action", this.onActionUsed);

    const readyClients: Set<string> = new Set();
    this.onMessage("ready", (client: Client) => {
      readyClients.add(client.sessionId);
      if (readyClients.size === this.maxClients) {
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

    this.setTurn();
  }

  incrementTurnIndex = () => {
    this.turnIndex += 1;
    if (this.turnIndex >= this.clients.length) {
      this.turnIndex = 0;
    }
  };

  onTurnEnded = (client: Client, message: any) => {
    if (client.sessionId !== this.state.currentTurn) {
      client.error(401, "Cannot end turn on another player's turn.");
      return;
    }

    this.turnTimeout.clear();

    this.incrementTurnIndex();
    this.setTurn();
  };

  setTurn() {
    this.state.currentTurn = this.turnOrder[this.turnIndex];
    this.turnTimeout = this.clock.setTimeout(
      this.onTurnExpired,
      settings.turnDurationTImeoutMillis
    );

    this.broadcast("turn_changed", { currentTurn: this.state.currentTurn });
  }

  onTurnExpired = () => {
    console.log("Current turn expired!");
    this.incrementTurnIndex();
    this.setTurn();
  };

  onActionUsed = (client: Client, { actionId }: UseActionMessageData) => {
    console.log(`Player ${client.sessionId} used action ${actionId}`);
  };
}

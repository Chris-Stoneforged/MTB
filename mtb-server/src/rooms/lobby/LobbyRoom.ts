import { Room, Client, matchMaker } from "@colyseus/core";

export class LobbyRoom extends Room {
  maxClients: number = 100;

  onCreate(options: any) {
    // Every second, evaluate matchmaking
    this.setSimulationInterval(() => this.evaluateMatchMaking(), 1000);

    // Once the client confirms they have consumed the seat reservation, remove them
    this.onMessage("confirm", (client: Client, message: any) => {
      client.leave();
    });
  }

  async evaluateMatchMaking() {
    // TODO: Properly implement...
    for (let i = 1; i < this.clients.length; i += 2) {
      const room = await matchMaker.createRoom("match_room", {});

      const seatReservations = await Promise.all(
        [this.clients[i], this.clients[i - 1]].map(async (client) => {
          return await matchMaker.reserveSeatFor(room, client, {});
        })
      );

      this.clients[i].send("seat", seatReservations[0]);
      this.clients[i - 1].send("seat", seatReservations[1]);
    }
  }
}

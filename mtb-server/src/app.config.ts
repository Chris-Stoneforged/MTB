import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { MatchRoom } from "./rooms/match/MatchRoom";
import { LobbyRoom } from "./rooms/lobby/LobbyRoom";

export default config({
  initializeGameServer: (gameServer) => {
    gameServer.define("match_room", MatchRoom);
    gameServer.define("lobby_room", LobbyRoom);
  },

  initializeExpress: (app) => {
    // TODO: Playground should only be used in production
    app.use("/", playground());
    app.use("/monitor", monitor());
  },
});

import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { MatchRoom } from "./rooms/MatchRoom";

export default config({
  initializeGameServer: (gameServer) => {
    gameServer.define("match_room", MatchRoom);
  },

  initializeExpress: (app) => {
    // TODO: Playground should only be used in production
    app.use("/", playground());
    app.use("/monitor", monitor());
  },
});

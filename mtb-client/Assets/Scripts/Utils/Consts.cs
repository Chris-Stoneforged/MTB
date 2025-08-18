namespace MTB.Game.Utils
{
    public static class ServerMessage
    {
        public const string TurnChanged = "turn_changed";
        public const string Seat = "seat";
    }

    public static class ClientMessage
    {
        public const string ConfirmSeat = "confirm";
        public const string Ready = "ready";
        public const string EndTurn = "end_turn";
    }

    public static class Room
    {
        public const string MatchRoom = "match_room";
        public const string LobbyRoom = "lobby_room";
    }
}
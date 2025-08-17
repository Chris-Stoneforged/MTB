using UnityEngine;
using Colyseus;
using MTB.Game.Schema;

namespace MTB.Game
{
    public class GameManager : MonoBehaviour
    {
        [SerializeField] private string _serverEndpoint;

        private ColyseusClient _client;
        private ColyseusRoom<NoState> _queueRoom;

        public async void Start()
        {
            _client = new ColyseusClient(_serverEndpoint);
            _queueRoom = await _client.JoinOrCreate("lobby_room");
            _queueRoom.OnMessage<ColyseusMatchMakeResponse>("seat", OnSeatReservationReceived);

            Debug.Log("Joined the queue!");
        }

        private async void OnSeatReservationReceived(ColyseusMatchMakeResponse reservation)
        {
            Debug.Log("Got seat");
            var matchRoom = await _client.ConsumeSeatReservation<MatchRoomState>(reservation);
            await _queueRoom.Send("confirm");
            Debug.Log("Joined the match!");
        }
    }
}

using UnityEngine;
using Colyseus;
using MTB.Game.Schema;
using MTB.Game.Utils;
using UnityEngine.SceneManagement;

namespace MTB.Game
{
    public class GameManager : MonoBehaviour
    {
        [SerializeField] private string _serverEndpoint;

        public static GameManager Instance;
        
        private ColyseusClient _client;
        private ColyseusRoom<NoState> _queueRoom;

        private void Start()
        {
            if (Instance != null)
            {
                Destroy(this);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public async void FindMatch()
        {
            _client = new ColyseusClient(_serverEndpoint);
            _queueRoom = await _client.JoinOrCreate(Room.LobbyRoom);
            _queueRoom.OnMessage<ColyseusMatchMakeResponse>(ServerMessage.Seat, OnSeatReservationReceived);

            Debug.Log("Joined the queue!");
        }

        public void LeaveQueue()
        {
            _queueRoom?.Leave();
        }

        private async void OnSeatReservationReceived(ColyseusMatchMakeResponse reservation)
        {
            var matchRoom = await _client.ConsumeSeatReservation<MatchRoomState>(reservation);
            await _queueRoom.Send(ClientMessage.ConfirmSeat);
            _queueRoom = null;
            OnJoinMatch(matchRoom);
        }

        private async void OnJoinMatch(ColyseusRoom<MatchRoomState> room)
        {
            Debug.Log("Joined the match!");
            await SceneManager.LoadSceneAsync("Match", LoadSceneMode.Single);
            MatchManager.Instance.OnMatchStarted(room);
        }
    }
}

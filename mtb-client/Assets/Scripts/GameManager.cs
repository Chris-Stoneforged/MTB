using UnityEngine;
using Colyseus;
using MTB.Game.Schema;

namespace MTB.Game
{
    public class GameManager : MonoBehaviour
    {
        [SerializeField] private string _serverEndpoint;

        public async void Start()
        {
            var client = new ColyseusClient(_serverEndpoint);
            var room = await client.JoinOrCreate<MatchRoomState>("match_room");
            
            Debug.Log("Joined the room!");
            room.OnError += RoomOnOnError;
        }

        private void RoomOnOnError(int code, string message)
        {
            Debug.LogError($"{code}: {message}");
        }
    }
}

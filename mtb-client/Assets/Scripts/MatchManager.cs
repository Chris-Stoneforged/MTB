using Colyseus;
using MTB.Game.MessageTypes;
using MTB.Game.Schema;
using UnityEngine;

public class MatchManager : MonoBehaviour
{
    public async void OnMatchStarted(ColyseusRoom<MatchRoomState> matchRoom)
    {
        matchRoom.OnMessage<EmptyMessage>("turn_started", _ =>
        {
            Debug.Log("Turn Started!");
        });

        await matchRoom.Send("ready");
    }
}

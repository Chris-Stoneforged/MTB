using System;
using Colyseus;
using MTB.Game.MessageTypes;
using MTB.Game.Schema;
using MTB.Game.Utils;
using UnityEngine;
using UnityEngine.Assertions;

public class MatchManager : MonoBehaviour
{
    public static event Action<string> TurnChanged;

    public static MatchManager Instance = null;
    
    private ColyseusRoom<MatchRoomState> _matchRoom;
    private string _currentTurn;

    public bool IsClientTurn => _currentTurn == _matchRoom.SessionId;

    private void Awake()
    {
        if (Instance != null)
        {
            Destroy(this);
        }

        Instance = this;
    }

    public async void OnMatchStarted(ColyseusRoom<MatchRoomState> matchRoom)
    {
        _matchRoom = matchRoom;
        _matchRoom.OnError += OnError;
        _matchRoom.OnMessage<TurnChangedMessage>(ServerMessage.TurnChanged, HandleTurnChanged);
        
        // We need to tell the server room that we've loaded in and ready for the match to start
        await _matchRoom.Send(ClientMessage.Ready);
    }

    private void OnError(int code, string message)
    {
        Debug.LogError($"{code} - {message}");
    }

    private void HandleTurnChanged(TurnChangedMessage message)
    {
        Assert.IsNotNull(message);
        
        _currentTurn = message.currentTurn;
        TurnChanged?.Invoke(message.currentTurn);
        
        if (message.currentTurn == _matchRoom.SessionId)
        {
            Debug.Log("It's your turn");
        }
    }

    public void EndTurn()
    {
        _matchRoom.Send(ClientMessage.EndTurn);
    }
}

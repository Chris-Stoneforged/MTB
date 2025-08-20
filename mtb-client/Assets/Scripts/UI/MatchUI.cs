using System;
using UnityEngine;
using UnityEngine.UI;

public class MatchUI : MonoBehaviour
{
    [SerializeField] private Button _endTurnButton;

    private void Start()
    {
        _endTurnButton.gameObject.SetActive(false);
        MatchManager.TurnChanged += OnTurnChanged;
    }

    private void OnDestroy()
    {
        MatchManager.TurnChanged -= OnTurnChanged;
    }

    private void OnTurnChanged(string currentTurn)
    { 
        _endTurnButton.gameObject.SetActive(MatchManager.Instance.IsClientTurn);
    }

    public void OnEndTurnClicked()
    {
        MatchManager.Instance.EndTurn();
        _endTurnButton.gameObject.SetActive(false);
    }
}

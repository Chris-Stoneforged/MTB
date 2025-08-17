using UnityEngine;
using UnityEngine.UI;

namespace MTB.Game.UI
{
    public class MainMenu : MonoBehaviour
    {
        [SerializeField] private Button _findMatchButton;
        [SerializeField] private Button _cancelButton;
        [SerializeField] private Text _searchingText;

        private void Start()
        {
            _searchingText.gameObject.SetActive(false);
            _cancelButton.gameObject.SetActive(false);
        }

        public void OnFindMatchClicked()
        {
            _findMatchButton.gameObject.SetActive(false);
            _cancelButton.gameObject.SetActive(true);
            _searchingText.gameObject.SetActive(true);
            
            GameManager.Instance.FindMatch();
        }

        public void OnCancelClicked()
        {
            _findMatchButton.gameObject.SetActive(true);
            _cancelButton.gameObject.SetActive(false);
            _searchingText.gameObject.SetActive(false);
            
            GameManager.Instance.LeaveQueue();
        }
    }
}
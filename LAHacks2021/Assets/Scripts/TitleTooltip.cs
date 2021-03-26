using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TitleTooltip : MonoBehaviour
{
    public Text text;
    public int positionPadding = 10;
    public int edgePadding = 20;

    private ArticleSphere lastSphere = null;

    public void UpdateTooltip(ArticleSphere article)
    {
        if (article != null)
        {
            if (article != lastSphere)
            {
                text.text = article.title;
                gameObject.SetActive(true);
            }
            AdjustTextPosition();
        }
        else
            gameObject.SetActive(false);

        lastSphere = article;
    }

    private void AdjustTextPosition()
    {
        if (text.rectTransform.rect.width + edgePadding + Input.mousePosition.x + positionPadding < Screen.width)
            transform.position = Input.mousePosition + new Vector3(positionPadding, 0);
        else
            transform.position = Input.mousePosition - new Vector3(text.rectTransform.rect.width + positionPadding, 0) ;
    }
}

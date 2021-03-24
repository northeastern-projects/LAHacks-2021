using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ArticleComponent : MonoBehaviour
{
    [SerializeField] private string title;
    [SerializeField] private string description;

    public void Initialize(Article article, float scaling)
    {
        title = article.title;
        description = article.description;
        transform.position = article.position * scaling;
        gameObject.name = article.title.Substring(0, 20);
    }
}

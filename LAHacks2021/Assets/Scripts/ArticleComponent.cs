using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ArticleComponent : MonoBehaviour
{
    [SerializeField] private string title;
    [SerializeField] private string description;

    private ArticleSphereConfig config;

    public void Initialize(Article article, float scaling, ArticleSphereConfig config)
    {
        title = article.title;
        description = article.description;
        transform.position = article.position * scaling;
        gameObject.name = article.title.Substring(0, 20);

        SetColor(config.sphereColor);
        transform.localScale = new Vector3(config.radius, config.radius, config.radius);

        this.config = config;
    }

    public void Highlight()
    {
        SetColor(config.highlightColor);
    }

    public void DefaultColor()
    {
        SetColor(config.sphereColor);
    }

    public void Select()
    {
        SetColor(config.selectedColor);
    }

    public void SetColor(Color color)
    {
        GetComponent<MeshRenderer>().material.color = color;
    }
}

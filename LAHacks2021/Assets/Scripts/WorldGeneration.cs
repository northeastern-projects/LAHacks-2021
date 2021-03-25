using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.Networking;

public class WorldGeneration : MonoBehaviour
{
    public ArticleComponent prefab;
    [Range(1f, 10f)]
    public float scaling;
    public ArticleSphereConfig sphereConfig;

    public new Camera camera;


    private List<ArticleComponent> articles;

    public void LoadFromJson(string json)
    {
        ArticleList list = JsonUtility.FromJson<ArticleList>(json);
        articles = new List<ArticleComponent>();

        foreach (Article article in list.Articles)
        {
            ArticleComponent obj = Instantiate(prefab);
            obj.Initialize(article, scaling, sphereConfig);
            obj.transform.SetParent(transform, true);
            articles.Add(obj);
        }
    }

    public void Update()
    {
        float scroll = Input.mouseScrollDelta.y;
        if (Mathf.Abs(scroll) > 0) 
        {
            float scale = Mathf.Pow(1.1f, scroll);
            ScaleArticlePositions(scale);
        }
    }

    private void ScaleArticlePositions(float scale)
    {   
        Vector3 anchor = camera.transform.position;
        foreach (ArticleComponent article in articles)
        {
            Vector3 delta = article.transform.position - anchor;
            delta *= scale;
            article.transform.position = delta + anchor;
        }
    }
}
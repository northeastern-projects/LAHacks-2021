﻿using System.Collections.Generic;
using UnityEngine;

public class WorldGeneration : MonoBehaviour
{
    public string path;
    public ArticleComponent prefab;
    [Range(1f, 10f)]
    public float scaling;

    public new Camera camera;

    private List<ArticleComponent> articles;

    private void Start()
    {
        TextAsset jsonFile = Resources.Load<TextAsset>(path);
        ArticleList list = JsonUtility.FromJson<ArticleList>(jsonFile.text);
        articles = new List<ArticleComponent>();

        foreach (Article article in list.Articles)
        {
            ArticleComponent obj = Instantiate(prefab);
            obj.Initialize(article, scaling);
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
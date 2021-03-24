using System.Collections.Generic;
using UnityEngine;

public class WorldGeneration
{
    public Article[] Articles { get; private set; }

    public WorldGeneration(string path)
    {
        TextAsset jsonFile = Resources.Load<TextAsset>(path);
        ArticleList list = JsonUtility.FromJson<ArticleList>(jsonFile.text);
        Articles = list.Articles;
    }
}
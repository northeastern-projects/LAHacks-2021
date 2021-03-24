using UnityEngine;
using System;

[Serializable]
public struct Article
{
    [SerializeField] public string title;
    [SerializeField] public string description;
    [SerializeField] public Vector3 position;
}

[Serializable]
public class ArticleList
{
    [SerializeField] public Article[] Articles;
}
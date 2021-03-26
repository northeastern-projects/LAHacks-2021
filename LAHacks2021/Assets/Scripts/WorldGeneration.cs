using System.Collections.Generic;
using UnityEngine;

public class WorldGeneration : MonoBehaviour
{
    public ArticleSphere prefab;
    [Range(1f, 10f)]
    public float scaling;
    public ArticleSphereConfig sphereConfig;

    public new Camera camera;

    private List<ArticleSphere> articles = new List<ArticleSphere>();

    public void LoadFromJson(string json)
    {
        ClearArticleSpheres();

        ArticleList list = JsonUtility.FromJson<ArticleList>(json);

        foreach (Article article in list.Articles)
        {
            ArticleSphere obj = Instantiate(prefab);
            obj.Initialize(article, scaling, sphereConfig);
            obj.transform.SetParent(transform, true);
            articles.Add(obj);
        }
    }

    private void ClearArticleSpheres()
    {
        foreach (ArticleSphere article in articles)
        {
            Destroy(article.gameObject);
        }
        articles = new List<ArticleSphere>();
    }
}
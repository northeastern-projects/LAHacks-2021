using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    public GameObject prefab;

    private void Start()
    {
        /*        Article[] articles = new Article[2];
                Article a1 = new Article
                {
                    name = "test Article1",
                    position = new Vector3(3f, 2f, 1f)
                };
                articles[0] = a1;
                articles[1] = a1;
                ArticleList list = new ArticleList
                {
                    Articles = articles
                };
                string json = JsonUtility.ToJson(list);
                Debug.Log(json);*/


        WorldGeneration world = new WorldGeneration("test");
        foreach (Article article in world.Articles)
        {
            GameObject obj = Instantiate(prefab);
            obj.transform.position = article.position;
            obj.name = article.name;
        }
    }
}

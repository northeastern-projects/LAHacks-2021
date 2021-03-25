using UnityEngine;

[CreateAssetMenu(fileName = "Article Sphere Config", menuName = "Scriptable Objects/Article Sphere Config", order= 1)]
public class ArticleSphereConfig : ScriptableObject
{
    public Color sphereColor;
    public Color highlightColor;
    public Color selectedColor;

    public float radius;
}

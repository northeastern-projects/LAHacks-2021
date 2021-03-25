using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System;
using System.IO;

public class ArticleDataLoader : MonoBehaviour
{
    public string path;
    public WorldGeneration generation;

    private bool isAssetRead = false;
    private string loadedJson = "";

    private void Start()
    {
        string assetPath = Application.streamingAssetsPath;
        Debug.Log(assetPath);
        bool isWebGl = assetPath.Contains("://") || assetPath.Contains(":///");
        if (isWebGl)
            StartCoroutine(SendRequest(Path.Combine(assetPath, path)));
        else // desktop app
            ReadDesktopData(Path.Combine(assetPath, path));
    }

    private void Update()
    {
        if (isAssetRead)
        {
            Debug.Log("JSON data successfully loaded");
            generation.LoadFromJson(loadedJson);
            Destroy(gameObject);
        }
    }

    private void ReadDesktopData(string fullPath)
    {
        try
        {
            loadedJson = File.ReadAllText(fullPath);
            isAssetRead = true;
        }
        catch (FileNotFoundException e)
        {
            Debug.LogError(e);
        }
    }

    private IEnumerator SendRequest(string url)
    {
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            yield return request.SendWebRequest();

            if (request.isNetworkError || request.isHttpError)
                HandleWebRequestFailure();
            else
            {
                loadedJson = request.downloadHandler.text;
                isAssetRead = true;
            }
        }
    }

    private void HandleWebRequestFailure()
    {
        Debug.LogError("Web Request Failure");
    }
}

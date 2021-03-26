using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    public float speed = 5;
    public float rotationSpeed = 3;
    public float inertia = 5;
    public float distance = 10f;

    public TitleTooltip tooltip;

    private ArticleSphere lastHover = null;
    private ArticleSphere selectedArticle = null;

    private bool isRotatingCamera = false;

    private Vector3 anchor = new Vector3(0, 0, 0);
    private Vector3 panVelocity;

    private void Start()
    {
        transform.LookAt(anchor);
    }

    private void Update()
    {
        ProcessUserInput();
        UpdatePosition();
    }

    private void ProcessUserInput()
    {
        if (Input.GetMouseButtonUp(0))
            isRotatingCamera = false;
        if (isRotatingCamera)
            RotateCamera();

        if (Input.GetMouseButton(1))
            AdjustPanVelocity();

        float scroll = Input.mouseScrollDelta.y;
        if (Mathf.Abs(scroll) > 0)
            AdjustDistance(scroll);

        ProcessSphereHighlighting();
    }

    private void RotateCamera()
    {
        transform.RotateAround(anchor, transform.up, Input.GetAxis("Mouse X") * rotationSpeed);
        transform.RotateAround(anchor, transform.right, -Input.GetAxis("Mouse Y") * rotationSpeed);
    }

    private void AdjustPanVelocity()
    {
        Vector3 v = transform.up * -Input.GetAxis("Mouse Y") + transform.right * -Input.GetAxis("Mouse X");
        v *= speed;
        panVelocity = v;
    }

    private void AdjustDistance(float scroll)
    {
        distance -= scroll;
        if (distance < 1f)
        {
            distance = 1f;
        }
    }

    private void ProcessSphereHighlighting()
    {
        ClearLastHoverHighlight();

        Ray screenRay = GetComponent<Camera>().ScreenPointToRay(Input.mousePosition);
        if (!isRotatingCamera && Physics.Raycast(screenRay, out RaycastHit hit))
        {
            ArticleSphere sphere = hit.transform.GetComponent<ArticleSphere>();

            tooltip.UpdateTooltip(sphere);

            if (Input.GetMouseButtonDown(0))
                ClickOnArticleSphere(sphere);
            else if (sphere != selectedArticle)
                HighlightSphere(sphere);
        }
        else if (Input.GetMouseButtonDown(0))
            isRotatingCamera = true;
        else
            tooltip.UpdateTooltip(null);
    }

    private void ClickOnArticleSphere(ArticleSphere sphere)
    {
        if (selectedArticle == sphere)
        {
            selectedArticle.Highlight();
            selectedArticle = null;
            return;
        }

        if (selectedArticle != null)
            selectedArticle.DefaultColor();
        
        selectedArticle = sphere;
        sphere.Select();
        anchor = sphere.transform.position;
        distance = 5f;

        StopCoroutine("LookAtAnchorCoroutine");
        StartCoroutine(LookAtAnchorCoroutine(2f));
    }

    private IEnumerator LookAtAnchorCoroutine(float duration)
    {
        float time = 0f;
        while (time < duration)
        {
            Quaternion rotation = Quaternion.LookRotation(anchor - transform.position, transform.up);
            transform.rotation = Quaternion.Slerp(transform.rotation, rotation, rotationSpeed * Time.deltaTime);
            time += Time.deltaTime;
            yield return null;
        }
        yield break;
    }

    private void HighlightSphere(ArticleSphere sphere)
    {
        sphere.Highlight();
        lastHover = sphere;
    }

    private void ClearLastHoverHighlight()
    {
        if (lastHover != null)
        {
            lastHover.DefaultColor();
            lastHover = null;
        }
    }

    private void UpdatePosition()
    {
        PanCamera();
        UpdateDistace();
    }

    private void PanCamera()
    {
        Vector3 delta = panVelocity * Time.deltaTime;

        panVelocity -= delta * inertia;
        transform.position += delta;
        anchor += delta;
    }

    private void UpdateDistace()
    {
        float dist = Vector3.Distance(transform.position, anchor);
        float adjustment = dist - distance;
        if (Mathf.Abs(adjustment) > 0.1)
        {
            Vector3 direction = Vector3.Normalize(anchor - transform.position);
            transform.position += direction * speed * adjustment * Time.deltaTime;
        }
    }
}

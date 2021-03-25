using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    public float speed;
    public float sprintSpeed;
    public float horizonalRotationSpeed;
    public float verticalRotationSpeed;

    private ArticleComponent lastHover = null;
    private ArticleComponent selectedArticle = null;

    private void Update()
    {
        if (Input.GetMouseButton(1))
            RotateCamera();

        MoveCamera();
        ProcessSphereHighlighting();
    }

    private void ProcessSphereHighlighting()
    {
        ClearLastHoverHighlight();

        Ray screenRay = GetComponent<Camera>().ScreenPointToRay(Input.mousePosition);
        if (Physics.Raycast(screenRay, out RaycastHit hit))
        {
            ArticleComponent sphere = hit.transform.GetComponent<ArticleComponent>();

            if (Input.GetMouseButtonDown(0))
                ClickOnArticleSphere(sphere);
            else if (sphere != selectedArticle)
                HighlightSphere(sphere);
        }
    }

    private void ClickOnArticleSphere(ArticleComponent sphere)
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
    }

    private void HighlightSphere(ArticleComponent sphere)
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

    private void MoveCamera()
    {
        float sprint = 1;
        if (Input.GetKey(KeyCode.LeftShift))
            sprint = sprintSpeed;

        MoveInDirection(transform.forward, Input.GetAxis("Vertical"), sprint);
        MoveInDirection(transform.right, Input.GetAxis("Horizontal"), sprint);
        MoveInDirection(transform.up, GetUpwardsMotion(), sprint);
    }

    private float GetUpwardsMotion()
    {
        float upwards = 0;
        if (Input.GetKey(KeyCode.Space))
            upwards = 1f;
        else if (Input.GetKey(KeyCode.LeftControl) || Input.GetKey(KeyCode.LeftCommand))
            upwards = -1f;
        return upwards;
    }

    private void RotateCamera()
    {
        float x = transform.eulerAngles.x + Input.GetAxis("Mouse Y") * -verticalRotationSpeed;
        float y = transform.eulerAngles.y + Input.GetAxis("Mouse X") * horizonalRotationSpeed;
        
        x = BoundXAxisRotation(x);
        
        transform.rotation = Quaternion.Euler(x, y, 0);
    }

    private float BoundXAxisRotation(float x)
    {
        if (x > 90 && x < 180)
            x = 90;
        else if (x < 270 && x >= 180)
            x = 270;
        return x;
    }

    private void MoveInDirection(Vector3 direction, float forward, float sprint)
    {
        transform.position += direction * Time.deltaTime * speed * forward * sprint;
    }
}

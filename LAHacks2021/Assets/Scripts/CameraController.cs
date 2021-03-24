﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    public float speed;
    public float horizonalRotationSpeed;
    public float verticalRotationSpeed;

    private void Update()
    {
        MoveForward(Input.GetAxis("Vertical"));
        MoveSideways(Input.GetAxis("Horizontal"));

        if (Input.GetMouseButton(1))
            MoveCamera();
    }

    private void MoveCamera()
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

    private void MoveForward(float forward)
    {
        transform.position += transform.forward * Time.deltaTime * speed * forward;
    }

    private void MoveSideways(float sideways)
    {
        transform.position += transform.right * Time.deltaTime * speed * sideways;
    }
}
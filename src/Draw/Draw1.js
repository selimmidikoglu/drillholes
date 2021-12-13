import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import "./Draw.css"
import a from "../scripts/data";
import { MeshBasicMaterial } from "three";
import { _FS, _VS } from "./glsl/tubeShader";

function Draw1() {
    const mountRef = useRef(null);
    var clock = new THREE.Clock();
    var stats =  new Stats();
    useEffect(() => {

        var scene = new THREE.Scene();
        var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const geometry = new THREE.PlaneGeometry(2, 2);

        const uniforms = {
            u_time: {value: 0.0},
            u_mouse: { value: {x: 0.0, y: 0.0}},
            u_resolution: {value: {x: 0.0, y: 0.0}},
            u_color: { value: new THREE.Color(0xFF0000)}
        }

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: _VS,
            fragmentShader: _FS
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        camera.position.z = 1;

        onWindowResize();
        if('ontouchstart' in window) {
            document.addEventListener('touchmove', move);
        }else{
            window.addEventListener('resize', onWindowResize, false);
            document.addEventListener('mousedown', move);
        }
        window.addEventListener('resize', onWindowResize, false);

        animate();

        function move(evt) {
            uniforms.u_mouse.value.x = (evt.touches) ? evt.touches[0].clientX: evt.clientX;
            uniforms.u_mouse.value.y = (evt.touches) ? evt.touches[0].clientY: evt.clientY;
        }
        
        function animate() {
            requestAnimationFrame(animate);
            uniforms.u_time.value += clock.getDelta();
            //console.log(uniforms.u_time.value, Math.sin(uniforms.u_time.value));
            stats.update();
            renderer.render(scene, camera);
        }
        function onWindowResize(event) {
            const aspectRatio = window.innerWidth / window.innerHeight;
            let width, height;
            if (aspectRatio >= 1) {
                width = 1;
                height = (window.innerHeight / window.innerWidth) * width;
            } else {
                width = aspectRatio;
                height = 1;
            }
            camera.left = -width;
            camera.right = width;
            camera.top = height;
            camera.bottom = -height;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            if(uniforms.u_resolution !== undefined) {
                uniforms.u_resolution.value.x = window.innerWidth;
                uniforms.u_resolution.value.y = window.innerHeight;
            }
        }

        
        mountRef.current.appendChild(renderer.domElement);
    }, []);
    return (
        <div className="main-container">
            <div className="canvas" ref={mountRef}>
            </div>
        </div>
    )

}

export default Draw1;
import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { Color } from "three";
import { GridHelper } from "three";

import Stats from 'three/examples/jsm/libs/stats.module.js';
import whichColor from "../scripts/helpers/colors";
import CameraControl from './CameraControl'
import a from "./data";


export default class Draw extends Component {
    componentDidMount() {
        var stats;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight);

        this.mount.appendChild(renderer.domElement);

        camera.position.setZ(400);
        camera.position.setY(-100);


        // const raycaster = new THREE.Raycaster();
        // const mouse = new THREE.Vector2(1, 1);


        scene.background = new THREE.Color(0xfffff0);
        const axesHelper = new THREE.AxesHelper(500)
        const gridHelper = new THREE.GridHelper(1000, 1000)


        for (let i = 0; i < a.length - 1; i++) {
            // if (a[i].x > 0)
            //     console.log(a[i]);
            var closedSpline = new THREE.CatmullRomCurve3([
                new THREE.Vector3(a[i].y, a[i].z, a[i].x),
                new THREE.Vector3(a[i + 1].y, a[i + 1].z, a[i + 1].x)
            ]);
            const geometry = new THREE.TubeGeometry(closedSpline, 20, 2, 8, false);
            console.log(typeof whichColor(a[i].rmr))
            const material = new THREE.MeshPhongMaterial({
                color: parseInt(whichColor(a[i].rmr)),
                polygonOffset: true,
                polygonOffsetFactor: 1, // positive value pushes polygon further away
                polygonOffsetUnits: 1,
                wireframe: false
            });
            const meshasd = new THREE.Mesh(geometry, material);
            scene.add(meshasd);
            var geo = new THREE.EdgesGeometry(meshasd.geometry); // or WireframeGeometry
            var mat = new THREE.LineBasicMaterial({ color: 0xffffff });
            var wireframe = new THREE.LineSegments(geo, mat);
            meshasd.add(wireframe);

        }
        //const controls = new OrbitControls( camera, renderer.domElement );

        var light = new THREE.AmbientLight();
        scene.add(light)
        stats = new Stats();
        document.body.appendChild(stats.dom);


        this.cameraControl = new CameraControl(renderer, camera, () => {
            // you might want to rerender on camera update if you are not rerendering all the time
            window.requestAnimationFrame(() => renderer.render(scene, camera))
        })
        var animate = function () {
            requestAnimationFrame(animate);
            // raycaster.setFromCamera(mouse, camera);

            // calculate objects intersecting the picking ray
            // const intersects = raycaster.intersectObjects(scene.children);
            // var choosen ; 
            // for (let i = 0; i < intersects.length; i++) {

            //     intersects[i].object.material.color.set(0xff0000);

            // }
            //
            renderer.render(scene, camera);

            stats.update();
        }
        animate();


        console.log("Scene polycount:", renderer.info.render.triangles)
        console.log("Active Drawcalls:", renderer.info.render.calls)
        console.log("Textures in Memory", renderer.info.memory.textures)
        console.log("Geometries in Memory", renderer.info.memory.geometries)
    }
    render() {
        return (
            <>
                <div className="canvas" ref={ref => (this.mount = ref)} />

            </>
        )
    }
}





class CustomSinCurve extends THREE.Curve {

    constructor(scale = 1) {

        super();

        this.scale = scale;

    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {

        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;

        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);

    }

}
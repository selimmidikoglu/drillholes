import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import whichColor from "../scripts/helpers/colors";
import a from "../scripts/data";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import "./Draw.css"

var drillholesNames = [];
for (let i = 0; i < a.length; i++) {
    if (!drillholesNames.includes(a[i]["HOLE_NUMBER"])) {
        drillholesNames.push(a[i]["HOLE_NUMBER"])
        console.log(drillholesNames)
    }
}

function Draw() {
    const mountRef = useRef(null);
    const [choosenDrillPart, setChoosenDrillPart] = useState()
    const [rmrValue, setrmrValue] = useState(0)
    var scene = new THREE.Scene();
    useEffect(() => {

        var stats;
        var selectedObject;
        var prevColor = "";
        var choosenName = "";

        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 7000);
        var renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight);

        mountRef.current.appendChild(renderer.domElement);

        camera.position.setZ(400);
        camera.position.setY(-100);
        scene.background = new THREE.Color(0xffffff);

        // add tubes one by one
        for (let i = 0; i < a.length - 1; i++) {

            if (a[i]["HOLE_NUMBER"] === a[i + 1]["HOLE_NUMBER"]) {
                var closedSpline = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(a[i].y, a[i].z, a[i].x),
                    new THREE.Vector3(a[i + 1].y, a[i + 1].z, a[i + 1].x)
                ]);
                var geometry = new THREE.TubeGeometry(closedSpline, 20, 5, 12, true);
                if (a[i].rmr > 1)
                    console.log(a[i].rmr)
                var material = new THREE.MeshLambertMaterial({
                    color: parseInt(whichColor(a[i].rmr)),
                });
                var meshasd = new THREE.Mesh(geometry, material);
                meshasd.name = `tube.${i}`
                meshasd.userData = a[i];
                scene.add(meshasd);

            }

        }



        var light = new THREE.AmbientLight();
        scene.add(light)
        stats = new Stats();
        document.body.appendChild(stats.dom);

        renderer.domElement.addEventListener("click", onclick, false);
        window.addEventListener('mousemove', onMouseMove, false);

        const raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        function onMouseMove(event) {

            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        }

        const controls = new OrbitControls(camera, renderer.domElement);

        function onclick(event) {
            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) {
                selectedObject = intersects[0];
                console.log(prevColor)
                if (prevColor === "") {
                    setChoosenDrillPart(selectedObject); // Select the clicked tube
                    setrmrValue(selectedObject.object.userData.rmr)
                    prevColor = new THREE.Color(selectedObject.object.material.color) // get the color of this tube
                    choosenName = selectedObject.object.name; // geth the name of the tube
                    selectedObject.object.material.color = new THREE.Color(0xff0000) // After saving previous color set new color to red of tube
                }
                else {
                    // If there is one previous tube choosen than change its color to previous color
                    // Set new choosen tube
                    setChoosenDrillPart(selectedObject);
                    setrmrValue(selectedObject.object.userData.rmr)
                    scene.getObjectByName(choosenName).material.color = prevColor;

                    // Update previous color variable to new chosen tube's color
                    prevColor = new THREE.Color(selectedObject.object.material.color);
                    choosenName = selectedObject.object.name; // geth the name of the tube
                    /* 
                     Prev color saved and clicked tube saved to state.
                     Now change the choosen tube color to red
                    */
                    selectedObject.object.material.color = new THREE.Color(0xff0000);

                }

                intersects = null;

            }
        }

        var animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            controls.update()
            stats.update();

        }
        animate();


        console.log("Scene polycount:", renderer.info.render.triangles)
        console.log("Active Drawcalls:", renderer.info.render.calls)
        console.log("Textures in Memory", renderer.info.memory.textures)
        console.log("Geometries in Memory", renderer.info.memory.geometries)

        //return () => holderMount.removeChild(renderer.domElement);
    }, []);


    const setNewPositions = (axis, choosenTube, e) => {
        if (axis === "X") {
            choosenTube.object.position.setY(e.target.value);
        }
        else if (axis === "Y") {
            choosenTube.object.position.setZ(e.target.value);
        }
        else if (axis === "Z") {
            choosenTube.object.position.setX(e.target.value);
        }
        else if (axis === "RMR") {
            choosenTube.object.material.color = new THREE.Color(parseInt(whichColor(e.target.value)));
            choosenTube.object.userData.rmr = e.target.value
            setrmrValue(e.target.value)
            console.log("2.", choosenTube.object.userData.rmr)

        }
    }
    return (
        <div className="main-container">
            <div className="info-window">

                {choosenDrillPart && Object.keys(choosenDrillPart).length > 0 && Object.keys(choosenDrillPart.object.userData).map(el =>
                (
                    <div key={el} className="basic_column" >
                        <span>{el}</span>
                        <span>{choosenDrillPart.object.userData[el]}</span>
                    </div>


                )
                )}
                {choosenDrillPart && (
                    <div className="attribute-changer-window">
                        <span>X</span><input type="number" onChangeCapture={e => setNewPositions("X", choosenDrillPart, e)}></input><br />
                        <span>Y</span><input type="number" onChange={e => setNewPositions("Y", choosenDrillPart, e)}></input><br />
                        <span>Z</span><input type="number" onChange={e => setNewPositions("Z", choosenDrillPart, e)}></input><br />
                        <span>RMR</span><input type="range" defaultValue={choosenDrillPart.object.userData.rmr} min="0" max="1" step="0.001" onChange={e => setNewPositions("RMR", choosenDrillPart, e)} /><br />
                        <span>{rmrValue} </span>
                    </div>
                )}
            </div>
            <div className="canvas" ref={mountRef}>

            </div>

        </div>
    )

}

export default Draw;
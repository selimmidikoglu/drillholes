import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import whichColor from "../scripts/helpers/colors";
import a from "../scripts/data";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import "./Draw.css"

var drill_size = 0;
var drillholesNames = [];
for (let i = 0; i < a.length; i++) {
    if (!drillholesNames.includes(a[i]["HOLE_NUMBER"])) {
        drillholesNames.push(a[i]["HOLE_NUMBER"])
        console.log(drillholesNames)
    }
}
var _VS = `
varying vec3 v_position;
void main() {
    v_position = position;
    gl_Position =  projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
}
`;

function Draw2() {
    const mountRef = useRef(null);
    var scene = new THREE.Scene();

    useEffect(() => {

        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 7000);
        var renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        camera.position.setZ(200);
        scene.background = new THREE.Color(0xffffff);

        function addDrill(drills, pts, colors) {
            //var drills1 = [new THREE.Vector3(3, 4, 10), new THREE.Vector3(8, 7, 10)];
            var closedSpline = new THREE.CatmullRomCurve3(drills, false);
            var tubeGeometry = new THREE.TubeBufferGeometry(closedSpline, 4, 5, 12, true);
            tubeGeometry.name = "Silindir"
            console.log(tubeGeometry);
            //vertices.map(vertice => console.log(vertice));
            var _FS = `
                #define DRILL_SIZE `+ single_drill.length + `
                #define COLORS_SIZE `+ colors.length + `
                varying vec3 v_position;
                uniform vec3 drills[DRILL_SIZE];
                uniform vec3 colors[COLORS_SIZE];
                uniform float radiusCurrent; 
                vec4 asd(vec3 v_position) {
                    for(int i= 0; i< DRILL_SIZE ; ++i) {
                        float x0 = drills[i].x;
                        floatyMax = drills[i].y;
                        float z0 = drills[i].z;

                        float x1 = drills[i+1].x;
                        float y1 = drills[i+1].y;
                        float z1 = drills[i+1].z;

                        //
                        
                        float sinB = (x0-x1)/sqrt(pow(y0-y1,2.0)+pow(x0-x1,2.0));
                        float cosB = (y0-y1)/sqrt(pow(y0-y1,2.0)+pow(x0-x1,2.0));

                        float rightX = x0 + radiusCurrent * cosB;
                        float leftX = x1 - radiusCurrent * cosB;

                        float topY =  y0 + radiusCurrent * sinB;
                        float bottomY =  y1 - radiusCurrent * sinB;

                        float xInside = step(v_position.x, rightX) * step(leftX, v_position.x);
                        float yInside = step(v_position.y, topY) * step(bottomY, v_position.y);

                        float result = xInside * yInside;

                        if(result == 1.0) {
                            return vec4(1.0,1.0,0.0,1.0);
                        }
                        else {
                            return vec4(1.0,0.0,1.0,1.0);
                        }
                    }
                }
                void main (void)
                {
                gl_FragColor = asd(v_position);
                }
                `;
            console.log(drills);
            var shaderMaterialTube = new THREE.ShaderMaterial({
                uniforms: {
                    drills: {
                        value: drills
                    },
                    colors: {
                        value: colors,
                    },
                    radiusCurrent: {
                        value: 5.00
                    }
                },
                vertexShader: _VS,
                fragmentShader: _FS,
                wireframe: false,

            })

            var tubeMesh = new THREE.Mesh(tubeGeometry, shaderMaterialTube);
            scene.add(tubeMesh);

        }
        var single_drill = [];
        var pts = [];
        var tubesColors = {}
        var colors = [];
        var tubeName = "";
        var tubes = {}
        var newVertex;
        for (let i = 0; i < a.length; i++) {
            if ((a[i] && a[i + 1]) && (a[i]["HOLE_NUMBER"] === a[i + 1]["HOLE_NUMBER"])) {
                newVertex = new THREE.Vector3(a[i].y, a[i].z, a[i].x)
                pts.push(newVertex);
                colors.push(new THREE.Color(parseInt(whichColor(a[i].rmr))));
            }
            else if ((a[i] && a[i + 1]) && (a[i]["HOLE_NUMBER"] !== a[i + 1]["HOLE_NUMBER"])) {
                newVertex = new THREE.Vector3(a[i].y, a[i].z, a[i].x)
                pts.push(newVertex);
                tubes[a[i]["HOLE_NUMBER"]] = pts;
                tubesColors[a[i]["HOLE_NUMBER"]] = colors;
                pts = [];
                colors = [];

            }
            else {
                newVertex = new THREE.Vector3(a[i].y, a[i].z, a[i].x)
                pts.push(newVertex);
                tubes[a[i]["HOLE_NUMBER"]] = pts;
                tubesColors[a[i]["HOLE_NUMBER"]] = colors;
                pts = [];
                colors = [];
            }

        }
        console.log(tubesColors);
        console.log(tubes);

        var radialSegments = 9;
        var newColors = []
        var path = new THREE.CatmullRomCurve3(tubes[Object.keys(tubes)[0]], false);
        var tubeGeometry = new THREE.TubeBufferGeometry(path, 15, 5, radialSegments, true);
        var drills = tubes[Object.keys(tubes)[0]];
        var colors = tubesColors[Object.keys(tubesColors)[0]];
        // console.log(tubesColors[Object.keys(tubesColors)[0]][0].r)
        // var newColors = [];
        // var segmentNumber = tubes[Object.keys(tubes)[0]].length;
        // console.log(segmentNumber);
        // var segmentVerticesCount = tubeGeometry.attributes.position.count / (segmentNumber-1);
        // for (let i = 0; i < segmentNumber-1; i++) {
        //     for (let j = 0; j < segmentVerticesCount; j++) {
        //         const el = tubesColors[Object.keys(tubesColors)[0]][i];
        //         //console.log(el);
        //         newColors.push(el.r,el.g,el.b);
        //     }
            
        // }
        var _FS = `
        #define DRILL_SIZE `+ drills.length + `
        #define COLORS_SIZE `+ colors.length + `
        varying vec3 v_position;
        uniform vec3 drills[DRILL_SIZE];
        uniform vec3 colors[COLORS_SIZE];
        uniform float radiusCurrent; 
        vec4 asd(vec3 v_position) {
            for(int i= 0; i< DRILL_SIZE ; ++i) {
                float x0 = drills[i].x;
                float y0 = drills[i].y;
                float z0 = drills[i].z;

                float x1 = drills[i+1].x;
                float y1 = drills[i+1].y;
                float z1 = drills[i+1].z;

                float xMin = 0.0;
                float yMin = 0.0;
                float zMin = 0.0;
                float xMax = 0.0;
                float yMax = 0.0;
                float zMax = 0.0;
                if(x0 >= x1){
                    xMax = x0;
                    xMin = x1;
                }
                else{
                    xMax = x1;
                    xMin = x0;
                }
                if(y0 >= y1){
                    yMax = y0;
                    yMin = y1;
                }
                else{
                    yMax = y1;
                    yMin = y0;
                }
                if(z0 >= z1){
                    zMax = z0;
                    zMin = z1;
                }
                else{
                    zMax = z1;
                    zMin = z0;
                }
                float sinBXY = (xMax-xMin)/sqrt(pow(yMax-yMin,2.0)+pow(xMax-xMin,2.0));
                float cosBXY = (yMax-yMin)/sqrt(pow(yMax-yMin,2.0)+pow(xMax-xMin,2.0));

                float sinBXZ = (xMax-xMin)/sqrt(pow(xMax-xMin),2.0+pow(zMax-zMin),2.0);
                float cosBXZ = (zMax-zMin)/sqrt(pow(xMax-xMin),2.0+pow(zMax-zMin),2.0);

                float sinBYZ = (yMax-yMin)/sqrt(pow(yMax-yMin),2.0+pow(zMax-zMin),2.0);
                float cosBYZ = (zMax-zMin)/sqrt(pow(yMax-yMin),2.0+pow(zMax-zMin),2.0);

                float rightXY = xMax + radiusCurrent * cosBXY;
                float leftXY = xMin - radiusCurrent * cosBXY;

                float inYX =  yMax + radiusCurrent * sinBXY;
                float outYX =  yMin - radiusCurrent * sinBXY;

                float rightXZ = xMax + radiusCurrent * cosBXZ;
                float leftXZ = xMin - radiusCurrent * cosBXZ;

                float topZX = zMax + radiusCurrent * sinBXZ;
                float bottomZX = zMin - radiusCurrent * sinBXZ;

                float inYZ = yMax + radiusCurrent * cosBYZ;
                float outYZ = yMin - radiusCurrent * cosBYZ;

                float topZY = zMax + radiusCurrent * sinBYZ;
                float bottomZY = zMin - radiusCurrent * sinBYZ;
                
                // XY check on elevated cylinder if between range
                bool xyInside = (v_position.x <= rightXY) && (leftXY <=  v_position.x);
                bool yxInside = (v_position.y <= inYX) && (outYX <= v_position.y);
                // ZX
                bool xzInside = (v_position.x <= rightXZ) && (leftXZ <= v_position.x)
                bool zxInside  = (v_position.z <= topZX) && (bottomZX <= v_position.y);
                // YZ
                bool yzInside = (v_position.y <= inYZ) && (outYZ <= v_position.y);
                bool zyInside = (v_position.z <= topZY) && (bottomZY <= v_position.z);

                bool result = xyInside && yxInside && xzInside && zxInside && yzInside && zyInside ;

                if(result) {
                    return vec4(colors[i],1.0);
                }
                
            }
        }
        void main (void)
        {
        gl_FragColor = asd(v_position);
        }
        `;
        var shaderMaterialTube = new THREE.ShaderMaterial({
            uniforms: {
                drills: {
                    value: drills
                },
                colors: {
                    value: colors,
                },
                radiusCurrent: {
                    value: 5.00
                }
            },
            vertexShader: _VS,
            fragmentShader: _FS,
            wireframe: false,

        })
        tubeGeometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(newColors), 3));
        //var material = new THREE.MeshPhysicalMaterial({ wireframe: false, vertexColors: THREE.VertexColors });
        var material = new THREE.MeshBasicMaterial({ wireframe: false});
        var mesh = new THREE.Mesh(tubeGeometry, shaderMaterialTube);
        console.log(mesh);
        scene.add(mesh);





        var light = new THREE.AmbientLight();
        scene.add(light);



        const controls = new OrbitControls(camera, renderer.domElement);

        var animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            controls.update()

        }
        animate();


        console.log("Scene polycount:", renderer.info.render.triangles)
        console.log("Active Drawcalls:", renderer.info.render.calls)
        console.log("Textures in Memory", renderer.info.memory.textures)
        console.log("Geometries in Memory", renderer.info.memory.geometries)

        //return () => holderMount.removeChild(renderer.domElement);
    }, []);



    return (
        <div className="main-container">
            <div className="canvas" ref={mountRef}>

            </div>

        </div>
    )

}

export default Draw2;
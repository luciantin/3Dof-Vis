import * as THREE from '../node_modules/three/build/three.module.js';
import { GeometryUtils } from '../node_modules/three/examples/jsm/utils/GeometryUtils.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({canvas: document.getElementById("Visualizer-O-Matic-9000")});


var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({
    color: 0xf0ff0f
});

var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 4; 

const canvas = document.getElementById("Visualizer-O-Matic-9000");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();



function resizeCanvasToDisplaySize() {
    // look up the size the canvas is being displayed

    const canvas = document.getElementById("Visualizer-O-Matic-9000");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}


function animate() {

    // resizeCanvasToDisplaySize();

    requestAnimationFrame(animate);
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;

    renderer.render(scene, camera);
}

animate();
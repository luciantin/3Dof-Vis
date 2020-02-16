import * as THREE from '../node_modules/three/build/three.module.js';

import { GeometryUtils } from '../node_modules/three/examples/jsm/utils/GeometryUtils.js';

THREE.Cache.enabled = true;

var container;

var camera, cameraTarget
var scene, renderer;

var group, textMesh1, textMesh2, textGeo, materials;

// var firstLetter = true;

var text = "NOP",

    height = 20,
    size = 70,
    hover = 30,

    curveSegments = 4,

    bevelThickness = 2,
    bevelSize = 1.5,
    bevelEnabled = true,

    font = undefined,

    fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
    fontWeight = "bold"; // normal bold

var mirror = true;

var fontMap = {

    "helvetiker": 0,
    "optimer": 1,
    "gentilis": 2,
    "droid/droid_sans": 3,
    "droid/droid_serif": 4

};

var weightMap = {

    "regular": 0,
    "bold": 1

};

 

init();



function init() {

    container = document.createElement('div');
    document.body.appendChild(container);


    //  scene = new THREE.Scene();
    //  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // CAMERA

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.set(0, 400, 700);

    // camera.position.z = 4; 

    cameraTarget = new THREE.Vector3(0, 150, 0);

    // SCENE

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 250, 1400);

    // LIGHTS

    var dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
    dirLight.position.set(0, 0, 1).normalize();
    scene.add(dirLight);

    var pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(0, 100, 90);
    scene.add(pointLight);

    var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 10000, 10000 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
    );
    plane.position.y = 0;
    plane.rotation.x = - Math.PI / 2;
    scene.add( plane );

    // Get text from hash

    var geometry = new THREE.BoxGeometry(100,100,100);
    var material = new THREE.MeshBasicMaterial({
        color: 0xf0ff0f
    });
    
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);


    text = 'Bravo';


    materials = [
        new THREE.MeshPhongMaterial({
            color: 0xf55fff,
            flatShading: false
        }), // front
        new THREE.MeshPhongMaterial({
            color: 0xf55ff5
        }) // side
    ];

    group = new THREE.Group();
    group.position.y = 0;

    scene.add(group);
    

    var plane2 = new THREE.Plane( new THREE.Vector3( 1, 1, 0.2 ), 3 );
    var helper = new THREE.PlaneHelper( plane2, 1, 0xffff00 );
    scene.add( helper );

    loadFont();

    renderer = new THREE.WebGLRenderer({canvas: document.getElementById("Visualizer-O-Matic-9000")});
    const canvas = document.getElementById("Visualizer-O-Matic-9000");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

}


function loadFont() {
    var loader = new THREE.FontLoader();
    loader.load('node_modules/three/examples/fonts/' + fontName + '_' + fontWeight + '.typeface.json', function (response) {
        font = response;
        createText();
    });
}

function createText() {

    textGeo = new THREE.TextGeometry(text, {

        font: font,

        size: size,
        height: height,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled

    });

    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();


    var centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

    textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);

    textMesh1 = new THREE.Mesh(textGeo, materials);
    textMesh2 = new THREE.Mesh(textGeo, materials);

    textMesh1.position.x = 0;
    textMesh1.position.y = 0;
    textMesh1.position.z = 0;
    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = 0;

    group.add(textMesh1);

}



function animate() {
    requestAnimationFrame(animate);

    camera.lookAt(cameraTarget); 

    // renderer.clear();

    renderer.render(scene, camera);
}


animate();


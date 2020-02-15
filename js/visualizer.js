// Imports

import * as THREE from '../node_modules/three/build/three.module.js';
import { GeometryUtils } from '../node_modules/three/examples/jsm/utils/GeometryUtils.js';

// textMesh1; 

THREE.Cache.enabled = true;


let cameraTarget = new THREE.Vector3(0, 150, 0);

// Fontzz

let CurrentFont = {
    font: undefined,
    height: 20,
    size: 70,
    hover: 30,
    curveSegments: 4,
    bevelThickness: 2,
    bevelSize: 1.5,
    weightMapValue: 0,
    fontMapValue: 0,
    bevelEnabled: true,
    fontLoaded: false,
    weightMap: ["regular", "bold"],
    fontMap: [ "helvetiker","optimer","gentilis","droid/droid_sans","droid/droid_serif"]
};

// Global Vars
var group, textMesh1, textMesh2, textGeo, materials;

var text = "NOP";



// let currentFont ;

var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.set(0, 400, 700);
var renderer = new THREE.WebGLRenderer({canvas: document.getElementById("Visualizer-O-Matic-9000")});


scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 250, 1400);

    // LIGHTS

    var dirLight = new THREE.DirectionalLight(0xff0000, 0.125);
    dirLight.position.set(0, 0, 1).normalize();
    scene.add(dirLight);

    var pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(0, 100, 90);
    scene.add(pointLight);


var geometry = new THREE.BoxGeometry(20,20,20);
var material = new THREE.MeshBasicMaterial({
    color: 0xf0ff0f
});



materials = [
    new THREE.MeshPhongMaterial({
        color: 0xf55fff,
        flatShading: false
    }), // front
    new THREE.MeshPhongMaterial({
        color: 0xf55ff5
    }) // side
];

var cube = new THREE.Mesh(geometry, material);

group = new THREE.Group();
group.position.y = 0;
scene.add(group);


// START
loadFont(CurrentFont);

init();


// console.log(loadFont());
animate();

// console.log(cfnt);
// END



// Functions

function init(){
    scene.add(cube);

    camera.position.z = 4; 

    const canvas = document.getElementById("Visualizer-O-Matic-9000");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
}



function animate() {

    // resizeCanvasToDisplaySize();
    
    if(CurrentFont.fontLoaded == true){
        CurrentFont.fontLoaded = false;
        console.log(CurrentFont.font.data);
        createText(CurrentFont,'asdasd');
        // group.dispose();
        cube.position.x = 2;
        // scene.remove(cube);
    }

    requestAnimationFrame(animate);
    camera.lookAt(cameraTarget); 

    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;


    // ????
    renderer.clear();

    renderer.render(scene, camera);
}



// AUTO RESIZE CANVAS
// TODO on resize call
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


//OK - ucita font , sam obi trebalo promijeniti font path ako treba
function loadFont(passedFontObject) {
    var loader = new THREE.FontLoader();
    loader.load('node_modules/three/examples/fonts/'
                 + passedFontObject.fontMap[passedFontObject.fontMapValue]
                 + '_' 
                 + passedFontObject.weightMap[passedFontObject.weightMapValue]
                 + '.typeface.json',
    // Kad ucita 
    function (response) {    
        passedFontObject.font = response;
    },// onProgress callback
	function ( xhr ) {
        // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        console.log('loaded');
        CurrentFont.fontLoaded = true;
	},
	// onError callback
	function ( err ) {
		console.log( 'An error happened' );
    });
}



function createText(FontObject,TextString) {

    textGeo = new THREE.TextGeometry(TextString, {

        font: FontObject.font,

        size: FontObject.size,
        height: FontObject.height,
        curveSegments: FontObject.curveSegments,

        bevelThickness: FontObject.bevelThickness,
        bevelSize: FontObject.bevelSize,
        bevelEnabled: FontObject.bevelEnabled

    });

    // textGeo.text = '1234';
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    var centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

    textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
    textMesh1 = new THREE.Mesh(textGeo, materials);

    textMesh2 = new THREE.Mesh(textGeo, materials);

    textMesh1.position.x = 0 ;
    textMesh1.position.y = 0;
    textMesh1.position.z = 0;
    textMesh1.rotation.x = -Math.PI /2;
    textMesh1.rotation.y = 0;

    // group.add(textMesh1);

    group.add(textMesh1);

    // textMesh2.position.x = centerOffset+250;
    // textMesh2.position.y = hover;
    // textMesh2.position.z = 20;
    // textMesh2.rotation.x = 0;
    // textMesh2.rotation.y = 0;
    
    // group.add(textMesh2);


}


let flg = true;

let butTaon = document.querySelector('.btn');

butTaon.addEventListener('click',hideElement);

function hideElement(){
    console.log('Bravo');
    if(flg) {
        flg = false;
        group.remove(textMesh1);}
    else {
        flg = true;
        group.add(textMesh1);}

}
// Imports

import * as THREE from '../node_modules/three/build/three.module.js';
import { GeometryUtils } from '../node_modules/three/examples/jsm/utils/GeometryUtils.js';


// Bitno za nesto
THREE.Cache.enabled = true;

let vanillaProgTextMatrix = [

    [['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],],

    [['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],],

    [['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],]

]

// Classes

class CoordinateHolder {
    constructor(px = 0,py = 0,pz = 0,rx = 0,ry = 0){
        this.px = px;
        this.py = py;
        this.pz = pz;
        this.rx = rx;
        this.ry = ry;
    }
}

class CommandHolder {
    constructor(value,px,py,pz){
        this.value = value;
        this.px = px;
        this.py = py;
        this.pz = pz;
    }
}

/////////////////////////

// Object Literals

let LangReader = {
   
    //mozda, jednog dana
    commandHistory : [],

    // 3Dof Program text
    progTextMatrix : [],

    //z - page , x - col , y - row
    progTextMatrixSize  : { x:0, y:0, z:0},  
    progTextMatrixStart : { x:0, y:0, z:0},  
    progTextMatrixCrnt : { x:0, y:0, z:0},  

    //Load Program text from WebPage to progTextMatrix
    loadProgramText : function(){

        //TODO load prog text
        this.progTextMatrix = vanillaProgTextMatrix;

        this.progTextMatrixSize.x = 3;
        this.progTextMatrixSize.y = 3;
        this.progTextMatrixSize.z = 3;

        this.progTextMatrixStart.x = 0;
        this.progTextMatrixStart.y = 0;
        this.progTextMatrixStart.z = 0;

        progTextMatrixCrnt = progTextMatrixStart;
        
        console.log('Load Prog Text : OK');
    },

    //vrati kordinate trenutne naredbe
    readCurrentCommand : function(){
        let tmp_cmd = new CommandHolder(
            this.progTextMatrix[this.progTextMatrixCrnt.z][this.progTextMatrixCrnt.y][this.progTextMatrixCrnt.x],
            this.progTextMatrixCrnt.x,
            this.progTextMatrixCrnt.y,
            this.progTextMatrixCrnt.z
        );
        return tmp_cmd;
    },


    evalCommand : function(command){
        if(command == 'NOP') ;
    },


    // nextCommand : function(){

    // }
};

let CurrentFont = {
    font: undefined, //Holds JSON font
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


    /////////////////
    // Global Vars //
    /////////////////
// 
let currentCoord = new CoordinateHolder();

// Text Display Vars
let centerCoord = new CoordinateHolder;
let startCoord = new CoordinateHolder;
let displayTextMatrix = [];
let CAN_TEXT_MATRIX_BE_LOADED = false;


// Rendering Vars

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById("Visualizer-O-Matic-9000")});
let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);

/////////////////////////


// CAMERA

let cameraTarget = new THREE.Vector3(0, 150, 0);
camera.position.set(0, 400, 700);


// Scene Setup

scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 250, 1400);

/////////////////////////


// LIGHTS

let dirLight = new THREE.DirectionalLight(0xff0000, 0.125);
dirLight.position.set(0, 0, 1).normalize();
scene.add(dirLight);

let pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(0, 100, 90);
scene.add(pointLight);

/////////////////////////


// Debugging Cube
let tst_geometry = new THREE.BoxGeometry(20,20,20);
let tst_material = new THREE.MeshBasicMaterial({ color: 0xf0ff0f });
let tst_cube = new THREE.Mesh(tst_geometry, tst_material);
scene.add(tst_cube);
/////////////////////////


// Main Materials

let materialB = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
let materialC = new THREE.MeshNormalMaterial();
 

// Main Code Execution
// START
loadFont(CurrentFont);

init();


// Looped
animate();

// END



// Functions

function init(){
    const canvas = document.getElementById("Visualizer-O-Matic-9000");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}



function animate() {

    requestAnimationFrame(animate);
    camera.lookAt(cameraTarget); 

    // font se ucitao pa se inita text 
    if(CurrentFont.fontLoaded == true && CAN_TEXT_MATRIX_BE_LOADED == false) CAN_TEXT_MATRIX_BE_LOADED = true;

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
    let loader = new THREE.FontLoader();
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
        console.log('Load Font : OK');
        CurrentFont.fontLoaded = true;
	},
	// onError callback
	function ( err ) {
		console.log( 'Load Font : ERROR' );
    });
}


function makeTextMesh(FontObject,TextString,CoordinateObject,MaterialObject){
    
    //Create Geometry
    let textGeo = new THREE.TextGeometry(TextString, {

        font: FontObject.font,

        size: FontObject.size,
        height: FontObject.height,
        curveSegments: FontObject.curveSegments,

        bevelThickness: FontObject.bevelThickness,
        bevelSize: FontObject.bevelSize,
        bevelEnabled: FontObject.bevelEnabled

    });

    //Smth
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    //
    textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);

    let textMesh = new THREE.Mesh(textGeo, MaterialObject);

    //
    textMesh.position.x = CoordinateObject.px;
    textMesh.position.y = CoordinateObject.py;
    textMesh.position.z = CoordinateObject.pz;
    textMesh.rotation.x = CoordinateObject.rx;
    textMesh.rotation.y = CoordinateObject.ry;

    // scene.add(textMesh);
    return textMesh;
}

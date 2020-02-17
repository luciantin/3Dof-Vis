// Imports

import * as THREE from '../node_modules/three/build/three.module.js';
import { GeometryUtils } from '../node_modules/three/examples/jsm/utils/GeometryUtils.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'; 

let controls;

// Bitno za nesto
THREE.Cache.enabled = true;


// l col (1d arr)
// j row (2d arr)
// i pge (3d arr)
let vanillaProgTextMatrix = [

    [['1','A','B'],
     ['2','NOP','NOP'],
     ['3','NOP','NOP'],],

    [['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],],

    [['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],]

]

let vanillaProgTextMatrix2 = [

    [
        ['7','8','9','A','b'],
        ['7','8','9','A','b'],
        ['7','8','9','A','b'],
        ['7','8','9','A','b'],
],
    [
        ['7','8','9','A','b'],
        ['7','8','9','A','b'],
        ['7','8','9','A','b'],
        ['7','8','9','A','b'],
],

    [['11','12','13'],
     ['14','15','16'],
     ['17','18','19'],],

    [['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],
     ['NOP','NOP','NOP'],]

]



// Classes

class TextDisplayController {

    constructor(){}

    Init(){

        //Assign t oeach Mesh Instance its setting
        for(let i = 0; i<TextDisplayMatrix.content.length;i++){
            for(let j = 0; j<TextDisplayMatrix.content[i].length;j++){
                for(let l = 0; l<TextDisplayMatrix.content[i][j].length;l++){

                    //Get Values From Array 
                    let value = TextDisplayMatrix.content[i][j][l].value;

                    let position = TextDisplayMatrix.content[i][j][l].position;
                    let scale = TextDisplayMatrix.content[i][j][l].scale;
                    let rotation = TextDisplayMatrix.content[i][j][l].rotation;

                    TextDisplayMatrix.content[i][j][l].mesh = makeTextMesh(CurrentFont,value,
                        l*100,j*100,i*100
                        ,TextMaterials[0])
                    
                    scene.add(TextDisplayMatrix.content[i][j][l].mesh);

                    // console.log(value)
                }
                // console.log('\n')
            }
            // console.log('<><><><><><><><><><><><><>')
        }

    }

    // clear(){}

    // refreshFull(){}

    // setMaterial(value,index,Material){

    // }

    // setTransform(value,index,position,scale,rotation){
    //     let tmpMatrix = new THREE.Matrix4().compose(
    //         position,
    //         new THREE.Quaternion().setFromEuler(rotation),
    //         scale
    //     );
        
    // }


}


// object type that LangReader returns when readCurrentCommand(); , COORDINATES IN THE TEXT Command ARRAY
class CommandHolder {
    constructor(value,px,py,pz){
        this.value = value;
        this.px = px;
        this.py = py;
        this.pz = pz;
    }
}

// base helper class for holding coordinates
class CoordinateHolder {

    constructor(
        position = new THREE.Vector3(0,0,0),
        scale    = new THREE.Vector3(1,1,1),
        rotation = new THREE.Euler( 0, 0, 0, 'XYZ'))
        {
        this.position = position;
        this.scale    = scale;
        this.rotation = rotation;
    }
}


class MeshCommandHolder extends CoordinateHolder{

    constructor(
        value,
        position = new THREE.Vector3(0,0,0),
        scale    = new THREE.Vector3(1,1,1),
        rotation = new THREE.Euler( 0, 0, 0, 'XYZ'))
        {
        super(position,scale,rotation);
        this.value = value;
        this.mesh;
    }
}



/////////////////////////

// Object Literals


// text to be displayed
let TextDisplayMatrix = {
        
    //First run this to fil the content
    loadProgramText: function(progText){
        this.content = new Array(progText.length); //make pages

        for(let i = 0; i < progText.length; i++) {
            this.content[i] = new Array(progText[i].length); //add rows to each page
            //add elements to each row
            for(let j = 0;j<progText[i].length;j++) this.content[i][j] = new Array(progText[i][j].length);
        }   

        //Copy elements 
        for(let i = 0; i<this.content.length; i++) for(let j = 0; j<this.content[i].length; j++) for(let l = 0; l<this.content[i][j].length; l++) this.content[i][j][l] = this.commandTextToMeshHolder(progText[i][j][l],i,j,l);

        
        console.table(this.content); 
    },

    commandTextToMeshHolder: function(value,x,y,z){

        //Create And Return CommandHolder
        let tmp_MCH = new MeshCommandHolder(
            value,
            new THREE.Vector3(x,y,z),
            new THREE.Vector3(1,1,1),
            new THREE.Euler( 0, 0, 0, 'XYZ')
        );

        return tmp_MCH;
    }

}

// 3dof lang reader
let LangReader = {
   
    //mozda, jednog dana
    commandHistory : [],

    // 3Dof Program text
    progTextMatrix : [],

    //z - page , x - col , y - row
    progTextMatrixSize  : { x:0, y:0, z:0},  
    progTextMatrixStart : { x:0, y:0, z:0},  
    progTextMatrixCrnt  : { x:0, y:0, z:0},  

    //Load Program text from WebPage to progTextMatrix
    loadProgramText : function(){

        //TODO load prog text
        this.progTextMatrix = vanillaProgTextMatrix2;

        this.progTextMatrixSize.x = 3;
        this.progTextMatrixSize.y = 3;
        this.progTextMatrixSize.z = 3;

        this.progTextMatrixStart.x = 0;
        this.progTextMatrixStart.y = 0;
        this.progTextMatrixStart.z = 0;

        this.progTextMatrixCrnt = this.progTextMatrixStart;
        
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
        // if(command == 'NOP') ;

        console.load('Current Command : '+command);
    },


    // nextCommand : function(){

    // }
};


// holds info about font ...
let CurrentFont = {
    font: undefined, //Holds JSON font
    height: 20,
    size: 30,
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



//moze se ucitat tek kad se font ucita
let CAN_TEXT_MATRIX_BE_LOADED = false;
let SHOULD_TEXT_MATRIX_BE_LOADED = true;

// Rendering Vars

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById("Visualizer-O-Matic-9000")});
let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 50000);

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


// bug Cube
let tst_geometry = new THREE.BoxGeometry(20,20,20);
let tst_material = new THREE.MeshBasicMaterial({ color: 0xf0ff0f });
let tst_cube = new THREE.Mesh(tst_geometry, tst_material);
scene.add(tst_cube);
/////////////////////////


// Materials

let TextMaterials = [
    new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
    new THREE.MeshNormalMaterial()
]


///////////////////////////
///////////////////////////
/// Main Code Execution ///
///////////////////////////
///////////////////////////

loadFont(CurrentFont);

LangReader.loadProgramText();
// console.log(LangReader.readCurrentCommand());
// console.table(LangReader.progTextMatrix);

TextDisplayMatrix.loadProgramText(LangReader.progTextMatrix);



initCanvas();


// Looped
animate();

///////////////////////////
///////////////////////////
///        END          ///
///////////////////////////
///////////////////////////

// Functions

function initCanvas(){
    const canvas = document.getElementById("Visualizer-O-Matic-9000");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    controls = new OrbitControls( camera, renderer.domElement );

	//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.05;

	controls.screenSpacePanning = false;

	controls.minDistance = 100;
	controls.maxDistance = 5000;

    controls.maxPolarAngle = Math.PI / 2;

}



function animate() {

    requestAnimationFrame(animate);

    camera.lookAt(cameraTarget); 

    // font se ucitao pa se inita text 
    if(CurrentFont.fontLoaded == true && CAN_TEXT_MATRIX_BE_LOADED == false) CAN_TEXT_MATRIX_BE_LOADED = true;

    if(CAN_TEXT_MATRIX_BE_LOADED && SHOULD_TEXT_MATRIX_BE_LOADED){
        SHOULD_TEXT_MATRIX_BE_LOADED = false; //jer je ucitana

        let atts = new TextDisplayController().Init();

        console.log('wdwdwd');

    }


    controls.update();

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


//Old
function makeTextMesh(FontObject,TextString,x,y,z,MaterialObject){
    
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
    textMesh.position.x = x;
    textMesh.position.y = y;
    textMesh.position.z = z;
    // textMesh.rotation.x = CoordinateObject.rx;
    // textMesh.rotation.y = CoordinateObject.ry;

    // scene.add(textMesh);
    return textMesh;
}


function makeTextGeo(FontObject,TextString){
    
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

    return textGeo;
}


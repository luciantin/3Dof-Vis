// Imports

import * as THREE from '../node_modules/three/build/three.module.js';
import { GeometryUtils } from '../node_modules/three/examples/jsm/utils/GeometryUtils.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'; 

let controls;

// Bitno za nesto
THREE.Cache.enabled = true;

let progText2 = `
NEW 
NOP NOP NOP STP
NOP NOP NOP STP
NOP NOP NOP STP
NEW
IIA IIA IIA STP
IIA IIA IIA STP
STR
IIB IIB IIB STP
END
`

let progText = `
NEW 
RDW NOP RLF NOP RLF NOP NOP NOP NOP STP
NOP NOP RUP NOP SOA PEA RLF STP
RRT NOP CAZ PUP NEA ADA RUP RUP NOP STP

NEW
NOP NOP NOP NOP RRT OIB STP
NOP STP
STO OIA NEA RLF STP
NEW
NOP NOP NOP NOP CBZ STP
NEW
NOP NOP NOP NOP RRT OIA STP
NEW
NOP NOP NOP NOP CAZ STP

STR 
NEA IIA NOP IIB PDW STP
END`;


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



////////////////////////////
///  Load Prog in TextArea
////////////////////////////

let visMenuTextArea = document.getElementById('vis-text-input');
visMenuTextArea.value = progText;


// Classes
class TextDisplayController {

    constructor(){
        this.textDirection = 3;
        this.textDirections = [ 'Front2Back', 'Back2Front', 'Left2Right', 'Top2Bottom', 'Bottom2Top'];
        this.content = 0;
        this.CurrentFont = {
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
    };

    Init(Text){

        this.loadProgramText(Text);

        for(let i = this.content.length - 1; i >= 0;i--){
                for(let j = this.content[i].length - 1; j >= 0; j--){
                    for(let l = this.content[i][j].length - 1; l >= 0;l--){
    
                        //Get Values From Array 
                        let value = this.content[i][j][l].value;
    
                        let position = this.content[i][j][l].position;
                        let scale = this.content[i][j][l].scale;
                        let rotation = this.content[i][j][l].rotation;
                        let x,y,z;

                        //ok
                        if(this.textDirections[this.textDirection] == 'Back2Front'){
                            x = l * 100;
                            y = j * 100; 
                            z = i * 100;
                        }

                        //ok
                        if(this.textDirections[this.textDirection] == 'Front2Back'){
                            x = l * 100;
                            y = j * 100; 
                            z = (this.content.length - 1 - i ) * 100;
                        }

                        //ok
                        if(this.textDirections[this.textDirection] == 'Top2Bottom'){
                            x = l * 100;
                            z = j * 100; 
                            y = (this.content.length - 1 - i ) * 100;
                        }

                        //ok
                        if(this.textDirections[this.textDirection] == 'Bottom2Top'){
                            x = l * 100;
                            z = j * 100; 
                            y = i * 100;
                        }


                        this.content[i][j][l].mesh =   makeTextMesh(this.CurrentFont,value,
                                                                    x,y,z
                                                                    ,TextMaterials[1])
                        
                        scene.add(this.content[i][j][l].mesh);
    
                    }
                }
            }

    };


    //First run this to fil the content
    loadProgramText(progText){
    this.content = new Array(progText.length); //make pages

    for(let i = 0; i < progText.length; i++) {
        this.content[i] = new Array(progText[i].length); //add rows to each page
        //add elements to each row
        for(let j = 0;j<progText[i].length;j++) this.content[i][j] = new Array(progText[i][j].length);
    }   

    //Copy elements 
    for(let i = 0; i<this.content.length; i++) for(let j = 0; j<this.content[i].length; j++) for(let l = 0; l<this.content[i][j].length; l++) this.content[i][j][l] = this.commandTextToMeshHolder(progText[i][j][l],i,j,l);

    
    // console.table(this.content); 
    };


    commandTextToMeshHolder(value,x,y,z){

    //Create And Return CommandHolder
    let tmp_MCH = new MeshCommandHolder(
        value,
        new THREE.Vector3(x,y,z),
        new THREE.Vector3(1,1,1),
        new THREE.Euler( 0, 0, 0, 'XYZ')
    );

    return tmp_MCH;
    };

    clear(){
        if(this.content != 0)
            for(let i = this.content.length - 1; i >= 0;i--)
                for(let j = this.content[i].length - 1; j >= 0; j--)
                    for(let l = this.content[i][j].length - 1; l >= 0;l--) scene.remove(this.content[i][j][l].mesh);
        this.content = 0;
    };


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



// 3dof lang reader
let LangReader = {
   
    //mozda, jednog dana
    commandHistory : [],

    // 3Dof Program text
    content : [],

    //z - page , y - row , x - elem 
    // progTextMatrixSize  : { x:0, y:0, z:0},  
    progTextMatrixStart : { x:0, y:0, z:0},  //pocetna
    progTextMatrixCrnt  : { x:0, y:0, z:0},  //trenutna 

    //Load Program text from WebPage to content
    loadProgramText : function(Text){

        //TODO load prog text

        for(let i = 0; i < Text.length; i++){
            this.content.push(Text[i].page);
            if(Text[i].id = 'STR') this.progTextMatrixStart.z = i;
        }

        // this.content = Text;

        this.progTextMatrixStart.x = 0;
        this.progTextMatrixStart.y = 0;

        this.progTextMatrixCrnt = this.progTextMatrixStart;
        
        console.log('Load Prog Text : OK');
    },

    step : function(){
        this.readCurrentCommand();
    },

    //vrati kordinate trenutne naredbe
    readCurrentCommand : function(){
        let tmp_cmd = new CommandHolder(
            this.content[this.progTextMatrixCrnt.z][this.progTextMatrixCrnt.y][this.progTextMatrixCrnt.x],
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

    clear : function(){
        this.content = [];
    },

    // nextCommand : function(){

    // }
};


 
//OK
//creates an array from text
// Compiler.loadProgText(progText);
// Compiler.CreateArrayFromProgramText();
let Compiler = {

    text : "",
    currentCharPos : -1,
    ROW_END : 'STP',
    PAGE_BEGIN : 'NEW',
    START_PAGE : 'STR',
    END_OF_PROGRAM : 'END',
    

    loadProgText : function(text){
        this.text = text;
    },

    //OK
    getNextChar : function() {
        this.currentCharPos = this.currentCharPos + 1;
        return (this.text.length-1) < this.currentCharPos ? this.END_OF_PROGRAM : this.text.charAt(this.currentCharPos);
    },

    //OK
    getNextValidChar : function(){
        let tmpC = this.getNextChar();
        if(tmpC.match(/[A-Z]/)) return tmpC;
        else return this.getNextValidChar();
    },

    //OK
    getNextCommand : function(){ return (this.getNextValidChar() + this.getNextValidChar() + this.getNextValidChar()); },

    //OK
    getNextRow : function() {
        let tmpCmd = this.getNextCommand();
        let cmdArray = [];

        while(tmpCmd != this.ROW_END && tmpCmd != this.PAGE_BEGIN  && tmpCmd != this.START_PAGE && tmpCmd != this.END_OF_PROGRAM){
            cmdArray.push(tmpCmd);
            tmpCmd = this.getNextCommand();
        };

        cmdArray.push(this.ROW_END);
        return {type : tmpCmd, row : cmdArray};
    },

    getNextPage : function(){
        let tmpCmd = this.getNextRow();
        let cmdArray = [];

        while(tmpCmd.type != this.PAGE_BEGIN  && tmpCmd.type != this.START_PAGE && tmpCmd.type != this.END_OF_PROGRAM){
            cmdArray.push(tmpCmd.row);
            tmpCmd = this.getNextRow();
        }
        
        return {type : tmpCmd.type, page : cmdArray};
    },

    //OK
    CreateArrayFromProgramText : function(){
        this.currentCharPos = -1;
        let tmpPage = this.getNextPage();
        let tmpType = tmpPage.type;
        let book = [];

        while(tmpType != this.END_OF_PROGRAM){
            tmpPage = this.getNextPage();
            book.push({id : tmpType, page: tmpPage.page});
            tmpType = tmpPage.type;
        }

        // console.table(book);
        return book;
    },
};


// progTextArea.load().textContent;
let progTextArea = {

    textContent : '',
    load : function(){
        this.textContent = visMenuTextArea.value;
        return this; //Ez of use
    }
};


    /////////////////
    // Global Vars //
    /////////////////



//moze se ucitat tek kad se font ucita
let CAN_TEXT_MATRIX_BE_LOADED = false;
let SHOULD_TEXT_MATRIX_BE_LOADED = false;

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

let DisplayControler = new TextDisplayController();

loadFont(DisplayControler.CurrentFont);


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
    if(DisplayControler.CurrentFont.fontLoaded == true && CAN_TEXT_MATRIX_BE_LOADED == false) CAN_TEXT_MATRIX_BE_LOADED = true;
    if(CAN_TEXT_MATRIX_BE_LOADED && SHOULD_TEXT_MATRIX_BE_LOADED){
        
        SHOULD_TEXT_MATRIX_BE_LOADED = false; //jer je ucitana
        
        Compiler.loadProgText(progTextArea.load().textContent);
        let tmpArrPrg = Compiler.CreateArrayFromProgramText();

        // console.log('progTextArea.load().textContent :', progTextArea.load().textContent);
        console.log('tmpArrPrg :', tmpArrPrg);

        LangReader.clear();
        LangReader.loadProgramText(tmpArrPrg);
        
        DisplayControler.clear();
        DisplayControler.Init(LangReader.content)
        // console.log('LangReader.readCurrentCommand() :', LangReader.readCurrentCommand());


        // console.log('OK');

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
        passedFontObject.fontLoaded = true;
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


// *********************************** //
/////////////////////////////////////////
/////////////////////////////////////////
///////////    UI Interaction    ////////
/////////////////////////////////////////
/////////////////////////////////////////
// *********************************** //



// Hide Menu Button 

let visMenu = document.querySelector('.visualizer-menu');
let visMenuBtnHide = document.getElementById('vis-menu-btn-hide');
let progCntrlToggleVis = document.getElementById('prog-control-btn-toggle-visibility');
let headerShowSidebar = document.getElementById('header-show-sidebar');
let headerMain = document.getElementById('header-main');


visMenuBtnHide.addEventListener('click',ToggleMenuVisibility);
headerShowSidebar.addEventListener('click',ToggleMenuVisibility);

progCntrlToggleVis.addEventListener('click',ToggleVisAll);

function ToggleMenuVisibility() { 
    visMenu.classList.toggle("hide"); 
    headerShowSidebar.classList.toggle("visibility-no"); 

}

function ToggleVisAll() { 
    visMenu.classList.toggle("hide"); 
    headerMain.classList.toggle("hide"); 
    headerShowSidebar.classList.toggle("visibility-no"); 

}

//SHOULD_TEXT_MATRIX_BE_LOADED



/////////////////////////////////////////
////////       Header Menu      /////////
/////////////////////////////////////////



/////////////////////////////////////////
////////     Program Control    /////////
/////////////////////////////////////////

// Load

let progCntrlLoad = document.getElementById('prog-control-btn-load');

progCntrlLoad.addEventListener('click', LoadProgFromTextArea);

function LoadProgFromTextArea(){
    SHOULD_TEXT_MATRIX_BE_LOADED = true;
} 

/////////////////////////////////////////
////////        Vis Menu        /////////
/////////////////////////////////////////













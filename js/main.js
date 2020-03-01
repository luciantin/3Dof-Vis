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
NOP NOP RUP OIA SOA PEA RLF STP
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


// l col  (1d arr)  x
// j row  (2d arr)  y
// i pge  (3d arr)  z
 

////////////////////////////
///  Load Prog in TextArea
////////////////////////////

let visMenuTextArea = document.getElementById('vis-text-input');
visMenuTextArea.value = progText;


class MasterController{


    constructor(){


        this.DisplaySettings = {
            meshId : 1,
            textDirection : 3,
            textDirections : [ 'Front2Back', 'Back2Front', 'Left2Right', 'Top2Bottom', 'Bottom2Top'],
            CurrentFont : {
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
            }
        };

        this.previousCommand = undefined;
        this.currentCommand = undefined;

        this.TextDisplay = new TextDisplayController();
        this.LangReader = new LangReader();

        this.group = new THREE.Group();

        // loadFont(this.TextDisplay.CurrentFont);
        loadFont(this.DisplaySettings.CurrentFont);
        loadHtmlMenu(this.DisplaySettings);
    }

    Init(tmpArrPrg){

        // this.LangReader.clear();
        // this.TextDisplay.clear();

        this.TextDisplay = new TextDisplayController();
        this.LangReader = new LangReader();
        this.previousCommand = undefined;
        this.currentCommand = undefined;

        this.TextDisplay.CurrentFont = this.DisplaySettings.CurrentFont;

        this.TextDisplay.meshId = this.DisplaySettings.meshId;
        this.TextDisplay.textDirection = this.DisplaySettings.textDirection;
        this.TextDisplay.textDirections = this.DisplaySettings.textDirections;

        this.LangReader.loadProgramText(tmpArrPrg);
        this.group = this.TextDisplay.Init(this.LangReader.content)

        // console.log('this.LangReader.readCurrentCommand :', this.LangReader.readCurrentCommand);
        this.previousCommand = this.LangReader.readCurrentCommand();
        this.TextDisplay.setMaterial(this.previousCommand, TextMaterials[0]); //first command

        scene.add(this.group);
    }

    clear(){
        this.previousCommand = undefined;
        this.currentCommand = undefined;

        this.TextDisplay = new TextDisplayController();
        this.LangReader = new LangReader();

        scene.remove(this.group);
        this.group = new THREE.Group();
    }


    step(){
        this.currentCommand = this.LangReader.readCurrentCommand();



        this.TextDisplay.setMaterial(this.previousCommand, TextMaterials[1]);
        this.TextDisplay.setMaterial(this.currentCommand, TextMaterials[0]);

        if(this.currentCommand.value == 'IIA' || this.currentCommand.value == 'IIB'){
            if(terminalControler.WAITING_FOR_INPUT == false && terminalControler.canTakeInput() == false){ 
                terminalControler.inputIdCounter++;
                terminalControler.input();
            }
            if(terminalControler.canTakeInput() == false) return;
        }


        // console.log(this.currentCommand);
        // console.log(this.previousCommand);

        this.LangReader.evalCommand(this.currentCommand.value);
        this.LangReader.step();

        this.previousCommand = this.currentCommand;        
    }



}


// Classes
class TextDisplayController {

    constructor(){
        this.meshId = 1;
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

    //after program load
    Init(Text){

        let txtGroup = new THREE.Group();

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
                
                    this.content[i][j][l].mesh = makeTextMesh(this.CurrentFont,value,x,y,z,TextMaterials[this.meshId]);
                    
                    txtGroup.add(this.content[i][j][l].mesh);
                }
            }
        }

        // scene.add(txtGroup);
        return txtGroup;
    };


    //First run this to fil the content with MeshHolder
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


    // highlightCommand


    // clear(){}

    // refreshFull(){}

    setMaterial(cmd,material){
        this.content[cmd.z][cmd.y][cmd.x].mesh.material = material;
    }

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
        this.x = px;
        this.y = py;
        this.z = pz;
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


// 3dof lang reader
class LangReader {

    constructor(){
        //mozda, jednog dana
        this.commandHistory = [];
        this.nopCntr = 0;
        // 3Dof Program text
        this.content = [];

        this.incrVal = 1;
        
        this.direction = 'RRT';

        this.progMemory = {

            Memory : [0,0,0,0,0,0,0,0,0,0,0,0,0],
            pntr : [0,0,0],

            resizeMem : function(pntrId, sign){
                
                if(sign == 'incr') this.pntr[pntrId]++;        
                if(sign == 'decr') this.pntr[pntrId]--;
                
                if(this.pntr[pntrId] < 0){
                    for(let i = 0; i < this.pntr.length; i++) if(i != pntrId) this.pntr[i]++;
                    this.Memory = [0] + this.Memory; 
                }
            
                if(this.pntr[pntrId] > this.Memory.length){ this.Memory = this.Memory + [0]; }
                
            },

            swapAB : function(){
                let tmp = this.getA();
                this.setA(this.getB());
                this.setB(tmp);
            },
            
            setA : function(num){ this.Memory[this.pntr[0]] = num; },
            setB : function(num){ this.Memory[this.pntr[1]] = num; },
            setC : function(num){ this.Memory[this.pntr[2]] = num; },
            
            getA : function(){ return this.Memory[this.pntr[0]]; },
            getB : function(){ return this.Memory[this.pntr[1]]; },
            getC : function(){ return this.Memory[this.pntr[2]]; },

            incrA : function(){ this.resizeMem(0,'incr'); },
            incrB : function(){ this.resizeMem(1,'incr'); },
            incrC : function(){ this.resizeMem(2,'incr'); },

            decrA : function(){ this.resizeMem(0,'decr'); },
            decrB : function(){ this.resizeMem(1,'decr'); },
            decrC : function(){ this.resizeMem(2,'decr'); },

            logMemory : function(){
                // console.log('this.progMemory :', this.Memory);
                // console.log('pntr > ',this.pntr);
            },
            
        };

        //z - page , y - row , x - elem 
        // progTextMatrixSize  = { x:0, y:0, z:0},  
        this.progTextMatrixStart = { x:0, y:0, z:0};  //pocetna
        this.progTextMatrixCrnt  = { x:0, y:0, z:0};  //trenutna 
    
    };

    //Load Program text from WebPage to content
    loadProgramText(Text){

        //TODO load prog text

        for(let i = 0; i < Text.length; i++){
            this.content.push(Text[i].page);
            if(Text[i].id = 'STR') this.progTextMatrixStart.z = i;
        }

        // this.content = Text;

        this.progTextMatrixStart.x = 0;
        this.progTextMatrixStart.y = 0;

        this.progTextMatrixCrnt = this.progTextMatrixStart;
        
        console.log('Load Prog Text OK');
    };


    //vrati kordinate trenutne naredbe,i naredbu
    readCurrentCommand(){
        let tmp_cmd = new CommandHolder(
            this.content[this.progTextMatrixCrnt.z][this.progTextMatrixCrnt.y][this.progTextMatrixCrnt.x],
            this.progTextMatrixCrnt.x,
            this.progTextMatrixCrnt.y,
            this.progTextMatrixCrnt.z
        );
        return tmp_cmd;
    };


    //pomakne program za jedan korak
    step(){
        if(this.direction == 'RUP')      this.progTextMatrixCrnt.y -= this.incrVal;
        if(this.direction == 'RDW') this.progTextMatrixCrnt.y += this.incrVal;
        if(this.direction == 'RRT') this.progTextMatrixCrnt.x += this.incrVal;
        if(this.direction == 'RLF') this.progTextMatrixCrnt.x -= this.incrVal;
        if(this.direction == 'PUP') this.progTextMatrixCrnt.z += this.incrVal;
        if(this.direction == 'PDW') this.progTextMatrixCrnt.z -= this.incrVal;
        if(this.direction == 'STOP') PROGRAM_STOP = true;
        this.incrVal = 1;
    };


    //evaluira naredbu
    evalCommand(command){
        // console.log('command :', command);
        //ostalo
        if(command == 'NOP') this.nopCntr++;
        if(command == 'STO') this.direction = 'STOP';
        if(command == 'STP') this.direction = 'STOP';
        
        //direction
        if(command == 'RUP') this.direction = 'RUP';
        if(command == 'RDW') this.direction = 'RDW';
        if(command == 'RLF') this.direction = 'RLF';
        if(command == 'RRT') this.direction = 'RRT';
        if(command == 'PUP') this.direction = 'PUP';
        if(command == 'PDW') this.direction = 'PDW';

        //memory
        if(command == 'CPA') this.progMemory.setA(this.progMemory.getB());
        if(command == 'CPB') this.progMemory.setB(this.progMemory.getA());
        if(command == 'SWP') this.progMemory.swapAB();
        if(command == 'NEA') this.progMemory.incrA();
        if(command == 'PEA') this.progMemory.decrA();
        if(command == 'NEB') this.progMemory.incrB();
        if(command == 'PEB') this.progMemory.decrB();


        //flow control
        if(command == 'CAZ') if(this.progMemory.getA() != 0) this.incrVal = 2;
        if(command == 'CBZ') {if(this.progMemory.getB() != 0) this.incrVal = 2;}
        if(command == 'CAL') if(this.progMemory.getA() <  this.progMemory.getB()) this.incrVal = 2;
        if(command == 'CBL') if(this.progMemory.getB() <  this.progMemory.getA()) this.incrVal = 2;
        if(command == 'CIE') if(this.progMemory.getA() != this.progMemory.getB()) this.incrVal = 2;

        //combination A
        if(command == 'REA') this.progMemory.setA(0);
        if(command == 'ADA') this.progMemory.setA(this.progMemory.getA() + this.progMemory.getB());
        if(command == 'AOA') this.progMemory.setA(this.progMemory.getA() + 1);
        if(command == 'SBA') this.progMemory.setA(this.progMemory.getA() - this.progMemory.getB());
        if(command == 'SOA') this.progMemory.setA(this.progMemory.getA() - 1);

        //combination B
        if(command == 'REB') this.progMemory.setB(0);
        if(command == 'ADB') this.progMemory.setB(this.progMemory.getB() + this.progMemory.getA());
        if(command == 'AOB') this.progMemory.setB(this.progMemory.getB() + 1);
        if(command == 'SAB') this.progMemory.setB(this.progMemory.getB() - this.progMemory.getA());
        if(command == 'SOB') this.progMemory.setB(this.progMemory.getB() - 1);

        //I/O
        if(command == 'OIA') terminalControler.output(this.progMemory.getA());
        if(command == 'OIB') terminalControler.output(this.progMemory.getB());
        if(command == 'IIA') this.progMemory.setA(Number(terminalControler.takeInput()));
        // if(command == 'IIA') console.log(Number(terminalControler.takeInput()));
        if(command == 'IIB') this.progMemory.setB(Number(terminalControler.takeInput()));
        // if(command == 'IIB') console.log(Number(terminalControler.takeInput()));
        if(command == 'OAA') return;
        if(command == 'OAB') return;

        // console.log('-----------------------------------------------------------');
        // if(command == 'IIA') console.log('command IIA');
        // else if(command == 'IIB') console.log('command IIB');
        // console.log('Current Command = '+command);
        // console.log('Current Direction : ' + this.direction);
        // this.progMemory.logMemory();
        // this.progMemory.Memory[this.progMemory.pntr[0]] = 10;
        // this.progMemory.Memory[this.progMemory.pntr[1]] = 10;
        // console.log(this.progMemory.Memory[this.progMemory.pntr[0]] );
        // console.log('A : ' + this.progMemory.getA() );
        // console.log('B : ' + this.progMemory.getB() );
        // console.log('Incr : '+this.incrVal );
        // this.progMemory.setA(20);
        // console.log('-----------------------------------------------------------');
    };

    

    clear(){
        this.commandHistory = [];
        this.nopCntr = 0;
        this.content = [];

        this.direction = 'RRT';
        this.pntrA = 0;
        this.pntrB = 0;
        this.pntrC = 0;
 
        this.progTextMatrixStart = { x:0, y:0, z:0}; 
        this.progTextMatrixCrnt  = { x:0, y:0, z:0};  
    };

};


/////////////////////////

// Object Literals

/////////////////////////


let terminalControler = {
    
    terminalHTML : document.querySelector('.terminal'),
    inputId : "terminal-input-num-",
    inputIdCounter : 0,
    inputContent : [0],
    WAITING_FOR_INPUT : false,
    GOT_INPUT : false,

    output : function(data){
        this.terminalHTML.innerHTML += `<p class="txt-font-editor-2" style="color:#fff; font-size:4rem;">${data}</p>`;
        this.terminalHTML.scrollTop = this.terminalHTML.scrollHeight;
    },

    input : function(){

        this.WAITING_FOR_INPUT = true;

        this.terminalHTML.innerHTML += `<input type="text" id="${this.makeInputId()}" class="txt-font-editor-2" style="background-color:#000; color:#fff; font-size:4rem;" placeholder="Input">`;
        this.terminalHTML.scrollTop = this.terminalHTML.scrollHeight;  

        document.querySelector(`#${this.makeInputId()}`).addEventListener('keypress',this.inputHandler);

    },

    inputHandler : function(key){
        if(key.code === "Enter"){
            terminalControler.removeInputHandler();
            terminalControler.setTextFromInputField();
            terminalControler.replaceInputWithText();
            // console.log(terminalControler.getLastInput());
            terminalControler.GOT_INPUT = true;
            terminalControler.WAITING_FOR_INPUT = false;
       }
    },

    canTakeInput : function(){
        return this.GOT_INPUT;
    },

    takeInput : function(){
        this.GOT_INPUT = false;
        let sd = terminalControler.getLastInput();
        // console.log('this.inputContent :', this.inputContent);
        // console.log('sd :', sd);
        // console.log('this.inputIdCounter :', this.inputIdCounter);
        return sd;
    },

    removeInputHandler : function(){
        document.querySelector(`#${terminalControler.makeInputId()}`).removeEventListener('keypress',terminalControler.inputHandler);
        // return terminalControler.getTextFromInputField;
    },

    getTextFromInputField : function(){ return document.querySelector(`#${this.makeInputId()}`).value; },

    setTextFromInputField : function(){ this.inputContent.push(Number(this.getTextFromInputField())); },

    makeInputId : function(){ return `${this.inputId}${this.inputIdCounter}`; }, //makes the input id from inputID and its number

    getLastInput : function(){ return this.inputContent[this.inputIdCounter]; },

    replaceInputWithText : function(){
        let txtElHTML = document.createElement('p');
        let inputElHTML = document.querySelector(`#${this.makeInputId()}`);
        
        txtElHTML.innerHTML = `<span class="txt-font-editor-2" style="background-color:#000; color:#00f; font-size:4rem;" > ${this.getLastInput()} </span>`;
        this.terminalHTML.replaceChild(txtElHTML,inputElHTML);
    },
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
let PROGRAM_STOP = false;

// Rendering Vars

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById("Visualizer-O-Matic-9000")});
let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 50000);

/////////////////////////


// CAMERA

let cameraTarget = new THREE.Vector3(0, 150, 0);
camera.position.set(0, 700, 700);


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
// scene.add(tst_cube);
/////////////////////////


// Materials

let TextMaterials = [
    new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
    new THREE.MeshNormalMaterial()
]

let TextMaterialNames = [
    'Neon Green',
    'Basic'
]


///////////////////////////
///////////////////////////
/// Main Code Execution ///
///////////////////////////
///////////////////////////


let ProgMaster = new MasterController();

SHOULD_TEXT_MATRIX_BE_LOADED = true;

initCanvas();


// let prms = terminalControler.input();
// console.log(prms);

// terminalControler.input();

// console.log('inTxt :', inTxt);

// console.log(terminalControler.input());

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

    controls.enableDamping = true; 
	controls.dampingFactor = 0.05;

	controls.screenSpacePanning = false;

	controls.minDistance = 100;
	controls.maxDistance = 5000;

    controls.maxPolarAngle = Math.PI / 2;

}



function animate() {

    // resizeCanvasToDisplaySize();

    requestAnimationFrame(animate);

    camera.lookAt(cameraTarget); 


    // if(inTxt.promise.done) console.log('inTxt :', inTxt);
    // if(inTxt.state > "pending") console.log('inTxt :', inTxt);

    // font se ucitao pa se inita text 
    if(ProgMaster.DisplaySettings.CurrentFont.fontLoaded == true && CAN_TEXT_MATRIX_BE_LOADED == false) CAN_TEXT_MATRIX_BE_LOADED = true;
    if(CAN_TEXT_MATRIX_BE_LOADED && SHOULD_TEXT_MATRIX_BE_LOADED){
        
        SHOULD_TEXT_MATRIX_BE_LOADED = false; //jer je ucitana
        
        Compiler.loadProgText(progTextArea.load().textContent);
        let tmpArrPrg = Compiler.CreateArrayFromProgramText();

        ProgMaster.clear();
        ProgMaster.Init(tmpArrPrg);

        console.log('Init OK');

        delay = 1000;
        speed = 1;
        autoPlay = false;
    }


    controls.update();

    renderer.clear();

    renderer.render(scene, camera);
}


// RESIZE

//OK
window.addEventListener( 'resize', resizeCanvasToDisplaySize, false );

function resizeCanvasToDisplaySize() {
    let canvas = document.getElementById("Visualizer-O-Matic-9000");
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
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


//
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





//SIDEBAR
let visMenuHTML = document.querySelector('.visualizer-menu');

//buttons
let visMenuBtnHideHTML = document.getElementById('vis-menu-btn-hide');
let visMenuBtnTextHTML = document.getElementById('vis-menu-btn-text');
let visMenuBtnSettingsHTML = document.getElementById('vis-menu-btn-settings');
let visMenuBtnDisplayHTML = document.getElementById('vis-menu-btn-display');

//input 
let visMenuTextDir = document.getElementById('vis-dis-text-dir');
let visMenuFontSize = document.getElementById('vis-dis-fontSize');
let visMenuMesh = document.getElementById('vis-dis-mesh');


//content
let visMenuTextHTML     = document.querySelector('#vis-text-input');
let visMenuSettingsHTML = document.querySelector('#vis-settings'); 
let visMenuDisplayHTML  = document.querySelector('#vis-display');


//PROG CNTRL
let progControlHTML = document.querySelector('.prog-control');
let progCntrlToggleVisHTML = document.getElementById('prog-control-btn-toggle-visibility');

//buttons
let progCntrlPlayHTML =  document.querySelector('#prog-control-btn-play');
let progCntrlPauseHTML = document.querySelector('#prog-control-btn-pause');
let progCntrlSpeedHTML = document.querySelector('#prog-control-btn-speed');
let progCntrlStepHTML =  document.querySelector('#prog-control-btn-step');


//HEADER
let headerMainHTML = document.getElementById('header-main');

//buttons
let headerShowSidebarHTML = document.getElementById('header-show-sidebar');




//fills dropdown menus
function loadHtmlMenu(TxtDisCntrl){

    let fontListHTML          = ""  ;
    let meshListHTML          = ""  ;
    // let fontSizeListHTML      = ""  ; nije lista
    let textDirectionListHTML = ""  ;

    for(let i = 0; i<TxtDisCntrl.textDirections.length; i++) textDirectionListHTML += `<option value="${i}">${TxtDisCntrl.textDirections[i]}</option> `;
    for(let i = 0; i<TxtDisCntrl.CurrentFont.fontMap.length; i++) fontListHTML += `<option value="${i}">${TxtDisCntrl.CurrentFont.fontMap[i]}</option> `;
    for(let i = 0; i<TextMaterialNames.length; i++) meshListHTML += `<option value="${i}">${TextMaterialNames[i]}</option> `;

    document.getElementById('vis-dis-font').innerHTML = fontListHTML;
    document.getElementById('vis-dis-text-dir').innerHTML = textDirectionListHTML;
    document.getElementById('vis-dis-mesh').innerHTML = meshListHTML;
    
    // let tmpOption = '<option>'    ;

}


// Hide Menu Button 

visMenuBtnHideHTML.addEventListener('click',ToggleMenuVisibility);
headerShowSidebarHTML.addEventListener('click',ToggleMenuVisibility);

progCntrlToggleVisHTML.addEventListener('click',ToggleVisAll);


function ToggleMenuVisibility() { 
    visMenuHTML.classList.toggle("hide"); 
    headerShowSidebarHTML.classList.toggle("visibility-no");     
}


//progControlHTML
function ToggleVisAll() { 

    if(!headerMainHTML.classList.contains('hide')){

        // progControlHTML.classList.add('visibility-no');

        progCntrlToggleVisHTML.innerHTML = "Show All";

        headerMainHTML.classList.add("hide"); 
        if(!visMenuHTML.classList.contains('hide')) visMenuHTML.classList.add("hide"); 
        if(!headerShowSidebarHTML.classList.contains('visibility-no')) headerShowSidebarHTML.classList.add("visibility-no"); 
    }
    else{

        // progControlHTML.classList.remove('visibility-no');

        progCntrlToggleVisHTML.innerHTML = "Hide All";

        headerMainHTML.classList.remove("hide"); 
        visMenuHTML.classList.remove("hide"); 
        headerShowSidebarHTML.classList.add("visibility-no"); 
    }   

}


/////////////////////////////////////////
////////       Header Menu      /////////
/////////////////////////////////////////



/////////////////////////////////////////
////////     Program Control    /////////
/////////////////////////////////////////

// Visibility on Hover when header hidden


// progControlHTML.addEventListener('mouseenter',function(){
//     // if(visMenuHTML.classList.contains('hide')) progControlHTML.classList.remove('visibility-no');
//     progControlHTML.classList.remove('move-to-back');
//     console.log('Test :');
// });
// progControlHTML.addEventListener('mouseleave',function(){
//     // if(visMenuHTML.classList.contains('hide')) progControlHTML.classList.add('visibility-no');
//     progControlHTML.classList.add('move-to-back');
//     console.log('Test2 :');
// });

let delay = 1000;
let speed = 1;
let autoPlay = false;
// let autoPlayInterval = setInterval(autoPlayFunction,(delay/speed));
let autoPlayInterval;

function autoPlayFunction(){
    ProgMaster.step();
    // if(autoPlay) setTimeout(autoPlayFunction, delay/speed);
    clearInterval(autoPlayInterval);
    if(!PROGRAM_STOP && autoPlay) autoPlayInterval = setInterval(autoPlayFunction,delay);
}

// setTimeout(autoPlayFunction, delay/speed);

//play
progCntrlPlayHTML.addEventListener('click',TogglePlay);

//pause
progCntrlPauseHTML.addEventListener('click',TogglePlay);

function TogglePlay(){ 
    if(!PROGRAM_STOP) autoPlay = !autoPlay; 
    if(!PROGRAM_STOP && autoPlay) autoPlayFunction();
    if(PROGRAM_STOP && autoPlay) SHOULD_TEXT_MATRIX_BE_LOADED = true;
};


//speed
progCntrlSpeedHTML.addEventListener('click',ToggleSpeed);

function ToggleSpeed(){
    speed++;
    if(speed == 4) speed = 1;
    if(speed == 1) delay = 1000;
    if(speed == 2) delay = 500;
    if(speed == 3) delay = 100;
    progCntrlSpeedHTML.innerHTML = `Speed ${speed}X`;
}


//step
progCntrlStepHTML.addEventListener('click',NextStep);

function NextStep(){ if(!PROGRAM_STOP) ProgMaster.step(); }

// Load
let progCntrlLoad = document.getElementById('prog-control-btn-load');

progCntrlLoad.addEventListener('click', LoadProgFromTextArea);

function LoadProgFromTextArea(){
    SHOULD_TEXT_MATRIX_BE_LOADED = true;
} 

/////////////////////////////////////////
////////    Side (Vis) Menu     /////////
/////////////////////////////////////////


visMenuBtnTextHTML.addEventListener('click',ToggleVisText);
visMenuBtnSettingsHTML.addEventListener('click',ToggleVisSettings);
visMenuBtnDisplayHTML.addEventListener('click',ToggleVisDisplay);

//visMenuTextHTML

function ToggleVisText(){
    visMenuTextHTML.classList.remove('hide');
    visMenuSettingsHTML.classList.add('hide');
    visMenuDisplayHTML.classList.add('hide');
}

function ToggleVisSettings(){
    visMenuSettingsHTML.classList.remove('hide');
    visMenuTextHTML.classList.add('hide');
    visMenuDisplayHTML.classList.add('hide');
}

function ToggleVisDisplay(){
    visMenuDisplayHTML.classList.remove('hide');
    visMenuSettingsHTML.classList.add('hide');
    visMenuTextHTML.classList.add('hide');
}


//change dir
visMenuTextDir.addEventListener('focus',function(){ this.selectedIndex = -1;});
visMenuTextDir.addEventListener('change',function(){ 
    let tmp = document.getElementById('vis-dis-text-dir');
    ProgMaster.DisplaySettings.textDirection = tmp.options[tmp.selectedIndex].value;
    // console.log('DisplayControler.textDirection  :', DisplayControler.textDirection );
    SHOULD_TEXT_MATRIX_BE_LOADED = true;
});

//change dir
visMenuMesh.addEventListener('focus',function(){ this.selectedIndex = -1;});
visMenuMesh.addEventListener('change',function(){ 
    let tmp = document.getElementById('vis-dis-mesh');
    ProgMaster.DisplaySettings.meshId = tmp.options[tmp.selectedIndex].value;
    // console.log('DisplayControler.textDirection  :', DisplayControler.meshId );
    SHOULD_TEXT_MATRIX_BE_LOADED = true;
});

//Font Size
visMenuFontSize.addEventListener('change',function(){ 
    let tmp = document.getElementById('vis-dis-fontSize');
    ProgMaster.DisplaySettings.CurrentFont.size = tmp.value;
    // console.log('DisplayControler.textDirection  :', DisplayControler.CurrentFont.size );
    SHOULD_TEXT_MATRIX_BE_LOADED = true;
});






























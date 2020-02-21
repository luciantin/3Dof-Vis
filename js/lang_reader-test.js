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




let LangReader = {

    text : "",
    currentCharPos : -1,
    ROW_END : 'STP',
    PAGE_BEGIN : 'NEW',
    START_PAGE : 'STR',
    END_OF_PROGRAM : 'END',
    

    rowTypeHelper : '', //to remember the type
    rowTypeHelperFlg : false,  

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
        //tu se stvori data.push({label: lab[i], value: val[i]}) sa XYZ ? ili kasnije ?
        // let tmpType;
        // let nxtCmd = this.getNextCommand();

        // if(this.rowTypeHelper == '') tmpType = nxtCmd;
        // else tmpType = this.rowTypeHelper;

        // let tmpCmd = nxtCmd;
        let tmpCmd = this.getNextCommand();
        // let tmpType = tmpCmd;
        let cmdArray = [];

        while(tmpCmd != this.ROW_END && tmpCmd != this.PAGE_BEGIN  && tmpCmd != this.START_PAGE && tmpCmd != this.END_OF_PROGRAM){
            cmdArray.push(tmpCmd);
            tmpCmd = this.getNextCommand();
        };

        // this.rowTypeHelper = tmpCmd;

        cmdArray.push(this.ROW_END);
        // return {type : tmpType, row : cmdArray};
        return {type : tmpCmd, row : cmdArray};
        // return {type : tmpCmd, row : cmdArray, typeFront : tmpType};
    },

    getNextPage : function(){
        let tmpCmd = this.getNextRow();
        let cmdArray = [];

        while(tmpCmd.type != this.PAGE_BEGIN  && tmpCmd.type != this.START_PAGE && tmpCmd.type != this.END_OF_PROGRAM){
            cmdArray.push(tmpCmd.row);
            tmpCmd = this.getNextRow();
        }
        
        return {type : tmpCmd.type, page : cmdArray};
        // return {type : tmpCmd.type, row : cmdArray,  typeFront : tmpCmd.typeFront};
    },

    //OK
    CreateArrayFromProgramText : function(){
        let tmpPage = this.getNextPage();
        let tmpType = tmpPage.type;
        let book = [];

        while(tmpType != this.END_OF_PROGRAM){
            tmpPage = this.getNextPage();
            book.push({id : tmpType, page: tmpPage.page});
            tmpType = tmpPage.type;
        }

        console.log('book :', book);
        // console.log(this.getNextCommand());
    },
}



LangReader.text = progText;
// LangReader.CreateArrayFromProgramText();
LangReader.CreateArrayFromProgramText();
// for(let i = 0 ; i < 20; i++) {
// //     // let tmpC = LangReader.getNextChar()
// //     // if(tmpC.match(/[A-Z]/))console.log("Char : " + tmpC + " Char : " + tmpC.match(/[A-Z]/));
// //     // console.log(' LangReader.getNextValidChar() :',  LangReader.getNextValidChar()  );
//     let sc = LangReader.getNextPage();
//     console.table('getNextPage :', sc);
//     if(sc.type == 'END' ) break;
//     // if(sc.type == 'STR' ) break;
// }
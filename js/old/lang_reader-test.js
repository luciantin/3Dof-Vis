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

let progText2 = `
NEW
STO STP
STR
PUP NOP RRT NOP NOP NOP RRT CAZ PUP OIA SOA RDW STP 
RRT NOP RUP NOP NOP NOP RUP NOP NOP NOP NOP RLF STP
NEW
RRT AOA AOA AOA AOA AOA NEB RDW RDW STP
PDW AOA AOA AOA AOA AOA NOP RLF RRT OIB STO STP
END

`

//creates an array from text
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
        let tmpPage = this.getNextPage();
        let tmpType = tmpPage.type;
        let book = [];

        while(tmpType != this.END_OF_PROGRAM){
            tmpPage = this.getNextPage();
            book.push({id : tmpType, page: tmpPage.page});
            tmpType = tmpPage.type;
        }

        console.table(book);
        return book;
    },
}



// Compiler.loadProgText(progText2);
// Compiler.CreateArrayFromProgramText();
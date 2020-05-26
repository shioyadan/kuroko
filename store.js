const {exec} = require("child_process")
const fs = require("fs");


let id_ = 1;
const ACTION = {
    SAVE_PDF_FILE: id_++,
    CHECK_CLIPBOARD: id_++,
    SET_AUTO_CAPTURE: id_++,
    OPEN_DIALOG_FILE_SAVE: id_++,
    OPEN_DIALOG_MODAL_MESSAGE: id_++,
};
const CHANGE = {
    START_PROCESSING: id_++,
    END_PROCESSING: id_++,
    CONTENT_UPDATE: id_++,
    SET_AUTO_CAPTURE: id_++,
    OPEN_DIALOG_FILE_SAVE: id_++,
    OPEN_DIALOG_MODAL_MESSAGE: id_++,
};

class Store {
    constructor() {
        this.tmpPDF_FileName = "tmp2.pdf";
        this.prevSavedPDF_FileName = "";
        this.flag = false;
        this.handlers_ = {};
        this.isPDF_Created = false;
        this.autoCapture = false;
        this.inExec = false;

        this.on(ACTION.SAVE_PDF_FILE, (fileName)=>{

            fs.copyFile(this.tmpPDF_FileName, fileName, (err) => {
                if (err) {
                    console.log(err.stack);
                }
                else {
                    this.prevSavedPDF_FileName = fileName;
                    console.log("PDF copy successful");
                }
            });            
        });

        this.on(ACTION.CHECK_CLIPBOARD, ()=>{
            this.checkClipBoard();
        });

        this.on(ACTION.SET_AUTO_CAPTURE, (set)=>{
            this.autoCapture = set;
            this.trigger(CHANGE.SET_AUTO_CAPTURE);
        });

        this.on(ACTION.OPEN_DIALOG_FILE_SAVE, (defaultFileName) => {
            this.trigger(CHANGE.OPEN_DIALOG_FILE_SAVE, defaultFileName);
        });

        this.on(ACTION.OPEN_DIALOG_MODAL_MESSAGE, (msg) => {
            this.trigger(CHANGE.OPEN_DIALOG_MODAL_MESSAGE, msg);
        });
        
        //this.checkClipBoard();
        //setInterval(this.checkClipBoard.bind(this), 1000);
    }

    checkClipBoard(){
        if (this.inExec) {
            return;
        }
        console.log("Start conversion");
        this.inExec = true;
        this.trigger(CHANGE.START_PROCESSING);
        exec(`kuroko.exe -b ${this.tmpPDF_FileName}`, (err, stdout, stderr) => {
            this.inExec = false;
            if (!err) {
                this.isPDF_Created = true;
                console.log("Conversion successful");
            }
            else {
                this.isPDF_Created = false;
                console.log("Conversion fail");
                console.log(stdout);
            }
            this.trigger(CHANGE.END_PROCESSING);
            this.trigger(CHANGE.CONTENT_UPDATE);
        });
    }


    on(event, handler) {
        if (!event) {
            console.log(`Unknown event ${event}`);            
        }
        if (!(event in this.handlers_ )) {
            this.handlers_[event] = [];
        }
        this.handlers_[event].push(handler);
    }

    trigger(event, ...args) {
        if (!event) {
            console.log(`Unknown event ${event}`);            
        }
        if (event in this.handlers_) {
            let handlers = this.handlers_[event];
            for (let h of handlers) {
                h.apply(null, args);
            }
        }
    }

    get ACTION(){
        return ACTION;
    }
    get CHANGE(){
        return CHANGE;
    }
}

module.exports.Store = Store;
module.exports.ACTION = ACTION;
module.exports.CHANGE = CHANGE;
const {exec} = require("child_process")
const fs = require("fs");


let id_ = 1;
const ACTION = {
    INITIALIZE_STORE: id_++,
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

    constructor(externalModules) {
        // They *must not* be double quoted in the following.
        // They must be double quoted only for exec().
        this.tmpPDF_FileName_ = __dirname + "/tmp2.pdf";
        this.kurokoCLI_Bin_ = __dirname + "/kuroko-cli/kuroko-cli.exe";
        this.initialized = false;

        this.prevSavedPDF_FileName = "";
        this.flag = false;
        this.handlers_ = {};
        this.isPDF_Created = false;
        this.autoCapture = false;
        this.inExec = false;
        this.pdfjsLib = externalModules.pdfjsLib;

        this.on(ACTION.SAVE_PDF_FILE, (fileName)=>{

            fs.copyFile(this.tmpPDF_FileName_, fileName, (err) => {
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
        
        this.on(ACTION.INITIALIZE_STORE, (msg) => {
            this.initKurokoCLI_();
        });
        //this.checkClipBoard();
        //setInterval(this.checkClipBoard.bind(this), 1000);
    }

    initKurokoCLI_() {
        this.inExec = true;
        this.trigger(CHANGE.START_PROCESSING);

        // kurokoCLI_Bin_ must be double quoted only for exec().
        exec(`"${this.kurokoCLI_Bin_}" -k`, (err, stdout, stderr) => {
            console.log("kuroko-cli: " + stdout);
            if (err) {
                if (!fs.existsSync(this.kurokoCLI_Bin_)) {
                    this.trigger(
                        this.ACTION.OPEN_DIALOG_MODAL_MESSAGE, 
                        `Could not find a binary: ${this.kurokoCLI_Bin_}.`
                    );
                    this.initialized = false;
                    this.inExec = false;
                    this.trigger(CHANGE.END_PROCESSING);
                    return;
                }

                console.log("Kuroko-cli could not open a virtual printer. Now try to install the printer.");
                // kurokoCLI_Bin_ must be double quoted only for exec().
                exec(`"${this.kurokoCLI_Bin_}" -i`, (err, stdout, stderr) => {
                    console.log("kuroko-cli: " + stdout);
                    if (err) {
                        this.trigger(
                            this.ACTION.OPEN_DIALOG_MODAL_MESSAGE, 
                            "Failed initialization. Could not install a virtual printer."
                        );
                    }
                    else {
                        console.log("Successfully installed a virtual printer.");
                        this.initialized = true;
                        this.inExec = false;
                        this.trigger(CHANGE.END_PROCESSING);
                    }
                });
            }
            else {
                console.log("Successfully opened a virtual printer.");
                this.initialized = true;
                this.inExec = false;
                this.trigger(CHANGE.END_PROCESSING);
            }
        });
    }

    checkClipBoard() {
        if (this.inExec || !this.initialized) {
            return;
        }

        console.log("Start conversion");
        this.inExec = true;
        this.trigger(CHANGE.START_PROCESSING);
        // tmpPDF_FileName_ must be double quoted.
        exec(`"${this.kurokoCLI_Bin_}" -b "${this.tmpPDF_FileName_}"`, (err, stdout, stderr) => {
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

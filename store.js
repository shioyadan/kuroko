let id_ = 1;
const ACTION = {
    OPEN_EMF_FILE: id_++,
    CAPTURE_CLIPBOARD_EMF: id_++
};
const CHANGE = {
    CONTENT_UPDATE: id_++
};

class Store {
    constructor() {
        this.pdfFileName = "mpki.pdf";
        this.flag = false;

        this.handlers_ = {};

        this.on(ACTION.OPEN_EMF_FILE, ()=>{
        });
        this.on(ACTION.CAPTURE_CLIPBOARD_EMF, ()=>{
            this.trigger(CHANGE.CONTENT_UPDATE);
        });
    }

    on(event, handler) {
        if (!(event in this.handlers_ )) {
            this.handlers_[event] = [];
        }
        this.handlers_[event].push(handler);
    }

    trigger(event, ...args) {
        if (event in this.handlers_) {
            let handlers = this.handlers_[event];
            for (let h of handlers) {
                h(args);
            }
        }
    }
}

module.exports.Store = Store;
module.exports.ACTION = ACTION;
module.exports.CHANGE = CHANGE;

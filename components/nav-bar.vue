<template>
<div ref="nav" tabindex="0"> <!-- フォーカスを与えるためには tabindex がいる -->
    <b-navbar type="dark" variant="dark">
        <b-navbar-nav align="right">
            <b-nav-item @click.stop.prevent="onClickPaste" v-bind:disabled="isPasteDisabled">
                <b-icon icon="clipboard-data"></b-icon>
                Paste Objects (Ctrl+V)
            </b-nav-item>
            <b-nav-item @click.stop.prevent="onClickSavePDF" v-bind:disabled="isSavePDF_Disabled">
                <b-icon icon="file-earmark-arrow-down"></b-icon> 
                Save PDF (Ctrl+S)
            </b-nav-item>
            <b-nav-item @click.stop.prevent="onClickAutoCapture">
                <b-icon icon="check-box" v-if="autoCapture"></b-icon>
                <b-icon icon="square" v-else></b-icon>
                Auto Capture on Focus
            </b-nav-item>
            <!--
            <b-nav-text v-if="isProcessing" align="right">
                <b-spinner label="Processing" type="grow" small v-if="isProcessing"></b-spinner>
                Processing...
            </b-nav-text>
            -->
        </b-navbar-nav>
        <!-- ml-auto で左側マージンをオート（bootstrap の機能）-->
        <b-navbar-nav class="ml-auto">
            <b-nav-text v-if="isProcessing">
                Processing...
                <b-spinner label="Processing" small></b-spinner>
            </b-nav-text>
        </b-navbar-nav>
    </b-navbar>
</div>
</template>

<script>
//# sourceURL=components/nav-bar.vue

let {remote} = global.require("electron");
module.exports = {
    data: function() {
        return {
            isPasteDisabled: false,
            isSavePDF_Disabled: true,
            isProcessing: false,
            autoCapture: false
        }
    },
    props: ["store"],
    mounted: function(){
        let self = this;
        /** @type {import("../store.js").Store} */
        let store = this.store;
        self.autoCapture = store.autoCapture;

        store.on(store.CHANGE.START_PROCESSING, ()=>{
            self.isProcessing = true;
            self.isPasteDisabled = true;
            self.isSavePDF_Disabled = true;
        });
        store.on(store.CHANGE.END_PROCESSING, ()=>{
            self.isProcessing = false;
            self.isPasteDisabled = false;
            self.isSavePDF_Disabled = !store.isPDF_Created;
        });
        store.on(store.CHANGE.OPEN_DIALOG_FILE_SAVE, (defaultFileName)=>{
            const dialog = remote.dialog;
            dialog.showSaveDialog(
                remote.getCurrentWindow(), 
                {
                    //properties: ["openFile"],
                    filters: [
                        {
                            name: "PDF",
                            extensions: ["PDF"]
                        }
                    ],
                    defaultPath: defaultFileName
                }
            ).then((result) => {
                if (!result.filePath || result.canceled) {
                    return;
                }

                // Store にファイルを開いて貰う
                store.trigger(store.ACTION.SAVE_PDF_FILE, result.filePath);
            });
        });
        store.on(store.CHANGE.SET_AUTO_CAPTURE, ()=>{
            self.autoCapture = store.autoCapture;
        });
    },
    methods: {
        onClickSavePDF: function(){
            /** @type {import("../store.js").Store} */
            let store = this.store;
            store.trigger(store.ACTION.OPEN_DIALOG_FILE_SAVE, store.prevSavedPDF_FileName);
            this.$refs.nav.focus(); // どうやってもクリックイベントを外せないので，他所にフォーカスをもっていく
        },
        onClickPaste: function(){
            /** @type {import("../store.js").Store} */
            let store = this.store;
            store.trigger(store.ACTION.CHECK_CLIPBOARD);
            this.$refs.nav.focus();
        },
        onClickAutoCapture: function(){
            /** @type {import("../store.js").Store} */
            let store = this.store;
            store.trigger(store.ACTION.SET_AUTO_CAPTURE, !store.autoCapture);
            this.$refs.nav.focus();
        },
        getHeight: function(){
            return this.$refs.nav.offsetHeight;
        }
    }
}
</script>

<style>
</style>

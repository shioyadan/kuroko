<template>
    <div class="app">
        <nav-bar :store="store"></nav-bar>
        <preview-sheet :store="store"></preview-sheet>
        <!--
        <div class="alart">
            <b-alert show dismissible>Default Alert</b-alert>
        <div>
        -->
    </div>
</template>

<style>
.app {
    width: 100%;
    height: 100%;
}
.alart {
    position: absolute; 
    z-index: 100;
}
</style>

<script>
//# sourceURL=components/app.vue

module.exports = {
    data: function() {
        return {
        }
    },
    mounted: function(){
        let {remote} = global.require("electron");
        let self = this;
        /** @type {import("../store.js").Store} */
        let store = this.store;

        // フォーカスが回ってきたらクリップボードをチェック
        window.onfocus = function(){
            if (store.autoCapture) {
                store.trigger(store.ACTION.CHECK_CLIPBOARD);
            }
        };

        // 貼り付け
        document.onkeydown = function(e) {
            let key = e.key;
            if (key == "v" && e.ctrlKey) {
                store.trigger(store.ACTION.CHECK_CLIPBOARD);
            }
            if (key == "s" && e.ctrlKey) {
                store.trigger(store.ACTION.OPEN_DIALOG_FILE_SAVE, store.prevSavedPDF_FileName);
            }
        };

        store.on(store.CHANGE.OPEN_DIALOG_MODAL_MESSAGE, (msg)=>{
            self.$bvModal.msgBoxOk(msg, {
                okVariant: "dark",
            });
        });

        
        this.$nextTick(function (){
            // Get the current window
            let electronWindow = remote.getCurrentWindow();

            // Now all initialization is finished and show window.
            electronWindow.show();

            store.trigger(store.ACTION.INITIALIZE_STORE);
        });

    },
    props: ["store"],
    components: {
        // 子コンポーネント
        "nav-bar": "url:components/nav-bar.vue",
        "preview-sheet": "url:components/preview-sheet.vue"
    }
}
</script>

<style>
</style>

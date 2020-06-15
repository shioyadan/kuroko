<template>
    <div class="pdf_container">
        <canvas ref="pdf_canvas" class="pdf_canvas"></canvas>
    </div>
</template>

<style>
    .pdf_canvas {
        background-color: #777;
    }
    .pdf_container {
        background-color: #777;
        position: absolute;
        overflow: hidden;

        /* 親の全体にはりつく */
        height: 100%;
        width: 100%;

        /* 子要素を中央に */
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<script>
//# sourceURL=components/preview-sheet.vue

module.exports = {
    data: function() {
        return {
            pdfjsLib: null,
        }
    },
    props: ["store"],
    mounted: function(){
        let self = this;
        /** @type {import("../store.js").Store} */
        let store = this.store;

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        self.pdfjsLib = store.pdfjsLib;

        store.on(store.CHANGE.START_PROCESSING, function(){
            // 処理開始時にサイズ 0 にして不可視に
            let canvas = self.$refs.pdf_canvas;
            canvas.style.width = "0px";
            canvas.style.height = "0px";
            canvas.style.visibility = "hidden";
        });
        store.on(store.CHANGE.CONTENT_UPDATE, function(){
            if (store.isPDF_Created) {
                self.drawPDF(store.tmpPDF_FileName_);
            }
        });
    },
    methods: {
        drawPDF: function(fileName){
            let pdfjsLib = this.pdfjsLib;
            let canvas = this.$refs.pdf_canvas;
            
            let loadingTask = pdfjsLib.getDocument(fileName);
            loadingTask.promise.then(function(pdf) {
                //console.log("loaded");
                
                // Fetch the first page
                let pageNumber = 1;
                pdf.getPage(pageNumber).then(function(page) {
                    //console.log('Page loaded');
                    
                    let scale = 1;
                    let viewport = page.getViewport({scale: scale});

                    // キャンバスのサイズを変更
                    canvas.style.width = viewport.width + "px";
                    canvas.style.height = viewport.height + "px";

                    // Prepare canvas using PDF page dimensions
                    //let canvas = this.$refs.pdf_canvas;
                    let context = canvas.getContext('2d');
    
                    // High DPI 対策
                    let devicePixelRatio = window.devicePixelRatio || 1;
                    let backingStoreRatio = context.backingStorePixelRatio || 1;
                    
                    if (devicePixelRatio !== backingStoreRatio) {
                        // 高解像度の際は内部サイズを大きくする
                        let ratio = devicePixelRatio / backingStoreRatio;
                        canvas.width = canvas.clientWidth * ratio;
                        canvas.height = canvas.clientHeight * ratio;
                        context.scale(ratio, ratio);
                    }
                    else{
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        context.scale(1, 1);
                    }

                    // Render PDF page into canvas context
                    let renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    let renderTask = page.render(renderContext);
                    renderTask.promise.then(function () {
                        canvas.style.visibility = "visible";
                        //console.log('Page rendered');
                    });
                });
            });
        }
    }
}
</script>


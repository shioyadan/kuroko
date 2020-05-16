<template>
    <div class="pdf_container">
        <canvas ref="pdf_canvas"></canvas>
    </div>
</template>

<style>
    .pdf_container {
        background-color: #777;
    }
</style>

<script>
//# sourceURL=components/preview-sheet.vue

module.exports = {
    data: function() {
        return {
        }
    },
    props: ["store"],
    mounted: function(){
        /** @type {import("../store.js").Store} */
        let store = this.store;
        let canvas = this.$refs.pdf_canvas;

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        let pdfjsLib = global.require("./node_modules/pdfjs-dist/build/pdf.js");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "./node_modules/pdfjs-dist/build/pdf.worker.js";
        
        let loadingTask = pdfjsLib.getDocument("mpki.pdf");
        loadingTask.promise.then(function(pdf) {
            //console.log("loaded");
            
            // Fetch the first page
            let pageNumber = 1;
            pdf.getPage(pageNumber).then(function(page) {
                //console.log('Page loaded');
                
                let scale = 8;
                let viewport = page.getViewport({scale: scale});

                // Prepare canvas using PDF page dimensions
                //let canvas = this.$refs.pdf_canvas;
                let context = canvas.getContext('2d');
                canvas.height = viewport.height * 1.75;
                canvas.width = viewport.width * 1.75;
                context.scale(1.75, 1.75);
                canvas.style.width = "100%";
                canvas.style.height = "100%";

                // Render PDF page into canvas context
                let renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                let renderTask = page.render(renderContext);
                renderTask.promise.then(function () {
                    //console.log('Page rendered');
                });
            });
        });
    }
}
</script>


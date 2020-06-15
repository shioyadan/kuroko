/*
<!-- 下記の CSS と js を１つにまとめた js を生成する -->
<link rel="stylesheet" type="text/css" href="./node_modules/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="./node_modules/bootstrap-vue/dist/bootstrap-vue.min.css">

<script src="./node_modules/vue/dist/vue.js"></script>
<script src="./node_modules/bootstrap-vue/dist/bootstrap-vue.js"></script>    
<script src="./node_modules/bootstrap-vue/dist/bootstrap-vue-icons.min.js"></script>
<script src="./node_modules/http-vue-loader/src/httpVueLoader.js"></script>
<script src="./node_modules/pdfjs-dist/build/pdf.js"></script>
*/

import "./node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./node_modules/bootstrap-vue/dist/bootstrap-vue.min.css";

// global に読み込んだモジュールを格納しておく
global["externalModules"] = 
{
    Vue: require("./node_modules/vue/dist/vue.js"),
    BootstrapVue: require("./node_modules/bootstrap-vue/dist/bootstrap-vue.js"),
    BootstrapVueIcons: require("./node_modules/bootstrap-vue/dist/bootstrap-vue-icons.min.js"),
    httpVueLoader: require("./node_modules/http-vue-loader/src/httpVueLoader.js"),
    pdfjsLib: require("./node_modules/pdfjs-dist/webpack.js"),
};


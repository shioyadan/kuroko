module.exports = {
    // 入力ファイル
    entry: "./external_modules_src.js",
    output: {
        // 出力先
        path: `${__dirname}/dist`,
        // 生成済みファイルから参照される時のパス
        publicPath: "dist/",
        // 生成ファイル
        filename: "external_modules.js",
        // 出力フォーマット
        //libraryTarget: "umd",
    },
    // electron 向け
    target: "electron-renderer",
    
    // 開発バージョン
    //mode: "production",
    mode: "development",

    // Source map の有効化
    devtool: 'inline-source-map',

    // Vue のインスタンスが複数ある旨のエラーを抑制するために必要
    resolve: {
        alias: {
          'vue$': 'vue/dist/vue.js'
        }
    },

    // CSS
    module: {
        rules: [{
            test: /\.css/,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: { url: false }
                }
            ]
        }]
    }
};

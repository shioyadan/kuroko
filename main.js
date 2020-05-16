"user strict";

// 起動時の開発者ツール内での警告を消すため
// ローカルファイルを読むと HTTP で通信したと見なされ，警告がでるらしい
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "1";

const electron = require("electron");
const {app} = electron;
const {BrowserWindow} = electron;

// __dirname には現在のファイルの場所が入る
let currentURL = "file://" + __dirname + "/index.html";

// メインウィンドウはGCされないようにグローバル宣言
let m_window = null;

// 起動時の警告さけ
//app.allowRendererProcessReuse = false;

// 全てのウィンドウが閉じたら終了
app.on("window-all-closed", function(){
    if (process.platform != "darwin") {
        app.quit();
    }
});

// Electronの初期化完了後に実行
app.on("ready", function() {
    // The main window is not shown while loading. 
    m_window = new BrowserWindow({
        width: 800, 
        height: 600, 
        show: true,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            plugins: true,   // PDF ビューアを使うために必要
            enableRemoteModule: true,
            webviewTag: true
        }
    });
    //m_window.setMenu(null);

    m_window.loadURL(currentURL);
    //m_window.toggleDevTools();

    // ウィンドウが閉じる前に，設定を保存
    // store.config が生きている間 = ウィンドウの生存期間内に処理をしないといけない
    m_window.on("close", function() {
        //m_window.webContents.executeJavaScript("store.config.save();");
    });

    // ウィンドウが閉じられたらアプリも終了
    m_window.on("closed", function() {
        m_window = null;
    });
});


declare let __dirname: string;
declare let process: any;
declare let global: any;

declare module "electron" {
    export let remote: any;    
    export let app: any;
    export let BrowserWindow: any;
}

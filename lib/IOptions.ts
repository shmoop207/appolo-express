import appolo = require('appolo');

export interface IOptions extends appolo.IOptions{
    templateEngine?: string,
    viewsFolder?: string,
    publicFolder?: string,
    uploadsFolder?: string,
    startMessage?: string,
    startServer?: boolean,
    loadDefaultConfigurations?: boolean,
    useBodyParser?: boolean,
    port?:number,
    ssl?:{
        key:string
        cert:string
    }
}
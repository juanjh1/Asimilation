import http from 'http';
import { backendMessaje } from './utils.js';
import { RouteManager } from './router-manager.js';



class UrlManager{
    #urlManager;
    constructor(pathManager){
        this.#urlManager = pathManager
    }
    addPath(name, def){
        this.#urlManager.addPath(name, def);
    }
    createRouteModule(name){
        this.#urlManager.createRouteModule(name);
    }
}


class Asimilation {
    static server = new Asimilation();
    #routerManager;
    #liveServer;
    constructor() {
        this.#routerManager = new RouteManager();
        this.#liveServer = this.#createServer();
    }

    #createServer() {
        return http.createServer((req, res) => {
            try {
                let statusCode = this.#routerManager.controlerHadler(req, res);
                //backendMessaje(statusCode);
            } catch (error) {
                let header = 500;
                res.writeHead(header, { 'Content-Type': 'text/plain' });
                res.end('Ocurrio un error');
            }
        })

    }

    listen(port) {
        this.#liveServer.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    }


    urlManager(){
        return new UrlManager(this.#routerManager);
    }

}

const server = Asimilation.server;
const url = server.urlManager();
export { server, url };

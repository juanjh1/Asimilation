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
            let header;
            try {
                console.log(!this.#routerManager.pathInclude(req.url))
                console.log(this.#routerManager)
                if (!this.#routerManager.pathInclude(req.url)) {
                    header = 404;
                    let message = backendMessaje(header)
                    message(req)
                    res.writeHead(header, { 'Content-Type': 'text/plain' });
                    res.end('Ruta no encontrada');
                    return;
                }
                header = 200;
                let message = backendMessaje(header)
                message(req)
                res.writeHead(header, { 'Content-Type': 'application/json' });
                this.#routerManager.execDef(req)(res)

            } catch (error) {
                header = 500;
                let message = backendMessaje(header)
                res.writeHead(header, { 'Content-Type': 'text/plain' });
                res.end('Ruta no encontrada');
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

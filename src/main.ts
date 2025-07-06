import http from 'http';
import { backendMessaje } from './utils.js';
import { RouteManager } from './router-manager.js';



class pathManagerAdapter{
    #pathManager: RouteManager ;
    constructor(pathManager: RouteManager){
        this.#pathManager = pathManager
    }
       addPath(name: string, callback: (req: any, res: any) => void) {
        this.#pathManager.addPath(name, callback);
    }
    createRouteModule(name: string){
        this.#pathManager.createRouteModule(name);
    }
}


class Asimilation {
    static server = new Asimilation();
    #routerManager: RouteManager;
    #liveServer: http.Server; 
    constructor() {
        this.#routerManager = new RouteManager();
        this.#liveServer = this.#createServer();
    }

    #createServer() : http.Server {
        return http.createServer((req, res) => {
            let statusCode: number;
            try {
                statusCode = this.#routerManager.controlerHadler(req, res);
                backendMessaje(statusCode);
            } catch (error) {
                statusCode = 500;
                backendMessaje(statusCode);
                res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
                res.end('Ocurrio un error');
            }
        })

    }

    listen(port:number) {
        this.#liveServer.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    }


    urlManager(){
        return new pathManagerAdapter(this.#routerManager);
    }

}

const server = Asimilation.server;
const url = server.urlManager();
export { server, url };

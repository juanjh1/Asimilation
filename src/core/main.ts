import http from 'http';
import { RouteManager, RouteModule } from './router-manager.js';
import { MiddlewarePipeline } from './middleware-manager.js';
import { MiddlewareManagerI } from '../interfaces/middleware-manager.js';
import { pathKwargs} from './type.js';
import { sendJsonMessage } from '../helpers/http-responses.js';

class PathManagerAdapter{
    #pathManager: RouteManager;

    constructor(pathManager: RouteManager){
        this.#pathManager = pathManager
    }

    addPath(name: string, callback: (req: any, res: any) => void, kwargs?: pathKwargs) {
        this.#pathManager.addPath(name, callback, kwargs);
    }

    createRouteModule(name: string):RouteModule {
       return this.#pathManager.createRouteModule(name);
    }
}


class Asimilation {
    static server = new Asimilation(MiddlewarePipeline);
    #routerManager: RouteManager;
    #liveServer: http.Server; 
    constructor(middelwareManager: MiddlewareManagerI) {
        this.#routerManager = new RouteManager(middelwareManager);
        this.#liveServer = this.#createServer();
    }

    #createServer() : http.Server {
        return http.createServer((req, res) => {
            try {
                this.#routerManager.controlerHadler(req, res);
            } catch (err) {
                if (err instanceof Error) {
                    this.#close(err.message, err.stack)
                }
                sendJsonMessage(res, {message: 'Internal Server error' }, 500)

            }
        })

    }


    #close(message: string, stack: string|undefined){
        this.#liveServer.close( ()=>{
            console.log(message)
            console.log(stack)
        })
    }

    #listen(port:number):void {
        this.#liveServer.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    }

    init(port: number, path:string ){
        this.#listen(port);
    }
    urlManager(): PathManagerAdapter {
        return new PathManagerAdapter(this.#routerManager);
    }

}

const server = Asimilation.server;
const url = server.urlManager();
export { server, url };

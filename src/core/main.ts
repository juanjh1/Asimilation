import { ServerResponse } from 'http';
import { RouteManager, RouteModule } from './router-manager.js';
import { MiddlewarePipeline } from './middleware-manager.js';
import { PathKwargs } from './type.js';
import { ArgumentedIncomingMessage } from '../interfaces/custom-request.js';
import { RouteManagerI } from '../interfaces/route-manager.js';
import {AsimilationServer} from "./asi_server.js"

class PathManagerAdapter {
    
    #pathManager: RouteManagerI;

    constructor(pathManager: RouteManagerI) {
        this.#pathManager = pathManager
    }

    addPath(name: string, callback: (req: ArgumentedIncomingMessage, res: ServerResponse) => void, kwargs?: PathKwargs) {
        this.#pathManager.addPath(name, callback, kwargs);
    }

    createRouteModule(name: string): RouteModule {
        return this.#pathManager.createRouteModule(name);
    }

}

class Asimilation {
    
    static server = new Asimilation(new RouteManager(MiddlewarePipeline));
    
    #routerManager	: RouteManagerI;
    #liveServer		: AsimilationServer;
    #port		: number = 5000;
    #basePath		: string = "";
    
    constructor(routerManager: RouteManagerI ) {
        this.#routerManager = routerManager;
        this.#liveServer = new AsimilationServer(routerManager.controlerHadler.bind(routerManager));
    }
    
    setup(port: number, path: string):void{
	this.#port = port;
	this.#basePath = path;
    }

    run(){
	this.#liveServer.startListening(this.#port);
        this.#liveServer.handlerRequest();
    }

    urlManager(): PathManagerAdapter {
        return new PathManagerAdapter(this.#routerManager);
    }
}

const asi: Asimilation = Asimilation.server;
const url: PathManagerAdapter = asi.urlManager();
export { asi, url };

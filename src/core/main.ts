import { RouteManager} from './router-manager.js';
import { MiddlewarePipeline } from './middleware-manager.js';
import { RouteManagerI } from '../interfaces/route-manager.js';
import {AsimilationServer} from "./asi_server.js"

class Asimilation {
    
    static server = new Asimilation(new RouteManager(MiddlewarePipeline));
    
    #routerManager	: RouteManagerI;
    #liveServer		: AsimilationServer;
    #port		    : number = 5000;
    #basePath		: string = "";
    
    constructor(routerManager: RouteManagerI ) {
        this.#routerManager = routerManager;
        this.#liveServer = new AsimilationServer(routerManager.controllerHandler.bind(routerManager));
    }
    
    setup(port: number, path: string) : void{
	    this.#port = port;
	    this.#basePath = path;
    }

    run(): void {
	    this.#liveServer.startListening(this.#port);
      this.#liveServer.handlerRequest();
    }

    urlManager(): RouteManagerI {
        return this.#routerManager
    }

    setUrlPrefix(prefix: string){
        // to do
    }
}

const asi: Asimilation = Asimilation.server;
const url: RouteManagerI = asi.urlManager();

export { asi, url };

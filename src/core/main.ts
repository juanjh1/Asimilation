import { RouteManager} from '../managers/router.manager.js';
import { MiddlewarePipeline } from '../managers/middleware.manager.js';
import { RouteManagerI } from '../interfaces/route-manager.js';
import {AsimilationServer} from "./asi.server.js"
import { AsimilationConfiguration } from './asimilation.config.js';
import { ConfigType } from '../types/config.type.js';

class Asimilation {
    
    static server = new Asimilation(new RouteManager(MiddlewarePipeline));
    
    #routerManager	: RouteManagerI;
    #liveServer		  : AsimilationServer;
    #config         : AsimilationConfiguration;

    constructor(routerManager: RouteManagerI ) {
        this.#routerManager = routerManager;
        this.#liveServer    = new AsimilationServer(routerManager.controllerHandler);
        this.#config        = new AsimilationConfiguration(import.meta.url)
    }
    
    setup(config: ConfigType): void{
      const port: number | undefined = config.port
      if ( port ) this.#config.setPort(port);
    }

    run(): void {
	    this.#liveServer.startListening(this.#config.getPort());
      this.#liveServer.handlerRequest();
    }

    urlManager(): RouteManagerI {
        return this.#routerManager
    }

    use(): void {}

    setUrlPrefix(prefix: string): void{
        // to do
    }
}

const asi: Asimilation = Asimilation.server;
const url: RouteManagerI = asi.urlManager();

export { asi, url };

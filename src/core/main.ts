import { RouteManager}        from '../managers/router.manager.js';
import { RouteManagerI }      from '../interfaces/route-manager.js';
import { AsimilationConfiguration } from './asimilation.config.js';
import { ConfigType }         from '../types/config.type.js';
import  Middelware from  '../managers/middleware.manager.js' 
import { InitializationError } from '../exceptions/basics/initialization.error.js';   
import { AsimilationServerI } from '../interfaces/asimilation.server.interface.js';
import { AsimilationServer } from './asi.server.js';
import { AsimilationConfigurationI } from '../interfaces/asimilation.config.interface.js';
import { Controller } from './type.js';
import { PathKwargs } from './type.js'; 
import { GetRouteI } from '../interfaces/router.interface.js';

const token = Symbol("AsInitToken")

export default class Asimilation {
    
    #rm	: RouteManagerI;
    #liveServer		  : AsimilationServerI;
    #config         : AsimilationConfigurationI;
    #baseUrl        : string;
    
    constructor(
      routerManager : RouteManagerI, 
      liveServer    : AsimilationServerI,
      tkn           : Symbol,
      config        : AsimilationConfigurationI 
    ) {
        if (token !== tkn) throw new InitializationError(this.constructor.name);  
        this.#rm = routerManager;
        this.#liveServer    = liveServer;
        this.#config        = config;
        this.#baseUrl        = '';
    }
    
    setup(config: ConfigType): void{
      const port: number | undefined = config.port
      this.#config.setPort(port)
      
    }

    run(): void {
	    this.#liveServer.startListening(this.#config.getPort());
      this.#liveServer.handlerRequest();
    }

    use(
      context: GetRoute 
    ): void {
      if( context instanceof GetRoute){
        for(const  route  of context.getRoute() ){

        }
      }
    }

    setUrlPrefix(prefix: string): void{
      this.#baseUrl = prefix
    }

    route(
      url       : string, 
      callback  : Controller, 
      kwargs?   : PathKwargs
    ){
        this.#rm.route(this.#baseUrl + url, callback, kwargs)    
    }

    static init(): Asimilation{
      const md = new Middelware() 
      const rm = new RouteManager(md)
      const as = new AsimilationServer(rm.controllerHandler)
      const ac = new AsimilationConfiguration(import.meta.url)
      return new Asimilation(rm, as, token, ac)
    } 
}

import { IncomingMessage, ServerResponse, METHODS } from 'http';
import { MiddelwareManagerI } from '../interfaces/middelware-manager.js';
import { middelwareFunction } from './middelware-manager.js';
import "../middelwares.js";


export class RouteManager {
  #paths: Map<string|undefined, (req: IncomingMessage, res :ServerResponse)=>void>;
  #middelwareManger: MiddelwareManagerI;
  constructor(middelwareManager: MiddelwareManagerI) {
    // we use map/ thats works becouse each endpoint its unique
    this.#middelwareManger = middelwareManager;
    this.#paths = new Map();
  }

  #pathInclude(url: string | undefined){
    return this.#paths.has(url)
  }

  addPath(url: string, callback: ( req: IncomingMessage, res:ServerResponse, kwargs?:{methods?: string[], handlers: middelwareFunction  }) => void) {
    // replace the reguex for starsWhit for best legibility
    if (!url.startsWith("/")) {
      url = "/" + url
    }

    this.#paths.set(url, callback)
  }

  controlerHadler(req: IncomingMessage, res: ServerResponse) {
    let header;
    if (!this.#pathInclude(req.url)) {
      header = 404;
      res.writeHead(header, { 'Content-Type': 'text/plain' });
      res.end('Ruta no encontrada');
      return header;
    }
    header = 200;
    res.writeHead(header, { 'Content-Type': 'application/json' });
 
    const handler = this.#paths.get(req.url);
    if (handler) {
      const { req:processedReq , res: processedRes} = this.#middelwareManger.run(req, res)
      handler(processedReq, processedRes);
    }
    return header;
  }


  createRouteModule(name: string) {
    return new RouteModule(this, name)
  }

}



class RouteModule {
  #manager: RouteManager;
  #baseNameSpace: string;
  constructor(manager: RouteManager, nameSpace: string) {
    this.#manager = manager;
    this.#baseNameSpace = nameSpace;
  }

}
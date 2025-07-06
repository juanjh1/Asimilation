import { IncomingMessage, ServerResponse } from 'http';

export class RouteManager {
  paths: Map<string|undefined, (req: IncomingMessage, res :ServerResponse)=>void>;

  constructor() {
    // we use map/ thats works becouse each endpoint its unique
    this.paths = new Map();

  }

  #pathInclude(url: string | undefined){
    return this.paths.has(url)
  }


  addPath(url: string, callback: ( req: IncomingMessage, res:ServerResponse,) => void) {
    if (!/^\//.test(url)) {
      url = "/" + url
    }
    this.paths.set(url, callback)
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
 
    const handler = this.paths.get(req.url);
    if (handler) {
      handler(req, res);
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
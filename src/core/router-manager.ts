import { IncomingMessage, ServerResponse, METHODS } from 'http';
import { MiddelwareManagerI } from '../interfaces/middelware-manager.js';
import { middelwareFunction, pathKwargs } from './type.js';
import { controller,  } from './type.js';
import "../middlewares.js";
import "../default/middleware/logger.js";

export class RouteManager {

  // 
  #paths: Map<string | undefined, Map<string, controller>>;
  #middelwaresByPath: Map<string, middelwareFunction []>;
  #middelwareManger: MiddelwareManagerI;

  constructor(middelwareManager: MiddelwareManagerI) {
    // we use map/ thats works becouse each endpoint its unique
    this.#middelwareManger = middelwareManager;
    this.#paths = new Map();
    this.#middelwaresByPath = new Map();
    
  }

  #pathInclude(url: string | undefined) {
    return this.#paths.has(url);
  }



  #validateMethod(method: string){
      if (!METHODS.includes(method)) {
        throw new Error("The method is not suported");
      }
  }


  addPath(url: string,
    callback: controller,
    kwargs?: pathKwargs) {

    // replace the reguex for starsWhit for best (or major my english is still broken) legibility
    url = this.validatePath(url)

    let methodsMap: Map<string, controller> = new Map()
    this.#paths.set(url, methodsMap)
    if (!kwargs || !kwargs.methods) {
      METHODS.forEach((metod: string) => {
        methodsMap.set(metod, callback);
      });
      return;
    }

    let incomngMethods: string[] = kwargs.methods

    incomngMethods.forEach((method: string) => {
      method = method.toLocaleUpperCase();
      this.#validateMethod(method);
      methodsMap.set(method, callback);
    });

  }

  validatePath(nameSpace: string) : string{
    if(!nameSpace.startsWith("/")){
      nameSpace = "/" +  nameSpace
    }
    nameSpace = nameSpace.replace(/\/+/g, "/");
    return nameSpace
  }


  controlerHadler(req: IncomingMessage, res: ServerResponse): void {
    let header;
    if (!this.#pathInclude(req.url)) {
      header = 404
      res.writeHead(header, { 'Content-Type': 'text/plain' });
      res.end("Path don't find");
      req.statusCode = header;
      return;
    }
  
    //header = 200;
    //res.writeHead(header, { 'Content-Type': 'application/json' });
    const handler = this.#paths.get(req.url);
    if (!handler) { throw new Error("The path is not working properly") }
    let method = req.method
    if (!method) {
      header = 400;
      res.writeHead(header, { 'Content-Type': 'text/plain' });
      res.end('Your reques comming whiout a method');
      req.statusCode = header;
      return;
    }

    if (!handler.has(method)) {
      header = 404;
      res.writeHead(header, { 'Content-Type': 'text/plain' });
      res.end("Path don't find");
      req.statusCode = header;
      return;
    }

    const { req: processedReq, res: processedRes } = this.#middelwareManger.run(req, res);

    let callback: (controller) | undefined = handler.get(method);

    if (!callback) {
      header = 500;
      res.writeHead(header, { 'Content-Type': 'text/plain' });
      res.end("Internal server error");
      req.statusCode = header;
      throw new Error("Callback can't be Undefined ")
    }

    callback(processedReq, processedRes);

    req.statusCode = header;

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
    this.#baseNameSpace = this.#manager.validatePath(nameSpace);
  }


  addPath(path: string, callback: controller, kwargs?: pathKwargs){
     path = this.#baseNameSpace + this.#manager.validatePath(path)
     this.#manager.addPath(path, callback, kwargs)
  }

    createRouteModule(name: string) {
    return new RouteModule(this.#manager, (this.#baseNameSpace + this.#manager.validatePath(name)))
  }

}
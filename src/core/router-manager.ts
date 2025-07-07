import { IncomingMessage, ServerResponse, METHODS } from 'http';
import { MiddelwareManagerI } from '../interfaces/middelware-manager.js';
import { middelwareFunction } from './middelware-manager.js';
import "../middelwares.js";
import { error } from 'console';


export class RouteManager {
  #paths: Map<string|undefined, Map<string, (req: IncomingMessage, res :ServerResponse)=>void> >;
  #middelwareManger: MiddelwareManagerI;
  constructor(middelwareManager: MiddelwareManagerI) {
    // we use map/ thats works becouse each endpoint its unique
    this.#middelwareManger = middelwareManager;
    this.#paths = new Map();
  }

  #pathInclude(url: string | undefined){
    return this.#paths.has(url);
  }

  addPath(url: string,
    callback: (req: IncomingMessage, res: ServerResponse) => void,
    kwargs?: { methods?: string[], handlers?: middelwareFunction[] }) {
    // replace the reguex for starsWhit for best (or major my english is still broken) legibility
    if (!url.startsWith("/")) {
      url = "/" + url;
    }

    let methodsMap : Map<string,(req: IncomingMessage, res :ServerResponse)=>void> = new Map()
    this.#paths.set(url, methodsMap)
    if (!kwargs || !kwargs.methods) {
      METHODS.forEach((metod: string) => {
        methodsMap.set(metod, callback);
      });
      return;
    }

    let incomngMethods: string[] =  kwargs.methods

    incomngMethods.forEach((method: string) => {
      method = method.toLocaleUpperCase();

      if( !METHODS.includes(method)){
        throw new Error("The method is not suported");
        return;
      }
      methodsMap.set(method, callback);
    });
    
  }

  controlerHadler(req: IncomingMessage, res: ServerResponse) {
    let header;
    if (!this.#pathInclude(req.url)) {
      header = 404;
      res.writeHead(header, { 'Content-Type': 'text/plain' });
      res.end("Path don't find");
      return header;
    }
    header = 200;
    res.writeHead(header, { 'Content-Type': 'application/json' });
 
    const handler = this.#paths.get(req.url);
    if (!handler) { throw new Error("The path is not working properly")}
    let method = req.method
    if(!method){
      header = 400;
      res.writeHead(header, { 'Content-Type': 'text/plain' });
      res.end('Your reques comming whiout a method');
      return header;
    }

    if(!handler.has(method)){
      header = 404;
      res.writeHead(header, { 'Content-Type': 'text/plain' });
      res.end("Path don't find");
      return header;
    }

    const { req:processedReq , res: processedRes} = this.#middelwareManger.run(req, res);
  
    let callback : ((req: IncomingMessage, res: ServerResponse) => void) | undefined = handler.get(method);

    if(!callback){
      header = 500;
      res.writeHead(header, { 'Content-Type': 'text/plain' });
      res.end("Internal server error");
      throw new Error("Callback can't be Undefined ")
    }
  
    callback(processedReq, processedRes);
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
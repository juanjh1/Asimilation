import { IncomingMessage, ServerResponse, METHODS } from 'http';
import { MiddelwareManagerI } from '../interfaces/middelware-manager.js';
import { middelwareFunction, pathKwargs ,ControllerRegistry, routeMiddlewares, routeMap} from './type.js';
import { sendTextMessaje } from '../utils/http-responses.js';
import { controller } from './type.js';
import "../middlewares.js";
import "../default/middleware/logger.js";

export class RouteManager {

  // 
  #paths: ControllerRegistry ;
  #middelwaresByPath: routeMiddlewares;
  #middelwareManger: MiddelwareManagerI;

  constructor(middelwareManager: MiddelwareManagerI) {
    // we use map/ thats works becouse each endpoint its unique
    this.#middelwareManger = middelwareManager;
    this.#paths = new Map();
    this.#middelwaresByPath = new Map();
    
  }

  #pathInclude(url: string | undefined): boolean {
    return this.#paths.has(url);
  }



  #validateMethod(method: string):void{
      if (!METHODS.includes(method)) {
        throw new Error("The method is not suported");
      }
  }


  addPath(url: string,
    callback: controller,
    kwargs?: pathKwargs) {

    // replace the reguex for starsWhit for best (or major my english is still broken) legibility
    url = this.parsePath(url)

    let methodsMap: routeMap = new Map()
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


    let middlewares: middelwareFunction [] | undefined= kwargs.handlers
    if(middlewares){
      this.#middelwaresByPath.set(url, middlewares)
    }
  }


  parsePath(nameSpace: string) : string{
    if(!nameSpace.startsWith("/")){
      nameSpace = "/" +  nameSpace
    }
    nameSpace = nameSpace.replace(/\/+/g, "/");
    return nameSpace
  }

 // i need fix that because i has a bigg problem indetify the acceptance 
 // dont delete req, remenber its for the acceptance 
  #handleNotFound(req: IncomingMessage, res: ServerResponse) : void{
      let code = 404
      req.statusCode = code;
      sendTextMessaje(res, "path not found", code)
  }

  #assertHandler(path: routeMap | undefined ):routeMap{
    if(path === undefined){
      throw new Error("The path is not working properly")
    }
    return  path
  }


  #assertMethod(req: IncomingMessage, res: ServerResponse) : void{
    let code = 400;
    req.statusCode = code;
    sendTextMessaje(res, "Your reques comming whiout a method", code)
  
  }


  #assertCallback(req: IncomingMessage, res: ServerResponse, callback : undefined | controller) : controller{
    let code = 500;
    if(callback === undefined){
      sendTextMessaje(res, "Internal server error", code )
      req.statusCode = code;
      throw new Error("Callback can't be Undefined ")
    }

    return callback
  }


  controlerHadler(req: IncomingMessage, res: ServerResponse): void {
    
    const { req: processedReq, res: processedRes } = this.#middelwareManger.run(req, res);

    if (!this.#pathInclude(req.url)) {
      this.#handleNotFound(req, res);
      return;
    }  
    
    let handler: routeMap  = this.#assertHandler(this.#paths.get(req.url));

    let method: string | undefined  = req.method
    if (!method) {
      this.#assertMethod(req, res)
      return;
    }

    if (!handler.has(method)) {
      this.#handleNotFound(req, res)
      return;
    }

    let callback: controller  = this.#assertCallback(req, res,handler.get(method)) ; 


    callback(processedReq, processedRes);

    req.statusCode = 200;

  }

  createRouteModule(initialPaht: string) {
    return new RouteModule(this, initialPaht)
  }
}



export class RouteModule {
  #manager: RouteManager;
  #initialPath: string;

  constructor(manager: RouteManager, nameSpace: string) {
    this.#manager = manager;
    this.#initialPath = this.#manager.parsePath(nameSpace);
  }


  addPath(path: string, callback: controller, kwargs?: pathKwargs){
     path = this.#initialPath + this.#manager.parsePath(path)
     this.#manager.addPath(path, callback, kwargs)
  }

    createRouteModule(name: string) {
    return new RouteModule(this.#manager, (this.#initialPath + this.#manager.parsePath(name)))
  }

}
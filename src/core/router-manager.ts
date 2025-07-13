import { IncomingMessage, ServerResponse, METHODS } from 'http';
import { MiddlewareManagerI } from '../interfaces/middleware-manager.js';
import { middlewareFunction, pathKwargs ,ControllerRegistry, routeMiddlewares, routeMap} from './type.js';
import { sendTextMessage } from '../helpers/http-responses.js';
import { controller } from './type.js';
import "../middlewares.js";
import "../default/middleware/logger.js";

export class RouteManager {

  #paths: ControllerRegistry ;
  #middlewaresByPath: routeMiddlewares;
  #middlewareManger: MiddlewareManagerI;

  constructor(middlewareManager: MiddlewareManagerI) {
    // we use map/ thats works because each endpoint it's unique
    this.#middlewareManger = middlewareManager;
    this.#paths = new Map();
    this.#middlewaresByPath = new Map();
    
  }

  #pathInclude(url: string): boolean {
    return this.#paths.has(url);
  }

  #validateMethod(method: string):void{
      if (!METHODS.includes(method)) {
        throw new Error("The method is not suported");
      }
  }

  #basicRegisterMethods(incomngMethods: string [] ,methodsMap: routeMap, callback: controller){
      incomngMethods.forEach((metod: string) => {
        methodsMap.set(metod, callback);
      });
  }

  #registerAllMethodsByDefault(methodsMap: routeMap, callback: controller){
    this.#basicRegisterMethods(METHODS, methodsMap, callback )
  }

  #registerMethods(incomngMethods: string [], methodsMap: routeMap, callback: controller ){
    
    incomngMethods = incomngMethods.map((method: string) => { 
      method = method.toUpperCase()
      this.#validateMethod(method)
      return method
     })
    
     this.#basicRegisterMethods(incomngMethods, methodsMap, callback)
  }

  #setMiddlewaresSafety(middlewares: middlewareFunction[] | undefined, url:string): void{   
    if(middlewares){
        this.#middlewaresByPath.set(url, middlewares)
    }else{
        this.#middlewaresByPath.set(url, [])
    }
  }

  #setMethodsSafety(incomngMethods :string[] | undefined, callback: controller, methodsMap: routeMap): void {
  if(incomngMethods){
      this.#registerMethods(incomngMethods, methodsMap, callback)
    }else{
      this.#registerAllMethodsByDefault(methodsMap, callback)
    }
  }


  addPath(url: string, callback: controller, kwargs?: pathKwargs) {

    url = this.parsePath(url)

    let methodsMap: routeMap = new Map()
    this.#paths.set(url, methodsMap)

    let middlewares: middlewareFunction [] | undefined;
    let incomngMethods: string[] | undefined;
    let options:pathKwargs | undefined  = kwargs

    if(!options ){
      this.#registerAllMethodsByDefault(methodsMap, callback)
      this.#middlewaresByPath.set(url, [])
      return
    }

    incomngMethods = options.methods
    this.#setMethodsSafety(incomngMethods, callback, methodsMap);

    middlewares = options.handlers
    this.#setMiddlewaresSafety(middlewares, url)

  }

  parsePath(nameSpace: string) : string{
    if(!nameSpace.startsWith("/")){
      nameSpace = "/" +  nameSpace
    }
    nameSpace = nameSpace.replace(/\/+/g, "/");
    return nameSpace
  }

 // i need fix that because i has a big problem indetify the acceptance 
 // dont delete req, reme,ber its for the acceptance 
  #handleNotFound(req: IncomingMessage, res: ServerResponse) : void{
      let code = 404
      res.statusCode = code;
      sendTextMessage(res, "path not found", code)
  }

  #assertHandler(path: routeMap | undefined ):routeMap{
    if(path === undefined){
      throw new Error("The path is not working properly")
    }
    return  path
  }

  #assertMethod(req: IncomingMessage, res: ServerResponse) : void{
    let code = 400;
    res.statusCode = code;
    sendTextMessage(res, "Your reques comming whiout a method", code)
  
  }

  #assertCallback(req: IncomingMessage, res: ServerResponse, callback : undefined | controller) : controller{
    let code = 500;
    if(callback === undefined){
      sendTextMessage(res, "Internal server error", code )
      res.statusCode = code;
      throw new Error("Callback can't be Undefined ")
    }

    return callback
  }

  controlerHadler(req: IncomingMessage, res: ServerResponse): void {
    
    this.#middlewareManger.run(req, res);

    let url: string | undefined =   req.url

    if(!url){return;}

    if (!this.#pathInclude(url)) {
      this.#handleNotFound(req, res);
      return;
    }  

    let handler: routeMap;
    
    handler = this.#assertHandler(this.#paths.get(url));

    let method: string | undefined  = req.method

    if (!method) {
      this.#assertMethod(req, res)
      return; 
    }

    if (!handler.has(method)) {
      this.#handleNotFound(req, res)
      return;
    }

    let callback: controller  = this.#assertCallback(req, res,handler.get(method));
    
    
    let callbacks: middlewareFunction[] | undefined = this.#middlewaresByPath.get(url)
  
    if(!callbacks){
      return;
    }

    this.#middlewareManger.runRouteMiddlewares(req, res, callbacks);

    callback(req, res);

    res.statusCode = 200;

  }

  createRouteModule(initialPath: string) {
    return new RouteModule(this, initialPath)
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
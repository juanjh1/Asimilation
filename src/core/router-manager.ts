import { IncomingMessage, ServerResponse, METHODS } from 'http';
import { MiddlewareManagerI } from '../interfaces/middleware-manager.js';
import { MiddlewareFunction, PathKwargs, ControllerRegistry, RouteMap, ParamControllerRegistry, FunctionDescriptor } from './type.js';
import { Controller } from './type.js';
import "../middlewares.js";
import "../default/middleware/logger.js";
import { ArgumentedIncomingMessageAbc  } from "../abstract/abstract_res.js"
import { RouteManagerI } from "../interfaces/route-manager.js"
import  { 
	  hasTypeParams, 
	  normalizePath, 
	  extractParamsNames, 
	  compiledUrlPattern
} 
from "../helpers/url-regex.js"




export class RouteManager implements RouteManagerI{

  #paths: ControllerRegistry;
  #dynamicPath: ParamControllerRegistry;
  #middlewareManger: MiddlewareManagerI;
  
  // need move to radex actualy is O(1) average 
  //but whit radex tree we can reduce to O(k)
  
  constructor(middlewareManager: MiddlewareManagerI)  {
    this.#middlewareManger = middlewareManager ;
    this.#dynamicPath = new Map();
    this.#paths = new Map();
  }

  #pathInclude(url: string): boolean {
    return this.#paths.has(url);
  }

  #validateMethod(method: string): void {
    if (!METHODS.includes(method)) {
      throw new Error("The method is not suported");
    }
  }

  #basicRegisterMethods(incomngMethods: string[], methodsMap: RouteMap, functionDescriptor: FunctionDescriptor) {
    incomngMethods.forEach((metod: string) => {
      methodsMap.set(metod, functionDescriptor);
    });
  }

  #registerAllMethodsByDefault(methodsMap: RouteMap, functionDescriptor: FunctionDescriptor): void {
    this.#basicRegisterMethods(METHODS, methodsMap, functionDescriptor)
  }

  #registerMethods(incomngMethods: string[], methodsMap: RouteMap, functionDescriptor: FunctionDescriptor): void {

    const contextIncomngMethods = incomngMethods.map((method: string) => {
      method = method.toUpperCase()
      this.#validateMethod(method)
      return method
    })
    this.#basicRegisterMethods(contextIncomngMethods, methodsMap, functionDescriptor)
  }


  #setMethodsSafety(incomngMethods: string[], functionDescriptor: FunctionDescriptor, methodsMap: RouteMap): void {
    if (incomngMethods.length !== 0) {
      this.#registerMethods(incomngMethods, methodsMap, functionDescriptor)
    } else {
      this.#registerAllMethodsByDefault(methodsMap, functionDescriptor)
    }
  }


  #buildFunctionDescriptor(params: string[], controller: Controller, middlewares: MiddlewareFunction[]): FunctionDescriptor {
	return { params, controller, middlewares }
  }
 

  addPath(url: string, callback: Controller, kwargs?: PathKwargs): void {
    
    url = normalizePath(url)

    const middlewares 	 : MiddlewareFunction[] = kwargs?.handlers ?? [];
    const incomngMethods : string [] 		= kwargs?.methods ?? [];
    const methodsMap	 : RouteMap 		= new Map();
    const isDynamic  	 : boolean  		= hasTypeParams(url);
    const params	 : string [] 		= isDynamic ? extractParamsNames(url) : [];
    const descriptor	 : FunctionDescriptor 	= this.#buildFunctionDescriptor(params, callback, middlewares)

    this.#setMethodsSafety(incomngMethods, descriptor, methodsMap);

    if (!isDynamic) {

      this.#paths.set(url, methodsMap)
      return
    
    }
    
    this.#dynamicPath.set(compiledUrlPattern(url), methodsMap)
  }

   
  #sendMessage(req: IncomingMessage, res: ServerResponse ,code: number, message: string):void{
	
	const accept: string = req.headers.accept ?? ""
		
  }

  // i need fix that because i has a big problem indetify the acceptance 
  // dont delete req, reme,hits for the acceptance 
  #handleNotFound(req: IncomingMessage, res: ServerResponse): void {
    const code = 404
    res.statusCode = code;
    this.#sendMessage(req, res, code, "path not found")
  }

  #assertHandler(path: RouteMap | undefined): RouteMap {

    	if (path === undefined) {
		throw new Error("The path is not working properly")
    	}
    	return path
  }

  #assertMethod(req: IncomingMessage, res: ServerResponse): void {
    const code = 400;
    res.statusCode = code;
    this.#sendMessage(req, res, code, "Your reques comming whiout a method")
  }

  #assertCallback(req: IncomingMessage, res: ServerResponse, callback: undefined | Controller): Controller {
    
    const code: number = 500;
    
    if (callback === undefined) {
     
      this.#sendMessage(req,res, code,"Internal server error" ) 
      res.statusCode = code;
      
      throw new Error("Callback can't be Undefined ")
    
    }

    return callback
  }

  #findMatchingDynamicPath(url: string): RegExp | undefined {
    
    for (const key of this.#dynamicPath.keys()) {
      if (key.test(url)) return key;
    }
    return undefined;
  }

  #buildParams(routeMap: RouteMap | undefined, method: string, url: string, regex: RegExp | undefined): { [key: string]: string } {
    const paramsObject: { [key: string]: string } = {};

    if (!routeMap || !regex) { return paramsObject; }

    const params: string[] = routeMap.get(method)?.params || [];
    
    const values: string[] = regex.exec(url)?.slice(1, params.length + 1) || []

    if (values.length !== params.length) { throw new Error("") }

    params.forEach((param, index) => { paramsObject[param] = values[index]; });

    return paramsObject;
  }

  #validateRoute(httpMethodHandlers: RouteMap | undefined, method: string | undefined, req: IncomingMessage, res: ServerResponse): { httpMethodHandlers: RouteMap, method: string } | undefined {
    
    if (!method) {
      this.#assertMethod(req, res);
      return undefined;
    }

    if (!httpMethodHandlers || !httpMethodHandlers.has(method)) {
      this.#handleNotFound(req, res);
      return undefined;
    }
    return { httpMethodHandlers, method }
  }

  #getHandler(url: string, regexUrl: RegExp | undefined, isStatic: boolean):RouteMap | undefined{
	return  isStatic
      ? this.#assertHandler(this.#paths.get(url))
      : regexUrl
      ? this.#assertHandler(this.#dynamicPath.get(regexUrl))
      : undefined;
  }

  controlerHadler(req: IncomingMessage, res: ServerResponse): void {
    
    this.#middlewareManger.run(req, res);

    const url		: string   | undefined 	= req.url ?? "";
    const method	: string   | undefined 	= req.method;
    const isStatic	: boolean 	     	= this.#pathInclude(url);
    const isDynamic	: RegExp   | undefined 	= this.#findMatchingDynamicPath(url);
    const handler	: RouteMap | undefined  = this.#getHandler(url, isDynamic, isStatic)
    
    let validation = this.#validateRoute(handler, method, req, res);

    if (!validation) {
      return
    }

    const { httpMethodHandlers, method: validatedMethod } = validation;
    
    const callback: Controller = this.#assertCallback(req, res, httpMethodHandlers.get(validatedMethod)?.controller);
    
    const paramsForRequest: { [key: string]: string } = this.#buildParams(httpMethodHandlers, validatedMethod, url, isDynamic)
    
    const callbacks: MiddlewareFunction[] = httpMethodHandlers.get(validatedMethod)?.middlewares ?? [];

    this.#middlewareManger.runRouteMiddlewares(req, res, callbacks);

    Object.setPrototypeOf(req, ArgumentedIncomingMessageAbc.prototype)

    const newRequest: ArgumentedIncomingMessageAbc = (req as ArgumentedIncomingMessageAbc);
    
    newRequest.params = paramsForRequest;
    
    if(res.writableEnded) return;
    
    callback(newRequest, res);
  }

  createRouteModule(initialPath: string): RouteModule {
    
	return new RouteModule(this, initialPath)
  
  }

}

export class RouteModule {

  #manager: RouteManager;
  #initialPath: string;

  constructor(manager: RouteManager, nameSpace: string) {
    this.#manager = manager;
    this.#initialPath = normalizePath(nameSpace);
  }

  addPath(path: string, callback: Controller, kwargs?: PathKwargs) {
    const contextPath = this.#initialPath + normalizePath(path)
    this.#manager.addPath(contextPath, callback, kwargs)
  }

  createRouteModule(name: string) {
    return new RouteModule(this.#manager, (this.#initialPath + normalizePath(name)))
  }
}

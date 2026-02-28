import { IncomingMessage, ServerResponse, METHODS} from 'http';
import { MiddlewareManagerI } from '../interfaces/middleware-manager.js';
import { MiddlewareFunction, PathKwargs, ControllerRegistry, RouteMap, ParamControllerRegistry, FunctionDescriptor, MiddlewareFunctionAsync } from './type.js';
import { Controller } from './type.js';
import "../middlewares.js";
import "../default/middleware/logger.js";
import { ArgumentedIncomingMessageAbc  } from "../abstract/abstract_req.js";
import { RouteManagerI } from "../interfaces/route-manager.js";
import { ArgumentedServerResponseAbc  } from "../abstract/abstract_res.js"
import  { 
	hasTypeParams, 
	normalizePath, 
	extractParamsNames, 
	compiledUrlPattern
} 
from "../helpers/url-regex.js";
import { validateCallbackExistence,  validateMethod} from "../helpers/url-validation.js"
import { ErrorResponseHandler } from '../types/router-response.type.js';
import { createErrorResponseHandler } from '../helpers/error-response.js';
import { sendErrorText, sendErrorJson } from '../utils/http-error-response.adapter.js'; 
import { NOT_FOUND_404 } from '../constants/status_code.constants.js';
import { buildFunctionDescriptor } from '../helpers/function-descriptor.helper.js';   

export class RouteManager implements RouteManagerI{

  #paths                    : ControllerRegistry;
  #dynamicPath              : ParamControllerRegistry;
  #middlewareManger         : MiddlewareManagerI;
  #httperrorHandler         : ErrorResponseHandler; 
  
  // need move to radex actualy is O(1) average 
  //but whit radex tree we can reduce to O(k)
  
  constructor(middlewareManager: MiddlewareManagerI)  {
    this.#middlewareManger = middlewareManager ;
    this.#dynamicPath = new Map();
    this.#paths = new Map();
    this.#httperrorHandler = createErrorResponseHandler({
      "text/plain": sendErrorText,
      "application/json": sendErrorJson
    })
  }

  #pathInclude(url: string): boolean {
    return this.#paths.has(url);
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
      validateMethod(method)
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

  addPath(url: string, callback: Controller, kwargs?: PathKwargs): void {
    
    url = normalizePath(url)

    const middlewares 	 : (MiddlewareFunction | MiddlewareFunctionAsync)[]  = kwargs?.handlers ?? [];
    const incomngMethods : string [] 		        = kwargs?.methods ?? [];
    const methodsMap	   : RouteMap 		        = new Map();
    const isDynamic  	   : boolean  		        = hasTypeParams(url);
    const params	       : string [] 		        = isDynamic ? extractParamsNames(url) : [];
    const descriptor	   : FunctionDescriptor 	= buildFunctionDescriptor(params, callback, middlewares)

    this.#setMethodsSafety(incomngMethods, descriptor, methodsMap);

    if (!isDynamic) {
      this.#paths.set(url, methodsMap)
      return
    }
    
    this.#dynamicPath.set(compiledUrlPattern(url), methodsMap)
  }

  #assertHandler(path: RouteMap | undefined): RouteMap {
    	if (path === undefined) {
		    throw new Error("The path is not working properly") // maby un 500? 
    	}
    	return path
  }

  #findMatchingDynamicPath(url: string): RegExp | undefined {
    for (const key of this.#dynamicPath.keys()) {
      if (key.test(url)) return key;
    }
    return undefined;
  }

  #buildParams(
    routeMap: RouteMap | undefined, 
    method: string, 
    url: string, 
    regex: RegExp | undefined
  ): { [key: string]: string } 
  {
    const paramsObject: { [key: string]: string } = {};

    if (!routeMap || !regex) { return paramsObject; }
    
    const params: string[] = routeMap.get(method)?.params || [];
    const values: string[] = regex.exec(url)?.slice(1, params.length + 1) || []

    if (values.length !== params.length) { throw new Error("") }

    params.forEach((param, index) => { paramsObject[param] = values[index]; });

    return paramsObject;
  }

  #validateRoute(
    httpMethodHandlers: RouteMap | undefined, 
    method: string | undefined, 
    req : ArgumentedIncomingMessageAbc,
    res: ArgumentedServerResponseAbc
  ): boolean 
  {
    
    if (!method) {
        this.#httperrorHandler(req, res, NOT_FOUND_404, "Request without method")
        return false;
    }

    if (!httpMethodHandlers || !httpMethodHandlers.has(method)) {
       this.#httperrorHandler(req, res, NOT_FOUND_404, "Route don't exist");
       return false;
    }

    return true; 
  }

  #getHandler(url: string, regexUrl: RegExp | undefined, isStatic: boolean):RouteMap | undefined{
	  return  isStatic
        ? this.#assertHandler(this.#paths.get(url))
        : regexUrl
        ? this.#assertHandler(this.#dynamicPath.get(regexUrl))
        : undefined;
  }

  controllerHandler(req: IncomingMessage, res: ServerResponse): void {
     
    const newRequest  : ArgumentedIncomingMessageAbc = (req as ArgumentedIncomingMessageAbc);
    const newResponse : ArgumentedServerResponseAbc = (res as ArgumentedServerResponseAbc)
    
    // set prototype for acces a wraper methods 
    Object.setPrototypeOf(newRequest, ArgumentedIncomingMessageAbc.prototype)
    Object.setPrototypeOf(newResponse, ArgumentedServerResponseAbc.prototype)

    const url		    : string   | undefined 	= req.url ?? "";
    const method	  : string   | undefined 	= req.method;
    const isStatic	: boolean 	          	= this.#pathInclude(url);
    const isDynamic	: RegExp   | undefined 	= this.#findMatchingDynamicPath(url);
    const handler 	: RouteMap | undefined  = this.#getHandler(url, isDynamic, isStatic)
      
    // run global middelwares 
    this.#middlewareManger.run(
      newRequest, 
      newResponse, 
      (_, __, next) => {
        if (!this.#validateRoute(handler, method, newRequest, newResponse)) return;
      
        const callback          : Controller                = validateCallbackExistence(handler!.get(method!)?.controller);
        const paramsForRequest  : {[key: string]: string }  = this.#buildParams(handler!, method!, url, isDynamic)
        const callbacks         :  (MiddlewareFunction | MiddlewareFunctionAsync) []  = handler!.get(method!)?.middlewares ?? [];
        // run espesific middelwares 
        this.#middlewareManger.runRouteMiddlewares(
          req, 
          res, 
          callbacks,
          (_, __, nextR )=>{
            newRequest.params = paramsForRequest;
            if(res.writableEnded) return;
            callback(newRequest,  newResponse);
            nextR()
          }
        );
        next() 
      }
    );
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

  addPath(path: string, callback: Controller ,kwargs?: PathKwargs) {
    const contextPath = this.#initialPath + normalizePath(path)
    this.#manager.addPath(contextPath, callback, kwargs)
  }

  createRouteModule(name: string) {
    return new RouteModule(this.#manager, (this.#initialPath + normalizePath(name)))
  }
}

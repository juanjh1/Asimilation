import { 
  IncomingMessage, 
  ServerResponse
} from 'http';
import { MiddlewareManagerI } from '../interfaces/middleware-manager.js';
import { 
  MiddlewareFunction, 
  PathKwargs, 
  RouteMap, 
  MiddlewareFunctionAsync 
} from './type.js';
import { Controller } from './type.js';
import "../middlewares.js";
import "../default/middleware/logger.js";
import { ArgumentedIncomingMessageAbc  } from "../abstract/abstract_req.js";
import { RouteManagerI } from "../interfaces/route-manager.js";
import { ArgumentedServerResponseAbc  } from "../abstract/abstract_res.js"
import  { normalizePath } from "../helpers/url-regex.js";
import { ErrorResponseHandler } from '../types/router-response.type.js';
import { createErrorResponseHandler } from '../helpers/error-response.js';
import { sendErrorText, sendErrorJson } from '../utils/http-error-response.adapter.js'; 
import { NOT_FOUND_404 } from '../constants/status_code.constants.js';
import { AddRoutePathAbc } from '../abstract/add_path_abstract.js';
import { validateCallbackExistence } from '../helpers/url-validation.js';
import { StringObject } from '../types/generic.type.js';


export class RouteManager extends AddRoutePathAbc  implements RouteManagerI {

  #middlewareManger         : MiddlewareManagerI;
  #httperrorHandler         : ErrorResponseHandler; 
  
  // need move to radex actualy is O(1) average 
  //but whit radex tree we can reduce to O(k)
  constructor(middlewareManager: MiddlewareManagerI)  {
    super(new Map(), new Map())
    this.#middlewareManger = middlewareManager ;
    this.#httperrorHandler = createErrorResponseHandler({
      "text/plain": sendErrorText,
      "application/json": sendErrorJson
    })
  }

  #pathInclude (url: string): boolean {
    return this.paths.has(url);
  }

  #assertHandler(path: RouteMap | undefined): RouteMap {
    	if (path === undefined) {
		    throw new Error("The path is not working properly") // maby un 500? 
    	}
    	return path
  }

  #findMatchingDynamicPath(url: string): RegExp | undefined {
    for (const key of this.dynamicPath.keys()) {
      if (key.test(url)) return key;
    }
    return undefined;
  }

  #buildParams(
    url: string, 
    regex: RegExp | undefined
  ): StringObject
  {
    const match = regex?.exec(url);

    if   (!match || !match.groups) return {};

    return match.groups as StringObject;
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
        ? this.#assertHandler(this.paths.get(url))
        : regexUrl
        ? this.#assertHandler(this.dynamicPath.get(regexUrl))
        : undefined;
  }

  controllerHandler(req: IncomingMessage, res: ServerResponse): void {
     
    const newRequest  : ArgumentedIncomingMessageAbc = (req as ArgumentedIncomingMessageAbc);
    const newResponse : ArgumentedServerResponseAbc = (res as ArgumentedServerResponseAbc)
    // TODO: Replace prototype mutation with composition wrapper
    // Reason: avoid runtime prototype mutation side effects
    // set prototype for acces a wraper methods 
    Object.setPrototypeOf(newRequest, ArgumentedIncomingMessageAbc.prototype)
    Object.setPrototypeOf(newResponse, ArgumentedServerResponseAbc.prototype)
    
    const undRefinedUrl : string []             = req.url?.split("?") ?? [] 
    const queryParam    : string   | undefined  = undRefinedUrl.length >= 2 ? undRefinedUrl[1]: undefined;   
    const url		        : string               	= undRefinedUrl.length >= 1 ? undRefinedUrl[0]: "";
    const method	      : string   | undefined 	= req.method;
    const isStatic	    : boolean 	          	= this.#pathInclude(url);
    const isDynamic	    : RegExp   | undefined 	= this.#findMatchingDynamicPath(url);
    const handler 	    : RouteMap | undefined  = this.#getHandler(url, isDynamic, isStatic)
      
    // run global middelwares 
    this.#middlewareManger.run(
      newRequest, 
      newResponse, 
      (_, __, next) => {
        if (!this.#validateRoute(handler, method, newRequest, newResponse)) return;
      
        const callback          : Controller                = validateCallbackExistence(handler!.get(method!)?.controller);
        const paramsForRequest  : StringObject  = this.#buildParams(url, isDynamic)
        const callbacks         : (MiddlewareFunction | MiddlewareFunctionAsync) []  = handler!.get(method!)?.middlewares ?? [];
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

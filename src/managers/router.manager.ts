import { 
  IncomingMessage, 
  ServerResponse
} from 'http';
import { 
  MiddlewareFunction, 
  RouteMap, 
} from '../core/type.js';
import { 
  Controller 
} from '../core/type.js';
import { 
  sendErrorText, 
  sendErrorJson 
} from '../utils/http-error-response.adapter.js'; 
import { RouteManagerI } from "../interfaces/route-manager.js";
import { ErrorResponseHandler } from '../types/router-response.type.js';
import { createErrorResponseHandler } from '../helpers/error-response.js';
import { NOT_FOUND_404 } from '../constants/status_code.constants.js';
import { AddRoutePathAbc } from '../abstract/add_path_abstract.js';
import { validateCallbackExistence } from '../helpers/url-validation.js';
import { StringObject } from '../types/generic.type.js';
import { MiddlewareManagerI } from '../interfaces/middleware-manager.js';
import { bound } from '../utils/decorators/bound.decorator.js';
import { ArgumentedIncomingMessageInterface } from '../interfaces/custom-request.js';
import { ArgumentedServerResponseInterface } from '../interfaces/custom-server-response.js';
import { ArgumentedIncomingMessageImp } from '../classes/req_and_res.implement.js';
import { ArgumentResponse } from '../helpers/message-exchange-proxie.helper.js';
import { normalizePath } from '../helpers/url-regex.js';


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
    	if (path === undefined) throw new Error("The path is not working properly");// maby un 500? 
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

    if(!match || !match.groups) return {};

    return match.groups as StringObject;
  }

  #validateRoute(
    httpMethodHandlers: RouteMap | undefined, 
    method: string | undefined,
    req : ArgumentedIncomingMessageInterface,
    res: ArgumentedServerResponseInterface
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

  setHandlerString(url: string, controller: RouteMap): void{
    this.paths.set(normalizePath(url), controller) 
  }
  
  setHandlerRegex(prefix:string ,  url:RegExp, controller: RouteMap):void{
    const p = url.toString()
    const np = normalizePath(prefix + p);
    const rnp = new RegExp(np)
    this.dynamicPath.set(rnp, controller)
  }

  #getHandler(url: string, regexUrl: RegExp | undefined, isStatic: boolean):RouteMap | undefined{
	  return  isStatic
        ? this.#assertHandler(this.paths.get(url))
        : regexUrl
        ? this.#assertHandler(this.dynamicPath.get(regexUrl))
        : undefined;
  }

  @bound controllerHandler (req: IncomingMessage, res: ServerResponse): void  {

    const newRequest  : ArgumentedIncomingMessageInterface =  Object.assign(
       req,
      Object.create(
        ArgumentedIncomingMessageImp.prototype
      ), 
    ) as ArgumentedIncomingMessageInterface;
    
    const newResponse : ArgumentedServerResponseInterface = ArgumentResponse(res) 
    
    const undRefinedUrl : string []             = req.url?.split("?") ?? [] 
    const queryParam    : string   | undefined  = undRefinedUrl.length >= 2 ? undRefinedUrl[1]: undefined;   
    const url		        : string               	= undRefinedUrl.length >= 1 ? undRefinedUrl[0]: "";
    const method	      : string   | undefined 	= req.method;
    const isStatic	    : boolean 	          	= this.#pathInclude(url);
    const isDynamic	    : RegExp   | undefined 	= this.#findMatchingDynamicPath(url);
    const handler 	    : RouteMap | undefined  = this.#getHandler(url, isDynamic, isStatic)
   
    this.#middlewareManger.run(
      newRequest, 
      newResponse, 
      (_, __, next) => {
        if (!this.#validateRoute(handler, method, newRequest, newResponse)) return;
      
        const callback          : Controller  = validateCallbackExistence(handler!.get(method!)?.controller);
        const paramsForRequest  : StringObject = this.#buildParams(url, isDynamic);
        const callbacks         : MiddlewareFunction []  = handler!.get(method!)?.middlewares ?? [];
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

}

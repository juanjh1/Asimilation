import { AddRoutePathInterface } from '../interfaces/add_path.interface.js';
import { 
  normalizePath, 
  hasTypeParams, 
  extractParamsNames, 
  compiledUrlPattern
} from '../helpers/url-regex.js';
import { 
  Controller, 
  MiddlewareFunction, 
  MiddlewareFunctionAsync, 
  RouteMap, 
  FunctionDescriptor,
  PathKwargs,
  ControllerRegistry,
  ParamControllerRegistry
  
} from '../core/type.js';
import { buildFunctionDescriptor } from '../helpers/function-descriptor.helper.js';
import { setMethodsSafety } from '../helpers/set-methods.helper.js';

export abstract class AddRoutePathAbc implements AddRoutePathInterface {
   
  protected paths       : ControllerRegistry;
  protected dynamicPath : ParamControllerRegistry;

  constructor(_paths: ControllerRegistry, _dynamicPath: ParamControllerRegistry){
    this.paths = _paths
    this.dynamicPath = _dynamicPath
  }

  addPath(url: string, callback: Controller, kwargs?: PathKwargs): void { 
    
    url = normalizePath(url)

    const middlewares 	 : (MiddlewareFunction | MiddlewareFunctionAsync)[]  = kwargs?.handlers ?? [];
    const incomngMethods : string [] 		        = kwargs?.methods ?? [];
    const methodsMap	   : RouteMap 		        = new Map();
    const isDynamic  	   : boolean  		        = hasTypeParams(url);
    const params	       : string [] 		        = isDynamic ? extractParamsNames(url) : [];
    const descriptor	   : FunctionDescriptor 	= buildFunctionDescriptor(params, callback, middlewares)

    setMethodsSafety(incomngMethods, descriptor, methodsMap);

    if (!isDynamic) {
      this.paths.set(url, methodsMap)
      return
    }
    
    this.dynamicPath.set(compiledUrlPattern(url), methodsMap)
  }

}

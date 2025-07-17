import { IncomingMessage, ServerResponse, METHODS } from 'http';
import { MiddlewareManagerI } from '../interfaces/middleware-manager.js';
import { MiddlewareFunction, PathKwargs, ControllerRegistry, RouteMap, ParamControllerRegistry, FunctionDescriptor } from './type.js';
import { sendTextMessage } from '../helpers/http-responses.js';
import { Controller } from './type.js';
import "../middlewares.js";
import "../default/middleware/logger.js";
import { ParamType } from '../enums/param-type.js';

export class RouteManager {

  #paths: ControllerRegistry;
  #dynamicPath: ParamControllerRegistry;
  #middlewareManger: MiddlewareManagerI;
  // #pathsWhitParams : string;

  constructor(middlewareManager: MiddlewareManagerI) {
    // we use map/ thats works because each endpoint it's unique
    this.#middlewareManger = middlewareManager;
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

    incomngMethods = incomngMethods.map((method: string) => {
      method = method.toUpperCase()
      this.#validateMethod(method)
      return method
    })

    this.#basicRegisterMethods(incomngMethods, methodsMap, functionDescriptor)
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

    url = this.parsePath(url)
    const middlewares: MiddlewareFunction[] = kwargs?.handlers ?? [];
    const incomngMethods: string[] = kwargs?.methods ?? [];
    const options: PathKwargs | undefined = kwargs
    const methodsMap: RouteMap = new Map()
    const isDynamic: boolean = /<[a-zA-Z]+:[a-zA-Z]+>/g.test(url);
    const params = isDynamic ? this.#extractParamName(url) : [];
    const descriptor: FunctionDescriptor = this.#buildFunctionDescriptor(params, callback, middlewares)

    this.#setMethodsSafety(incomngMethods, descriptor, methodsMap);
    if (!options) {
      if (!isDynamic) {
        this.#paths.set(url, methodsMap)
      } else {
        this.#dynamicPath.set(this.#urlToRegex(url), methodsMap)
      }
      return
    }

    if (!isDynamic) {
      this.#paths.set(url, methodsMap)
      return
    }
    this.#dynamicPath.set(this.#urlToRegex(url), methodsMap)

  }


  #getRegexForType(match: string, _: string): string {

    const TYPE_LOCATION: number = 0

    let type = match.replace(/[<>]/g, "").split(":")[TYPE_LOCATION]
    for (const param of ParamType.values()) {
      if (param.isTypeEqual(type)) {
        return param.getRegex();
      }
    }
    throw new Error("Type is don't defined")
  }

  #urlToRegex(url: string): RegExp {
    let modifiedUrl: string = url.replace(/<[a-zA-Z]+:[a-zA-Z]+>/, this.#getRegexForType)
    let regex: RegExp = new RegExp(modifiedUrl);
    return regex;
  }

  #extractParamName(url: string): string[] {
    const NAME_LOCATION = 1

    const matches: string[] | null = url.match(/<[a-zA-Z]+:[a-zA-Z]+>/g)
    if (!matches) {
      throw new Error("No parameter matches found")
    }
    const values = matches.map((value: string) => {
      return value.replace(/[<>]/g, "").split(":")[NAME_LOCATION]
    })
    return values;
  }


  parsePath(nameSpace: string): string {
    if (!nameSpace.startsWith("/")) {
      nameSpace = "/" + nameSpace
    }
    nameSpace = nameSpace.replace(/\/+/g, "/");
    return nameSpace
  }

  // i need fix that because i has a big problem indetify the acceptance 
  // dont delete req, reme,hits for the acceptance 
  #handleNotFound(req: IncomingMessage, res: ServerResponse): void {
    let code = 404
    res.statusCode = code;
    sendTextMessage(res, "path not found", code)
  }

  #assertHandler(path: RouteMap | undefined): RouteMap {
    if (path === undefined) {
      throw new Error("The path is not working properly")
    }
    return path
  }

  #assertMethod(req: IncomingMessage, res: ServerResponse): void {
    let code = 400;
    res.statusCode = code;
    sendTextMessage(res, "Your reques comming whiout a method", code)
  }

  #assertCallback(req: IncomingMessage, res: ServerResponse, callback: undefined | Controller): Controller {
    let code = 500;
    if (callback === undefined) {
      sendTextMessage(res, "Internal server error", code)
      res.statusCode = code;
      throw new Error("Callback can't be Undefined ")
    }

    return callback
  }

  #findMatchingDynamicPath(url: string): RegExp | undefined{
  for (const key of this.#dynamicPath.keys()) {
    if (key.test(url)) return  key ;
  }
    return  undefined;
  }

  controlerHadler(req: IncomingMessage, res: ServerResponse): void {

    this.#middlewareManger.run(req, res);
    const url: string | undefined = req.url ?? "";
    const method: string | undefined = req.method;
    const isStatic: boolean = this.#pathInclude(url);
    const isDynamic: RegExp | undefined = this.#findMatchingDynamicPath(url);
    let handler: RouteMap | undefined = isStatic ? this.#assertHandler(this.#paths.get(url)) : 
                            isDynamic != undefined ? this.#assertHandler(this.#dynamicPath.get(isDynamic)): undefined

    if(!handler){
        this.#handleNotFound(req, res);
        return
    }
     if (!method) {
        this.#assertMethod(req, res)
        return;
      }

      if (!handler.has(method)) {
        this.#handleNotFound(req, res)
        return;
      }

      let callback: Controller = this.#assertCallback(req, res, handler.get(method)?.controller);

      let params: string[] = handler.get(method)?.params ?? [];

      let callbacks: MiddlewareFunction[] = handler.get(method)?.middlewares ?? [];

      this.#middlewareManger.runRouteMiddlewares(req, res, callbacks);

      callback(req, res);

      res.statusCode = 200;

  
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
    this.#initialPath = this.#manager.parsePath(nameSpace);
  }


  addPath(path: string, callback: Controller, kwargs?: PathKwargs) {
    path = this.#initialPath + this.#manager.parsePath(path)
    this.#manager.addPath(path, callback, kwargs)
  }

  createRouteModule(name: string) {
    return new RouteModule(this.#manager, (this.#initialPath + this.#manager.parsePath(name)))
  }

}
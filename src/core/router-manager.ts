import { IncomingMessage, ServerResponse, METHODS } from 'http';
import { MiddlewareManagerI } from '../interfaces/middleware-manager.js';
import { MiddlewareFunction, PathKwargs, ControllerRegistry, RouteMap, ParamControllerRegistry, FunctionDescriptor } from './type.js';
import { sendTextMessage } from '../helpers/http-responses.js';
import { Controller } from './type.js';
import "../middlewares.js";
import "../default/middleware/logger.js";
import { ParamType } from '../enums/param-type.js';
import { ArgumentedIncomingMessage } from "../interfaces/custom-request.js"


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
    url = this.parsePath(url)

    const middlewares: MiddlewareFunction[] = kwargs?.handlers ?? [];
    const incomngMethods: string[] = kwargs?.methods ?? [];
    const methodsMap: RouteMap = new Map()
    const isDynamic: boolean = /<[a-zA-Z]+:[a-zA-Z]+>/g.test(url);
    const params = isDynamic ? this.#extractParamName(url) : [];
    const descriptor: FunctionDescriptor = this.#buildFunctionDescriptor(params, callback, middlewares)

    this.#setMethodsSafety(incomngMethods, descriptor, methodsMap);

    if (!isDynamic) {
      this.#paths.set(url, methodsMap)
      return
    }
    this.#dynamicPath.set(this.#urlToRegex(url), methodsMap)

  }


  #getRegexForType(match: string, _: string): string {
    const TYPE_LOCATION: number = 0

    const type = match.replace(/[<>]/g, "").split(":")[TYPE_LOCATION]

    for (const param of ParamType.values()) {
      if (param.isTypeEqual(type)) { return param.getRegex(); }
    }

    throw new Error("Type is don't defined")
  }

  #urlToRegex(url: string): RegExp {
    const safe = url.replace(/([.*+?^=!${}()|\[\]\/\\])/g, '\\$1');
    const modifiedUrl: string = "^"+safe.replace(/<[a-zA-Z]+:[a-zA-Z]+>/g, this.#getRegexForType)+"$"
    const regex: RegExp = new RegExp(modifiedUrl);
    return regex;
  }

  #extractParamName(url: string): string[] {
    const NAME_LOCATION = 1

    const matches: string[] | null = url.match(/<[a-zA-Z]+:[a-zA-Z]+>/g)
    if (!matches) { throw new Error("No parameter matches found") }

    const values = matches.map((value: string) => { return value.replace(/[<>]/g, "").split(":")[NAME_LOCATION] })
    return values;
  }


  parsePath(nameSpace: string): string {

    let contextNameSpace: string = nameSpace

    if (!contextNameSpace.startsWith("/")) { contextNameSpace = "/" + contextNameSpace }

    contextNameSpace = contextNameSpace.replace(/\/+/g, "/");

    return contextNameSpace;
  }

  // i need fix that because i has a big problem indetify the acceptance 
  // dont delete req, reme,hits for the acceptance 
  #handleNotFound(req: IncomingMessage, res: ServerResponse): void {
    const code = 404
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
    const code = 400;
    res.statusCode = code;
    sendTextMessage(res, "Your reques comming whiout a method", code)
  }

  #assertCallback(req: IncomingMessage, res: ServerResponse, callback: undefined | Controller): Controller {
    const code = 500;
    if (callback === undefined) {
      sendTextMessage(res, "Internal server error", code)
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
    if (!httpMethodHandlers) {
      this.#handleNotFound(req, res);
      return undefined;
    }

    if (!method) {
      this.#assertMethod(req, res);
      return undefined;
    }

    if (!httpMethodHandlers.has(method)) {
      this.#handleNotFound(req, res);
      return undefined;
    }

    return { httpMethodHandlers, method }
  }

  controlerHadler(req: IncomingMessage, res: ServerResponse): void {
    this.#middlewareManger.run(req, res);

    const url: string | undefined = req.url ?? "";
    const method: string | undefined = req.method;

    const isStatic: boolean = this.#pathInclude(url);
    const isDynamic: RegExp | undefined = this.#findMatchingDynamicPath(url);


    const handler: RouteMap | undefined = isStatic
      ? this.#assertHandler(this.#paths.get(url))
      : isDynamic
      ? this.#assertHandler(this.#dynamicPath.get(isDynamic))
      : undefined;

    let validation = this.#validateRoute(handler, method, req, res);

    if (!validation) {
      return
    }

    const { httpMethodHandlers, method: validatedMethod } = validation;
    const callback: Controller = this.#assertCallback(req, res, httpMethodHandlers.get(validatedMethod)?.controller);
    const paramsForRequest: { [key: string]: string } = this.#buildParams(httpMethodHandlers, validatedMethod, url, isDynamic)
    const callbacks: MiddlewareFunction[] = httpMethodHandlers.get(validatedMethod)?.middlewares ?? [];

    this.#middlewareManger.runRouteMiddlewares(req, res, callbacks);

    const newRequest: ArgumentedIncomingMessage = (req as ArgumentedIncomingMessage);
    newRequest.params = paramsForRequest;

    callback(newRequest, res);
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
    const contextPath = this.#initialPath + this.#manager.parsePath(path)
    this.#manager.addPath(contextPath, callback, kwargs)
  }

  createRouteModule(name: string) {
    return new RouteModule(this.#manager, (this.#initialPath + this.#manager.parsePath(name)))
  }

}
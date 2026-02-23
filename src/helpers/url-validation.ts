import { METHODS } from 'http';
import { Controller } from "../core/type.js"
import { NotSuportedMethodError } from '../exceptions/routing/method.error.js';


export function validateCallbackExistence (callback: undefined | Controller): Controller {
    if (callback === undefined) {
      throw new Error("Callback can't be Undefined ")
    }
    return callback
}

//export function validateRoute(httpMethodHandlers: RouteMap | undefined, method: string | undefined, req: IncomingMessage, res: ServerResponse): { httpMethodHandlers: RouteMap, method: string } | undefined {
    
//    if (!method) {
//      this.#assertMethod(req, res);
//      return undefined;
//    }

//    if (!httpMethodHandlers || !httpMethodHandlers.has(method)) {
//      this.#handleNotFound(req, res);
//      return undefined;
//   }
//    return { httpMethodHandlers, method }
//}

export function validateMethod(method: string): void {
    if (!METHODS.includes(method)) {
	    throw new NotSuportedMethodError;
    }
}


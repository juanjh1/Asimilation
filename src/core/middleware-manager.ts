import {IncomingMessage, ServerResponse} from "http"
import { MiddlewareManagerI } from "../interfaces/middleware-manager.js";
import { MiddlewareFunction, MiddlewareFunctionAsync } from "./type.js";
import { ArgumentedIncomingMessageInterface } from '../interfaces/custom-request.js'; 
import { ArgumentedServerResponseInterface } from '../interfaces/custom-server-response.js';


class MiddlewareManager implements MiddlewareManagerI{
	
	static instance: MiddlewareManager = MiddlewareManager.getInstance();
    
	#middelwares: (MiddlewareFunction | MiddlewareFunctionAsync) [] ;
		
	constructor(){
		this.#middelwares  = []
	}

	addMiddleware(middelware: MiddlewareFunction| MiddlewareFunctionAsync): void{
		this.#middelwares.push(middelware)
	}

	// the next dont work, if u dont use next the function extecute	
	async #runer(
    middelwareList: ( MiddlewareFunction | MiddlewareFunctionAsync ) [], 
    req: ArgumentedIncomingMessageInterface, 
    res: ArgumentedServerResponseInterface
  ): Promise<void>
  {
		
		function  dispach (index: number): Promise<void>  {
			if( middelwareList.length == 0 ) return Promise.resolve();
			let current = middelwareList[index]
			if ( current ) {
				return Promise.resolve(
          current( req, res, 
          ()=>{ dispach(index+1)} 
          )
        );
			}
      return Promise.resolve();
		}
  	
		dispach(0);
	}

	async run(
    req           : ArgumentedIncomingMessageInterface, 
    res           : ArgumentedServerResponseInterface,
    callbackMidd  : (MiddlewareFunctionAsync | MiddlewareFunction)
  ) :  Promise<{req: ArgumentedIncomingMessageInterface, res: ArgumentedServerResponseInterface}>
  {
		const newMiddList = this.#middelwares.concat(callbackMidd)
    await this.#runer(newMiddList, req, res)
		
		return {req, res}
	}

	runRouteMiddlewares(
    req: ArgumentedIncomingMessageInterface, 
    res: ArgumentedServerResponseInterface, 
    middelwareList: (MiddlewareFunction | MiddlewareFunctionAsync) [],
    callbackMidd  : (MiddlewareFunctionAsync | MiddlewareFunction)
  ): {req: ArgumentedIncomingMessageInterface, res: ArgumentedServerResponseInterface}
	{
      this.#runer(middelwareList.concat(callbackMidd), req, res)
      return {req, res}
	}

	static getInstance(): MiddlewareManager{
		return new MiddlewareManager();
	}
}

export const MiddlewarePipeline = MiddlewareManager.instance;

import { MiddlewareManagerI } from "../interfaces/middleware-manager.js";
import { 
  MiddlewareFunction,
} from "../core/type.js";
import { ArgumentedIncomingMessageInterface } from '../interfaces/custom-request.js'; 
import { ArgumentedServerResponseInterface } from '../interfaces/custom-server-response.js';
import { HttpPair } from '../types/mensaje-exchange.type.js';


export default class MiddlewareManager implements MiddlewareManagerI{
	
	#middelwares: MiddlewareFunction [] ;
		
	constructor(){
		this.#middelwares  = []
  }

	set (middelware: MiddlewareFunction): void{
		this.#middelwares.push(middelware)
	}

	async #runer(
    middelwareList: ( MiddlewareFunction ) [], 
    req: ArgumentedIncomingMessageInterface, 
    res: ArgumentedServerResponseInterface
  ): Promise<void>
  {
		
		async function  dispach (index: number): Promise<void>  {
			if( middelwareList.length == 0 ) return Promise.resolve();
			let current = middelwareList[index]
			if ( current ) {
				return Promise.resolve(
          await current( req, res, 
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
    callbackMidd  : MiddlewareFunction
  ):Promise<HttpPair>
  {
		const newMiddList = this.#middelwares.concat(callbackMidd)
    await this.#runer(newMiddList, req, res)
		
		return {req, res}
	}

	async runRouteMiddlewares(
    req: ArgumentedIncomingMessageInterface, 
    res: ArgumentedServerResponseInterface, 
    middelwareList: MiddlewareFunction  [],
    callbackMidd  : MiddlewareFunction
  ):Promise<HttpPair>
	{
      await this.#runer(middelwareList.concat(callbackMidd), req, res)
      return {req, res}
	}
}


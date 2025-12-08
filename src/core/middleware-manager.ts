import {IncomingMessage, ServerResponse} from "http"
import { MiddlewareManagerI } from "../interfaces/middleware-manager.js";
import { MiddlewareFunction, MiddlewareFunctionAsync } from "./type.js";
import { ArgumentedIncomingMessageAbc } from "../abstract/abstract_req.js";
import { ArgumentedServerResponseAbc  } from "../abstract/abstract_res.js"

class MiddlewareManager implements MiddlewareManagerI{
	
	static instance: MiddlewareManager = MiddlewareManager.getInstance();
    
	#middelwares: (MiddlewareFunction | MiddlewareFunctionAsync) [] ;
		
	constructor(){

		this.#middelwares  = []
	}

	addMiddleware(middelware: MiddlewareFunction| MiddlewareFunctionAsync): void{
		
		this.#middelwares.push(middelware)

	}
	
	#runer(middelwareList: ( MiddlewareFunction | MiddlewareFunctionAsync ) [], req: ArgumentedIncomingMessageAbc, res: ArgumentedServerResponseAbc): void{
		console.log(this.#middelwares)	
		const dispach = (index: number): void => {
			
			if( middelwareList.length == 0){ return }
			
			let current = middelwareList[index]
                	
			if ( current ) {
				current( req, res, ()=>{ 
					dispach(index+1)
				    }
				)
			}
		}
        	dispach(0);
	}

	run(req: ArgumentedIncomingMessageAbc , res: ArgumentedServerResponseAbc) :  {req: ArgumentedIncomingMessageAbc, res: ArgumentedServerResponseAbc}{
		
		this.#runer(this.#middelwares, req, res)
		
		return {req, res}
	}

	runRouteMiddlewares(req: ArgumentedIncomingMessageAbc, res: ArgumentedServerResponseAbc, middelwareList: (MiddlewareFunction | MiddlewareFunctionAsync) []): {req: ArgumentedIncomingMessageAbc, res: ServerResponse}

	{
        	this.#runer(middelwareList, req, res)
        	return {req, res}
	}

	static getInstance(): MiddlewareManager{
        	
		return new MiddlewareManager();
	}
}

export const MiddlewarePipeline = MiddlewareManager.instance;

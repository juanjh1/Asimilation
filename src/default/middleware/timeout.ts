import { MiddlewarePipeline } from "../../core/middleware-manager.js";
import { ArgumentedIncomingMessageAbc } from "../../abstract/abstract_req.js";
import { ArgumentedServerResponseAbc } from "../../abstract/abstract_res.js";

MiddlewarePipeline.addMiddleware(
    async (req: ArgumentedIncomingMessageAbc, res:ArgumentedServerResponseAbc, next:(error?:Error)=> void)=>{
	
	let finished: boolean = false;

	const timer = setTimeout( ():void => {
		if(!finished || !res.writableEnded){	
			res.sendJson({message: 'Request timed out'}, 504)
			finished = true;
		}

	}, 1)
	
	try{
		next();
	}
	finally{
		clearTimeout(timer);
		finished = true;
	}
    }
)

import { MiddlewarePipeline } from "../../core/middleware-manager.js";
import {ServerResponse} from "http"
import { ArgumentedIncomingMessage } from "../../interfaces/custom-request.js";
import { createLog } from "../../utils/logger.js";
import { timeTakedToResolve } from "../../helpers/date.js"

MiddlewarePipeline.addMiddleware(
    (req: ArgumentedIncomingMessage, res:ServerResponse , next:(error?:Error)=> void)=>{
	const start: Date = new Date();
	req.on("end", ()=>{

            let statusCode : number | undefined = res.statusCode
            let method 	   : string | undefined = req.method
            let url        : string | undefined =  req.url
	    const finalDate: Date = new Date();
	    
	    const timeTaked: number = timeTakedToResolve(start,finalDate);

            if(statusCode && method && url){
                createLog(statusCode, method, url, timeTaked)  
                next()
                return;
            }  

            throw new Error("Error in the logger")
        })
    }
)

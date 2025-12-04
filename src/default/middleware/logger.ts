import { MiddlewarePipeline } from "../../core/middleware-manager.js";
import { MiddlewareFunction } from "../../core/type.js";
import {ServerResponse} from "http"
import { ArgumentedIncomingMessage } from "../../interfaces/custom-request.js";
import { createLog } from "../../utils/logger.js";

MiddlewarePipeline.addMiddleware(
    (req: ArgumentedIncomingMessage, res:ServerResponse , next:(error?:Error)=> void)=>{
        req.on("end", ()=>{

            let statusCode: number | undefined = res.statusCode
            let method : string | undefined = req.method
            let url : string | undefined =  req.url

            if(statusCode && method && url){
                createLog(statusCode, method, url)  
                next()
                return;
            }  

            throw new Error("Error in the logger")
        })
    }
)

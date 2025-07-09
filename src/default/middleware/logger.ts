import { MiddlewarePipeline } from "../../core/middleware-manager.js";
import { createLogger } from "../../utils/logger.js";

MiddlewarePipeline.addMiddleware(
    (req, res, next) =>{
        req.on("end", ()=>{
            let statusCode: number | undefined = req.statusCode
            let method : string | undefined = req.method
            let url : string | undefined =  req.url

            if(statusCode && method && url){
                createLogger(statusCode, method, url)  
                next()
                return;
            }  

            throw new Error("Error in the logger")
        })
    }
)
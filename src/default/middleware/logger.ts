import { MiddlewarePipeline } from "../../core/middleware-manager.js";
import { createLog } from "../../utils/logger.js";

MiddlewarePipeline.addMiddleware(
    (req, res, next) =>{
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
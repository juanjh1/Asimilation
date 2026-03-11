import { MiddlewarePipeline } from "../../managers/middleware.manager.js";
import { ArgumentedIncomingMessageAbc } from "../../abstract/abstract_req.js";
import { ArgumentedServerResponseAbc } from "../../abstract/abstract_res.js";

MiddlewarePipeline.addMiddleware(
  (
   req: ArgumentedIncomingMessageAbc, 
   res:ArgumentedServerResponseAbc , 
   next:(error?:Error
  )=> void)=>{
    try{
      next()
    }catch(error){
        res.sendJson({ message: 'Internal Server error' }, 500)	
    }
  }
)
